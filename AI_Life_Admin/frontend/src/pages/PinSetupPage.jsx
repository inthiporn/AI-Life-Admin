import { useAppState } from "../state/AppStateContext";
import PinPad from "../components/PinPad";

export default function PinSetupPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("biometric")}>
        ←
      </button>
      <div className="icon-badge">🔒</div>
      <h2>
        ตั้งรหัส PIN
        <br />
        <span className="muted small">สำหรับยืนยันการทำรายการสำคัญ</span>
      </h2>
      <PinPad onComplete={() => navigate("home")} />
    </section>
  );
}
