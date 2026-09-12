create table if not exists registration_events (
  id text primary key,
  event_id text not null unique references events(id) on delete restrict,
  opens_at timestamptz not null,
  closes_at timestamptz not null,
  age_groups jsonb not null default '[]'::jsonb,
  max_entries integer check (max_entries is null or max_entries > 0),
  status text not null check (status in ('draft', 'open', 'closed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (jsonb_typeof(age_groups) = 'array'),
  check (closes_at > opens_at)
);

create table if not exists registration_entries (
  id text primary key,
  reference text not null unique,
  registration_event_id text not null references registration_events(id) on delete restrict,
  participant_name text not null,
  wing text not null check (wing in ('E', 'F', 'G', 'H')),
  flat_number text not null check (flat_number ~ '^([1-9]0[1-6]|100[1-6]|110[1-6])$'),
  age_group text not null,
  mobile_hash text not null,
  mobile_number text,
  status text not null check (status in ('confirmed', 'cancelled')),
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  cancelled_at timestamptz
);

create index if not exists registration_entries_public_lookup
on registration_entries (registration_event_id, status, wing, flat_number, participant_name);

create index if not exists registration_entries_created_at
on registration_entries (created_at desc);

create unique index if not exists one_confirmed_registration_per_participant_flat_event
on registration_entries (registration_event_id, lower(btrim(participant_name)), wing, flat_number)
where status = 'confirmed';

insert into registration_events (id, event_id, opens_at, closes_at, age_groups, status)
select
  'registration-' || e.id,
  e.id,
  timestamp with time zone '2026-09-01 08:00:00+05:30',
  e.starts_at,
  case
    when e.category ilike '%kids%' or e.name_en ilike '%children%' then '["6-9", "10-13", "14-17"]'::jsonb
    else '["Open"]'::jsonb
  end,
  'open'
from events e
where e.id in ('event-3', 'event-5', 'event-8', 'event-9', 'event-14', 'event-17')
on conflict (id) do update set
  event_id = excluded.event_id,
  opens_at = excluded.opens_at,
  closes_at = excluded.closes_at,
  age_groups = excluded.age_groups,
  status = excluded.status,
  updated_at = now();

update events e
set registration_url = '/registrations?event=' || e.id || '/' || e.slug,
    updated_at = now()
where e.id in ('event-3', 'event-5', 'event-8', 'event-9', 'event-14', 'event-17');
