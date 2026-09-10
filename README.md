# Palladium Plus Society Ganeshotsav 2026

Mobile-first bilingual PWA for Palladium Plus Society Ganeshotsav 2026 / पॅलेडियम प्लस सोसायटी गणेशोत्सव २०२६.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Neon Postgres for production data on Vercel
- Vitest for domain tests
- Local seed-backed repository adapter so the app runs without real credentials

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Required production setup

1. Add the Neon integration from the Vercel Marketplace or create a Neon project directly.
2. Set `DATABASE_URL` in Vercel and locally.
3. Run migrations in `neon/migrations` against the Neon database.
4. Keep resident access public: anyone with the link can view details and book aarti slots.
5. Configure one admin account with environment variables:
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
6. Add production environment variables:
   - `NEXT_PUBLIC_SITE_URL`
   - `DATABASE_URL`
   - `BOOKING_MOBILE_HASH_SECRET`
7. Connect an OTP/SMS provider only if mobile verification is reintroduced later.
8. Deploy to Vercel or another Next.js host with the same environment variables.

Never commit `.env`, `.env.local`, service-role keys, OTP credentials, or production resident data.

## Quality checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Notes

- All festival and “today” calculations use `Asia/Kolkata`.
- Aarti slot generation follows the confirmed PRD schedule: no slots on 14 September, morning/evening from 15-24 September, and morning only on 25 September.
- Resident pages and aarti booking are public to anyone with the link.
- `/admin` is protected by a single environment-configured admin account.
- Public pages never expose booking mobile numbers, notes, or general booking lists.
- Database-side `submit_aarti_booking` in `neon/migrations` enforces idempotency and one confirmed booking per aarti slot.
