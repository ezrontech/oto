-- Oto Database Schema
-- Create all tables with proper constraints and indexes

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  plan TEXT DEFAULT 'Community' CHECK (plan IN ('Community', 'Creator', 'Campaign')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agents table
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT 'AI',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'idle', 'offline')),
  tone TEXT,
  system_prompt TEXT,
  allowed_tools TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Spaces table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='spaces' AND column_name='visibility') THEN
    ALTER TABLE public.spaces ADD COLUMN visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='spaces' AND column_name='member_count') THEN
    ALTER TABLE public.spaces ADD COLUMN member_count INTEGER DEFAULT 0;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.spaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Team', 'Community', 'Room')),
  description TEXT NOT NULL,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  member_count INTEGER DEFAULT 0,
  settings JSONB DEFAULT '{}',
  enabled_tools TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'lead' CHECK (status IN ('lead', 'customer', 'client')),
  company TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Space Members table
CREATE TABLE IF NOT EXISTS public.space_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(space_id, user_id)
);

-- Space Tools table
CREATE TABLE IF NOT EXISTS public.space_tools (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  config JSONB,
  UNIQUE(space_id, tool_id)
);

-- Mailing Lists table
CREATE TABLE IF NOT EXISTS public.mailing_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subscribers' AND column_name='newsletter_id') THEN
    ALTER TABLE public.subscribers RENAME COLUMN newsletter_id TO list_id;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES public.mailing_lists(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(list_id, email)
);

-- Article Distributions table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='article_distributions' AND column_name='newsletter_id') THEN
    ALTER TABLE public.article_distributions RENAME COLUMN newsletter_id TO list_id;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.article_distributions (
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  list_id UUID REFERENCES public.mailing_lists(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (article_id, list_id)
);

-- Knowledge documents table
CREATE TABLE IF NOT EXISTS public.knowledge_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User AI Keys table
CREATE TABLE IF NOT EXISTS public.user_ai_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL, -- 'openai', 'anthropic', etc.
  api_key TEXT NOT NULL,
  model_name TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Workspace Tasks table
CREATE TABLE IF NOT EXISTS public.workspace_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'backlog')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMP WITH TIME ZONE,
  assignee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace Goals table
CREATE TABLE IF NOT EXISTS public.workspace_goals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  target_date TIMESTAMP WITH TIME ZONE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'on_track' CHECK (status IN ('on_track', 'at_risk', 'behind', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspace Events table
CREATE TABLE IF NOT EXISTS public.workspace_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  organizer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Space Roles table (role-based permissions)
CREATE TABLE IF NOT EXISTS public.space_roles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'moderator', 'member', 'guest', 'content_creator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(space_id, user_id)
);

-- Channels table (for Team Spaces)
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (unified for all space types)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.messages(id) ON DELETE CASCADE,
  attachments JSONB DEFAULT '[]',
  mentions JSONB DEFAULT '[]',
  reactions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (for Community Spaces)
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  media JSONB DEFAULT '[]',
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  reactions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table (for posts and articles)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  reactions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (post_id IS NOT NULL OR article_id IS NOT NULL)
);

-- Mailing Lists table
CREATE TABLE IF NOT EXISTS public.mailing_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscribers table (non-Oto users)
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES public.mailing_lists(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(list_id, email)
);

-- Article-Mailing List junction
CREATE TABLE IF NOT EXISTS public.article_distributions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  list_id UUID REFERENCES public.mailing_lists(id) ON DELETE CASCADE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, list_id)
);

-- AI Provider abstraction
CREATE TABLE IF NOT EXISTS public.ai_providers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('openai', 'anthropic', 'local', 'custom', 'hosted')),
  config JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_spaces_user_id ON public.spaces(user_id);
CREATE INDEX IF NOT EXISTS idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_agent_id ON public.conversations(agent_id);
CREATE INDEX IF NOT EXISTS idx_articles_user_id ON public.articles(user_id);
CREATE INDEX IF NOT EXISTS idx_space_members_space_id ON public.space_members(space_id);
CREATE INDEX IF NOT EXISTS idx_space_members_user_id ON public.space_members(user_id);
CREATE INDEX IF NOT EXISTS idx_mailing_lists_user_id ON public.mailing_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_list_id ON public.subscribers(list_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_documents_user_id ON public.knowledge_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON public.analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_name ON public.analytics(metric_name);

-- Helper functions for RLS to avoid recursion
-- These functions are SECURITY DEFINER to bypass RLS when checking for relationships
CREATE OR REPLACE FUNCTION public.check_is_member(space_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.space_members
    WHERE space_id = space_id_param
    AND user_id = user_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.check_is_owner(space_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.spaces
    WHERE id = space_id_param
    AND user_id = user_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Updated_at triggers
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_users_updated_at ON public.users;
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_agents_updated_at ON public.agents;
CREATE TRIGGER handle_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_spaces_updated_at ON public.spaces;
CREATE TRIGGER handle_spaces_updated_at
  BEFORE UPDATE ON public.spaces
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_contacts_updated_at ON public.contacts;
CREATE TRIGGER handle_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_conversations_updated_at ON public.conversations;
CREATE TRIGGER handle_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_articles_updated_at ON public.articles;
CREATE TRIGGER handle_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_knowledge_documents_updated_at ON public.knowledge_documents;
CREATE TRIGGER handle_knowledge_documents_updated_at
  BEFORE UPDATE ON public.knowledge_documents
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_user_ai_keys_updated_at ON public.user_ai_keys;
CREATE TRIGGER handle_user_ai_keys_updated_at
  BEFORE UPDATE ON public.user_ai_keys
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_workspace_tasks_updated_at ON public.workspace_tasks;
CREATE TRIGGER handle_workspace_tasks_updated_at
  BEFORE UPDATE ON public.workspace_tasks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_workspace_goals_updated_at ON public.workspace_goals;
CREATE TRIGGER handle_workspace_goals_updated_at
  BEFORE UPDATE ON public.workspace_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS handle_workspace_events_updated_at ON public.workspace_events;
CREATE TRIGGER handle_workspace_events_updated_at
  BEFORE UPDATE ON public.workspace_events
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.space_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mailing_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own data
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Agents policies
DROP POLICY IF EXISTS "Users can view own agents" ON public.agents;
CREATE POLICY "Users can view own agents" ON public.agents
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own agents" ON public.agents;
CREATE POLICY "Users can manage own agents" ON public.agents
  FOR ALL USING (auth.uid() = user_id);

-- Spaces policies
DROP POLICY IF EXISTS "Members can view space" ON public.spaces;
CREATE POLICY "Members can view space" ON public.spaces
  FOR SELECT USING (
    visibility = 'public' OR
    user_id = auth.uid() OR
    public.check_is_member(id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can create spaces" ON public.spaces;
CREATE POLICY "Users can create spaces" ON public.spaces
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Owners can manage space" ON public.spaces;
CREATE POLICY "Owners can manage space" ON public.spaces
  FOR ALL USING (user_id = auth.uid()); 

-- Space Members policies
DROP POLICY IF EXISTS "Members can view space membership" ON public.space_members;
CREATE POLICY "Members can view space membership" ON public.space_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    public.check_is_member(space_id, auth.uid()) OR
    public.check_is_owner(space_id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can join spaces" ON public.space_members;
CREATE POLICY "Users can join spaces" ON public.space_members
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    public.check_is_owner(space_id, auth.uid())
  );

DROP POLICY IF EXISTS "Owners can manage members" ON public.space_members;
CREATE POLICY "Owners can manage members" ON public.space_members
  FOR ALL USING (
    public.check_is_owner(space_id, auth.uid())
  );

-- Mailing Lists policies
DROP POLICY IF EXISTS "Users can manage own mailing lists" ON public.mailing_lists;
CREATE POLICY "Users can manage own mailing lists" ON public.mailing_lists
  FOR ALL USING (auth.uid() = user_id);

-- Subscribers policies
DROP POLICY IF EXISTS "Users can manage own subscribers" ON public.subscribers;
CREATE POLICY "Users can manage own subscribers" ON public.subscribers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mailing_lists WHERE id = list_id AND user_id = auth.uid())
  );

-- Contacts policies
DROP POLICY IF EXISTS "Users can view own contacts" ON public.contacts;
CREATE POLICY "Users can view own contacts" ON public.contacts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own contacts" ON public.contacts;
CREATE POLICY "Users can manage own contacts" ON public.contacts
  FOR ALL USING (auth.uid() = user_id);

-- Conversations policies
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own conversations" ON public.conversations;
CREATE POLICY "Users can manage own conversations" ON public.conversations
  FOR ALL USING (auth.uid() = user_id);

-- Articles policies
DROP POLICY IF EXISTS "Users can view own articles" ON public.articles;
CREATE POLICY "Users can view own articles" ON public.articles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own articles" ON public.articles;
CREATE POLICY "Users can manage own articles" ON public.articles
  FOR ALL USING (auth.uid() = user_id);

-- Article Distributions policies
DROP POLICY IF EXISTS "Users can view article distributions" ON public.article_distributions;
CREATE POLICY "Users can view article distributions" ON public.article_distributions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.articles WHERE id = article_id AND user_id = auth.uid())
  );

-- Knowledge documents policies
DROP POLICY IF EXISTS "Users can view own knowledge documents" ON public.knowledge_documents;
CREATE POLICY "Users can view own knowledge documents" ON public.knowledge_documents
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own knowledge documents" ON public.knowledge_documents;
CREATE POLICY "Users can manage own knowledge documents" ON public.knowledge_documents
  FOR ALL USING (auth.uid() = user_id);

-- User AI Keys policies
ALTER TABLE public.user_ai_keys ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own AI keys" ON public.user_ai_keys;
CREATE POLICY "Users can manage own AI keys" ON public.user_ai_keys
  FOR ALL USING (auth.uid() = user_id);

-- Workspace Tools policies (Tasks, Goals, Events)
ALTER TABLE public.workspace_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view tasks" ON public.workspace_tasks;
CREATE POLICY "Members can view tasks" ON public.workspace_tasks
  FOR SELECT USING (public.check_is_member(space_id, auth.uid()) OR public.check_is_owner(space_id, auth.uid()));

DROP POLICY IF EXISTS "Members can manage tasks" ON public.workspace_tasks;
CREATE POLICY "Members can manage tasks" ON public.workspace_tasks
  FOR ALL USING (public.check_is_member(space_id, auth.uid()) OR public.check_is_owner(space_id, auth.uid()));

DROP POLICY IF EXISTS "Members can view goals" ON public.workspace_goals;
CREATE POLICY "Members can view goals" ON public.workspace_goals
  FOR SELECT USING (public.check_is_member(space_id, auth.uid()) OR public.check_is_owner(space_id, auth.uid()));

DROP POLICY IF EXISTS "Members can manage goals" ON public.workspace_goals;
CREATE POLICY "Members can manage goals" ON public.workspace_goals
  FOR ALL USING (public.check_is_member(space_id, auth.uid()) OR public.check_is_owner(space_id, auth.uid()));

DROP POLICY IF EXISTS "Members can view events" ON public.workspace_events;
CREATE POLICY "Members can view events" ON public.workspace_events
  FOR SELECT USING (public.check_is_member(space_id, auth.uid()) OR public.check_is_owner(space_id, auth.uid()));

DROP POLICY IF EXISTS "Members can manage events" ON public.workspace_events;
CREATE POLICY "Members can manage events" ON public.workspace_events
  FOR ALL USING (public.check_is_member(space_id, auth.uid()) OR public.check_is_owner(space_id, auth.uid()));

-- Analytics policies
DROP POLICY IF EXISTS "Users can view own analytics" ON public.analytics;
CREATE POLICY "Users can view own analytics" ON public.analytics
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own analytics" ON public.analytics;
CREATE POLICY "Users can insert own analytics" ON public.analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES FOR SPACES SYSTEM
-- ============================================================================

-- Space Roles RLS
ALTER TABLE public.space_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view roles in their spaces" ON public.space_roles;
CREATE POLICY "Users can view roles in their spaces" ON public.space_roles
  FOR SELECT USING (
    space_id IN (
      SELECT space_id FROM public.space_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners and admins can manage roles" ON public.space_roles;
CREATE POLICY "Owners and admins can manage roles" ON public.space_roles
  FOR ALL USING (
    space_id IN (
      SELECT space_id FROM public.space_roles 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Channels RLS
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view channels" ON public.channels;
CREATE POLICY "Members can view channels" ON public.channels
  FOR SELECT USING (
    space_id IN (
      SELECT space_id FROM public.space_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can manage channels" ON public.channels;
CREATE POLICY "Admins can manage channels" ON public.channels
  FOR ALL USING (
    space_id IN (
      SELECT space_id FROM public.space_roles 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Messages RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view messages" ON public.messages;
CREATE POLICY "Members can view messages" ON public.messages
  FOR SELECT USING (
    space_id IN (
      SELECT space_id FROM public.space_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can create messages" ON public.messages;
CREATE POLICY "Members can create messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    space_id IN (
      SELECT space_id FROM public.space_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own messages" ON public.messages;
CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = user_id);

-- Posts RLS (Community Spaces - restricted posting)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone in space can view posts" ON public.posts;
CREATE POLICY "Anyone in space can view posts" ON public.posts
  FOR SELECT USING (
    space_id IN (
      SELECT space_id FROM public.space_members WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Only creators can create posts" ON public.posts;
CREATE POLICY "Only creators can create posts" ON public.posts
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    space_id IN (
      SELECT space_id FROM public.space_roles 
      WHERE user_id = auth.uid() AND role IN ('owner', 'content_creator')
    )
  );

DROP POLICY IF EXISTS "Authors can update own posts" ON public.posts;
CREATE POLICY "Authors can update own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = author_id);

-- Comments RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view comments" ON public.comments;
CREATE POLICY "Members can view comments" ON public.comments
  FOR SELECT USING (
    (post_id IN (
      SELECT id FROM public.posts WHERE space_id IN (
        SELECT space_id FROM public.space_members WHERE user_id = auth.uid()
      )
    )) OR
    (article_id IS NOT NULL)
  );

DROP POLICY IF EXISTS "Members can create comments" ON public.comments;
CREATE POLICY "Members can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON public.comments;
CREATE POLICY "Users can update own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

-- Mailing Lists RLS
ALTER TABLE public.mailing_lists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own lists" ON public.mailing_lists;
CREATE POLICY "Users can manage own lists" ON public.mailing_lists
  FOR ALL USING (auth.uid() = user_id);

-- Subscribers RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "List owners can manage subscribers" ON public.subscribers;
CREATE POLICY "List owners can manage subscribers" ON public.subscribers
  FOR ALL USING (
    list_id IN (
      SELECT id FROM public.mailing_lists WHERE user_id = auth.uid()
    )
  );

-- Article Distributions RLS
ALTER TABLE public.article_distributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Article owners can manage distributions" ON public.article_distributions;
CREATE POLICY "Article owners can manage distributions" ON public.article_distributions
  FOR ALL USING (
    article_id IN (
      SELECT id FROM public.articles WHERE user_id = auth.uid()
    )
  );

-- AI Providers RLS
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own providers" ON public.ai_providers;
CREATE POLICY "Users can manage own providers" ON public.ai_providers
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================

-- Channels trigger
DROP TRIGGER IF EXISTS handle_channels_updated_at ON public.channels;
CREATE TRIGGER handle_channels_updated_at
  BEFORE UPDATE ON public.channels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Messages trigger
DROP TRIGGER IF EXISTS handle_messages_updated_at ON public.messages;
CREATE TRIGGER handle_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Posts trigger
DROP TRIGGER IF EXISTS handle_posts_updated_at ON public.posts;
CREATE TRIGGER handle_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Comments trigger
DROP TRIGGER IF EXISTS handle_comments_updated_at ON public.comments;
CREATE TRIGGER handle_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Mailing Lists trigger
DROP TRIGGER IF EXISTS handle_mailing_lists_updated_at ON public.mailing_lists;
CREATE TRIGGER handle_mailing_lists_updated_at
  BEFORE UPDATE ON public.mailing_lists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- AI Providers trigger
DROP TRIGGER IF EXISTS handle_ai_providers_updated_at ON public.ai_providers;
CREATE TRIGGER handle_ai_providers_updated_at
  BEFORE UPDATE ON public.ai_providers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
