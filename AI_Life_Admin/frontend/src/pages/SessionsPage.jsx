import { useAppState } from "../state/AppStateContext";

export default function SessionsPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("account")}>
        ←
      </button>
      <h2>อุปกรณ์ที่เข้าสู่ระบบ</h2>
      <div className="session-card">
        <p className="bold">
          iPhone 16 (iOS 18) <span className="badge">อุปกรณ์นี้</span>
        </p>
        <p className="muted small">Bangkok, Thailand · 15 มิ.ย. 2568 10:24 น.</p>
      </div>
      <div className="session-card">
        <p className="bold">MacBook Pro</p>
        <p className="muted small">Bangkok, Thailand · 12 มิ.ย. 2568 09:15 น.</p>
        <button className="btn-text danger">ออกจากระบบอุปกรณ์นี้</button>
      </div>
    </section>
  );
}
