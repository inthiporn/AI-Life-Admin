import { useEffect, useRef, useState } from "react";
import { useAppState } from "../state/AppStateContext";

export default function OtpPage() {
  const { navigate } = useAppState();
  const [digits, setDigits] = useState(["4", "8", "2", "9", "1", "3"]);
  const [seconds, setSeconds] = useState(42);
  const inputsRef = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);

  function handleResend(e) {
    e.preventDefault();
    setSeconds(42);
  }

  function handleChange(index, value) {
    const digit = value.slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && inputsRef.current[index + 1]) inputsRef.current[index + 1].focus();
  }

  function handleVerify() {
    if (digits.some((d) => !d)) {
      alert("กรุณากรอกรหัส OTP ให้ครบ 6 หลัก");
      return;
    }
    navigate("biometric");
  }

  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("login")}>
        ←
      </button>
      <div className="icon-badge">📱</div>
      <h2>
        ยืนยันตัวตน
        <br />
        <span className="muted small">OTP</span>
      </h2>
      <p className="muted center">
        เราได้ส่งรหัส OTP ไปยัง
        <br />
        เบอร์ 089-xxx-1234
      </p>
      <div className="otp-boxes">
        {digits.map((d, i) => (
          <input
            key={i}
            maxLength={1}
            className="otp-box"
            value={d}
            ref={(el) => (inputsRef.current[i] = el)}
            onChange={(e) => handleChange(i, e.target.value)}
          />
        ))}
      </div>
      <p className="muted center">
        รหัสใช้ได้อีก <span>{"00:" + String(seconds).padStart(2, "0")}</span>
      </p>
      <p className="muted center small">
        ไม่ได้รับรหัส?{" "}
        <a href="#" onClick={handleResend}>
          ส่งใหม่
        </a>
      </p>
      <button className="btn-primary" onClick={handleVerify}>
        ยืนยันรหัส OTP
      </button>
    </section>
  );
}
