import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Auth callback result:', { error: error?.message })
    
    if (!error) {
      // Redirect to root and let auth provider handle navigation based on onboarding status
      return NextResponse.redirect(`${origin}/`)
    } else {
      console.error('Auth callback error:', error)
    }
  }

  // return the user to login page on error
  return NextResponse.redirect(`${origin}/auth/login`)
}
