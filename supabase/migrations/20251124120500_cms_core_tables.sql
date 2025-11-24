-- CMS Core Tables Migration
-- Creates foundational tables for the headless page builder

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Pages table ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_pages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('draft','published','scheduled','archived')),
  locale text NOT NULL DEFAULT 'en',
  store_target text NOT NULL DEFAULT 'all' CHECK (store_target IN ('tech','lifestyle','all')),
  template text NOT NULL DEFAULT 'full-width',
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  theme_overrides jsonb,
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public','authenticated','role')),
  access_roles text[],
  published_at timestamptz,
  scheduled_at timestamptz,
  unpublish_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cms_pages_slug ON public.cms_pages(slug);
CREATE INDEX IF NOT EXISTS idx_cms_pages_status ON public.cms_pages(status);
CREATE INDEX IF NOT EXISTS idx_cms_pages_store ON public.cms_pages(store_target);
CREATE INDEX IF NOT EXISTS idx_cms_pages_locale ON public.cms_pages(locale);

-- Block library -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_blocks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  type text NOT NULL,
  category text NOT NULL DEFAULT 'content',
  schema jsonb NOT NULL,
  default_props jsonb NOT NULL,
  preview_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Themes --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_themes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  tokens jsonb NOT NULL,
  applies_to text[] DEFAULT ARRAY['all'],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Menus ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_menus (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  store_target text NOT NULL DEFAULT 'all' CHECK (store_target IN ('tech','lifestyle','all')),
  locale text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Media metadata ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_media (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename text NOT NULL,
  mime_type text NOT NULL,
  url text NOT NULL,
  cdn_url text,
  size_bytes bigint,
  width integer,
  height integer,
  tags text[],
  alt_text text,
  meta jsonb,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- AI configs ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_ai_configs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  primary_provider text NOT NULL DEFAULT 'none',
  backup_provider text NOT NULL DEFAULT 'none',
  threshold_type text NOT NULL DEFAULT 'daily' CHECK (threshold_type IN ('daily','monthly','rate')),
  threshold_value integer NOT NULL DEFAULT 1000,
  use_backup_when text NOT NULL DEFAULT 'onThreshold' CHECK (use_backup_when IN ('onError','onThreshold','manual')),
  enabled_features jsonb NOT NULL DEFAULT jsonb_build_object(
    'seo', true,
    'description', true,
    'hero', true,
    'lottie', false,
    'autotag', true
  ),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Secrets stored separately to avoid exposing keys directly
CREATE TABLE IF NOT EXISTS public.cms_ai_secrets (
  config_id uuid PRIMARY KEY REFERENCES public.cms_ai_configs(id) ON DELETE CASCADE,
  primary_key_encrypted text,
  backup_key_encrypted text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Revisions -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_revisions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_cms_revisions_page ON public.cms_revisions(page_id);

-- Permissions / Roles -------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  policies jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.cms_user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES public.cms_roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);

-- Audit log -----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cms_audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity text NOT NULL,
  entity_id uuid,
  action text NOT NULL,
  payload jsonb,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Triggers to keep updated_at current ---------------------------------------
CREATE OR REPLACE FUNCTION public.cms_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_cms_pages_updated
BEFORE UPDATE ON public.cms_pages
FOR EACH ROW EXECUTE PROCEDURE public.cms_set_updated_at();

CREATE TRIGGER trg_cms_blocks_updated
BEFORE UPDATE ON public.cms_blocks
FOR EACH ROW EXECUTE PROCEDURE public.cms_set_updated_at();

CREATE TRIGGER trg_cms_themes_updated
BEFORE UPDATE ON public.cms_themes
FOR EACH ROW EXECUTE PROCEDURE public.cms_set_updated_at();

CREATE TRIGGER trg_cms_menus_updated
BEFORE UPDATE ON public.cms_menus
FOR EACH ROW EXECUTE PROCEDURE public.cms_set_updated_at();

CREATE TRIGGER trg_cms_ai_configs_updated
BEFORE UPDATE ON public.cms_ai_configs
FOR EACH ROW EXECUTE PROCEDURE public.cms_set_updated_at();

CREATE TRIGGER trg_cms_roles_updated
BEFORE UPDATE ON public.cms_roles
FOR EACH ROW EXECUTE PROCEDURE public.cms_set_updated_at();

