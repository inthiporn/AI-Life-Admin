import { useAppState } from "../state/AppStateContext";
import PinPad from "../components/PinPad";

export default function PinVerifyReauthPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("reauth")}>
        ←
      </button>
      <div className="icon-badge">🔒</div>
      <h2>กรอกรหัส PIN</h2>
      <PinPad onComplete={() => navigate("processing")} />
    </section>
  );
}
