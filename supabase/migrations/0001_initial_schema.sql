-- ============================================================
-- SamadhanSetu — Initial Schema Migration
-- Run this once in: Supabase → SQL Editor → Run
-- ============================================================

-- Enable pgvector (used in Phase 3 for semantic duplicate detection)
create extension if not exists vector with schema extensions;

-- ============================================================
-- ENUM TYPES
-- ============================================================

create type user_role as enum (
  'citizen',
  'university',
  'industry',
  'admin'
);

create type problem_status as enum (
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Returned'      -- reviewer sends back for more evidence (Phase 5)
);

create type offering_type as enum (
  'mentorship',
  'funding',
  'prototyping'
);

create type assignment_status as enum (
  'pending',
  'accepted',
  'in_progress',
  'completed'
);

create type confidence_flag as enum (
  'looks genuine',
  'needs verification'
);

-- ============================================================
-- TABLE: users
-- Mirrors auth.users. Created automatically on first sign-in
-- via the trigger below.
-- ============================================================

create table public.users (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  role       user_role not null default 'citizen',
  contact    text,
  verified   boolean not null default false,
  created_at timestamptz not null default now()
);

-- Auto-create a public.users row whenever someone signs up or
-- signs in for the first time via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.users (id, role)
  values (new.id, 'citizen')
  on conflict (id) do nothing;  -- safe to call multiple times
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- TABLE: problems
-- One row per citizen-submitted problem report.
-- ============================================================

create table public.problems (
  id                     uuid primary key default gen_random_uuid(),
  title                  text not null,
  description            text not null,
  category               text not null,
  media                  text[] not null default '{}',   -- Supabase Storage URLs
  lat                    double precision,
  lng                    double precision,
  status                 problem_status not null default 'Submitted',
  submitted_by           uuid references public.users(id) on delete set null,

  -- AI scoring columns (populated by Phase 2 Edge Function)
  severity_score         numeric(4,2),    -- 0–10
  urgency_score          numeric(4,2),    -- 0–10
  community_impact_score numeric(4,2) not null default 0,  -- incremented by Phase 3
  priority_score         numeric(4,2),    -- 0.4*sev + 0.3*urg + 0.3*impact
  ai_confidence_flag     confidence_flag,

  -- Reviewer fields (Phase 5)
  reviewer_note          text,

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Keep updated_at current on every UPDATE
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger problems_updated_at
  before update on public.problems
  for each row execute function public.touch_updated_at();

-- ============================================================
-- TABLE: institutions
-- Universities and colleges that can be assigned problems.
-- ============================================================

create table public.institutions (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  district        text,
  departments     text[] not null default '{}',
  specialisations text[] not null default '{}',
  created_at      timestamptz not null default now()
);

-- ============================================================
-- TABLE: assignments
-- Links a verified problem to an institution.
-- ============================================================

create table public.assignments (
  id             uuid primary key default gen_random_uuid(),
  problem_id     uuid not null references public.problems(id) on delete cascade,
  institution_id uuid not null references public.institutions(id) on delete cascade,
  status         assignment_status not null default 'pending',
  team           text[] not null default '{}',   -- faculty/student names
  mentor         text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger assignments_updated_at
  before update on public.assignments
  for each row execute function public.touch_updated_at();

-- ============================================================
-- TABLE: industry_partners
-- Companies offering mentorship, funding, or prototyping.
-- ============================================================

create table public.industry_partners (
  id         uuid primary key default gen_random_uuid(),
  org_name   text not null,
  sector     text,
  offering   offering_type,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLE: projects
-- Created when an industry partner joins an assignment.
-- ============================================================

create table public.projects (
  id                  uuid primary key default gen_random_uuid(),
  assignment_id       uuid not null references public.assignments(id) on delete cascade,
  milestones          jsonb[] not null default '{}',
  industry_partner_id uuid references public.industry_partners(id) on delete set null,
  deliverables        jsonb[] not null default '{}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.touch_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- --- users ---
alter table public.users enable row level security;

create policy "users: read own row"
  on public.users for select
  using (auth.uid() = id);

create policy "users: update own row"
  on public.users for update
  using (auth.uid() = id);

-- --- problems ---
-- Citizens can insert their own problems and read only their own.
-- Reviewer / admin access is added in Phase 5.
alter table public.problems enable row level security;

create policy "problems: citizen insert"
  on public.problems for insert
  to authenticated
  with check (auth.uid() = submitted_by);

create policy "problems: citizen read own"
  on public.problems for select
  using (auth.uid() = submitted_by);

-- --- institutions (locked until Phase 5) ---
alter table public.institutions enable row level security;

-- --- assignments (locked until Phase 5) ---
alter table public.assignments enable row level security;

-- --- industry_partners (locked until Phase 6) ---
alter table public.industry_partners enable row level security;

-- --- projects (locked until Phase 6) ---
alter table public.projects enable row level security;

-- ============================================================
-- END OF MIGRATION
-- ============================================================
