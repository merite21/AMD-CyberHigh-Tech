-- ============================================================
-- AMD CyberHigh Tech — Script de configuration Supabase
-- ============================================================
-- À exécuter dans : Supabase Dashboard > SQL Editor > New query
-- (sur VOTRE propre projet Supabase, pas un projet existant d'un autre client)
--
-- Ce script crée 3 tables (messages de contact, demandes de devis,
-- candidatures) ainsi qu'un espace de stockage pour les CV, avec des
-- politiques de sécurité (Row Level Security) qui n'autorisent QUE
-- l'insertion depuis le site public — personne ne peut lire, modifier
-- ou supprimer les données via l'API publique. Vous consultez tout
-- depuis le Table Editor / Storage du Dashboard, avec votre propre compte.
-- ============================================================

-- 1. Messages du formulaire de contact (contact.html)
create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  service text,
  message text not null
);

alter table contact_messages enable row level security;

create policy "Autoriser l'insertion publique"
  on contact_messages
  for insert
  to anon
  with check (true);

-- 2. Demandes de devis payantes (quote.html, après paiement Kkiapay)
create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text,
  company text,
  email text,
  phone text,
  service text,
  budget text,
  description text,
  payment_transaction_id text
);

alter table quote_requests enable row level security;

create policy "Autoriser l'insertion publique"
  on quote_requests
  for insert
  to anon
  with check (true);

-- 3. Candidatures (careers.html)
create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  position text,
  message text,
  cv_path text
);

alter table job_applications enable row level security;

create policy "Autoriser l'insertion publique"
  on job_applications
  for insert
  to anon
  with check (true);

-- 4. Espace de stockage pour les CV (privé — non listable publiquement)
insert into storage.buckets (id, name, public)
values ('job-applications-cv', 'job-applications-cv', false)
on conflict (id) do nothing;

create policy "Autoriser l'upload public des CV"
  on storage.objects
  for insert
  to anon
  with check (bucket_id = 'job-applications-cv');

-- ============================================================
-- Fin du script. Une fois exécuté :
--   - Table Editor > contact_messages / quote_requests / job_applications
--     pour consulter les messages, devis et candidatures reçus.
--   - Storage > job-applications-cv pour télécharger les CV envoyés.
-- ============================================================
