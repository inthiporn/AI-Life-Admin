# AI Life Admin — Cloud Functions (Node.js + TypeScript)

Implements the Callable Cloud Functions described in [`docs/tech-spec.md`](../docs/tech-spec.md) §3.2, against the Firestore schema in [`docs/database-schema.md`](../docs/database-schema.md).

> **Node.js is not installed on this machine**, so these files were hand-written and have not been compiled or run yet. Install Node 20 LTS, then follow the steps below.

## Setup

```bash
npm install -g firebase-tools   # if you don't have the Firebase CLI yet
firebase login
cd functions
npm install
```

Update [`.firebaserc`](../.firebaserc) with your real Firebase project ID (`ai-life-admin-dev` is a placeholder).

## Local development

```bash
npm run build:watch      # in one terminal — recompiles TS on save
firebase emulators:start # from the repo root — Auth, Firestore, Storage, Functions
```

## Deploy

```bash
npm run build
firebase deploy --only functions,firestore:rules,firestore:indexes
```

## Structure

```
src/
  index.ts              — exports every deployed function
  lib/
    admin.ts             — firebase-admin initialization (Firestore, Auth)
    assert.ts             — requireAuth / requireField guard helpers
    paymentGateway.ts     — Payment Gateway client (placeholder — wire up a real provider)
    ocrProvider.ts         — AI/OCR client (placeholder — wire up a real provider)
  types/models.ts          — TypeScript interfaces mirroring the Firestore documents
  auth/                    — setPin, setupBiometric, reauthenticate (+ reauth token verification)
  documents/scanDocument.ts
  payments/processPayment.ts
  account/deleteAccount.ts
  scheduled/onBillOverdue.ts — daily Cloud Scheduler job
```

## Known placeholders to fill in before production

- `lib/paymentGateway.ts` — currently always "succeeds"; replace with a real Payment Gateway (PromptPay/credit card) integration.
- `lib/ocrProvider.ts` — currently returns empty fields; replace with a real AI/OCR Vision API call.
- `.firebaserc` — replace the placeholder project ID.
- Environment secrets (Payment Gateway keys, OCR provider keys) should be set via `firebase functions:secrets:set`, never committed to the repo.
