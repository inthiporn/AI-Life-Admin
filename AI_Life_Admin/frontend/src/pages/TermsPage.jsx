import { useState } from "react";
import { useAppState } from "../state/AppStateContext";

export default function TermsPage() {
  const { navigate } = useAppState();
  const [terms, setTerms] = useState(true);
  const [pdpa, setPdpa] = useState(true);
  const [promo, setPromo] = useState(false);

  function handleAccept() {
    if (!terms || !pdpa) {
      alert("กรุณายอมรับเงื่อนไขการใช้บริการและ PDPA ก่อนดำเนินการต่อ");
      return;
    }
    navigate("login");
  }

  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("language")}>
        ←
      </button>
      <h2>
        ข้อกำหนดและเงื่อนไข
        <br />
        <span className="muted small">Terms &amp; Conditions</span>
      </h2>
      <div className="checklist">
        <label className="check-row">
          <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
          <span>ฉันยอมรับเงื่อนไขการใช้บริการ</span>
        </label>
        <label className="check-row">
          <input type="checkbox" checked={pdpa} onChange={(e) => setPdpa(e.target.checked)} />
          <span>ฉันยินยอมให้เก็บและใช้ข้อมูลส่วนบุคคลตาม PDPA</span>
        </label>
        <label className="check-row">
          <input type="checkbox" checked={promo} onChange={(e) => setPromo(e.target.checked)} />
          <span>รับข่าวสารและโปรโมชั่น (ไม่บังคับ)</span>
        </label>
      </div>
      <button className="btn-primary" onClick={handleAccept}>
        ยอมรับ
      </button>
    </section>
  );
}
