-- Supabase RLS baseline for portfolio-backend
-- Safe to run multiple times.

begin;

-- 1) Enable RLS on all app tables
alter table public.admin enable row level security;
alter table public.profile enable row level security;
alter table public.projects enable row level security;
alter table public.work_experiences enable row level security;
alter table public.certifications enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.blog_posts enable row level security;
alter table public.contact_messages enable row level security;
alter table public.project_skills enable row level security;
alter table public.post_tags enable row level security;

-- 1a) Explicit lock-down policy for admin table
-- This removes the "RLS enabled but no policies" warning while preserving deny-by-default behavior.
drop policy if exists admin_no_client_access on public.admin;
create policy admin_no_client_access
on public.admin
for all
to anon, authenticated
using (false)
with check (false);

-- 2) Public read policies for portfolio content
-- Profile
drop policy if exists profile_public_read on public.profile;
create policy profile_public_read
on public.profile
for select
to anon, authenticated
using (auth.role() in ('anon', 'authenticated'));

-- Projects (published only)
drop policy if exists projects_public_read on public.projects;
create policy projects_public_read
on public.projects
for select
to anon, authenticated
using (is_published = true);

-- Work experiences (published only)
drop policy if exists work_experiences_public_read on public.work_experiences;
create policy work_experiences_public_read
on public.work_experiences
for select
to anon, authenticated
using (is_published = true);

-- Certifications (published only)
drop policy if exists certifications_public_read on public.certifications;
create policy certifications_public_read
on public.certifications
for select
to anon, authenticated
using (is_published = true);

-- Education
drop policy if exists education_public_read on public.education;
create policy education_public_read
on public.education
for select
to anon, authenticated
using (auth.role() in ('anon', 'authenticated'));

-- Skills
drop policy if exists skills_public_read on public.skills;
create policy skills_public_read
on public.skills
for select
to anon, authenticated
using (auth.role() in ('anon', 'authenticated'));

-- Blog posts (published only)
drop policy if exists blog_posts_public_read on public.blog_posts;
create policy blog_posts_public_read
on public.blog_posts
for select
to anon, authenticated
using (is_published = true);

-- Junction tables
drop policy if exists project_skills_public_read on public.project_skills;
create policy project_skills_public_read
on public.project_skills
for select
to anon, authenticated
using (auth.role() in ('anon', 'authenticated'));

drop policy if exists post_tags_public_read on public.post_tags;
create policy post_tags_public_read
on public.post_tags
for select
to anon, authenticated
using (auth.role() in ('anon', 'authenticated'));

-- 3) Contact form submit policy
drop policy if exists contact_messages_public_insert on public.contact_messages;
create policy contact_messages_public_insert
on public.contact_messages
for insert
to anon, authenticated
with check (
	auth.role() in ('anon', 'authenticated')
	and length(trim(name)) > 0
	and length(trim(email)) > 0
	and length(trim(subject)) > 0
	and length(trim(message)) > 0
);

-- Note:
-- - No select/update/delete policy is created for admin/contact_messages.
-- - service_role bypasses RLS in Supabase and can still do backend operations.

commit;
