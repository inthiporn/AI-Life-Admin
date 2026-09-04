import { useState } from "react";
import { formatTHB, useAppState } from "../state/AppStateContext";

export default function PaymentConfirmPage() {
  const { navigate, currentBill } = useAppState();
  const [method, setMethod] = useState("promptpay");

  if (!currentBill) {
    return (
      <section className="screen">
        <button className="btn-back" onClick={() => navigate("home")}>
          ←
        </button>
        <p className="muted center">ไม่พบรายการที่เลือก</p>
      </section>
    );
  }

  const amountLabel = formatTHB(currentBill.amount);

  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("home")}>
        ←
      </button>
      <h2>ยืนยันการชำระเงิน</h2>
      <div className="bill-summary">
        <p className="muted">เลขที่ผู้ใช้ไฟฟ้า</p>
        <p className="bold">{currentBill.ref}</p>
        <p className="muted">ยอดชำระ</p>
        <p className="amount">{amountLabel} บาท</p>
        <p className="muted">กำหนดชำระ</p>
        <p className="bold">{currentBill.due}</p>
      </div>
      <p className="muted">ช่องทางชำระเงิน</p>
      <div className="option-list">
        <label className="option-row">
          <input type="radio" name="pm" checked={method === "promptpay"} onChange={() => setMethod("promptpay")} />
          <span>💠 PromptPay (แนะนำ)</span>
        </label>
        <label className="option-row">
          <input type="radio" name="pm" checked={method === "card"} onChange={() => setMethod("card")} />
          <span>💳 บัตรเครดิต / เดบิต</span>
        </label>
        <label className="option-row">
          <input type="radio" name="pm" checked={method === "autodebit"} onChange={() => setMethod("autodebit")} />
          <span>🏦 หักบัญชีอัตโนมัติ</span>
        </label>
      </div>
      <button className="btn-primary" onClick={() => navigate("reauth")}>
        ชำระเงิน {amountLabel} บาท
      </button>
    </section>
  );
}
