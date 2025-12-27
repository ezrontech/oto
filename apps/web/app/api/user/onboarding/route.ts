import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const onboardingData = await request.json()
    console.log('Onboarding completion attempt:', { userId: user.id, hasData: !!onboardingData })
    
    // Try to update user profile with onboarding data
    try {
      console.log('Updating onboarding for user:', user.id);
      
      const { data, error } = await supabase
        .from('users')
        .update({
          onboarding_completed: true,
          onboarding_data: onboardingData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single()

      console.log('Database update result:', { 
        success: !error, 
        error: error?.message, 
        data: !!data,
        userId: user.id 
      })

      if (error) {
        if (error.message?.includes('column') || error.message?.includes('does not exist')) {
          console.error('Onboarding columns not found in database - PLEASE RUN MIGRATION')
          return NextResponse.json({ 
            error: 'Database columns missing',
            warning: 'Please run the database migration to add onboarding fields'
          }, { status: 400 })
        }
        throw error
      }

      console.log('Onboarding completed successfully for user:', user.id)
      return NextResponse.json({ data })
    } catch (updateError: any) {
      console.error('Error updating onboarding:', updateError)
      return NextResponse.json({ 
        error: 'Failed to update database',
        details: updateError.message
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in onboarding API:', error)
    return NextResponse.json({ error: 'Failed to save onboarding' }, { status: 500 })
  }
}
