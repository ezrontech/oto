-- Migration: Add onboarding fields to users table
-- Run this in Supabase SQL editor to update existing tables

-- Add onboarding columns to users table if they don't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_data JSONB;

-- Update existing users to have onboarding_completed = false by default
UPDATE public.users 
SET onboarding_completed = FALSE 
WHERE onboarding_completed IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.users.onboarding_completed IS 'Whether user has completed onboarding flow';
COMMENT ON COLUMN public.users.onboarding_data IS 'JSON data from onboarding flow';
