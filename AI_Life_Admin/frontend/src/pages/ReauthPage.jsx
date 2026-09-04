import { useAppState } from "../state/AppStateContext";

export default function ReauthPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <div className="icon-badge">🔐</div>
      <h2>ยืนยันตัวตนอีกครั้ง</h2>
      <p className="muted center">เพื่อความปลอดภัย กรุณายืนยันตัวตนก่อนทำรายการ</p>
      <div className="reauth-options">
        <button className="reauth-btn" onClick={() => navigate("processing")}>
          <span>😊</span>Face ID
        </button>
        <button className="reauth-btn" onClick={() => navigate("pin-verify-reauth")}>
          <span>🔢</span>รหัส PIN
        </button>
      </div>
      <button className="btn-primary" onClick={() => navigate("processing")}>
        ใช้ Face ID
      </button>
      <button className="btn-text" onClick={() => navigate("pin-verify-reauth")}>
        กรอกรหัส PIN
      </button>
    </section>
  );
}
