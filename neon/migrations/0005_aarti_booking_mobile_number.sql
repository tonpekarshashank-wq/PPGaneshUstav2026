alter table aarti_bookings
  add column if not exists mobile_number text;

drop function if exists submit_aarti_booking(text, text, text, text, text, text, text, text, text);

create or replace function submit_aarti_booking(
  p_id text,
  p_slot_id text,
  p_reference text,
  p_resident_name text,
  p_wing text,
  p_flat_number text,
  p_mobile_hash text,
  p_mobile_number text,
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
    id, reference, slot_id, resident_name, wing, flat_number, mobile_hash, mobile_number,
    participant_count, note, status, idempotency_key, verified_at
  ) values (
    p_id, p_reference, p_slot_id, trim(p_resident_name), upper(trim(p_wing)), upper(trim(p_flat_number)), p_mobile_hash, p_mobile_number,
    1, nullif(trim(coalesce(p_note, '')), ''), 'confirmed', p_idempotency_key, now()
  )
  returning * into v_booking;

  return v_booking;
end;
$$;
