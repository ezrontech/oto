import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Fetching agents for user:', user.id);

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    console.log('Agents query result:', { data: data?.length || 0, error: error?.message });

    if (error) {
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        console.error('Agents table does not exist - PLEASE RUN DATABASE SCHEMA');
        return NextResponse.json({ 
          error: 'Database table missing',
          details: 'Please run the database schema migration to create the agents table'
        }, { status: 500 })
      }
      throw error
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('Error fetching agents:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch agents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

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

    const agentData = await request.json()
    
    const { data, error } = await supabase
      .from('agents')
      .insert({
        ...agentData,
        user_id: user.id
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error creating agent:', error)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}
