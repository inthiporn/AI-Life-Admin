import { useState } from "react";
import { useAppState } from "../state/AppStateContext";

export default function LoginPage() {
  const { navigate } = useAppState();
  const [identifier, setIdentifier] = useState("pecky@gmail.com");
  const [password, setPassword] = useState("password");
  const [remember, setRemember] = useState(true);

  function handleLogin() {
    if (!identifier.trim() || !password.trim()) {
      alert("กรุณากรอกอีเมล/เบอร์โทรศัพท์และรหัสผ่าน");
      return;
    }
    navigate("otp");
  }

  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("terms")}>
        ←
      </button>
      <div className="icon-badge">🛡️</div>
      <h2>
        เข้าสู่ระบบ
        <br />
        <span className="muted small">AI Life Admin</span>
      </h2>
      <div className="field">
        <label>อีเมล หรือ เบอร์โทรศัพท์</label>
        <input type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="pecky@gmail.com" />
      </div>
      <div className="field">
        <label>รหัสผ่าน</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      <label className="check-row small-check">
        <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        <span>จดจำฉันไว้</span>
      </label>
      <button className="btn-primary" onClick={handleLogin}>
        เข้าสู่ระบบ
      </button>
      <p className="link-row muted">
        ลืมรหัสผ่าน?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate("forgot-password");
          }}
        >
          สมัครสมาชิก
        </a>
      </p>
    </section>
  );
}
