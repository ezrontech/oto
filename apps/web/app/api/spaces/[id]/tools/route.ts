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

        // Get space with enabled tools
        const { data, error } = await supabase
            .from('spaces')
            .select('enabled_tools')
            .eq('id', spaceId)
            .single()

        if (error) throw error

        return NextResponse.json({ data: data.enabled_tools || [] })
    } catch (error: any) {
        console.error('Error fetching tools:', error)
        return NextResponse.json({
            error: 'Failed to fetch tools',
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
        const { tool } = body

        // Verify requester is owner or admin
        const { data: requesterRole } = await supabase
            .from('space_roles')
            .select('role')
            .eq('space_id', spaceId)
            .eq('user_id', user.id)
            .single()

        if (!requesterRole || !['owner', 'admin'].includes(requesterRole.role)) {
            return NextResponse.json({
                error: 'Forbidden - Only owners and admins can manage tools'
            }, { status: 403 })
        }

        // Get current tools
        const { data: space } = await supabase
            .from('spaces')
            .select('enabled_tools')
            .eq('id', spaceId)
            .single()

        const currentTools = space?.enabled_tools || []

        // Add tool if not already enabled
        if (!currentTools.includes(tool)) {
            const updatedTools = [...currentTools, tool]

            const { data, error } = await supabase
                .from('spaces')
                .update({ enabled_tools: updatedTools })
                .eq('id', spaceId)
                .select()
                .single()

            if (error) throw error

            return NextResponse.json({ data: data.enabled_tools })
        }

        return NextResponse.json({ data: currentTools })
    } catch (error: any) {
        console.error('Error enabling tool:', error)
        return NextResponse.json({
            error: 'Failed to enable tool',
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
        const tool = searchParams.get('tool')

        if (!tool) {
            return NextResponse.json({ error: 'tool parameter required' }, { status: 400 })
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
                error: 'Forbidden - Only owners and admins can manage tools'
            }, { status: 403 })
        }

        // Get current tools and remove the specified one
        const { data: space } = await supabase
            .from('spaces')
            .select('enabled_tools')
            .eq('id', spaceId)
            .single()

        const currentTools = space?.enabled_tools || []
        const updatedTools = currentTools.filter((t: string) => t !== tool)

        const { data, error } = await supabase
            .from('spaces')
            .update({ enabled_tools: updatedTools })
            .eq('id', spaceId)
            .select()
            .single()

        if (error) throw error

        return NextResponse.json({ data: data.enabled_tools })
    } catch (error: any) {
        console.error('Error disabling tool:', error)
        return NextResponse.json({
            error: 'Failed to disable tool',
            details: error.message
        }, { status: 500 })
    }
}
