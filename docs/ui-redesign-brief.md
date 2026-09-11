# UI redesign brief — Palladium Plus Society Ganeshotsav 2026

Target app: `pp-ganesh-ustav2026` (Next.js App Router, Tailwind assumed, mobile-first bilingual PWA).
Scope: visual system + layout for Home, Schedule, Event detail, Aarti, Winners, Admin, and the shared shell.
Behaviour, data model, Supabase functions and RLS are **out of scope** — do not change them.

Companion visual reference: `Ganeshotsav UI Mockups.dc.html` in this project (foundations card `1a`, then one mock per page).

---

## 1. What is wrong today

1. **No hierarchy.** Every page is a stack of same-weight cards. Nothing tells the eye where to start.
2. **Bilingual strings are joined with slashes** (`Book Aarti Seva / आरती सेवेसाठी नाव नोंदवा`). Labels double in length, wrap onto 2–3 lines, and force both languages on a reader who needs one. The EN/MR switch exists but changes almost nothing.
3. **Generic default styling.** System sans, crimson `#9f1239`, small radii, hairline borders — nothing says festival, nothing says this society.
4. **Uniform density.** 14–16px type everywhere, equal gaps everywhere; no rhythm between sections.
5. **Undesigned empty states.** Winners is seven identical "Results will be announced soon" cards.
6. **Dropdown-driven filtering** on Schedule and Aarti, where a horizontal date rail is faster on a phone.
7. **Duplicate nav** — the same four links appear in the header and again in the footer; `/admin` is exposed in the public nav.

---

## 2. Design tokens

Add these as CSS custom properties on `:root` (or Tailwind theme extensions) and use them everywhere. No raw hexes in components.

```css
:root {
  /* ground & surfaces */
  --color-bg:        #f5ead8; /* cream page */
  --color-surface:   #ebddc5; /* sand — secondary cards, table headers */
  --color-card:      #ffffff; /* elevated card */
  --color-ink:       #201e1d; /* primary text */
  --color-ink-muted: #5c534d; /* body secondary */
  --color-ink-soft:  #8a7f75; /* labels, meta */

  /* accents */
  --color-accent:      #c67139; /* terracotta — primary actions, active state */
  --color-accent-700:  #7c3f1d; /* dark terracotta — hero ground, link text */
  --color-accent-100:  #f0d9c1; /* terracotta tint — tags */
  --color-accent2:     #7a8a5e; /* sage — "open" / confirmed / second voice */
  --color-accent2-100: #dfe4d2; /* sage tint — tags */
  --color-neutral-300: #c9bda8; /* "booked" / disabled fill */

  /* radii */
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-pill: 999px;

  /* elevation */
  --shadow-sm: 0 2px 8px rgba(60,35,15,.07);
  --shadow-md: 0 3px 14px rgba(60,35,15,.10);
  --shadow-lg: 0 8px 28px rgba(30,14,4,.22);
}
```

**Retire `#9f1239`.** Replace it with `--color-accent-700` everywhere, including the PWA `theme-color` meta and manifest. If the committee insists on the crimson, keep it only as `theme-color`.

Semantic colour use:

| Meaning | Token |
| --- | --- |
| Primary action, active nav/tab/date | `--color-accent` |
| Hero / page-header ground | `--color-accent-700` |
| Slot open, booking confirmed | `--color-accent2` |
| Slot booked by someone else, disabled | `--color-neutral-300` |
| Awaiting / pending | `--color-accent-100` on ink text |

---

## 3. Typography

Four families, loaded via `next/font/google` with `display: swap`:

| Role | Family | Weights | Use |
| --- | --- | --- | --- |
| Latin display | **Caprasimo** | 400 | Page titles, hero, big numerals (dates, stats, times). Never below 22px. |
| Devanagari display | **Baloo 2** | 600, 700 | Every Marathi title — Caprasimo has no Devanagari. |
| Latin body | **Figtree** | 400, 600, 700 | Body, labels, buttons, nav, tables. |
| Devanagari body | **Mukta** | 400, 600 | Marathi body copy and helper text. |

Scale (mobile → desktop):

- Hero title: 38px / 62px, Caprasimo, `line-height: 1.02–1.05`
- Page title: 28px Caprasimo
- Card title (Marathi): 18–21px Baloo 2 600
- Card subtitle (English): 13px Figtree 600, `--color-ink-soft`
- Body: 15.5px Figtree 400, `line-height: 1.6`, never below 15px
- Section label: 11.5px Figtree 700, `letter-spacing: .14em`, uppercase, `--color-ink-soft`
- Tag: 10px Figtree 700, `letter-spacing: .1em`, uppercase

`text-wrap: pretty` on all paragraph text. Marathi never gets `text-transform: uppercase`.

---

## 4. The bilingual rule (do this first — highest leverage)

**There is no EN/MR toggle.** Remove the language switcher and the `useLang` state entirely. The pairing is fixed: Marathi leads, English supports.

Replace every `"English / मराठी"` concatenated string with a pair.

```tsx
// before
<h3>{`${e.titleEn} / ${e.titleMr}`}</h3>

// after
<BiTitle en={e.titleEn} mr={e.titleMr} />
```

```tsx
// components/BiTitle.tsx — Marathi leads, English trails. No language state.
export function BiTitle({ en, mr, size = "card" }: { en: string; mr: string; size?: "card" | "page" }) {
  return (
    <div>
      <div lang="mr" className="font-devDisplay" data-size={size}>{mr}</div>
      <div lang="en" className="text-ink-soft text-[13px] font-semibold leading-snug">{en}</div>
    </div>
  );
}
```

Rules:

1. **Content** (event titles, competition names, page titles) shows both: Marathi at full size in Baloo 2, English one step down in `--color-ink-soft`. If a record has no Marathi title, render the English alone at full size in Caprasimo — never an empty line.
2. **Chrome** (buttons, nav, tabs, filter chips, field labels, status tags, table headers) is **English only**. `Book Aarti Seva`, not `Book Aarti Seva / आरती सेवेसाठी नाव नोंदवा`. Short, familiar English is what residents already use for these controls.
3. A handful of devotional headings stay Marathi-only where the Marathi is the everyday term — `आरतीची वेळ`, `आरती सेवा`, `विजेते` — with an English line beneath in the same pairing.
4. Set `lang="mr"` on Marathi text nodes and `lang="en"` on English so the browser shapes and reads each correctly.
5. Removing the toggle frees the top-right header slot. On mobile use it for a `Day 1` festival-day badge (terracotta-tint pill); on desktop the "Book aarti" pill already sits there.

## 5. Shared shell

**Mobile header** — society mark (32px terracotta circle, `श्री`), `Palladium Plus` in Caprasimo 15px, and a `Day 1` festival-day badge on the right (the slot the language toggle used to occupy). Sits on `--color-accent-700` on Home, on `--color-bg` elsewhere.

**Mobile tab bar** — 5 tabs: Home, Schedule, Aarti, Winners, More. 26px Lucide icons at `stroke-width: 2.75`, 11px Figtree labels, active tab in `--color-accent` with a filled circle behind the icon. Minimum 44px hit target; add `padding-bottom: env(safe-area-inset-bottom)`.

**Move `/admin` out of the public nav** into "More", alongside committee contacts and the pamphlet.

**Desktop (≥1024px)** — one sticky header: mark + wordmark left, four text links + a terracotta "Book aarti" pill right. Active link gets a 2px `--color-accent` underline. Content caps at `max-width: 1120px` and centres. The footer becomes a real footer (society name, committee credit, page list, admin sign-in link) — not a copy of the nav.

---

## 6. Page-by-page

### Home
- Full-bleed hero on `--color-accent-700`, with two decorative circles (terracotta `rgba(198,113,57,.45)` and sage `rgba(122,138,94,.35)`) bleeding off the top-right, `overflow: hidden`. These circles are the only ornament in the system.
- Hero contents in order: countdown pill (`Starts in 3 days`), Caprasimo title on two lines, Marathi subtitle in Baloo 2 at 72% opacity, a `FROM 14 Sept — TO 25 Sept` rule, then two pill buttons (filled terracotta primary, outlined secondary).
- **"Happening next"** — 2–3 events max, not the full list. Each card: a coloured date block (Caprasimo day numeral, weekday, time) on the left, category tag + bilingual title on the right. First card white on `--color-accent` block; subsequent cards sand.
- Aarti-timings band on `--color-accent2` with the two times in Caprasimo.
- Pamphlet card: washed, rounded image on top (mobile) or left (desktop), View / Download pills below.
- Desktop: hero splits into copy (left, 1.15fr) and a white "Happening next" card floating on the maroon ground (right, .85fr); pamphlet and aarti band become a 1.3 / .7 row.

### Schedule
- Replace both `<select>` dropdowns. **Date rail**: horizontally scrollable row of 52px rounded date chips (weekday / Caprasimo numeral / event dot), active chip filled terracotta; sticky under the header. **Category filter**: horizontally scrollable pill chips, active filled ink. Collapse the 15 poster categories to ~6 groups (All, Puja, Kids, Cultural, Games, Community) and keep search behind an icon button.
- Events render as a **timeline**: 60px time gutter (Figtree 700 time + am/pm), a 2px rule with a 10px dot per event, cards to the right. White card for normal events, sand for aarti/visarjan.
- Day heading above each group: `Monday 14 Sept` + rule + event count.

### Event detail
- Header on `--color-accent-700`: back to Schedule, Share pill, `Day 1 · Puja` chip, Marathi title in Baloo 2 27px, English subtitle in Caprasimo 18px.
- White detail card with three labelled rows: WHEN / WHERE / STATUS (status as a coloured dot + word).
- Description in 15.5px body.
- **Translation notice** as a sand-tinted block: "Translation pending committee review" + one line of explanation. Today's phrasing ("Poster-transcribed event. English translation requires final committee proofread before go-live") is internal language — rewrite for residents.
- Two pill actions: Add to calendar (filled), Share on WhatsApp (outlined).
- "Later on day 1" list at the bottom.

### Aarti
- Numbered steps, slot-first. **Step 1 · Date** — same date rail as Schedule, ineligible dates at 45% opacity. **Step 2 · Slot** — two large slot cards; the selected/open one white with a 2px sage border, the taken one sand with a `--color-neutral-300` "Booked" tag. Time in Caprasimo 24px plus the reporting time beside it.
- **Step 3 · Details** moves into a **bottom sheet** that appears after a slot is picked, with a drag handle and the selected slot echoed under the title. Four pill inputs on a 2-column grid (name full width, Wing / Flat side by side, Mobile full width), consent checkbox, one filled terracotta submit.
- Rewrite the intro. Current copy mentions Supabase transactional functions and RLS — invisible to residents. Use: "Pick a date, pick a slot, book it. One slot per flat."
- Keep the 25 September morning-only rule and the 2:00 am cancellation cutoff as one line of helper text under the slots.

### Winners
- Filter chips: `Declared N` / `Awaiting N` / category.
- **Declared** competitions: white rounded card, sage header holding the bilingual competition name and date, then one row per place — 34px circle with a Caprasimo numeral (1st terracotta, 2nd/3rd sand), name, wing + flat. Never render mobile numbers or private notes.
- **Awaiting** competitions: compact single-line sand rows with a "Soon" tag and the judging date — not seven full-size cards. Add the judging date so the row carries information.
- Close with one card: "Get results on WhatsApp — the committee posts each result to the society group as it is signed off."

### Admin
- Ink header (`--color-ink`) to separate it from the public site; keep the cream body, drop all decoration.
- Stat row: 4 cards — Aarti slots booked (`9 / 23`), Events to proofread, Results pending, Next aarti (on sage). Numerals in Caprasimo 30px.
- Tab chips: Bookings / Events / Results / Translations.
- A real table (the one screen where a table beats cards): sand header row in 10.5px uppercase labels, 14px rows, `--color-accent2` "Confirmed" and `--color-accent-100` "Pending" tags, right-aligned text action per row.
- **Mask mobile numbers by default** (`98••• 41••`) with an explicit reveal; log reveals if the committee wants an audit trail.
- Below 900px the table becomes stacked cards — do not horizontally scroll it.

---

## 7. Interaction states

Themed, never browser defaults:

```css
:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
```

- Hover: one ramp step darker fill, or a `color-mix(in oklch, var(--color-accent) 12%, transparent)` tint on outlined/ghost controls.
- Active/pressed: `--color-accent-700`.
- Disabled: 45% opacity, no pointer events.
- `::selection`: terracotta tint.
- Loading: sand skeleton blocks at the card's radius, not spinners.
- Respect `prefers-reduced-motion`; keep transitions ≤150ms.

---

## 8. Accessibility & quality bar

- Body text ≥ 4.5:1 against its background. `--color-accent` on cream is ~3:1 — large text and chrome only; for accent-coloured body text use `--color-accent-700`.
- Terracotta and sage fills always carry white or `--color-ink` text at full opacity, never alpha-muted ink.
- Hit targets ≥ 44px. Date and category rails are keyboard-navigable with arrow keys and must not trap focus.
- `lang` attributes on both languages; `aria-label`s in the active language.
- Every icon-only button gets an accessible label.

---

## 9. Suggested order of work

1. Tokens + fonts + retire `#9f1239`.
2. Remove the EN/MR toggle and `useLang`; apply `BiTitle` across all pages.
3. Shared shell: header, 5-tab bar, desktop nav + real footer, `/admin` out of public nav.
4. Home hero and "Happening next".
5. Schedule date rail + timeline (removes both dropdowns).
6. Aarti slot-first flow + bottom sheet.
7. Event detail, Winners, Admin.
8. States, focus rings, contrast pass.

---

## 10. Do not

- Do not add Ganesha illustrations, mandala borders, diya graphics or gradient meshes. The two bleeding circles and the terracotta/sage pairing carry the festival.
- Do not introduce a fifth typeface, or use Caprasimo below 22px.
- Do not keep slash-joined bilingual strings anywhere, and do not reintroduce a language toggle.
- Do not surface internal implementation language (Supabase, RLS, "go-live", "demo verification") in resident-facing copy.
- Do not expose resident mobile numbers, private notes, or unconsented names on public pages.
