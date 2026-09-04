import { useAppState } from "../state/AppStateContext";

export default function SplashPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <div className="splash-content">
        <div className="logo">🛡️</div>
        <h1>AI Life Admin</h1>
        <p className="subtitle">Less Admin, More Life</p>
        <p className="subtitle-th">ผู้ช่วยจัดการชีวิตให้คุณมีเวลาสำคัญกว่า</p>
      </div>
      <button className="btn-primary" onClick={() => navigate("welcome")}>
        เริ่มต้นใช้งาน
      </button>
    </section>
  );
}
