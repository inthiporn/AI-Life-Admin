import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}
