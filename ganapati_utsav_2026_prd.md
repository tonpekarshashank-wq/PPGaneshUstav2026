# Product Requirements Document

## Society Ganapati Utsav 2026 Application

**Working product name:** Palladium Plus Society Ganeshotsav 2026 | पॅलेडियम प्लस सोसायटी गणेशोत्सव २०२६  
**Event dates:** Monday, 14 September 2026 to Friday, 25 September 2026  
**Audience:** Residents of a housing society with 400+ flats  
**Primary platform:** Mobile-first responsive web application / installable PWA  
**Document status:** Build-ready MVP specification  
**Owner:** Society Ganapati Utsav Committee  

---

## 1. Product summary

Create a simple bilingual community application that becomes the single source of truth for the society's Ganapati Utsav. Residents should be able to see today's announcements, browse the complete English/Marathi event schedule, volunteer for morning or evening aarti, and view activity winners. Committee administrators should be able to update all of this without changing code.

The product should feel festive, welcoming, and extremely easy to use on a phone. A resident should understand what is happening today within five seconds and complete an aarti nomination in under one minute.

## 2. Problem statement

Event information is normally distributed through chat messages, posters, and word of mouth. Important updates get buried, schedules change, aarti nominations become difficult to coordinate, and winner announcements are fragmented. With 400+ flats, the committee needs one reliable, editable application while residents need a low-friction experience that does not require downloading an app.

## 3. Goals and success measures

### Product goals

1. Make today's program and important announcements immediately visible.
2. Maintain one bilingual schedule for the full festival.
3. Let verified residents nominate themselves for an available morning or evening aarti slot.
4. Prevent accidental duplicate and over-capacity bookings.
5. Give the committee a simple administrative interface.
6. Publish activity results and winners quickly and respectfully.

### Suggested success measures

| Metric | MVP target |
| --- | --- |
| Resident reach | At least 60% of flats visit during the festival |
| Aarti bookings | At least 80% of configured capacity filled |
| Booking completion | At least 85% of started forms completed |
| Booking time | Median under 60 seconds |
| Schedule accuracy | All committee-approved changes visible within 5 minutes |
| Admin usability | A trained committee member can update content without developer support |
| Mobile performance | Main content usable within 3 seconds on a typical 4G connection |

## 4. Scope

### MVP

- Bilingual English/Marathi interface and content.
- Home page with today's events and pinned announcements.
- Full schedule from 14–25 September 2026.
- Schedule filters by date and activity type.
- Morning/evening aarti nomination and slot availability.
- Booking confirmation, lookup, and cancellation before a configurable cutoff.
- Winners section grouped by activity.
- A “Participate & Contribute” area for activity instructions, external/contact-based registrations, volunteer opportunities, and Anand Mela stall booking details.
- Committee admin panel for announcements, events, aarti settings/bookings, and winners.
- Mobile-first responsive design and shareable URL.
- Basic audit history and usage analytics.

### Not in MVP

- Online payments or donation collection.
- Voting for winners.
- Social feed, resident comments, or direct messaging.
- Native iOS/Android applications.
- Reserved seating or food-coupon management.
- Public display of resident phone numbers or the complete aarti booking list.

## 5. Users and roles

| Role | Needs | Permissions |
| --- | --- | --- |
| Resident | Know today's program, plan participation, book aarti, see winners | View public content; create, view, or cancel own booking after verification |
| Committee admin | Keep information accurate and coordinate participation | Create/edit/publish/archive content; configure capacity and cutoffs; manage bookings; publish winners |
| Super admin | Control committee access and recover mistakes | All admin permissions plus invite/remove admins and view audit history |

## 6. Product principles

- **Today first:** The first screen answers “What is happening today?”
- **No app download:** Open from a WhatsApp message or QR code.
- **Bilingual by design:** Do not treat Marathi as an afterthought.
- **Minimal data collection:** Collect only what is required to coordinate participation.
- **Safe defaults:** Do not expose resident contact details publicly.
- **Committee-editable:** Dates, times, translations, capacity, and cutoffs are configuration, not hard-coded UI.

## 7. Information architecture

### Resident navigation

1. **Home / आजचे कार्यक्रम**
2. **Schedule / संपूर्ण वेळापत्रक**
3. **Aarti Seva / आरती सेवा**
4. **Winners / विजेते**

The Home page should also contain a prominent **Participate & Contribute / सहभागी व्हा व योगदान द्या** section. Avoid adding a fifth navigation item unless the number of participation opportunities grows enough to justify a separate page.

Use a sticky bottom navigation on mobile and a compact top navigation on desktop. Provide an English/मराठी language switcher in the header and remember the selection on the device.

### Admin navigation

1. Dashboard
2. Announcements
3. Schedule
4. Aarti slots and bookings
5. Activities and winners
6. Settings and administrators
7. Audit log

## 8. Core resident journeys

### Journey A — See what is happening today

1. Resident opens the shared link.
2. Home shows festival day/date, countdown or “Festival in progress,” pinned alert, and today's chronological events.
3. Resident taps an event for description, venue, participation instructions, and contact information.
4. If there are no events today, show the next upcoming event instead of an empty screen.

### Journey B — Browse the full schedule

1. Resident opens Schedule.
2. The current festival date is selected automatically when applicable; otherwise 14 September is selected.
3. Resident changes date or filters by Aarti, Kids, Cultural, Competition, Community, or Visarjan.
4. Every card shows time, English name, Marathi name, venue, and participation status.

### Journey C — Nominate for aarti

1. Resident opens Aarti Seva.
2. Resident selects an eligible date, then Morning or Evening. Booking is not offered on 14 September, and the Evening option is not offered on 25 September.
3. UI shows availability such as “3 of 5 places available.”
4. Resident enters full name, flat number, building/wing, mobile number, and optional family/member count or note.
5. Resident verifies the mobile number using OTP. If SMS is not configured for the pilot, admin approval may be used as the temporary fallback.
6. Resident accepts the participation note/privacy statement and submits.
7. System validates eligibility, duplicate rules, capacity, and cutoff atomically.
8. Resident receives an on-screen confirmation with booking reference and a WhatsApp-friendly summary.

### Journey D — View or cancel own aarti booking

1. Resident selects “Find my booking.”
2. Mobile OTP verifies identity.
3. System shows active booking details.
4. Resident can cancel before the configured cutoff; capacity becomes available immediately.
5. After cutoff, the UI asks the resident to contact the committee instead.

### Journey E — View winners

1. Resident opens Winners.
2. Published activities appear newest first.
3. Activity page shows winner name, flat/wing if consented, prize/rank, optional image, and a congratulatory message.
4. Unpublished results show “Results will be announced soon / निकाल लवकरच जाहीर केले जातील.”

### Journey F — Participate in an activity or contribute

1. Resident sees participation cards on Home and relevant CTAs on event detail pages.
2. Each card explains who can participate, registration deadline, fee if applicable, inclusions, venue/reporting details, and the responsible committee contact.
3. Resident taps the configured action: call, WhatsApp, open a registration link, or open an in-app form.
4. MVP keeps payments offline. The admin records any fee as informational content only.

## 9. Functional requirements and acceptance criteria

### FR-1: Home and announcements

- Show a hero area with product name, festival date range, and current state: Upcoming, In Progress, or Completed.
- Show pinned announcements before today's events.
- Announcement fields: English title/body, Marathi title/body, severity (`Information`, `Important`, `Urgent`), publish start/end, optional link, and status.
- Only published announcements within their display window appear to residents.
- Today's events use the society's configured timezone (`Asia/Kolkata`).
- If an event is changed or cancelled, show a visible status badge and optional change note.
- Provide share buttons using the Web Share API, with copy-link fallback.

**Acceptance criteria**

- At 00:00 IST, the page automatically begins showing the new day's events.
- An admin can publish an urgent notice that appears at the top without deploying code.
- Expired or draft announcements never appear publicly.

### FR-2: Full bilingual schedule

- Cover every festival date from 14 through 25 September 2026, inclusive.
- Event fields: English name, Marathi name, English/Marathi description, start date/time, end date/time, venue, category, participation instructions, registration link or status, contact label, status, and display order.
- Display both activity names together by default. The language preference controls which language is visually primary, not whether the other name exists.
- Support event states: Scheduled, Updated, Cancelled, Completed.
- Allow admin reorder, duplicate, publish/unpublish, and edit events.
- Store timestamps consistently and display in IST.

**Acceptance criteria**

- Every event card displays date, time, and names in both languages.
- Date filters return the correct event list in chronological order.
- Cancelled events remain visible with a clear cancellation label unless archived by an admin.

### FR-3: Aarti slot configuration

- Generate bookable Morning and Evening slots at 8:00 AM and 8:00 PM for 15–24 September 2026.
- Generate only a bookable Morning slot at 8:00 AM on 25 September 2026. Do not generate the normal Evening slot because Maha Aarti is held at 4:30 PM.
- Do not generate aarti booking slots on 14 September 2026.
- Aarti timings and bookings are independent of other scheduled activities, even when another activity occurs at or near the same time.
- Admin-configurable fields per slot: label in both languages, start time, reporting time, capacity, booking-open time, booking cutoff, instructions, status, and waitlist enabled/disabled.
- Default proposed capacity: 5 nominations per slot. This must be confirmed by the committee.
- Slot states: Upcoming, Open, Full, Closed, Cancelled.
- Admin can block or reopen a slot and alter capacity. Reducing capacity below existing confirmed bookings requires explicit confirmation and must not silently cancel residents.

### FR-4: Aarti nomination and booking rules

- Required inputs: resident full name, wing/building, flat number, mobile number, chosen date, chosen period, and consent checkbox.
- Optional inputs: number of family participants and note to committee.
- Validate name length, Indian mobile format, wing/flat format, festival date, open booking window, and capacity.
- Proposed default eligibility rule: one confirmed aarti slot per flat for the whole festival, configurable to one per day or unrestricted by admin.
- Same flat/mobile/date/period submission must be idempotent and must not create a duplicate.
- Capacity allocation must use a database transaction or unique constraint to prevent overbooking under simultaneous submissions.
- If a full slot has waitlist enabled, resident may join the ordered waitlist.
- If a confirmed booking is cancelled, the first waitlisted nomination is promoted automatically or flagged for admin approval, depending on configuration.
- Confirmation should include reference number, date, period, time, reporting time, resident name, and flat.
- Admin can add an offline booking, move a booking, cancel it with a reason, promote a waitlisted booking, and export bookings as CSV.

**Acceptance criteria**

- Two simultaneous submissions cannot make confirmed bookings exceed capacity.
- A duplicate submission returns the existing confirmation rather than creating a new row.
- Residents cannot view other residents' mobile numbers or notes.
- Admin actions record actor, time, old state, new state, and reason where applicable.

### FR-5: Winner announcements

- Admin creates one result group per activity/event.
- Each winner record supports rank/prize, English and Marathi display labels, participant/team name, optional flat/wing, optional image, and optional note.
- Results remain draft until explicitly published.
- Admin can publish multiple winners for one activity and control their order.
- Public page shows only consented resident information; mobile numbers are never shown.

**Acceptance criteria**

- Draft winners are visible only to admins.
- A published result appears immediately under the correct activity.
- Removing publication hides the result without deleting it.

### FR-6: Administration

- Admin authentication should use secure email magic link or OTP; do not use a shared password.
- Dashboard cards: today's events, active announcements, aarti fill rate, waitlisted residents, and unpublished results.
- Forms must validate that both English and Marathi event names are entered before publication.
- Admin receives a preview before publishing content.
- Destructive actions require confirmation and should archive/soft-delete by default.
- Maintain an audit log for content, booking, capacity, and result changes.

### FR-7: Search, sharing, and states

- Provide schedule search across both English and Marathi names.
- Every important page has loading, empty, validation-error, network-error, and retry states.
- Deep links should work for a specific event, aarti date, or result.
- Use human-readable share text in both languages where appropriate.

### FR-8: Participate and contribute

- An event may have zero or more participation opportunities.
- Opportunity fields: English/Marathi title and description, participation type (`Activity registration`, `Volunteer`, `Stall booking`, `Contribution`, `Other`), audience/eligibility, registration deadline, fee description, inclusions, setup/reporting time, contact name, contact mobile, external URL, action type, status, and display priority.
- Supported action types: Call, WhatsApp, External form, In-app form, and Information only.
- Public contact details appear only when the contact owner and committee have approved publication.
- Expired opportunities remain readable but the action changes to `Registrations closed / नोंदणी बंद`.
- Admin can feature an opportunity on Home and link it to its schedule event.

**Acceptance criteria**

- Anand Mela appears as a featured opportunity until its nomination deadline.
- On and after 15 September 2026, its booking CTA is disabled unless an admin extends the deadline.
- Fee information is clearly labeled and the application does not imply that online payment has been collected.

## 10. Official activity schedule supplied by the committee

The following schedule is transcribed from the shared Palladium Plus Society Ganeshotsav 2026 poster. English names are product translations of the Marathi source and should receive a final committee proofread before go-live. Morning and evening aarti bookings are separate from the special programs listed below.

| Date | Time | English activity | Marathi activity | Category |
| --- | --- | --- | --- | --- |
| Mon, 14 Sep | 11:00 AM | Shri Ganesh Idol Installation and Pran Pratishtha | श्री गणेश मूर्ती स्थापना व प्राणप्रतिष्ठा | Puja |
| Tue, 15 Sep | 7:00 PM | Haldi-Kumkum Ceremony and 21 Recitations of Ganapati Atharvashirsha | हळदी-कुंकू समारंभ आणि गणपती अथर्वशीर्ष २१ आवर्तन | Religious / Community |
| Wed, 16 Sep | 8:30 PM | Children's Chess and Carrom Competition | लहान मुलांची बुद्धिबळ व कॅरम स्पर्धा | Kids / Competition |
| Thu, 17 Sep | 6:00 PM | Bhajan by Sita Bhajani Mandal, Palladium Plus | भजन – सीता भजनी मंडळ, पॅलेडियम प्लस | Cultural / Devotional |
| Fri, 18 Sep | 8:30 PM | Children's Fancy Dress and Dance Competition | लहान मुलांची फॅन्सी ड्रेस व नृत्य स्पर्धा | Kids / Competition |
| Fri, 18 Sep | 9:15 PM | Movie Night – Mahaprabhu Jagannath | मूव्ही नाईट – महाप्रभू जगन्नाथ | Entertainment |
| Sat, 19 Sep | 10:00 AM | Health Check-up Camp | आरोग्य तपासणी शिबिर | Health / Community |
| Sat, 19 Sep | 10:00 AM | Children's Drawing Competition | लहान मुलांची चित्रकला स्पर्धा | Kids / Competition |
| Sat, 19 Sep | 10:00 AM | Rangoli Competition | रांगोळी स्पर्धा | Competition |
| Sat, 19 Sep | 6:00 PM | Anand Mela | आनंद मेळा | Community / Marketplace |
| Sun, 20 Sep | 10:00 AM | Shri Satyanarayan Maha Puja | श्री सत्यनारायण महापूजा | Puja |
| Sun, 20 Sep | 5:00 PM | Bhajan by Sant Dnyaneshwar Bhajani Mandal, Pune | भजन – संत ज्ञानेश्वर भजनी मंडळ, पुणे | Cultural / Devotional |
| Sun, 20 Sep | 9:00 PM | Mahaprasad (Bhandara) | महाप्रसाद (भंडारा) | Community |
| Mon, 21 Sep | 8:30 PM | Lemon-and-Spoon Race for Children and Musical Chairs for Women | लिंबू चमचा (लहान मुले) आणि संगीत खुर्ची (महिलांसाठी) | Games / Competition |
| Tue, 22 Sep | 8:30 PM | Karaoke Night for Senior Citizens | कराओके नाईट – ज्येष्ठांसाठी | Cultural |
| Wed, 23 Sep | 7:00 PM | Special Presentation by Shri Gurudev Tabla Academy, Pune | विशेष सादरीकरण – श्री गुरुदेव तबला अकादमी, पुणे | Cultural |
| Thu, 24 Sep | 8:30 PM | Tambola | तंबोला | Games |
| Fri, 25 Sep | 4:00 PM | Lezim and Flag Troupe Presentation | लेझीम–ध्वज पथक सादरीकरण | Cultural / Procession |
| Fri, 25 Sep | 4:30 PM | Maha Aarti | महाआरती | Aarti |
| Fri, 25 Sep | 5:00 PM | Visarjan Procession | विसर्जन मिरवणूक | Visarjan |

### Recurring aarti slots

| Dates | Morning booking | Evening booking | Rule |
| --- | --- | --- | --- |
| 14 Sep 2026 | Not available | Not available | No aarti booking required on the installation day |
| 15–24 Sep 2026 | 8:00 AM | 8:00 PM | Both slots are bookable each day |
| 25 Sep 2026 | 8:00 AM | Disabled | Maha Aarti takes place at 4:30 PM instead of the normal evening aarti |

English labels: `Morning Aarti` and `Evening Aarti`. Marathi labels: `सकाळची आरती` and `संध्याकाळची आरती`.

These aartis operate independently of all other activities. For example, an activity shown at 7:00 PM remains a separate schedule item and does not change the 8:00 PM evening aarti unless an admin explicitly changes the aarti slot.

### Anand Mela participation details

| Field | Confirmed detail from poster |
| --- | --- |
| Date and time | Saturday, 19 September 2026, 6:00 PM onwards |
| Venue | E Building Driveway |
| Offerings | Homemade food; handicraft and art; fashion and style; jewellery and gifts; games and more |
| Nomination deadline | 14 September 2026 |
| Resident stall charge | ₹500 |
| Outside-vendor stall charge | ₹1,000 |
| Setup time | From 5:00 PM |
| Included | One table and two chairs |
| Extra table | ₹200 |
| Booking contact | Mousami — +91 82176 27165 |

Configure the event CTA as `Book your stall / तुमचा स्टॉल बुक करा`. For MVP, use a call/WhatsApp action to the published contact; do not collect payment in the application. The contact number must be stored as editable admin content rather than hard-coded in the component.

## 11. Data model

### Core entities

| Entity | Important fields |
| --- | --- |
| `users` | id, role, email/mobile, status, created_at |
| `announcements` | id, title_en, title_mr, body_en, body_mr, severity, starts_at, ends_at, is_pinned, status, created_by |
| `events` | id, slug, name_en, name_mr, description_en, description_mr, starts_at, ends_at, venue_en, venue_mr, category, status, registration_url, display_order, sample_content |
| `aarti_slots` | id, event_date, period, label_en, label_mr, starts_at, reporting_at, capacity, booking_opens_at, booking_closes_at, waitlist_enabled, status |
| `aarti_bookings` | id, reference, slot_id, resident_name, wing, flat_number, mobile_encrypted, mobile_hash, participant_count, note, status, waitlist_position, verified_at, created_at, cancelled_at |
| `activities` | id, event_id, name_en, name_mr, results_status |
| `winners` | id, activity_id, rank_order, prize_en, prize_mr, display_name, wing, flat_number, image_url, note_en, note_mr, consent_to_publish, status |
| `participation_opportunities` | id, event_id, type, title_en, title_mr, description_en, description_mr, eligibility, deadline_at, fee_text_en, fee_text_mr, inclusions_en, inclusions_mr, setup_at, contact_name, contact_mobile, action_type, external_url, featured, status |
| `audit_logs` | id, actor_id, entity_type, entity_id, action, before_json, after_json, reason, created_at |
| `settings` | festival dates, timezone, booking rule, default capacity, cancellation cutoff, committee contact, language defaults |

### Constraints and privacy

- Unique active booking constraint based on configured policy, plus a hard idempotency key for identical submissions.
- A confirmed-booking count must never exceed slot capacity.
- Normalize wing and flat numbers before duplicate checks.
- Encrypt mobile numbers at rest where supported; store a one-way normalized hash for duplicate checks.
- Apply role-based row-level security. Residents cannot query the general bookings table.
- Retain booking data only for the committee-approved period, then delete or anonymize it.

## 12. Design requirements

- Festive but uncluttered visual system using warm saffron, maroon, cream, and restrained gold accents.
- Use culturally respectful, original decorative motifs; do not let ornamentation reduce readability.
- Minimum body text of 16 px on mobile and touch targets of at least 44 × 44 px.
- Use a Devanagari-capable font such as Noto Sans Devanagari and a compatible Latin font.
- Meet WCAG 2.1 AA contrast and keyboard-navigation expectations.
- Avoid autoplay audio, heavy animation, or large unoptimized images.
- Show dates in a resident-friendly format; support Marathi date labels while storing ISO dates.
- Key CTA labels:
  - `Book Aarti Seva / आरती सेवेसाठी नाव नोंदवा`
  - `View Full Schedule / संपूर्ण वेळापत्रक पहा`
  - `See Winners / विजेते पहा`

## 13. Recommended technical approach

### Suggested stack

- **Frontend:** Next.js with TypeScript and Tailwind CSS.
- **Backend/database/auth:** Supabase (PostgreSQL, Auth, Storage, Row Level Security), or an equivalent managed service.
- **Deployment:** Vercel or another managed web host.
- **Notifications:** Start with shareable on-screen/WhatsApp confirmation; add SMS/WhatsApp provider only after committee approval and credential setup.
- **Analytics:** Privacy-conscious event analytics without storing names, mobile numbers, or flat numbers in analytics payloads.

This stack is a recommendation, not a requirement. The application should keep the data-access layer isolated so the backend can be replaced.

### Environments

- Local development
- Staging for committee review
- Production for residents

Never use production resident data in development or staging.

## 14. Analytics events

| Event | Useful properties (non-PII only) |
| --- | --- |
| `home_viewed` | language, festival_state |
| `announcement_opened` | announcement_id, severity |
| `schedule_viewed` | selected_date, language |
| `schedule_filtered` | category |
| `event_opened` | event_id, category |
| `aarti_slot_selected` | date, period, slot_state |
| `aarti_booking_started` | date, period |
| `aarti_booking_completed` | date, period, result_status |
| `aarti_booking_cancelled` | date, period |
| `winners_viewed` | activity_id |
| `participation_cta_selected` | event_id, opportunity_type, action_type |
| `language_changed` | from_language, to_language |

## 15. Error handling and edge cases

- Slot becomes full while resident is completing the form: explain clearly and offer another slot or waitlist.
- Network fails after submission: retry with the same idempotency key and return the existing result if already created.
- Admin changes an event after residents viewed it: show `Updated` and last-updated time.
- Admin cancels an aarti slot with bookings: require a reason, notify/flag affected bookings, and present admin follow-up list.
- Incorrect device timezone: all festival calculations use server-side IST.
- No Marathi translation: prevent publication for event names; allow optional descriptions to fall back to English with an admin warning.
- Image upload failure: winner record can still be saved without an image.
- Festival over: home switches to a thank-you state while schedule and winners remain available.

## 16. Security and compliance

- Use server-side authorization for every admin operation.
- Apply rate limits to OTP and booking endpoints.
- Add bot protection after suspicious repeated submissions, while keeping the normal resident flow simple.
- Sanitize rich text and uploads; restrict image type and size.
- Do not log OTP values, full mobile numbers, names, or flat numbers in analytics or client errors.
- Back up the database daily during the event period.
- Publish a short privacy notice explaining purpose, access, retention, and committee contact.
- Obtain explicit consent before publicly showing a participant's flat/wing or photo in winner announcements.

## 17. Testing and release criteria

### Essential test coverage

- Unit tests for date, cutoff, capacity, duplicate, waitlist, and language-fallback logic.
- Integration tests for authenticated admin CRUD and protected resident lookup.
- Concurrency test with more simultaneous requests than slot capacity.
- End-to-end tests for home, schedule filters, successful booking, duplicate booking, full slot, cancellation, and result publication.
- Manual bilingual proofreading by a fluent Marathi reviewer.
- Device testing on recent Android Chrome, iPhone Safari, and desktop browsers.
- Accessibility pass for contrast, labels, focus order, errors, and keyboard usage.

### Go-live checklist

- Committee confirms official dates, event names, translations, times, venues, contacts, and participation rules.
- Committee verifies the poster transcription and all English translations.
- Committee confirms aarti capacity, eligibility rule, verification method, cutoff, cancellation, and waitlist policy.
- Approve every poster-transcribed schedule record and its English translation.
- Create at least two admin accounts; do not rely on one person.
- Test booking with multiple simultaneous submissions.
- Verify privacy notice, data retention date, backups, and emergency contact.
- Place QR code and short URL on society posters and WhatsApp notices.
- Freeze non-essential changes by 13 September 2026; allow content updates throughout the festival.

## 18. Delivery plan

### Phase 1 — Foundation

- Set up project, database, authentication, bilingual design system, and responsive navigation.
- Implement schema, security policies, settings, and seed data.

### Phase 2 — Resident experience

- Build home, announcements, full schedule, event detail, search/filter, and sharing.

### Phase 3 — Participation and results

- Build aarti availability, OTP/verification, booking rules, lookup/cancellation, waitlist, and winners.

### Phase 4 — Administration and readiness

- Build admin CRUD, dashboard, exports, audit log, analytics, automated tests, accessibility QA, and deployment documentation.

## 19. Open decisions for the committee

1. Official society/application name, logo, and committee contact.
2. Final schedule, venue, participant age groups, and registration instructions.
3. Aarti capacity: one family/flat or multiple people per slot?
4. Eligibility: one booking per flat for the festival, one per day, or unrestricted?
5. Is a booking immediately confirmed, or approved by an admin?
6. Should a full slot offer an automatic waitlist?
7. How late can a resident cancel?
8. Is OTP available, or should the committee verify bookings using a resident directory?
9. Should confirmed names be visible publicly, or admin-only? Recommended: admin-only.
10. Who approves Marathi translations and winner-publication consent?

---

## 20. Copy-paste Codex implementation prompt

```text
Build a production-quality, mobile-first bilingual PWA called “Palladium Plus Society Ganeshotsav 2026 | पॅलेडियम प्लस सोसायटी गणेशोत्सव २०२६” for a housing society with 400+ flats.

Use the attached PRD as the source of truth. First inspect the current repository and preserve its conventions. If it is empty, use Next.js, TypeScript, Tailwind CSS, and Supabase. Create a clean data-access layer, database migrations, seed data, row-level security policies, environment-variable examples, tests, and a concise README with local setup and deployment instructions. Never commit real credentials.

Implement these resident experiences:
1. Home with the festival state, pinned announcements, today's chronological events, and next-event fallback.
2. Full schedule for 14–25 September 2026 with date/category filters, search, event states, venue and details. Every event must show English and Marathi names.
3. Aarti Seva with date and Morning/Evening selection, live capacity, resident nomination, verification abstraction, confirmation reference, own-booking lookup, cancellation cutoff, configurable duplicate policy, atomic capacity enforcement, and optional waitlist.
4. Winners grouped by activity, with rank/prize and consent-aware display of names, flat/wing, notes, and optional image.
5. Participate & Contribute cards with configurable Call, WhatsApp, external-form, in-app-form, or information-only actions. Seed the confirmed Anand Mela stall details from the PRD; payments remain offline.
6. English/Marathi language preference remembered on the device.

Implement a secure admin area for announcements, schedule, aarti slot configuration/bookings, activities/winners, settings, CSV export, and audit history. Use secure admin authentication; never use a shared password. Public users must not be able to query booking contact data.

Important behavior:
- Use Asia/Kolkata for all festival and “today” calculations.
- Apply the confirmed aarti schedule exactly: no aarti booking on 14 September; Morning and Evening slots at 8:00 AM and 8:00 PM from 15–24 September; Morning slot only at 8:00 AM on 25 September; no regular evening slot on 25 September because Maha Aarti is at 4:30 PM. Aarti is independent of every other scheduled activity.
- Prevent overbooking under concurrent requests using database-side transactional enforcement and constraints.
- Make booking submission idempotent.
- Do not send PII to analytics or client-side logs.
- Seed the official poster schedule from the PRD, but keep English translations and specifically flagged items in draft until committee review.
- Provide accessible loading, empty, error, cancelled, full, closed, and completed states.
- Meet WCAG 2.1 AA contrast and use a Devanagari-capable font.
- Avoid heavy animations and optimize for typical mobile 4G.

Work in milestones. Before implementation, summarize assumptions and propose the file/data architecture. Then implement the complete MVP, run lint, type-check, unit/integration tests and the production build, fix all failures, and report what was completed plus any external setup still required (Supabase project, OTP provider, hosting, and production environment variables).
```

## 21. Definition of done

The MVP is done when a resident can open a link on a phone, understand today's program, browse the complete bilingual schedule, successfully nominate for an available aarti slot without causing a duplicate or overbooking, retrieve/cancel their own eligible booking, and view published winners; and when an authenticated committee admin can manage all related content and bookings without a code change.
