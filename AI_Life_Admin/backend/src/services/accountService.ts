import { db, auth } from "../config/firebase";

const OWNED_SUBCOLLECTIONS = [
  "devices",
  "payment_methods",
  "notifications",
  "consents",
  "security_logs",
  "settings",
];

const OWNED_TOP_LEVEL_COLLECTIONS = ["bills", "documents"] as const;

/** Deletes a user's Firestore data and their Firebase Authentication account (PDPA/GDPR erasure). */
export async function deleteAccount(uid: string): Promise<void> {
  const userRef = db.collection("users").doc(uid);

  for (const sub of OWNED_SUBCOLLECTIONS) {
    const snap = await userRef.collection(sub).get();
    if (snap.empty) continue;
    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }

  for (const collectionName of OWNED_TOP_LEVEL_COLLECTIONS) {
    const snap = await db.collection(collectionName).where("user_id", "==", uid).get();
    if (snap.empty) continue;
    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
  // `transactions` are financial records — retained for audit/compliance rather than deleted.

  await userRef.delete();
  await auth.deleteUser(uid);
}
