import { onCall } from "firebase-functions/v2/https";
import { requireAuth, requireField } from "../middleware/guards";
import { verifyReauthToken } from "../services/authService";
import { processPayment as processPaymentService } from "../services/paymentService";

interface ProcessPaymentRequest {
  bill_id: string;
  payment_method_id: string;
  reauth_token: string;
}

/** Callable: pays a bill after verifying the caller's step-up reauth token. */
export const processPayment = onCall<ProcessPaymentRequest>(async (request) => {
  const uid = requireAuth(request);
  const billId = requireField(request.data.bill_id, "bill_id");
  const paymentMethodId = requireField(request.data.payment_method_id, "payment_method_id");
  const reauthToken = requireField(request.data.reauth_token, "reauth_token");

  await verifyReauthToken(uid, reauthToken);
  const result = await processPaymentService(uid, billId, paymentMethodId);

  return {
    transaction_id: result.transactionId,
    status: result.status,
    amount: result.amount,
    paid_at: result.paidAtMillis,
  };
});
