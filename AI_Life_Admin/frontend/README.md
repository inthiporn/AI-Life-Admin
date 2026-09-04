# AI Life Admin — Frontend (React + Vite)

The real app shell, wired to the Firebase backend in [`../backend`](../backend). Currently just a skeleton — a minimal `HomePage` that resolves the signed-in user via Firebase Authentication.

> **Node.js is not installed on the machine this was scaffolded on**, so this has not been run or built yet.

## Relationship to `../prototype/`

[`../prototype/`](../prototype) is a static HTML/CSS/JS clickable mockup of every screen (onboarding, auth, home, services, document scan, payment, account/security settings) — no framework, no backend calls, just mock state. It's useful for reviewing the UX end-to-end.

This `frontend/` app is the real implementation target: React components that call the actual Cloud Functions in `../backend/src/routes` via `src/services/api.js`, and read/write Firestore directly per the access rules in [`../firestore.rules`](../firestore.rules). Porting each screen from `prototype/` into a React page under `src/pages/` is the next milestone — none of that porting has happened yet.

## Structure

```
public/                — static assets served as-is
src/
  assets/               — images, fonts (currently empty)
  components/           — reusable UI components (currently empty)
  context/AuthContext.jsx — wraps useAuth, exposes the current user app-wide
  hooks/useAuth.js       — Firebase Authentication state listener
  pages/HomePage.jsx     — placeholder landing page
  services/
    firebaseClient.js     — Firebase SDK initialization (Auth, Firestore, Functions, Storage)
    api.js                 — callable-function wrappers, one per backend controller
  main.jsx                — Vite/React entry point
  App.jsx                  — root component
```

## Setup

```bash
cd frontend
npm install
cp .env.example .env   # fill in your Firebase Web App config
npm run dev
```
