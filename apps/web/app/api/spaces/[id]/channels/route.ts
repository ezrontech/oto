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

        // Get all channels for this space
        const { data, error } = await supabase
            .from('channels')
            .select('*')
            .eq('space_id', spaceId)
            .order('created_at', { ascending: true })

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('Error fetching channels:', error)
        return NextResponse.json({
            error: 'Failed to fetch channels',
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
        const { name, description, is_private } = body

        // Verify requester is owner or admin
        const { data: requesterRole } = await supabase
            .from('space_roles')
            .select('role')
            .eq('space_id', spaceId)
            .eq('user_id', user.id)
            .single()

        if (!requesterRole || !['owner', 'admin'].includes(requesterRole.role)) {
            return NextResponse.json({
                error: 'Forbidden - Only owners and admins can create channels'
            }, { status: 403 })
        }

        // Create channel
        const { data, error } = await supabase
            .from('channels')
            .insert({
                space_id: spaceId,
                name,
                description,
                is_private: is_private || false
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('Error creating channel:', error)
        return NextResponse.json({
            error: 'Failed to create channel',
            details: error.message
        }, { status: 500 })
    }
}
