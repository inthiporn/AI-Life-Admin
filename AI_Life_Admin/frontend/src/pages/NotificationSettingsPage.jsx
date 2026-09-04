import { useState } from "react";
import { useAppState } from "../state/AppStateContext";

const ROWS = [
  { key: "billReminder", label: "แจ้งเตือนบิลใกล้ครบกำหนด" },
  { key: "paymentSuccess", label: "แจ้งเตือนการชำระเงินสำเร็จ" },
  { key: "securityAlert", label: "แจ้งเตือนความปลอดภัยบัญชี" },
  { key: "promotions", label: "ข่าวสารและโปรโมชั่น" },
];

export default function NotificationSettingsPage() {
  const { navigate } = useAppState();
  const [prefs, setPrefs] = useState({
    billReminder: true,
    paymentSuccess: true,
    securityAlert: true,
    promotions: false,
  });

  function toggle(key) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("account")}>
        ←
      </button>
      <h2>ตั้งค่าการแจ้งเตือน</h2>
      <div className="menu-list">
        {ROWS.map((r) => (
          <div className="menu-row toggle-row" key={r.key}>
            <span>{r.label}</span>
            <label className="switch">
              <input type="checkbox" checked={prefs[r.key]} onChange={() => toggle(r.key)} />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
}
