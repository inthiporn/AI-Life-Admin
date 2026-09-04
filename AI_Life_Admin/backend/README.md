# AI Life Admin — Backend (Node.js + TypeScript)

Implements the API surface described in [`docs/tech-spec.md`](../../docs/tech-spec.md) §3.2, against the Firestore schema in [`docs/database-schema.md`](../../docs/database-schema.md).

> **Node.js is not installed on the machine this was scaffolded on**, so these files have not been compiled or run yet. Install Node 20 LTS, then follow the steps below.

## Why this isn't a plain Express app

This project runs on **Firebase**: Cloud Functions instead of an Express server, Cloud Firestore instead of Mongoose/Sequelize models. There is intentionally no `app.js`/`server.js` — Firebase manages the runtime, and functions are invoked by name from the client SDK (`httpsCallable`) rather than by HTTP route. `src/routes/index.ts` plays the role a REST router normally would: it's the single place mapping a public function name to its controller.

## Structure

```
src/
  index.ts                — entry point Firebase deploys (re-exports src/routes)
  routes/index.ts          — maps each callable/scheduled function name to its controller
  controllers/              — thin handlers: parse the request, call a service, shape the response
    authController.ts        (setPin, setupBiometric, reauthenticate)
    documentController.ts    (scanDocument)
    paymentController.ts     (processPayment)
    accountController.ts     (deleteAccount)
  services/                 — business logic and third-party integrations
    authService.ts            PIN hashing, biometric flag, reauth token issuance/verification
    documentService.ts        orchestrates OCR extraction + Firestore write
    paymentService.ts         claim → charge → settle bill payment flow
    accountService.ts         cascading account deletion
    paymentGatewayService.ts  Payment Gateway client (placeholder — wire up a real provider)
    ocrService.ts             AI/OCR client (placeholder — wire up a real provider)
  middleware/guards.ts       — requireAuth / requireField request guards
  models/firestoreSchemas.ts — TypeScript interfaces mirroring every Firestore document
  utils/generateReference.ts — small pure helpers (e.g. transaction reference ids)
  jobs/onBillOverdue.ts      — daily Cloud Scheduler job
scripts/                    — one-off Admin SDK scripts (e.g. seeding), run manually — not deployed
tests/                      — Jest unit tests (currently covers utils/generateReference.ts)
.env.example                — local emulator config template (production secrets use `firebase functions:secrets:set`)
```

## Setup

```bash
npm install -g firebase-tools   # if you don't have the Firebase CLI yet
firebase login
cd backend
npm install
cp .env.example .env            # fill in local values for the emulator, if needed
```

[`.firebaserc`](../.firebaserc) is already set to the `ai-life-admin-8f715` project.

## Seed data

```bash
npm run seed:service-categories
```

Writes the 5 `service_categories` documents (electricity, water, tax, social, health_checkup) via the Admin SDK — this bypasses `firestore.rules`, which intentionally blocks clients from writing this collection. Requires Google Cloud credentials for whichever project you're targeting:

```bash
gcloud auth application-default login   # writes to the real ai-life-admin-8f715 project
# — or, to seed the local emulator instead —
firebase emulators:start                # in another terminal
export FIRESTORE_EMULATOR_HOST=localhost:8080
```

## Local development

```bash
npm run build:watch      # in one terminal — recompiles TS on save
firebase emulators:start # from the repo root (AI_Life_Admin/) — Auth, Firestore, Storage, Functions
```

## Tests

```bash
npm test
```

## Deploy

```bash
npm run build
firebase deploy --only functions,firestore:rules,firestore:indexes
```

## Known placeholders to fill in before production

- `services/paymentGatewayService.ts` — currently always "succeeds"; replace with a real Payment Gateway (PromptPay/credit card) integration.
- `services/ocrService.ts` — currently returns empty fields; replace with a real AI/OCR Vision API call.
- `.firebaserc` — replace the placeholder project ID.
- Environment secrets (Payment Gateway keys, OCR provider keys) should be set via `firebase functions:secrets:set`, never committed to the repo.
