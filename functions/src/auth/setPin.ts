import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import * as bcrypt from "bcryptjs";
import { db } from "../lib/admin";
import { requireAuth, requireField } from "../lib/assert";

interface SetPinRequest {
  pin: string;
}

/** Sets or changes the user's 6-digit PIN. The PIN itself is never stored — only its hash. */
export const setPin = onCall<SetPinRequest>(async (request) => {
  const uid = requireAuth(request);
  const pin = requireField(request.data.pin, "pin");

  if (!/^\d{6}$/.test(pin)) {
    throw new HttpsError("invalid-argument", "PIN ต้องเป็นตัวเลข 6 หลัก");
  }

  const pinHash = await bcrypt.hash(pin, 10);

  const userRef = db.collection("users").doc(uid);
  await userRef.set(
    { pin_hash: pinHash, updated_at: FieldValue.serverTimestamp() },
    { merge: true }
  );

  await userRef.collection("security_logs").add({
    event_type: "pin_changed",
    created_at: FieldValue.serverTimestamp(),
  });

  return { success: true };
});
