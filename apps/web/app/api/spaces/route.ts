import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.split(' ')[1]

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: authHeader || '' } }
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('spaces')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error: any) {
    console.error('Error fetching spaces:', error)
    return NextResponse.json({
      error: 'Failed to fetch spaces',
      details: error.message || error.details || error,
      hint: error.hint
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.split(' ')[1]

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: authHeader || '' } }
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser(token)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user profile to check plan (still helpful even if gating is relaxed)
    const { data: profile } = await supabase
      .from('users')
      .select('plan')
      .eq('id', user.id)
      .single()

    const spaceData = await request.json()

    // Plan validation removed per user request: Everyone can create Team spaces

    // Set defaults
    const visibility = spaceData.type === 'Community' ? 'public' : 'private'

    // Insert space
    const { data: space, error: spaceError } = await supabase
      .from('spaces')
      .insert({
        ...spaceData,
        visibility: spaceData.visibility || visibility,
        user_id: user.id
      })
      .select()
      .single()

    if (spaceError) throw spaceError

    // Add creator as owner in space_members
    const { error: memberError } = await supabase
      .from('space_members')
      .insert({
        space_id: space.id,
        user_id: user.id,
        role: 'owner'
      })

    if (memberError) {
      console.error('Failed to add creator as member:', memberError)
    }

    return NextResponse.json({ data: space })
  } catch (error: any) {
    const errorDetails = {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    }
    console.error('Error creating space:', errorDetails)
    return NextResponse.json({
      error: 'Failed to create space',
      ...errorDetails
    }, { status: 500 })
  }
}
