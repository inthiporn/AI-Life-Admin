import { onCall } from "firebase-functions/v2/https";
import { requireAuth, requireField } from "../middleware/guards";
import { verifyReauthToken } from "../services/authService";
import { deleteAccount as deleteAccountService } from "../services/accountService";

interface DeleteAccountRequest {
  reauth_token: string;
}

/** Callable: permanently deletes the calling user's account and owned data. */
export const deleteAccount = onCall<DeleteAccountRequest>(async (request) => {
  const uid = requireAuth(request);
  const reauthToken = requireField(request.data.reauth_token, "reauth_token");

  await verifyReauthToken(uid, reauthToken);
  await deleteAccountService(uid);

  return { success: true };
});
