import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { db } from "../lib/admin";
import { requireAuth, requireField } from "../lib/assert";
import { verifyReauthToken } from "../auth/reauthenticate";
import { chargePayment } from "../lib/paymentGateway";
import type { BillDoc, PaymentMethodDoc } from "../types/models";

interface ProcessPaymentRequest {
  bill_id: string;
  payment_method_id: string;
  reauth_token: string;
}

/**
 * Pays a bill. Mirrors docs/tech-spec.md §4.1 — implemented as two Firestore
 * writes around the external gateway call (Firestore transactions cannot
 * safely wrap a network request):
 *   1) atomically flip bill.status pending -> processing (guards double-submit)
 *   2) call the Payment Gateway
 *   3) write the transaction doc + finalize bill.status (paid or back to pending)
 */
export const processPayment = onCall<ProcessPaymentRequest>(async (request) => {
  const uid = requireAuth(request);
  const billId = requireField(request.data.bill_id, "bill_id");
  const paymentMethodId = requireField(request.data.payment_method_id, "payment_method_id");
  const reauthToken = requireField(request.data.reauth_token, "reauth_token");

  await verifyReauthToken(uid, reauthToken);

  const billRef = db.collection("bills").doc(billId);
  const paymentMethodRef = db
    .collection("users")
    .doc(uid)
    .collection("payment_methods")
    .doc(paymentMethodId);

  // Phase 1: claim the bill atomically so a double-submit can't charge twice.
  const bill = await db.runTransaction(async (tx) => {
    const billSnap = await tx.get(billRef);
    if (!billSnap.exists) {
      throw new HttpsError("not-found", "ไม่พบรายการบิลนี้");
    }
    const data = billSnap.data() as BillDoc;
    if (data.user_id !== uid) {
      throw new HttpsError("permission-denied", "ไม่มีสิทธิ์เข้าถึงบิลนี้");
    }
    if (data.status !== "pending") {
      throw new HttpsError("failed-precondition", "บิลนี้ถูกชำระแล้วหรือกำลังดำเนินการอยู่");
    }
    tx.update(billRef, { status: "processing", updated_at: FieldValue.serverTimestamp() });
    return data;
  });

  const paymentMethodSnap = await paymentMethodRef.get();
  if (!paymentMethodSnap.exists) {
    await billRef.update({ status: "pending", updated_at: FieldValue.serverTimestamp() });
    throw new HttpsError("not-found", "ไม่พบช่องทางชำระเงินนี้");
  }
  const paymentMethod = paymentMethodSnap.data() as PaymentMethodDoc;

  const now = new Date();
  const transactionRef =
    "TX" +
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    billId.slice(-6).toUpperCase();

  // Phase 2: call the external gateway (outside any Firestore transaction).
  const chargeResult = await chargePayment({
    amount: bill.amount,
    gatewayTokenRef: paymentMethod.gateway_token_ref,
    referenceId: transactionRef,
  });

  // Phase 3: finalize — write the transaction doc and settle the bill.
  const txDocRef = db.collection("transactions").doc(transactionRef);
  if (chargeResult.success) {
    await db.runTransaction(async (tx) => {
      tx.set(txDocRef, {
        bill_id: billId,
        payment_method_ref: paymentMethodRef.path,
        user_id: uid,
        amount: bill.amount,
        status: "success",
        paid_at: FieldValue.serverTimestamp(),
        created_at: FieldValue.serverTimestamp(),
      });
      tx.update(billRef, { status: "paid", updated_at: FieldValue.serverTimestamp() });
    });

    await db.collection("users").doc(uid).collection("notifications").add({
      title: "ชำระเงินสำเร็จ",
      message: `ชำระเงินจำนวน ${bill.amount.toFixed(2)} บาท เรียบร้อยแล้ว`,
      type: "payment_success",
      is_read: false,
      created_at: FieldValue.serverTimestamp(),
    });

    return {
      transaction_id: transactionRef,
      status: "success",
      amount: bill.amount,
      paid_at: Timestamp.now().toMillis(),
    };
  }

  // Payment failed: record it and release the bill back to pending.
  await txDocRef.set({
    bill_id: billId,
    payment_method_ref: paymentMethodRef.path,
    user_id: uid,
    amount: bill.amount,
    status: "failed",
    paid_at: null,
    created_at: FieldValue.serverTimestamp(),
  });
  await billRef.update({ status: "pending", updated_at: FieldValue.serverTimestamp() });

  throw new HttpsError(
    "unavailable",
    "ระบบชำระเงินขัดข้อง กรุณาลองใหม่ภายใน 5 นาที"
  );
});
