/**
 * One-off seed script: writes sample `bills` documents for a fixed demo
 * user ("demo-user"), so the frontend's Home screen has real Firestore data
 * to read (not just service_categories). Uses the Admin SDK, so it bypasses
 * firestore.rules — run this from a trusted machine only.
 *
 * There is no real Firebase Auth user behind "demo-user" yet (login/OTP are
 * still mocked in the frontend) — this is a placeholder until auth is wired
 * up, at which point these should be reseeded under a real signed-up uid.
 *
 * Usage: see scripts/seedServiceCategories.ts — same setup, run with:
 *   npx ts-node --transpile-only scripts/seedDemoBills.ts
 */
import { initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

initializeApp();
const db = getFirestore();

const DEMO_USER_ID = "demo-user";

const BILLS: Array<{
  id: string;
  category_id: string;
  provider_name: string;
  reference_number: string;
  amount: number;
  due_date: Date;
  status: "pending" | "overdue" | "paid" | "cancelled" | "appointment";
}> = [
  {
    id: "demo-electricity-1",
    category_id: "electricity",
    provider_name: "การไฟฟ้านครหลวง",
    reference_number: "123456789",
    amount: 1245.0,
    due_date: new Date("2026-09-30"),
    status: "pending",
  },
  {
    id: "demo-water-1",
    category_id: "water",
    provider_name: "การประปานครหลวง",
    reference_number: "987654321",
    amount: 320.5,
    due_date: new Date("2026-10-15"),
    status: "pending",
  },
  {
    id: "demo-tax-1",
    category_id: "tax",
    provider_name: "กรมการขนส่งทางบก",
    reference_number: "1กข-1234 กรุงเทพมหานคร",
    amount: 800.0,
    due_date: new Date("2026-11-05"),
    status: "pending",
  },
  {
    id: "demo-social-1",
    category_id: "social",
    provider_name: "สำนักงานประกันสังคม",
    reference_number: "SSO-556677",
    amount: 750.0,
    due_date: new Date("2026-09-20"),
    status: "pending",
  },
  {
    id: "demo-electricity-2",
    category_id: "electricity",
    provider_name: "การไฟฟ้านครหลวง",
    reference_number: "123456789",
    amount: 980.0,
    due_date: new Date("2026-08-01"),
    status: "overdue",
  },
  {
    // Non-monetary reminder, not a payable bill — see BillDoc.status in
    // backend/src/models/firestoreSchemas.ts for why "appointment" exists.
    id: "demo-health-checkup-1",
    category_id: "health_checkup",
    provider_name: "โรงพยาบาลรามาธิบดี",
    reference_number: "-",
    amount: 0,
    due_date: new Date("2026-11-20"),
    status: "appointment",
  },
];

async function main() {
  const batch = db.batch();
  for (const { id, due_date, status, ...data } of BILLS) {
    batch.set(db.collection("bills").doc(id), {
      ...data,
      user_id: DEMO_USER_ID,
      document_id: null,
      due_date: Timestamp.fromDate(due_date),
      status,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
  }
  await batch.commit();
  console.log(`Seeded ${BILLS.length} bills documents for user_id="${DEMO_USER_ID}".`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
