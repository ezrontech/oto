import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const spaceId = params.id
        const { searchParams } = new URL(request.url)
        const channelId = searchParams.get('channel_id')
        const limit = parseInt(searchParams.get('limit') || '50')

        let query = supabase
            .from('messages')
            .select('*, users(id, name, email)')
            .eq('space_id', spaceId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (channelId) {
            query = query.eq('channel_id', channelId)
        }

        const { data, error } = await query

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('Error fetching messages:', error)
        return NextResponse.json({
            error: 'Failed to fetch messages',
            details: error.message
        }, { status: 500 })
    }
}

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
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

        const spaceId = params.id
        const body = await request.json()
        const { content, channel_id, parent_id, mentions, attachments } = body

        // Create message
        const { data, error } = await supabase
            .from('messages')
            .insert({
                space_id: spaceId,
                channel_id,
                user_id: user.id,
                content,
                parent_id,
                mentions: mentions || [],
                attachments: attachments || []
            })
            .select('*, users(id, name, email)')
            .single()

        if (error) throw error

        // Check for @Oto mentions and trigger AI response (future implementation)
        const hasOtoMention = mentions?.some((m: any) => m.type === 'oto')
        if (hasOtoMention) {
            // TODO: Trigger Oto AI response via provider abstraction
            console.log('Oto mentioned - AI response needed')
        }

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('Error creating message:', error)
        return NextResponse.json({
            error: 'Failed to create message',
            details: error.message
        }, { status: 500 })
    }
}
