import { useAppState } from "../state/AppStateContext";

export default function BiometricPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("otp")}>
        ←
      </button>
      <div className="icon-badge">👆</div>
      <h2>
        ตั้งค่าการเข้าสู่ระบบ
        <br />
        <span className="muted small">ด้วย Biometrics</span>
      </h2>
      <p className="muted center">
        เพื่อความปลอดภัยและความสะดวก
        <br />
        คุณสามารถเข้าสู่ระบบด้วย Face ID / Touch ID
        <br />
        ในการเข้าสู่ระบบครั้งถัดไป
      </p>
      <button className="btn-primary" onClick={() => navigate("pin-setup")}>
        เปิดใช้งาน
      </button>
      <button className="btn-text" onClick={() => navigate("pin-setup")}>
        ข้ามไปก่อน
      </button>
    </section>
  );
}
