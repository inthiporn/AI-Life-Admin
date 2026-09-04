import { useAppState } from "../state/AppStateContext";
import BottomNav from "../components/BottomNav";

export default function ScanPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("services")}>
        ←
      </button>
      <h2>สแกนเอกสาร</h2>
      <p className="muted center">วางเอกสารให้อยู่ในกรอบ</p>
      <div className="scan-frame">
        <div className="scan-doc-mock">
          <p className="doc-title">บัตรประจำตัวประชาชน</p>
          <p className="doc-sub">ประเทศไทย</p>
          <p className="doc-line">นายสมชาย ใจดี</p>
          <p className="doc-line">1 2345 67890 12</p>
        </div>
      </div>
      <p className="muted center small">รองรับไฟล์ JPG, PNG, PDF</p>
      <button className="btn-primary" onClick={() => navigate("scan-review")}>
        ถ่ายรูป / สแกน
      </button>
      <BottomNav active="scan" />
    </section>
  );
}
