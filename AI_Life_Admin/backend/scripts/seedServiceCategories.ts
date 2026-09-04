/**
 * One-off seed script: writes the 5 sample `service_categories` documents
 * described in docs/database-schema.md §4.4 (same set shown in the
 * prototype's Services grid). Uses the Admin SDK, so it bypasses
 * firestore.rules (which intentionally blocks client writes to this
 * collection) — run this from a trusted machine only.
 *
 * Usage:
 *   cd backend
 *   npm install
 *   # Point at a project — pick ONE:
 *   #   a) local emulator:  firebase emulators:start   (in another terminal)
 *   #                       export FIRESTORE_EMULATOR_HOST=localhost:8080
 *   #   b) real project:    gcloud auth application-default login
 *   #                       (or set GOOGLE_APPLICATION_CREDENTIALS to a service account key)
 *   npx ts-node scripts/seedServiceCategories.ts
 */
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

const CATEGORIES: Array<{
  id: string;
  name: string;
  icon: string;
  description: string;
  is_active: boolean;
}> = [
  { id: "electricity", name: "ค่าไฟฟ้า", icon: "⚡", description: "ชำระ/ตรวจสอบยอดค่าไฟฟ้า", is_active: true },
  { id: "water", name: "ค่าน้ำประปา", icon: "🚰", description: "ชำระ/ตรวจสอบยอดค่าน้ำประปา", is_active: true },
  { id: "tax", name: "ต่อภาษีรถ", icon: "🚗", description: "ต่อภาษีรถยนต์/รถจักรยานยนต์ประจำปี", is_active: true },
  { id: "social", name: "ประกันสังคม", icon: "🛡️", description: "ตรวจสอบสิทธิและชำระเงินสมทบประกันสังคม", is_active: true },
  { id: "health_checkup", name: "ตรวจสุขภาพ", icon: "❤️", description: "นัดหมายและติดตามผลตรวจสุขภาพประจำปี", is_active: true },
];

async function main() {
  const batch = db.batch();
  for (const { id, ...data } of CATEGORIES) {
    batch.set(db.collection("service_categories").doc(id), data);
  }
  await batch.commit();
  console.log(`Seeded ${CATEGORIES.length} service_categories documents.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
