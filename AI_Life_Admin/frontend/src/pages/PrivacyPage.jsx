import { useAppState } from "../state/AppStateContext";

export default function PrivacyPage() {
  const { navigate } = useAppState();
  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("account")}>
        ←
      </button>
      <h2>ข้อมูลและความเป็นส่วนตัว</h2>
      <div className="menu-list">
        <button className="menu-row">
          <span>แก้ไขข้อมูลผู้ใช้งาน</span>
          <span>›</span>
        </button>
        <button className="menu-row">
          <span>แก้ไขความยินยอม (Consent)</span>
          <span>›</span>
        </button>
        <button className="menu-row">
          <span>ดาวน์โหลดข้อมูลของฉัน</span>
          <span>›</span>
        </button>
        <button className="menu-row danger">
          <span>ลบบัญชีผู้ใช้งาน</span>
          <span>›</span>
        </button>
      </div>
    </section>
  );
}
