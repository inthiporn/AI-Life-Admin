import { AppStateProvider, useAppState } from "./state/AppStateContext";
import PhoneShell from "./components/PhoneShell";

import SplashPage from "./pages/SplashPage";
import WelcomePage from "./pages/WelcomePage";
import LanguagePage from "./pages/LanguagePage";
import TermsPage from "./pages/TermsPage";
import LoginPage from "./pages/LoginPage";
import OtpPage from "./pages/OtpPage";
import BiometricPage from "./pages/BiometricPage";
import PinSetupPage from "./pages/PinSetupPage";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ScanPage from "./pages/ScanPage";
import ScanReviewPage from "./pages/ScanReviewPage";
import PaymentConfirmPage from "./pages/PaymentConfirmPage";
import ReauthPage from "./pages/ReauthPage";
import ProcessingPage from "./pages/ProcessingPage";
import SuccessPage from "./pages/SuccessPage";
import AccountPage from "./pages/AccountPage";
import SecuritySettingsPage from "./pages/SecuritySettingsPage";
import SessionsPage from "./pages/SessionsPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import PrivacyPage from "./pages/PrivacyPage";
import HelpPage from "./pages/HelpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PinVerifyReauthPage from "./pages/PinVerifyReauthPage";

// Maps each screen id (see ../../prototype/app.js's navigate()) to its page component.
const SCREENS = {
  splash: SplashPage,
  welcome: WelcomePage,
  language: LanguagePage,
  terms: TermsPage,
  login: LoginPage,
  otp: OtpPage,
  biometric: BiometricPage,
  "pin-setup": PinSetupPage,
  home: HomePage,
  services: ServicesPage,
  scan: ScanPage,
  "scan-review": ScanReviewPage,
  "payment-confirm": PaymentConfirmPage,
  reauth: ReauthPage,
  processing: ProcessingPage,
  success: SuccessPage,
  account: AccountPage,
  "security-settings": SecuritySettingsPage,
  sessions: SessionsPage,
  "notification-settings": NotificationSettingsPage,
  privacy: PrivacyPage,
  help: HelpPage,
  "forgot-password": ForgotPasswordPage,
  "pin-verify-reauth": PinVerifyReauthPage,
};

function ScreenRouter() {
  const { screen } = useAppState();
  const Page = SCREENS[screen] || SplashPage;
  return <Page />;
}

export default function App() {
  return (
    <AppStateProvider>
      <PhoneShell>
        <ScreenRouter />
      </PhoneShell>
    </AppStateProvider>
  );
}
