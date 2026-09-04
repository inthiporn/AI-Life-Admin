# AI Life Admin — Frontend (React + Vite)

The real app shell, wired to Firebase. All 24 screens from [`../prototype/`](../prototype) have been ported to React components (verified running via `npm run dev`), driven by a small in-app screen-state router rather than URL routing — see [`src/state/AppStateContext.jsx`](src/state/AppStateContext.jsx).

**What's real vs. still mocked:**
- The Services grid (`src/pages/ServicesPage.jsx`) reads the live `service_categories` collection from Firestore, and the Home bill list reads the live `bills` collection for a fixed `demo-user` (seeded by `backend/scripts/seedDemoBills.ts`) — both fall back to a static list if Firestore is unreachable. This is genuinely connected to the `ai-life-admin-8f715` project.
- The health-checkup "appointment" card on Home stays local-only — it's a reminder, not a payable bill, and the backend's `BillDoc.status` schema has no "appointment" value.
- Everything else (login, OTP, payment processing, account settings) still uses local mock state, same as the static prototype — `startPaymentFor`/`completePayment` update React state only, they don't write back to Firestore. Wiring these to `../backend`'s Cloud Functions (`src/services/api.js`, already scaffolded) and Firebase Authentication (`src/context/AuthContext.jsx`, `src/hooks/useAuth.js`, already scaffolded but unused by the ported pages) is the next milestone — that's also what would replace the placeholder `demo-user` with a real signed-in uid.

## Relationship to `../prototype/`

[`../prototype/`](../prototype) is a static HTML/CSS/JS clickable mockup — no framework, no backend calls. It's kept as-is for quick UX reviews without needing `npm install`. This `frontend/` app is the real implementation: the same 24 screens as actual React components, with `src/styles/app.css` ported near-verbatim from `../prototype/styles.css`.

## Structure

```
public/                    — static assets served as-is
src/
  state/AppStateContext.jsx — screen navigation + live service_categories/bills fetch (falls back to mock data)
  components/
    PhoneShell.jsx           — phone-frame chrome (status bar, note banner)
    BottomNav.jsx             — the 4-tab bottom nav (home/scan/services/account)
    PinPad.jsx                 — reusable PIN entry (setup + reauth-verify screens)
  pages/                     — one component per screen (24 total), e.g. HomePage.jsx, ServicesPage.jsx, PaymentConfirmPage.jsx
  context/AuthContext.jsx   — wraps useAuth, exposes the current user app-wide (scaffolded, not yet used by pages)
  hooks/useAuth.js           — Firebase Authentication state listener (scaffolded, not yet used by pages)
  services/
    firebaseClient.js         — Firebase SDK initialization (Auth, Firestore, Functions, Storage, Analytics)
    api.js                     — callable-function wrappers, one per backend controller (scaffolded, not yet used by pages)
  main.jsx                    — Vite/React entry point, imports styles/app.css
  App.jsx                      — screen-id → page-component map + AppStateProvider
```

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # fill in your Firebase Web App config
npm run dev
```
