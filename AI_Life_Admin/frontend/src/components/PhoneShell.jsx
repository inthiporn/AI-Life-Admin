export default function PhoneShell({ children }) {
  return (
    <>
      <div className="phone">
        <div className="statusbar">
          <span>9:41</span>
          <span className="statusbar-icons">●●● ▲ 🔋</span>
        </div>
        <div className="screens">{children}</div>
      </div>
      <div className="prototype-note">
        <strong>AI Life Admin</strong>
        <br />
        UI ported from ../../prototype/ — service list reads live Firestore data, everything else is still mocked (see docs/tech-spec.md)
      </div>
    </>
  );
}
