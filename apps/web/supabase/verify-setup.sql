-- Test script to verify database setup
-- Run this in Supabase SQL Editor

-- Check if onboarding fields were added to users table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
    AND column_name IN ('onboarding_completed', 'onboarding_data')
ORDER BY column_name;

-- Check if there's any data
SELECT 'users' as table_name, COUNT(*) as record_count FROM public.users
UNION ALL
SELECT 'agents' as table_name, COUNT(*) as record_count FROM public.agents
UNION ALL  
SELECT 'spaces' as table_name, COUNT(*) as record_count FROM public.spaces
UNION ALL
SELECT 'contacts' as table_name, COUNT(*) as record_count FROM public.contacts
UNION ALL
SELECT 'conversations' as table_name, COUNT(*) as record_count FROM public.conversations
UNION ALL
SELECT 'knowledge' as table_name, COUNT(*) as record_count FROM public.knowledge
ORDER BY table_name;

-- Check your user's onboarding status
SELECT id, email, onboarding_completed, onboarding_data 
FROM public.users 
WHERE email = 'shamouycodes@gmail.com';  -- Replace with your email
