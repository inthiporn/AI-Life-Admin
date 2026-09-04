import { formatTHB, useAppState } from "../state/AppStateContext";
import BottomNav from "../components/BottomNav";

export default function HomePage() {
  const { bills, categoryFor, pendingCount, payBill, navigate } = useAppState();

  return (
    <section className="screen">
      <div className="home-header">
        <div>
          <p className="muted">สวัสดีค่ะ 👋</p>
          <h3>คุณเปิ้ล มีเรื่องต้องจัดการ {pendingCount} เรื่อง</h3>
        </div>
        <button className="icon-btn" onClick={() => navigate("notification-settings")}>
          🔔
        </button>
      </div>
      <div className="bill-list">
        {bills.map((bill) => {
          const cat = categoryFor(bill.category);
          const isPayable = bill.status === "pending" || bill.status === "overdue";
          return (
            <button
              key={bill.id}
              className={"bill-card" + (bill.status === "paid" ? " paid" : "")}
              onClick={() => isPayable && payBill(bill.id)}
            >
              <span className="bill-icon">{cat.icon}</span>
              <span className="bill-info">
                <span className="bill-name">{cat.name}</span>
                <br />
                <span className={"bill-due" + (bill.status === "overdue" ? " overdue" : "")}>
                  {bill.status === "paid"
                    ? "ชำระแล้ว"
                    : bill.status === "appointment"
                    ? "นัดหมาย " + bill.due
                    : bill.status === "overdue"
                    ? "เกินกำหนดชำระ " + bill.due
                    : "ครบกำหนด " + bill.due}
                </span>
              </span>
              <span className="bill-amount">{bill.amount > 0 ? formatTHB(bill.amount) + " บ." : ""}</span>
            </button>
          );
        })}
      </div>
      <button className="btn-secondary" onClick={() => navigate("services")}>
        + เพิ่มธุระใหม่
      </button>
      <BottomNav active="home" />
    </section>
  );
}
