import { onCall } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../lib/admin";
import { requireAuth } from "../lib/assert";

interface SetupBiometricRequest {
  enabled: boolean;
}

/** Enables/disables Face ID / Touch ID quick-login for the calling user. */
export const setupBiometric = onCall<SetupBiometricRequest>(async (request) => {
  const uid = requireAuth(request);
  const enabled = request.data.enabled ?? true;

  const userRef = db.collection("users").doc(uid);
  await userRef.set(
    { biometric_enabled: enabled, updated_at: FieldValue.serverTimestamp() },
    { merge: true }
  );

  await userRef.collection("security_logs").add({
    event_type: enabled ? "biometric_enabled" : "biometric_disabled",
    created_at: FieldValue.serverTimestamp(),
  });

  return { success: true, biometric_enabled: enabled };
});
