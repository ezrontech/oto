-- Migration: 20251228_functional_redesign
-- Description: Implement plan tiers, space refactor, and article distribution system.

BEGIN;

-- 1. CLEANUP LEGACY TABLES --
DROP TABLE IF EXISTS public.subscribers CASCADE;
DROP TABLE IF EXISTS public.newsletters CASCADE;

-- 2. UPDATE USERS TABLE --
-- Update plan constraint
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_plan_check;
ALTER TABLE public.users ALTER COLUMN plan SET DEFAULT 'Community';
ALTER TABLE public.users ADD CONSTRAINT users_plan_check CHECK (plan IN ('Community', 'Team', 'Agency'));

-- 3. UPDATE SPACES TABLE --
-- Update type constraint and backfill 'Club' to 'Room'
UPDATE public.spaces SET type = 'Room' WHERE type = 'Club';
ALTER TABLE public.spaces DROP CONSTRAINT IF EXISTS spaces_type_check;
ALTER TABLE public.spaces ADD CONSTRAINT spaces_type_check CHECK (type IN ('Team', 'Community', 'Room'));

-- Add visibility and other metadata
ALTER TABLE public.spaces ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public'));

-- 4. NEW TABLES: SPACES & PERMISSIONS --

-- Space Members
CREATE TABLE IF NOT EXISTS public.space_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(space_id, user_id)
);

-- Backfill existing space owners as 'owner'
INSERT INTO public.space_members (space_id, user_id, role)
SELECT id, user_id, 'owner' FROM public.spaces
ON CONFLICT DO NOTHING;

-- Space Tools
CREATE TABLE IF NOT EXISTS public.space_tools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  config JSONB,
  UNIQUE(space_id, tool_id)
);

-- 5. NEW TABLES: ARTICLES & MAILING LISTS --

-- Mailing Lists
CREATE TABLE IF NOT EXISTS public.mailing_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES public.mailing_lists(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(list_id, email)
);

-- Article Distributions
CREATE TABLE IF NOT EXISTS public.article_distributions (
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  list_id UUID REFERENCES public.mailing_lists(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (article_id, list_id)
);

-- 6. ROW LEVEL SECURITY (RLS) --

-- Enable RLS on new tables
ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailing_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_distributions ENABLE ROW LEVEL SECURITY;

-- Space Permissions RLS
DROP POLICY IF EXISTS "Users can view own spaces" ON public.spaces;
CREATE POLICY "Members can view space" ON public.spaces
  FOR SELECT USING (
    visibility = 'public' OR
    EXISTS (SELECT 1 FROM public.space_members WHERE space_id = id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can manage own spaces" ON public.spaces;
CREATE POLICY "Owners can manage space" ON public.spaces
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.space_members WHERE space_id = id AND user_id = auth.uid() AND role = 'owner')
  );

-- Plan Gating Policy
CREATE POLICY "Enforce Plan for Team Spaces" ON public.spaces
  FOR INSERT WITH CHECK (
    (type != 'Team') OR 
    (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND plan IN ('Team', 'Agency')))
  );

-- Space Members RLS
CREATE POLICY "Members can view space membership" ON public.space_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.space_members WHERE space_id = space_members.space_id AND user_id = auth.uid())
  );

-- Mailing Lists RLS
CREATE POLICY "Users can manage own mailing lists" ON public.mailing_lists
  FOR ALL USING (auth.uid() = user_id);

-- Subscribers RLS
CREATE POLICY "Users can manage own subscribers" ON public.subscribers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mailing_lists WHERE id = list_id AND user_id = auth.uid())
  );

COMMIT;
