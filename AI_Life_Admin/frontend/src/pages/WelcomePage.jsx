import { useAppState } from "../state/AppStateContext";

export default function WelcomePage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("splash")}>
        ←
      </button>
      <div className="welcome-illustration">🏠📅🚗</div>
      <h2>
        ให้ AI ช่วยจัดการเรื่องชีวิต
        <br />
        ครบ จบ ในแอปเดียว
      </h2>
      <p className="muted">จบทุกเรื่อง เอกสาร บิล นัดหมาย เพียงแตะปุ่มเดียว</p>
      <div className="dots">
        <span className="dot active"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
      <button className="btn-primary" onClick={() => navigate("language")}>
        เริ่มต้นใช้งาน
      </button>
    </section>
  );
}
