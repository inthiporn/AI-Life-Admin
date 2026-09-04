import { useAppState } from "../state/AppStateContext";

export default function HelpPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("account")}>
        ←
      </button>
      <h2>ช่วยเหลือ</h2>
      <div className="menu-list">
        <button className="menu-row">
          <span>❓ คำถามที่พบบ่อย (FAQ)</span>
          <span>›</span>
        </button>
        <button className="menu-row">
          <span>💬 ติดต่อเรา</span>
          <span>›</span>
        </button>
        <button className="menu-row">
          <span>📜 เงื่อนไขการใช้งาน</span>
          <span>›</span>
        </button>
      </div>
    </section>
  );
}
