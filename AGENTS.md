# Agent notes

## UI work
All UI/visual changes follow `docs/ui-redesign-brief.md`. Read it before touching
any component, page, or stylesheet. `docs/ui-mockups.html` is the visual reference
for the same spec (open in a browser; not needed to implement).

Rules that override defaults:
- Design tokens are CSS custom properties defined in <wherever you put them>.
  Never hard-code a hex, font stack, radius, or shadow in a component.
- There is no EN/MR language toggle. Marathi leads, English supports. See brief §4.
- Retired crimson from the original build must not appear in code. Use `--color-accent-700`.

## Stack
Next.js App Router, TypeScript, Tailwind, Neon Postgres. Do not change the data
model or database migrations during UI work unless the user asks for it.
