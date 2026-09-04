import { formatTHB, useAppState } from "../state/AppStateContext";

export default function SuccessPage() {
  const { navigate, lastPayment } = useAppState();
  const billName = lastPayment ? lastPayment.billName : "รายการ";
  const amountLabel = lastPayment ? formatTHB(lastPayment.amount) : "0.00";

  return (
    <section className="screen">
      <div className="success-icon">✅</div>
      <h2>สำเร็จแล้ว!</h2>
      <p className="muted center">
        ชำระ{billName}เรียบร้อย
        <br />
        <span className="bold">{amountLabel} บาท</span>
      </p>
      <div className="bill-summary">
        <p className="muted">วันที่ทำรายการ</p>
        <p className="bold">{lastPayment ? lastPayment.dateLabel : "-"}</p>
        <p className="muted">เลขที่อ้างอิง</p>
        <p className="bold">{lastPayment ? lastPayment.txId : "-"}</p>
      </div>
      <button className="btn-secondary">ดูใบเสร็จรับเงิน</button>
      <button className="btn-primary" onClick={() => navigate("home")}>
        กลับหน้าหลัก
      </button>
    </section>
  );
}
