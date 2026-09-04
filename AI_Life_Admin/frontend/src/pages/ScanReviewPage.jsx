import { useAppState } from "../state/AppStateContext";

export default function ScanReviewPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("scan")}>
        ←
      </button>
      <div className="ai-badge">
        ✅ AI ดึงข้อมูลจากเอกสารสำเร็จ
        <br />
        <span className="muted small">โปรดตรวจสอบความถูกต้อง</span>
      </div>
      <h3>ข้อมูลจากบัตรประชาชน</h3>
      <div className="field">
        <label>ชื่อ-นามสกุล</label>
        <input type="text" defaultValue="นายสมชาย ใจดี" />
      </div>
      <div className="field">
        <label>เลขประจำตัวประชาชน</label>
        <input type="text" defaultValue="1 2345 67890 12" />
      </div>
      <div className="field">
        <label>วันที่ออกบัตร</label>
        <input type="text" defaultValue="10 ม.ค. 2538" />
      </div>
      <div className="field">
        <label>วันหมดอายุ</label>
        <input type="text" defaultValue="10 ม.ค. 2569" />
      </div>
      <button className="btn-secondary" onClick={() => navigate("scan")}>
        แก้ไขข้อมูล
      </button>
      <button className="btn-primary" onClick={() => navigate("services")}>
        ยืนยันข้อมูล
      </button>
    </section>
  );
}
