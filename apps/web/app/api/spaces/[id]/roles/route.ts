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

        // Get all roles for this space
        const { data, error } = await supabase
            .from('space_roles')
            .select('*, users(id, name, email)')
            .eq('space_id', spaceId)
            .order('created_at', { ascending: true })

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('Error fetching roles:', error)
        return NextResponse.json({
            error: 'Failed to fetch roles',
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
        const { user_id, role } = body

        // Verify requester is owner or admin
        const { data: requesterRole } = await supabase
            .from('space_roles')
            .select('role')
            .eq('space_id', spaceId)
            .eq('user_id', user.id)
            .single()

        if (!requesterRole || !['owner', 'admin'].includes(requesterRole.role)) {
            return NextResponse.json({
                error: 'Forbidden - Only owners and admins can assign roles'
            }, { status: 403 })
        }

        // Assign role
        const { data, error } = await supabase
            .from('space_roles')
            .upsert({
                space_id: spaceId,
                user_id,
                role
            })
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error('Error assigning role:', error)
        return NextResponse.json({
            error: 'Failed to assign role',
            details: error.message
        }, { status: 500 })
    }
}

export async function DELETE(
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
        const userId = searchParams.get('user_id')

        if (!userId) {
            return NextResponse.json({ error: 'user_id required' }, { status: 400 })
        }

        // Verify requester is owner or admin
        const { data: requesterRole } = await supabase
            .from('space_roles')
            .select('role')
            .eq('space_id', spaceId)
            .eq('user_id', user.id)
            .single()

        if (!requesterRole || !['owner', 'admin'].includes(requesterRole.role)) {
            return NextResponse.json({
                error: 'Forbidden - Only owners and admins can remove roles'
            }, { status: 403 })
        }

        // Cannot remove owner
        const { data: targetRole } = await supabase
            .from('space_roles')
            .select('role')
            .eq('space_id', spaceId)
            .eq('user_id', userId)
            .single()

        if (targetRole?.role === 'owner') {
            return NextResponse.json({
                error: 'Cannot remove owner role'
            }, { status: 400 })
        }

        // Remove role
        const { error } = await supabase
            .from('space_roles')
            .delete()
            .eq('space_id', spaceId)
            .eq('user_id', userId)

        if (error) throw error

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Error removing role:', error)
        return NextResponse.json({
            error: 'Failed to remove role',
            details: error.message
        }, { status: 500 })
    }
}
