import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebaseClient";

// Placeholder until Firebase Authentication is wired into the Login/OTP screens —
// this is the user_id backend/scripts/seedDemoBills.ts seeded real bills under.
const DEMO_USER_ID = "demo-user";

// The health-checkup card is a reminder/appointment, not a payable bill — the
// backend schema's BillDoc.status has no "appointment" value, so this stays
// local-only rather than being seeded into Firestore alongside real bills.
const HEALTH_APPOINTMENT_BILL = { id: "bill_health_appt", category: "health_checkup", ref: "-", due: "20 พ.ย. 2569", amount: 0, status: "appointment" };

// Falls back to this if Firestore isn't reachable (offline, rules, missing .env) —
// same shape as backend/scripts/seedDemoBills.ts.
const FALLBACK_BILLS = [
  { id: "bill1", category: "electricity", ref: "123456789", due: "30 มิ.ย. 2569", amount: 1245.0, status: "pending" },
  { id: "bill2", category: "water", ref: "987654321", due: "15 ส.ค. 2569", amount: 320.5, status: "pending" },
  HEALTH_APPOINTMENT_BILL,
];

// Falls back to this if Firestore isn't reachable — matches the 5 documents
// seeded by backend/scripts/seedServiceCategories.ts.
const FALLBACK_CATEGORIES = [
  { id: "electricity", name: "ค่าไฟฟ้า", icon: "⚡" },
  { id: "water", name: "ค่าน้ำประปา", icon: "🚰" },
  { id: "tax", name: "ต่อภาษีรถ", icon: "🚗" },
  { id: "social", name: "ประกันสังคม", icon: "🛡️" },
  { id: "health_checkup", name: "ตรวจสุขภาพ", icon: "❤️" },
];

const AD_HOC_AMOUNT = 450.0;

export function formatTHB(amount) {
  return amount.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatThaiDate(timestamp) {
  if (!timestamp) return "-";
  const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" });
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [screen, setScreen] = useState("splash");
  const [bills, setBills] = useState(FALLBACK_BILLS);
  const [currentBillId, setCurrentBillId] = useState(null);
  const [lastPayment, setLastPayment] = useState(null);
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    let cancelled = false;
    getDocs(collection(db, "service_categories"))
      .then((snap) => {
        if (cancelled || snap.empty) return;
        const docs = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((c) => c.is_active !== false);
        if (docs.length) setCategories(docs);
      })
      .catch(() => {
        // Firestore unreachable (offline, rules, missing .env) — keep the static fallback.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getDocs(query(collection(db, "bills"), where("user_id", "==", DEMO_USER_ID)))
      .then((snap) => {
        if (cancelled || snap.empty) return;
        const docs = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            category: data.category_id,
            ref: data.reference_number || "-",
            due: formatThaiDate(data.due_date),
            amount: data.amount,
            status: data.status,
          };
        });
        setBills([...docs, HEALTH_APPOINTMENT_BILL]);
      })
      .catch(() => {
        // Firestore unreachable (offline, rules, missing .env) — keep the static fallback.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const navigate = useCallback((id) => setScreen(id), []);

  function categoryFor(categoryId) {
    return categories.find((c) => c.id === categoryId) || { id: categoryId, icon: "🧾", name: "บริการ" };
  }

  const startPaymentFor = useCallback((category) => {
    setBills((prev) => {
      const existing = prev.find((b) => b.category === category);
      if (existing) {
        setCurrentBillId(existing.id);
        return prev;
      }
      const bill = { id: "bill_" + category, category, ref: "-", due: "-", amount: AD_HOC_AMOUNT, status: "pending" };
      setCurrentBillId(bill.id);
      return [...prev, bill];
    });
    setScreen("payment-confirm");
  }, []);

  const completePayment = useCallback(() => {
    const paidBill = bills.find((b) => b.id === currentBillId) || null;
    setBills((prev) => prev.map((b) => (b.id === currentBillId ? { ...b, status: "paid" } : b)));

    const now = new Date();
    const txId =
      "TX" +
      now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(Math.floor(Math.random() * 90000) + 10000);

    setLastPayment({
      billName: paidBill ? categoryFor(paidBill.category).name : "รายการ",
      amount: paidBill ? paidBill.amount : 0,
      dateLabel:
        now.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" }) +
        " " +
        now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) +
        " น.",
      txId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bills, currentBillId, categories]);

  const currentBill = bills.find((b) => b.id === currentBillId) || null;
  const pendingCount = bills.filter((b) => b.status !== "paid").length;

  const value = {
    screen,
    navigate,
    bills,
    currentBill,
    categories,
    categoryFor,
    lastPayment,
    pendingCount,
    startPaymentFor,
    completePayment,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
