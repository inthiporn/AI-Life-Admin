import { useState } from "react";
import { useAppState } from "../state/AppStateContext";

export default function SecuritySettingsPage() {
  const { navigate } = useAppState();
  const [biometric, setBiometric] = useState(true);
  const [newDeviceAlert, setNewDeviceAlert] = useState(true);

  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("account")}>
        ←
      </button>
      <h2>ตั้งค่าความปลอดภัย</h2>
      <div className="menu-list">
        <button className="menu-row" onClick={() => navigate("forgot-password")}>
          <span>🔑 เปลี่ยนรหัสผ่าน</span>
          <span>›</span>
        </button>
        <div className="menu-row toggle-row">
          <span>👆 Face ID / Touch ID</span>
          <label className="switch">
            <input type="checkbox" checked={biometric} onChange={(e) => setBiometric(e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>
        <button className="menu-row" onClick={() => navigate("pin-setup")}>
          <span>🔒 เปลี่ยนรหัส PIN</span>
          <span>›</span>
        </button>
        <div className="menu-row toggle-row">
          <span>🔔 แจ้งเตือนเมื่อมีการเข้าสู่ระบบใหม่</span>
          <label className="switch">
            <input type="checkbox" checked={newDeviceAlert} onChange={(e) => setNewDeviceAlert(e.target.checked)} />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </section>
  );
}
