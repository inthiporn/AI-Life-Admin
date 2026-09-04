# AI Life Admin

AI ผู้ช่วยจัดการธุระส่วนตัว (บิล เอกสารราชการ การนัดหมาย) — สแกนเอกสาร ให้ AI ดึงข้อมูล และดำเนินการชำระเงินแทนผู้ใช้

Full design & architecture docs live in [`../docs`](../docs) — start with [`tech-spec.md`](../docs/tech-spec.md) and [`database-schema.md`](../docs/database-schema.md).

## Structure

```
AI_Life_Admin/
├── backend/                  # Node.js + TypeScript — Firebase Cloud Functions + Firestore
├── frontend/                 # React + Vite — the real app shell (early skeleton)
├── prototype/                 # Static HTML/CSS/JS — clickable UX mockup of every screen
├── firebase.json, .firebaserc # Firebase project config
├── firestore.rules            # Firestore Security Rules
├── firestore.indexes.json     # Firestore composite indexes
└── package.json               # npm workspaces (backend + frontend)
```

## Why Firebase instead of a classic Express + SQL/Mongo backend

The project runs on Firebase (Cloud Functions, Cloud Firestore, Firebase Authentication, Storage, Cloud Messaging) rather than a self-hosted Express server with its own database — see [`docs/tech-spec.md`](../docs/tech-spec.md) §1 for the reasoning. `backend/` is still organized in the familiar controllers → services → models shape, just running on Cloud Functions instead of Express routes; see [`backend/README.md`](backend/README.md) for exactly how that maps.

## Getting started

Requires Node.js 20 LTS and the Firebase CLI (`npm install -g firebase-tools`).

```bash
npm install          # installs both workspaces (backend, frontend)
npm run backend:serve   # Firebase emulators (Auth, Firestore, Storage, Functions)
npm run frontend:dev    # Vite dev server
```

See [`backend/README.md`](backend/README.md) and [`frontend/README.md`](frontend/README.md) for details, including required `.env` values.

## Status

- **Docs** — tech spec, Firestore schema: done, see [`../docs`](../docs)
- **Prototype** — clickable UX mockup of every screen: done, see [`prototype/`](prototype)
- **Backend** — Cloud Functions for auth, document scan, payments, account deletion, overdue-bill job: implemented, not yet compiled/tested (no Node.js on the machine that scaffolded it) or connected to a real Payment Gateway / AI-OCR provider
- **Frontend** — React/Vite app shell: skeleton only; porting the `prototype/` screens into real React pages has not started
