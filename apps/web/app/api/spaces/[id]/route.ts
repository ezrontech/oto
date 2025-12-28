import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
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

        // Fetch space details
        const { data: space, error: spaceError } = await supabase
            .from('spaces')
            .select(`
        *,
        space_members (
          id,
          user_id,
          role,
          users (
            name,
            email,
            avatar_url
          )
        )
      `)
            .eq('id', id)
            .single()

        if (spaceError) throw spaceError

        // Check if user is a member or if the space is public
        const isMember = space.space_members.some((m: any) => m.user_id === user.id)
        const isPublic = space.visibility === 'public'

        if (!isMember && !isPublic) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        return NextResponse.json({ data: space })
    } catch (error: any) {
        console.error('Error fetching space:', error)
        return NextResponse.json({
            error: 'Failed to fetch space',
            details: error.message || error,
            code: error.code
        }, { status: 500 })
    }
}
