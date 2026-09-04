import { onSchedule } from "firebase-functions/v2/scheduler";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { db } from "../lib/admin";
import type { BillDoc } from "../types/models";

/** Runs daily: flags pending bills past their due_date as overdue and notifies the owner. */
export const onBillOverdue = onSchedule("every day 02:00", async () => {
  const now = Timestamp.now();
  const snap = await db
    .collection("bills")
    .where("status", "==", "pending")
    .where("due_date", "<", now)
    .get();

  if (snap.empty) return;

  const batch = db.batch();
  snap.docs.forEach((doc) => {
    batch.update(doc.ref, { status: "overdue", updated_at: FieldValue.serverTimestamp() });
  });
  await batch.commit();

  await Promise.all(
    snap.docs.map((doc) => {
      const bill = doc.data() as BillDoc;
      return db.collection("users").doc(bill.user_id).collection("notifications").add({
        title: "บิลเกินกำหนดชำระ",
        message: `รายการมูลค่า ${bill.amount.toFixed(2)} บาท เกินกำหนดชำระแล้ว`,
        type: "bill_reminder",
        is_read: false,
        created_at: FieldValue.serverTimestamp(),
      });
    })
  );
});
