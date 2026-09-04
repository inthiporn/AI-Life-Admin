import { useEffect, useState } from "react";
import { useAppState } from "../state/AppStateContext";

export default function ProcessingPage() {
  const { navigate, completePayment } = useAppState();
  const [step3Done, setStep3Done] = useState(false);
  const [step4Done, setStep4Done] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep3Done(true), 500);
    const t2 = setTimeout(() => setStep4Done(true), 1000);
    const t3 = setTimeout(() => {
      completePayment();
      navigate("success");
    }, 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // Runs once when this screen mounts, matching runProcessing() in ../../prototype/app.js
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="screen">
      <div className="spinner"></div>
      <h2>AI กำลังดำเนินการ</h2>
      <div className="checklist plain">
        <p>✅ ตรวจสอบข้อมูล</p>
        <p>✅ ดำเนินการชำระเงิน</p>
        <p>{step3Done ? "✅" : "⏳"} รอผลการยืนยัน</p>
        <p>{step4Done ? "✅" : "⏳"} บันทึกรายการ</p>
      </div>
    </section>
  );
}
