import { createClient } from '@supabase/supabase-js'

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function runMigration() {
  try {
    console.log('Running onboarding migration...')
    
    // Add onboarding columns to users table if they don't exist
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.users 
        ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS onboarding_data JSONB;
      `
    })
    
    if (alterError) {
      console.error('Error adding columns:', alterError)
      // Try alternative approach
      console.log('Trying alternative approach...')
      
      // Check if columns exist first
      const { data: columns } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'users')
        .eq('table_schema', 'public')
        .in('column_name', ['onboarding_completed', 'onboarding_data'])
      
      if (!columns || columns.length < 2) {
        console.log('Columns need to be added. Please run the SQL manually in Supabase dashboard.')
        console.log(`
-- Run this in Supabase SQL Editor:
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS onboarding_data JSONB;

UPDATE public.users 
SET onboarding_completed = FALSE 
WHERE onboarding_completed IS NULL;
        `)
      } else {
        console.log('Columns already exist')
      }
    }
    
    // Update existing users to have onboarding_completed = false by default
    const { error: updateError } = await supabase
      .from('users')
      .update({ onboarding_completed: false })
      .is('onboarding_completed', null)
    
    if (updateError) {
      console.error('Error updating users:', updateError)
    } else {
      console.log('Migration completed successfully!')
    }
    
  } catch (error) {
    console.error('Migration failed:', error)
    console.log('Please run the SQL manually in Supabase dashboard.')
  }
}

runMigration()
