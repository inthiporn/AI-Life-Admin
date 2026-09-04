import { HttpsError } from "firebase-functions/v2/https";
import { FieldValue } from "firebase-admin/firestore";
import { db } from "../config/firebase";
import { extractDocumentData } from "./ocrService";

const MIN_CONFIDENCE = 0.7;

export interface ScanResult {
  documentId: string;
  extractedData: Record<string, string>;
  needsReview: boolean;
}

/** Calls the AI/OCR provider on an uploaded document and saves the result to Firestore. */
export async function scanAndStoreDocument(
  uid: string,
  filePath: string,
  docType: string
): Promise<ScanResult> {
  if (!filePath.startsWith(`users/${uid}/`)) {
    throw new HttpsError("permission-denied", "ไม่มีสิทธิ์เข้าถึงไฟล์นี้");
  }

  const result = await extractDocumentData(filePath);
  const needsReview = result.confidence < MIN_CONFIDENCE;

  const docRef = await db.collection("documents").add({
    user_id: uid,
    doc_type: docType,
    file_path: filePath,
    extracted_data: result.data,
    status: "pending",
    needs_review: needsReview,
    scanned_at: FieldValue.serverTimestamp(),
  });

  return { documentId: docRef.id, extractedData: result.data, needsReview };
}
