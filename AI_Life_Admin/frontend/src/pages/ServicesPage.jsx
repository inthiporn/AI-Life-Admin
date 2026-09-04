import { useAppState } from "../state/AppStateContext";
import BottomNav from "../components/BottomNav";

export default function ServicesPage() {
  const { categories, startPaymentFor, navigate } = useAppState();

  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("home")}>
        ←
      </button>
      <h2>เลือกบริการ</h2>
      <input type="text" className="search-box" placeholder="🔍 ค้นหาบริการ เช่น ไฟฟ้า, ประกัน..." />
      <div className="service-grid">
        {categories.map((c) => (
          <button key={c.id} className="service-card" onClick={() => startPaymentFor(c.id)}>
            {c.icon}
            <span>{c.name}</span>
          </button>
        ))}
        <button className="service-card" onClick={() => navigate("scan")}>
          📷<span>สแกนเอกสาร</span>
        </button>
      </div>
      <BottomNav active="services" />
    </section>
  );
}
