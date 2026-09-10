create extension if not exists pgcrypto;

create type public.app_role as enum ('resident', 'committee_admin', 'super_admin');
create type public.content_status as enum ('draft', 'published', 'archived');
create type public.event_state as enum ('scheduled', 'updated', 'cancelled', 'completed');
create type public.aarti_period as enum ('morning', 'evening');
create type public.slot_status as enum ('upcoming', 'open', 'full', 'closed', 'cancelled');
create type public.booking_status as enum ('confirmed', 'waitlisted', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'resident',
  email text,
  mobile_hash text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.settings (
  id text primary key default 'festival',
  festival_start_date date not null,
  festival_end_date date not null,
  timezone text not null default 'Asia/Kolkata',
  duplicate_policy text not null default 'one_per_festival' check (duplicate_policy in ('one_per_festival', 'one_per_day', 'unrestricted')),
  default_capacity integer not null default 5 check (default_capacity > 0),
  cancellation_cutoff_hours integer not null default 6 check (cancellation_cutoff_hours >= 0),
  waitlist_promotion text not null default 'admin_review' check (waitlist_promotion in ('automatic', 'admin_review')),
  updated_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_mr text not null,
  body_en text not null,
  body_mr text not null,
  severity text not null check (severity in ('information', 'important', 'urgent')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_pinned boolean not null default false,
  status public.content_status not null default 'draft',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_en text not null,
  name_mr text not null,
  description_en text,
  description_mr text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  venue_en text not null,
  venue_mr text not null,
  category text not null,
  state public.event_state not null default 'scheduled',
  status public.content_status not null default 'draft',
  registration_url text,
  contact_label text,
  display_order integer not null default 0,
  sample_content boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at >= starts_at),
  check (char_length(name_en) > 0 and char_length(name_mr) > 0)
);

create table public.aarti_slots (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  period public.aarti_period not null,
  label_en text not null,
  label_mr text not null,
  starts_at timestamptz not null,
  reporting_at timestamptz not null,
  capacity integer not null check (capacity > 0),
  booking_opens_at timestamptz not null,
  booking_closes_at timestamptz not null,
  waitlist_enabled boolean not null default true,
  status public.slot_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (event_date, period),
  check (event_date <> date '2026-09-14'),
  check (not (event_date = date '2026-09-25' and period = 'evening')),
  check (booking_closes_at <= starts_at)
);

create table public.aarti_bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  slot_id uuid not null references public.aarti_slots(id) on delete restrict,
  resident_name text not null,
  wing text not null,
  flat_number text not null,
  normalized_flat text not null,
  mobile_encrypted bytea,
  mobile_hash text not null,
  participant_count integer not null default 1 check (participant_count between 1 and 10),
  note text,
  status public.booking_status not null default 'confirmed',
  waitlist_position integer,
  idempotency_key text not null unique,
  verified_at timestamptz not null,
  created_at timestamptz not null default now(),
  cancelled_at timestamptz,
  cancellation_reason text
);

create unique index aarti_booking_idempotent_active_idx
on public.aarti_bookings (slot_id, normalized_flat, mobile_hash)
where status <> 'cancelled';

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id),
  name_en text not null,
  name_mr text not null,
  results_status public.content_status not null default 'draft'
);

create table public.winners (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
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
  status public.content_status not null default 'draft'
);

create table public.participation_opportunities (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id),
  type text not null,
  title_en text not null,
  title_mr text not null,
  description_en text not null,
  description_mr text not null,
  eligibility_en text,
  eligibility_mr text,
  deadline_at timestamptz,
  fee_text_en text,
  fee_text_mr text,
  inclusions_en text,
  inclusions_mr text,
  setup_at timestamptz,
  contact_name text,
  contact_mobile text,
  action_type text not null,
  external_url text,
  featured boolean not null default false,
  status public.content_status not null default 'draft'
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  entity_type text not null,
  entity_id text not null,
  action text not null,
  before_json jsonb,
  after_json jsonb,
  reason text,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
    and role in ('committee_admin', 'super_admin')
    and status = 'active'
  );
$$;

alter table public.profiles enable row level security;
alter table public.settings enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.aarti_slots enable row level security;
alter table public.aarti_bookings enable row level security;
alter table public.activities enable row level security;
alter table public.winners enable row level security;
alter table public.participation_opportunities enable row level security;
alter table public.audit_logs enable row level security;

create policy "public published announcements" on public.announcements for select using (status = 'published' and now() between starts_at and ends_at);
create policy "public published events" on public.events for select using (status = 'published');
create policy "public open aarti slots" on public.aarti_slots for select using (status in ('upcoming', 'open', 'full', 'closed', 'cancelled'));
create policy "public published activities" on public.activities for select using (results_status = 'published');
create policy "public consented winners" on public.winners for select using (status = 'published' and consent_to_publish = true);
create policy "public participation" on public.participation_opportunities for select using (status = 'published');

create policy "admins read all profiles" on public.profiles for select using (public.is_admin() or id = auth.uid());
create policy "admins manage settings" on public.settings for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage announcements" on public.announcements for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage slots" on public.aarti_slots for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage bookings" on public.aarti_bookings for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage activities" on public.activities for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage winners" on public.winners for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage opportunities" on public.participation_opportunities for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read audit" on public.audit_logs for select using (public.is_admin());

create or replace function public.submit_aarti_booking(
  p_slot_id uuid,
  p_resident_name text,
  p_wing text,
  p_flat_number text,
  p_mobile_hash text,
  p_mobile_encrypted bytea,
  p_participant_count integer,
  p_note text,
  p_idempotency_key text,
  p_verified_at timestamptz
) returns public.aarti_bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_slot public.aarti_slots%rowtype;
  v_existing public.aarti_bookings%rowtype;
  v_confirmed integer;
  v_status public.booking_status;
  v_waitlist_position integer;
  v_booking public.aarti_bookings%rowtype;
  v_flat text := upper(trim(p_wing)) || '-' || upper(trim(p_flat_number));
begin
  select * into v_existing from public.aarti_bookings where idempotency_key = p_idempotency_key;
  if found then
    return v_existing;
  end if;

  select * into v_slot from public.aarti_slots where id = p_slot_id for update;
  if not found then
    raise exception 'slot_not_found';
  end if;
  if v_slot.status in ('closed', 'cancelled') or now() < v_slot.booking_opens_at or now() > v_slot.booking_closes_at then
    raise exception 'slot_closed';
  end if;

  select * into v_existing
  from public.aarti_bookings
  where slot_id = p_slot_id and normalized_flat = v_flat and mobile_hash = p_mobile_hash and status <> 'cancelled';
  if found then
    return v_existing;
  end if;

  select count(*) into v_confirmed from public.aarti_bookings where slot_id = p_slot_id and status = 'confirmed';
  if v_confirmed < v_slot.capacity then
    v_status := 'confirmed';
  elsif v_slot.waitlist_enabled then
    v_status := 'waitlisted';
    select coalesce(max(waitlist_position), 0) + 1 into v_waitlist_position from public.aarti_bookings where slot_id = p_slot_id and status = 'waitlisted';
  else
    raise exception 'slot_full';
  end if;

  insert into public.aarti_bookings (
    reference, slot_id, resident_name, wing, flat_number, normalized_flat, mobile_hash, mobile_encrypted,
    participant_count, note, status, waitlist_position, idempotency_key, verified_at
  ) values (
    'PPG-' || upper(substr(encode(digest(p_slot_id::text || v_flat || p_idempotency_key, 'sha1'), 'hex'), 1, 8)),
    p_slot_id, trim(p_resident_name), upper(trim(p_wing)), upper(trim(p_flat_number)), v_flat, p_mobile_hash, p_mobile_encrypted,
    p_participant_count, p_note, v_status, v_waitlist_position, p_idempotency_key, p_verified_at
  )
  returning * into v_booking;

  return v_booking;
end;
$$;

create or replace function public.cancel_aarti_booking(p_reference text, p_mobile_hash text, p_reason text)
returns public.aarti_bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking public.aarti_bookings%rowtype;
begin
  update public.aarti_bookings
  set status = 'cancelled', cancelled_at = now(), cancellation_reason = p_reason
  where reference = p_reference and mobile_hash = p_mobile_hash and status <> 'cancelled'
  returning * into v_booking;

  if not found then
    raise exception 'booking_not_found';
  end if;

  return v_booking;
end;
$$;
