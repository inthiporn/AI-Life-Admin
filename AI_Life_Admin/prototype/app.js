// AI Life Admin — Interactive Prototype
// Mock state only (no real Firebase). Mirrors entities described in docs/database-schema.md

const state = {
  bills: [
    { id: "bill1", category: "electricity", icon: "⚡", name: "ค่าไฟฟ้า", ref: "123456789", due: "30 มิ.ย. 2569", amount: 1245.00, status: "pending" },
    { id: "bill2", category: "water", icon: "🚰", name: "ค่าน้ำประปา", ref: "987654321", due: "15 ส.ค. 2569", amount: 320.50, status: "pending" },
    { id: "bill3", category: "health", icon: "❤️", name: "ตรวจสุขภาพ", ref: "-", due: "20 พ.ย. 2569", amount: 0, status: "appointment" },
  ],
  currentBillId: null,
  pinBuffer: "",
  pinTarget: null, // 'pin-setup' | 'pin-verify-reauth'
};

const screens = document.querySelectorAll(".screen");
function navigate(id) {
  const target = document.getElementById("screen-" + id);
  if (!target) return;
  screens.forEach((s) => s.classList.remove("active"));
  target.classList.add("active");
  target.scrollTop = 0;
  if (id === "home") renderHome();
  if (id === "processing") runProcessing();
}

// Delegate all [data-nav] clicks
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-nav]");
  if (!el) return;
  e.preventDefault();

  // Service card sets which bill the payment flow is for
  if (el.classList.contains("service-card") && el.dataset.bill) {
    startPaymentFor(el.dataset.bill);
    return;
  }
  navigate(el.dataset.nav);
});

function formatTHB(n) {
  return n.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderHome() {
  const list = document.getElementById("home-bill-list");
  list.innerHTML = "";
  state.bills.forEach((bill) => {
    const btn = document.createElement("button");
    btn.className = "bill-card" + (bill.status === "paid" ? " paid" : "");
    btn.innerHTML = `
      <span class="bill-icon">${bill.icon}</span>
      <span class="bill-info">
        <span class="bill-name">${bill.name}</span><br>
        <span class="bill-due">${bill.status === "paid" ? "ชำระแล้ว" : bill.status === "appointment" ? "นัดหมาย " + bill.due : "ครบกำหนด " + bill.due}</span>
      </span>
      <span class="bill-amount">${bill.amount > 0 ? formatTHB(bill.amount) + " บ." : ""}</span>
    `;
    if (bill.status === "pending") {
      btn.addEventListener("click", () => startPaymentFor(bill.category));
    }
    list.appendChild(btn);
  });
  const pendingCount = state.bills.filter((b) => b.status !== "paid").length;
  document.getElementById("home-pending-count").textContent = pendingCount;
}

function startPaymentFor(category) {
  let bill = state.bills.find((b) => b.category === category);
  if (!bill) {
    // service not yet in mock bill list -> create an ad-hoc one for the demo
    const names = { tax: ["🚗", "ต่อภาษีรถ"], social: ["🛡️", "ประกันสังคม"] };
    const [icon, name] = names[category] || ["🧾", "บริการ"];
    bill = { id: "bill_" + category, category, icon, name, ref: "-", due: "-", amount: 450.00, status: "pending" };
    state.bills.push(bill);
  }
  state.currentBillId = bill.id;
  document.getElementById("pay-title").textContent = "ยืนยันการชำระเงิน";
  document.getElementById("pay-ref").textContent = bill.ref;
  document.getElementById("pay-amount").textContent = formatTHB(bill.amount) + " บาท";
  document.getElementById("pay-due").textContent = bill.due;
  document.getElementById("pay-btn-amount").textContent = formatTHB(bill.amount);
  navigate("payment-confirm");
}

// --- Terms accept: require the two mandatory checkboxes ---
document.getElementById("btn-accept-terms").addEventListener("click", (e) => {
  const boxes = document.querySelectorAll(".consent-cb");
  const mandatory = [boxes[0], boxes[1]];
  if (!mandatory.every((b) => b.checked)) {
    e.preventDefault();
    alert("กรุณายอมรับเงื่อนไขการใช้บริการและ PDPA ก่อนดำเนินการต่อ");
  }
});

// --- Login ---
document.getElementById("btn-login").addEventListener("click", () => {
  const id = document.getElementById("login-identifier").value.trim();
  const pw = document.getElementById("login-password").value.trim();
  if (!id || !pw) {
    alert("กรุณากรอกอีเมล/เบอร์โทรศัพท์และรหัสผ่าน");
    return;
  }
  navigate("otp");
  startOtpTimer();
});

// --- OTP ---
let otpTimerInterval = null;
function startOtpTimer() {
  let seconds = 42;
  const el = document.getElementById("otp-timer");
  clearInterval(otpTimerInterval);
  otpTimerInterval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(otpTimerInterval);
      el.textContent = "00:00";
      return;
    }
    el.textContent = "00:" + String(seconds).padStart(2, "0");
  }, 1000);
}
document.getElementById("btn-resend-otp").addEventListener("click", (e) => {
  e.preventDefault();
  startOtpTimer();
});
document.getElementById("btn-verify-otp").addEventListener("click", () => {
  const boxes = document.querySelectorAll(".otp-box");
  const code = Array.from(boxes).map((b) => b.value).join("");
  if (code.length !== 6) {
    alert("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
    return;
  }
  navigate("biometric");
});
// auto-advance focus between otp boxes
document.querySelectorAll(".otp-box").forEach((box, idx, all) => {
  box.addEventListener("input", () => {
    if (box.value && all[idx + 1]) all[idx + 1].focus();
  });
});

// --- PIN pad (shared logic for setup + reauth verify) ---
function setupPinPad(keypadId, dotsId, onComplete) {
  const keypad = document.getElementById(keypadId);
  const dots = document.querySelectorAll("#" + dotsId + " .pin-dot");
  let buffer = "";
  keypad.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-key]");
    if (!btn) return;
    const key = btn.dataset.key;
    if (key === "back") {
      buffer = buffer.slice(0, -1);
    } else if (buffer.length < 6) {
      buffer += key;
    }
    dots.forEach((d, i) => d.classList.toggle("filled", i < buffer.length));
    if (buffer.length === 6) {
      setTimeout(() => {
        buffer = "";
        dots.forEach((d) => d.classList.remove("filled"));
        onComplete();
      }, 250);
    }
  });
}
setupPinPad("pin-keypad", "pin-dots", () => navigate("home"));
setupPinPad("pin-keypad-reauth", "pin-dots-reauth", () => navigate("processing"));

// --- Document scan ---
document.getElementById("btn-do-scan").addEventListener("click", () => {
  navigate("scan-review");
});
document.getElementById("btn-confirm-scan").addEventListener("click", () => {
  navigate("services");
});

// --- Payment ---
document.getElementById("btn-pay").addEventListener("click", () => {
  navigate("reauth");
});

// --- Processing -> Success ---
function runProcessing() {
  document.getElementById("processing-step3").textContent = "⏳ รอผลการยืนยัน";
  document.getElementById("processing-step4").textContent = "⏳ บันทึกรายการ";
  setTimeout(() => {
    document.getElementById("processing-step3").textContent = "✅ รอผลการยืนยัน";
  }, 500);
  setTimeout(() => {
    document.getElementById("processing-step4").textContent = "✅ บันทึกรายการ";
  }, 1000);
  setTimeout(() => {
    completePayment();
    navigate("success");
  }, 1500);
}

function completePayment() {
  const bill = state.bills.find((b) => b.id === state.currentBillId);
  const now = new Date();
  const txid = "TX" + now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(Math.floor(Math.random() * 90000) + 10000);

  document.getElementById("success-desc").innerHTML =
    `ชำระ${bill ? bill.name : "รายการ"}เรียบร้อย<br><span class="bold" id="success-amount">${bill ? formatTHB(bill.amount) : "0.00"} บาท</span>`;
  document.getElementById("success-date").textContent =
    now.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" }) +
    " " + now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }) + " น.";
  document.getElementById("success-txid").textContent = txid;

  if (bill) bill.status = "paid";
}
