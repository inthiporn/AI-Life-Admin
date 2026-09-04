import { useAppState } from "../state/AppStateContext";

const ITEMS = [
  { id: "home", icon: "🏠", label: "หน้าหลัก" },
  { id: "scan", icon: "📄", label: "เอกสาร" },
  { id: "services", icon: "🧾", label: "บริการ" },
  { id: "account", icon: "👤", label: "โปรไฟล์" },
];

export default function BottomNav({ active }) {
  const { navigate } = useAppState();
  return (
    <nav className="bottom-nav">
      {ITEMS.map((item) => (
        <button
          key={item.id}
          className={"nav-item" + (item.id === active ? " active" : "")}
          onClick={() => navigate(item.id)}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
