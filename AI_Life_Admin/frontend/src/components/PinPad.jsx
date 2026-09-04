import { useState } from "react";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** 6-digit PIN entry (dots + keypad), reused by setup and reauth-verify screens. */
export default function PinPad({ onComplete }) {
  const [buffer, setBuffer] = useState("");

  function handleKey(key) {
    const next = key === "back" ? buffer.slice(0, -1) : buffer.length < 6 ? buffer + key : buffer;
    setBuffer(next);
    if (next.length === 6) {
      setTimeout(() => {
        setBuffer("");
        onComplete();
      }, 250);
    }
  }

  return (
    <>
      <div className="pin-dots">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className={"pin-dot" + (i < buffer.length ? " filled" : "")} />
        ))}
      </div>
      <div className="keypad">
        {KEYS.map((k) => (
          <button key={k} onClick={() => handleKey(k)}>
            {k}
          </button>
        ))}
        <button className="ghost" tabIndex={-1} />
        <button onClick={() => handleKey("0")}>0</button>
        <button onClick={() => handleKey("back")}>⌫</button>
      </div>
    </>
  );
}
