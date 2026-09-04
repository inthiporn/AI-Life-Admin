import { HttpsError } from "firebase-functions/v2/https";
import type { CallableRequest } from "firebase-functions/v2/https";

/** Throws `unauthenticated` if the callable was invoked without a signed-in user. */
export function requireAuth(request: CallableRequest): string {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "ต้องเข้าสู่ระบบก่อนใช้งานฟังก์ชันนี้");
  }
  return request.auth.uid;
}

/** Throws `invalid-argument` when a required field is missing/empty. */
export function requireField<T>(value: T | undefined | null, fieldName: string): T {
  if (value === undefined || value === null || value === "") {
    throw new HttpsError("invalid-argument", `ขาดข้อมูล: ${fieldName}`);
  }
  return value;
}
