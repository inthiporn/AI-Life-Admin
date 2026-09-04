import { httpsCallable } from "firebase/functions";
import { functions } from "./firebaseClient";

// Thin wrappers around the Cloud Functions exported from backend/src/routes/index.ts.
// Mirrors docs/tech-spec.md §3.2 — each function here maps 1:1 to a callable on the backend.

export function setPin(pin) {
  return httpsCallable(functions, "setPin")({ pin });
}

export function setupBiometric(enabled) {
  return httpsCallable(functions, "setupBiometric")({ enabled });
}

export function reauthenticate(method, pin) {
  return httpsCallable(functions, "reauthenticate")({ method, pin });
}

export function scanDocument(filePath, docType) {
  return httpsCallable(functions, "scanDocument")({ file_path: filePath, doc_type: docType });
}

export function processPayment(billId, paymentMethodId, reauthToken) {
  return httpsCallable(functions, "processPayment")({
    bill_id: billId,
    payment_method_id: paymentMethodId,
    reauth_token: reauthToken,
  });
}

export function deleteAccount(reauthToken) {
  return httpsCallable(functions, "deleteAccount")({ reauth_token: reauthToken });
}
