-- Test script to check if tables exist and have data
-- Run this in Supabase SQL Editor

-- Check if tables exist
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'agents', 'spaces', 'contacts', 'conversations')
ORDER BY table_name;

-- Check if there's any data in the tables
SELECT 'users' as table_name, COUNT(*) as record_count FROM public.users
UNION ALL
SELECT 'agents' as table_name, COUNT(*) as record_count FROM public.agents
UNION ALL  
SELECT 'spaces' as table_name, COUNT(*) as record_count FROM public.spaces
UNION ALL
SELECT 'contacts' as table_name, COUNT(*) as record_count FROM public.contacts
UNION ALL
SELECT 'conversations' as table_name, COUNT(*) as record_count FROM public.conversations
ORDER BY table_name;
