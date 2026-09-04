import { useState } from "react";
import { useAppState } from "../state/AppStateContext";

const OPTIONS = [
  { value: "th", label: "🇹🇭 ไทย" },
  { value: "en", label: "🇬🇧 English" },
  { value: "jp", label: "🇯🇵 日本語 Japanese" },
];

export default function LanguagePage() {
  const { navigate } = useAppState();
  const [lang, setLang] = useState("th");

  return (
    <section className="screen">
      <button className="btn-back" onClick={() => navigate("welcome")}>
        ←
      </button>
      <h2>
        เลือกภาษา
        <br />
        <span className="muted small">Choose Language</span>
      </h2>
      <div className="option-list">
        {OPTIONS.map((o) => (
          <label className="option-row" key={o.value}>
            <input type="radio" name="lang" checked={lang === o.value} onChange={() => setLang(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      <button className="btn-primary" onClick={() => navigate("terms")}>
        ถัดไป
      </button>
    </section>
  );
}
