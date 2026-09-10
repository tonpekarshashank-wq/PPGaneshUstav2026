create table if not exists announcements (
  id text primary key,
  title_en text not null,
  title_mr text not null,
  body_en text not null,
  body_mr text not null,
  severity text not null check (severity in ('information', 'important', 'urgent')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_pinned boolean not null default false,
  status text not null check (status in ('draft', 'published', 'archived')),
  updated_at timestamptz not null default now()
);

create table if not exists events (
  id text primary key,
  slug text not null unique,
  name_en text not null,
  name_mr text not null,
  description_en text not null default '',
  description_mr text not null default '',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  venue_en text not null,
  venue_mr text not null,
  category text not null,
  state text not null check (state in ('scheduled', 'updated', 'cancelled', 'completed')),
  status text not null check (status in ('draft', 'published', 'archived')),
  registration_url text,
  contact_label text,
  display_order integer not null default 0,
  sample_content boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists aarti_slots (
  id text primary key,
  event_date date not null,
  period text not null check (period in ('morning', 'evening')),
  label_en text not null,
  label_mr text not null,
  starts_at timestamptz not null,
  reporting_at timestamptz not null,
  capacity integer not null default 1 check (capacity > 0),
  booking_opens_at timestamptz not null,
  booking_closes_at timestamptz not null,
  waitlist_enabled boolean not null default false,
  status text not null check (status in ('upcoming', 'open', 'full', 'closed', 'cancelled')),
  updated_at timestamptz not null default now(),
  unique (event_date, period),
  check (event_date <> date '2026-09-14'),
  check (not (event_date = date '2026-09-25' and period = 'evening'))
);

create table if not exists aarti_bookings (
  id text primary key,
  reference text not null unique,
  slot_id text not null references aarti_slots(id) on delete restrict,
  resident_name text not null,
  wing text not null,
  flat_number text not null,
  mobile_hash text not null,
  participant_count integer not null default 1,
  note text,
  status text not null check (status in ('confirmed', 'waitlisted', 'cancelled')),
  waitlist_position integer,
  idempotency_key text not null unique,
  verified_at timestamptz not null,
  created_at timestamptz not null default now(),
  cancelled_at timestamptz
);

create unique index if not exists one_confirmed_booking_per_slot
on aarti_bookings (slot_id)
where status = 'confirmed';

create table if not exists activities (
  id text primary key,
  event_id text references events(id),
  name_en text not null,
  name_mr text not null,
  results_status text not null check (results_status in ('draft', 'published', 'archived'))
);

create table if not exists winners (
  id text primary key,
  activity_id text not null,
  rank_order integer not null,
  prize_en text not null,
  prize_mr text not null,
  display_name text not null,
  wing text,
  flat_number text,
  image_url text,
  note_en text,
  note_mr text,
  consent_to_publish boolean not null default false,
  status text not null check (status in ('draft', 'published', 'archived')),
  updated_at timestamptz not null default now()
);

create or replace function submit_aarti_booking(
  p_id text,
  p_slot_id text,
  p_reference text,
  p_resident_name text,
  p_wing text,
  p_flat_number text,
  p_mobile_hash text,
  p_note text,
  p_idempotency_key text
) returns aarti_bookings
language plpgsql
as $$
declare
  v_slot aarti_slots%rowtype;
  v_existing aarti_bookings%rowtype;
  v_booking aarti_bookings%rowtype;
begin
  select * into v_existing from aarti_bookings where idempotency_key = p_idempotency_key;
  if found then
    return v_existing;
  end if;

  select * into v_slot from aarti_slots where id = p_slot_id for update;
  if not found then
    raise exception 'slot_not_found';
  end if;

  if v_slot.status in ('closed', 'cancelled') then
    raise exception 'slot_closed';
  end if;

  if exists (select 1 from aarti_bookings where slot_id = p_slot_id and status = 'confirmed') then
    raise exception 'slot_already_booked';
  end if;

  insert into aarti_bookings (
    id, reference, slot_id, resident_name, wing, flat_number, mobile_hash,
    participant_count, note, status, idempotency_key, verified_at
  ) values (
    p_id, p_reference, p_slot_id, trim(p_resident_name), upper(trim(p_wing)), upper(trim(p_flat_number)), p_mobile_hash,
    1, nullif(trim(coalesce(p_note, '')), ''), 'confirmed', p_idempotency_key, now()
  )
  returning * into v_booking;

  return v_booking;
end;
$$;
