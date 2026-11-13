-- Supabase → SQL Editor → New query → shu faylni joylab "Run" bosing (bir marta).
create table if not exists mycoffee_store (
  id text primary key,
  doc jsonb not null,
  updated_at timestamptz not null default now()
);

-- Jadvalga faqat server (service_role kaliti) kira oladi; brauzerdan to'g'ridan-to'g'ri kirish yopiq.
alter table mycoffee_store enable row level security;
