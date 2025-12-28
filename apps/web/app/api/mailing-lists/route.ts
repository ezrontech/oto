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
            .from('mailing_lists')
            .select('*, subscribers:subscribers(count)')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Error fetching mailing lists:', error)
        return NextResponse.json({ error: 'Failed to fetch mailing lists' }, { status: 500 })
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

        const listData = await request.json()

        const { data, error } = await supabase
            .from('mailing_lists')
            .insert({
                ...listData,
                user_id: user.id
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error) {
        console.error('Error creating mailing list:', error)
        return NextResponse.json({ error: 'Failed to create mailing list' }, { status: 500 })
    }
}
