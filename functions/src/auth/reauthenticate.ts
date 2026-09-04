import { onCall, HttpsError } from "firebase-functions/v2/https";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { db } from "../lib/admin";
import { requireAuth } from "../lib/assert";
import type { UserDoc } from "../types/models";

const REAUTH_TTL_MS = 5 * 60 * 1000; // 5 minutes, per docs/tech-spec.md §4.3

interface ReauthenticateRequest {
  method: "pin" | "biometric";
  pin?: string;
}

/**
 * Step-up authentication: verifies PIN (server-side) or trusts a biometric
 * check already performed on-device by the OS, then issues a short-lived
 * reauth_token that processPayment/deleteAccount require.
 */
export const reauthenticate = onCall<ReauthenticateRequest>(async (request) => {
  const uid = requireAuth(request);
  const { method } = request.data;

  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new HttpsError("not-found", "ไม่พบผู้ใช้งาน");
  }
  const user = userSnap.data() as UserDoc;

  if (method === "pin") {
    if (!request.data.pin || !user.pin_hash) {
      throw new HttpsError("invalid-argument", "ไม่พบรหัส PIN ที่ตั้งไว้");
    }
    const match = await bcrypt.compare(request.data.pin, user.pin_hash);
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

  return { reauth_token: token, expires_at: expiresAt.toMillis() };
});

/** Shared helper used by functions that require a valid, unexpired reauth token. */
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
