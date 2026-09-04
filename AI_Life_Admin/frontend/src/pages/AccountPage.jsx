import { useAppState } from "../state/AppStateContext";
import BottomNav from "../components/BottomNav";

const MENU_ITEMS = [
  { id: "security-settings", icon: "🛡️", label: "ตั้งค่าความปลอดภัย" },
  { id: "sessions", icon: "💻", label: "อุปกรณ์ที่เข้าสู่ระบบ" },
  { id: "notification-settings", icon: "🔔", label: "การแจ้งเตือน" },
  { id: "privacy", icon: "📄", label: "ข้อมูลและความเป็นส่วนตัว" },
  { id: "help", icon: "❓", label: "ช่วยเหลือ" },
];

export default function AccountPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <h2>โปรไฟล์ของฉัน</h2>
      <div className="account-header">
        <div className="avatar">🧑</div>
        <div>
          <p className="bold">คุณเปิ้ล</p>
          <p className="muted small">pecky@gmail.com</p>
        </div>
      </div>
      <div className="menu-list">
        {MENU_ITEMS.map((item) => (
          <button key={item.id} className="menu-row" onClick={() => navigate(item.id)}>
            <span>
              {item.icon} {item.label}
            </span>
            <span>›</span>
          </button>
        ))}
        <button className="menu-row danger" onClick={() => navigate("login")}>
          <span>🚪 ออกจากระบบ</span>
          <span>›</span>
        </button>
      </div>
      <BottomNav active="account" />
    </section>
  );
}
