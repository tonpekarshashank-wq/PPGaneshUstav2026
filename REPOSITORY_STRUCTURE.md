# Repository Structure

Last reviewed: 2026-09-10

## Current layout

```text
.
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── data/
│   ├── lib/
│   └── server/
├── supabase/
│   └── migrations/
├── neon/
│   └── migrations/
├── tests/
├── README.md
├── REPOSITORY_STRUCTURE.md
└── ganapati_utsav_2026_prd.md
```

## Notes

- This repository now contains a Next.js, TypeScript, Tailwind CSS PWA scaffold with seed-backed local data and Supabase production migrations.
- `README.md` contains local setup, production setup, quality checks, and credential handling notes.
- `ganapati_utsav_2026_prd.md` is the primary project artifact: a 516-line build-ready MVP PRD for the Palladium Plus Society Ganeshotsav 2026 application.
- `src/app` contains resident routes, event details, Aarti Seva, winners, and admin dashboard pages.
- `src/components` contains reusable UI such as event cards, language toggle, schedule browser, aarti client flow, and participation cards.
- `src/data` contains local seed content transcribed from the PRD and a repository adapter.
- `src/lib` contains domain types, IST date helpers, i18n, booking validation/idempotency logic, analytics privacy scrubbing, and CSV export.
- `src/server` contains server-only Supabase and verification abstractions.
- `neon/migrations` contains the current production Postgres schema, transactional aarti booking function, and seed data for Neon.
- `supabase/migrations` is retained as earlier reference material and should not be used for the current Vercel/Neon path.
- `tests` contains Vitest coverage for date handling, aarti schedule/booking rules, CSV privacy, and analytics privacy.
- Git status at review time showed `ganapati_utsav_2026_prd.md` as untracked.

## Expected future structure

Future additions should stay within the current boundaries: app routes in `src/app`, reusable UI in `src/components`, domain logic in `src/lib`, server-only integrations in `src/server`, and database changes in `supabase/migrations`.
