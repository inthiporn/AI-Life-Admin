import { onCall } from "firebase-functions/v2/https";
import { db, auth } from "../lib/admin";
import { requireAuth, requireField } from "../lib/assert";
import { verifyReauthToken } from "../auth/reauthenticate";

const SUBCOLLECTIONS = [
  "devices",
  "payment_methods",
  "notifications",
  "consents",
  "security_logs",
  "settings",
];

interface DeleteAccountRequest {
  reauth_token: string;
}

/** Deletes a user's Firestore data and their Firebase Authentication account (PDPA/GDPR erasure). */
export const deleteAccount = onCall<DeleteAccountRequest>(async (request) => {
  const uid = requireAuth(request);
  const reauthToken = requireField(request.data.reauth_token, "reauth_token");
  await verifyReauthToken(uid, reauthToken);

  const userRef = db.collection("users").doc(uid);

  for (const sub of SUBCOLLECTIONS) {
    const snap = await userRef.collection(sub).get();
    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    if (!snap.empty) await batch.commit();
  }

  const ownedCollections = ["bills", "documents"] as const;
  for (const collectionName of ownedCollections) {
    const snap = await db.collection(collectionName).where("user_id", "==", uid).get();
    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    if (!snap.empty) await batch.commit();
  }
  // `transactions` are financial records — retained for audit/compliance rather than deleted.

  await userRef.delete();
  await auth.deleteUser(uid);

  return { success: true };
});
