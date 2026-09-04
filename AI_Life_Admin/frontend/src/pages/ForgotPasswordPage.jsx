import { useState } from "react";
import { useAppState } from "../state/AppStateContext";

export default function ForgotPasswordPage() {
  const { navigate } = useAppState();
  const [identifier, setIdentifier] = useState("");

  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("login")}>
        ←
      </button>
      <div className="icon-badge">🔑</div>
      <h2>ลืมรหัสผ่าน?</h2>
      <p className="muted center">
        กรุณาใส่อีเมลหรือเบอร์โทรศัพท์
        <br />
        เพื่อรับรหัสยืนยัน
      </p>
      <div className="field">
        <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="อีเมล หรือ เบอร์โทรศัพท์" />
      </div>
      <button className="btn-primary" onClick={() => navigate("otp")}>
        ส่งรหัสยืนยัน
      </button>
    </section>
  );
}
