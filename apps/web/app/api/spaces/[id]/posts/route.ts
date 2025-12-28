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
        const status = searchParams.get('status') || 'published'
        const limit = parseInt(searchParams.get('limit') || '20')

        const { data, error } = await supabase
            .from('posts')
            .select('*, users(id, name, email)')
            .eq('space_id', spaceId)
            .eq('status', status)
            .order('published_at', { ascending: false })
            .limit(limit)

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('Error fetching posts:', error)
        return NextResponse.json({
            error: 'Failed to fetch posts',
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
        const { title, content, media, status, scheduled_at } = body

        // Verify user has creator role (owner or content_creator)
        const { data: userRole } = await supabase
            .from('space_roles')
            .select('role')
            .eq('space_id', spaceId)
            .eq('user_id', user.id)
            .single()

        if (!userRole || !['owner', 'content_creator'].includes(userRole.role)) {
            return NextResponse.json({
                error: 'Forbidden - Only creators can post in Community Spaces'
            }, { status: 403 })
        }

        // Create post
        const postData: any = {
            space_id: spaceId,
            author_id: user.id,
            title,
            content,
            media: media || [],
            status: status || 'published'
        }

        if (status === 'scheduled' && scheduled_at) {
            postData.scheduled_at = scheduled_at
        } else if (status === 'published') {
            postData.published_at = new Date().toISOString()
        }

        const { data, error } = await supabase
            .from('posts')
            .insert(postData)
            .select('*, users(id, name, email)')
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('Error creating post:', error)
        return NextResponse.json({
            error: 'Failed to create post',
            details: error.message
        }, { status: 500 })
    }
}
