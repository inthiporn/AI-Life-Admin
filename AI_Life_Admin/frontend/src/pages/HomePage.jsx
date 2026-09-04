import { useAuthContext } from "../context/AuthContext";

/**
 * Placeholder landing page. The full set of screens (onboarding, home,
 * services, document scan, payment) is designed in ../../prototype/ as a
 * static HTML/JS clickable mockup — porting each screen into a React page
 * here is the next step.
 */
export default function HomePage() {
  const { user, isLoading } = useAuthContext();

  if (isLoading) return <p>กำลังโหลด...</p>;

  return (
    <main style={{ fontFamily: "sans-serif", padding: 24 }}>
      <h1>AI Life Admin</h1>
      <p>{user ? `สวัสดีค่ะ ${user.email ?? user.phoneNumber}` : "กรุณาเข้าสู่ระบบ"}</p>
    </main>
  );
}
