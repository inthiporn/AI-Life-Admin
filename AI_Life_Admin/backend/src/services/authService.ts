import { HttpsError } from "firebase-functions/v2/https";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { db } from "../config/firebase";
import type { UserDoc } from "../models/firestoreSchemas";

const REAUTH_TTL_MS = 5 * 60 * 1000; // 5 minutes, per docs/tech-spec.md §4.3

/** Sets or changes the user's 6-digit PIN. The PIN itself is never stored — only its hash. */
export async function setPin(uid: string, pin: string): Promise<void> {
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
}

/** Enables/disables Face ID / Touch ID quick-login for the given user. */
export async function setupBiometric(uid: string, enabled: boolean): Promise<void> {
  const userRef = db.collection("users").doc(uid);
  await userRef.set(
    { biometric_enabled: enabled, updated_at: FieldValue.serverTimestamp() },
    { merge: true }
  );
  await userRef.collection("security_logs").add({
    event_type: enabled ? "biometric_enabled" : "biometric_disabled",
    created_at: FieldValue.serverTimestamp(),
  });
}

export interface ReauthResult {
  reauthToken: string;
  expiresAtMillis: number;
}

/**
 * Step-up authentication: verifies PIN (server-side) or trusts a biometric
 * check already performed on-device by the OS, then issues a short-lived
 * reauth token that payment/account-deletion flows require.
 */
export async function reauthenticate(
  uid: string,
  method: "pin" | "biometric",
  pin?: string
): Promise<ReauthResult> {
  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new HttpsError("not-found", "ไม่พบผู้ใช้งาน");
  }
  const user = userSnap.data() as UserDoc;

  if (method === "pin") {
    if (!pin || !user.pin_hash) {
      throw new HttpsError("invalid-argument", "ไม่พบรหัส PIN ที่ตั้งไว้");
    }
    const match = await bcrypt.compare(pin, user.pin_hash);
    if (!match) {
      throw new HttpsError("permission-denied", "รหัส PIN ไม่ถูกต้อง");
    }
  } else if (method === "biometric") {
    if (!user.biometric_enabled) {
      throw new HttpsError("failed-precondition", "ยังไม่ได้เปิดใช้งาน Biometric");
    }
    // Biometric match itself happens on-device (Face ID/Touch ID); the client
    // only calls this function after the OS confirms success.
  } else {
    throw new HttpsError("invalid-argument", "method ต้องเป็น 'pin' หรือ 'biometric'");
  }

  const token = crypto.randomUUID();
  const expiresAt = Timestamp.fromMillis(Date.now() + REAUTH_TTL_MS);

  await userRef.update({
    reauth: { token, expires_at: expiresAt },
    updated_at: FieldValue.serverTimestamp(),
  });
  await userRef.collection("security_logs").add({
    event_type: "reauthenticated",
    created_at: FieldValue.serverTimestamp(),
  });

  return { reauthToken: token, expiresAtMillis: expiresAt.toMillis() };
}

/** Verifies a reauth token issued by `reauthenticate` is present and unexpired. */
export async function verifyReauthToken(uid: string, token: string | undefined): Promise<void> {
  if (!token) {
    throw new HttpsError("permission-denied", "ต้องยืนยันตัวตนอีกครั้งก่อนทำรายการนี้");
  }
  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  const user = userSnap.data() as UserDoc | undefined;

  if (!user?.reauth || user.reauth.token !== token) {
    throw new HttpsError("permission-denied", "reauth_token ไม่ถูกต้อง");
  }
  if (user.reauth.expires_at.toMillis() < Date.now()) {
    throw new HttpsError("permission-denied", "reauth_token หมดอายุ กรุณายืนยันตัวตนใหม่");
  }
}
