import { onCall } from "firebase-functions/v2/https";
import { requireAuth, requireField } from "../middleware/guards";
import * as authService from "../services/authService";

interface SetPinRequest {
  pin: string;
}

/** Callable: sets or changes the calling user's 6-digit PIN. */
export const setPin = onCall<SetPinRequest>(async (request) => {
  const uid = requireAuth(request);
  const pin = requireField(request.data.pin, "pin");
  await authService.setPin(uid, pin);
  return { success: true };
});

interface SetupBiometricRequest {
  enabled: boolean;
}

/** Callable: enables/disables Face ID / Touch ID quick-login. */
export const setupBiometric = onCall<SetupBiometricRequest>(async (request) => {
  const uid = requireAuth(request);
  const enabled = request.data.enabled ?? true;
  await authService.setupBiometric(uid, enabled);
  return { success: true, biometric_enabled: enabled };
});

interface ReauthenticateRequest {
  method: "pin" | "biometric";
  pin?: string;
}

/** Callable: step-up authentication, issues a short-lived reauth_token. */
export const reauthenticate = onCall<ReauthenticateRequest>(async (request) => {
  const uid = requireAuth(request);
  const { method, pin } = request.data;
  const result = await authService.reauthenticate(uid, method, pin);
  return { reauth_token: result.reauthToken, expires_at: result.expiresAtMillis };
});
