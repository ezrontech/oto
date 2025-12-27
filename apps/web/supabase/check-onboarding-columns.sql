-- Test script to check if onboarding columns exist
-- Run this in Supabase SQL Editor to check your database

-- Check if onboarding_completed column exists
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
    AND table_schema = 'public'
    AND column_name IN ('onboarding_completed', 'onboarding_data')
ORDER BY column_name;

-- If no results returned, you need to run the migration:
-- ALTER TABLE public.users 
-- ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
-- ADD COLUMN IF NOT EXISTS onboarding_data JSONB;
