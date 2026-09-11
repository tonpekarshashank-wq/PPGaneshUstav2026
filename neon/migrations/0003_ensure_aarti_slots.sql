insert into aarti_slots (id, event_date, period, label_en, label_mr, starts_at, reporting_at, capacity, booking_opens_at, booking_closes_at, waitlist_enabled, status)
select
  'aarti-' || to_char(d::date, 'YYYY-MM-DD') || '-' || p.period,
  d::date,
  p.period,
  case when p.period = 'morning' then 'Morning Aarti' else 'Evening Aarti' end,
  case when p.period = 'morning' then 'सकाळची आरती' else 'संध्याकाळची आरती' end,
  (d::date + case when p.period = 'morning' then time '08:00' else time '20:00' end) at time zone 'Asia/Kolkata',
  (d::date + case when p.period = 'morning' then time '07:45' else time '19:45' end) at time zone 'Asia/Kolkata',
  1,
  timestamp with time zone '2026-09-01 08:00:00+05:30',
  (d::date + case when p.period = 'morning' then time '02:00' else time '14:00' end) at time zone 'Asia/Kolkata',
  false,
  'open'
from generate_series(date '2026-09-15', date '2026-09-25', interval '1 day') d
cross join (values ('morning'), ('evening')) as p(period)
where not (d::date = date '2026-09-25' and p.period = 'evening')
on conflict (id) do nothing;
