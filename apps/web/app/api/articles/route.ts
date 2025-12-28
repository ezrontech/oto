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
      .from('articles')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 })
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

    const { mailing_lists, spaces, ...articleData } = await request.json()

    // 1. Insert Article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        ...articleData,
        user_id: user.id
      })
      .select()
      .single()

    if (articleError) throw articleError

    // 2. Handle Mailing List Distribution if published
    if (article.status === 'published' && mailing_lists && Array.isArray(mailing_lists)) {
      const distributions = mailing_lists.map(listId => ({
        article_id: article.id,
        list_id: listId,
        sent_at: new Date().toISOString()
      }))

      const { error: distError } = await supabase
        .from('article_distributions')
        .insert(distributions)

      if (distError) console.error('Error creating mailing distributions:', distError)
    }

    // 3. Handle Space Sharing
    // (In a real system, this might trigger a 'Shared Content' message in the space)
    if (article.status === 'published' && spaces && Array.isArray(spaces)) {
      // Future logic for space sharing
      console.log('Sharing article to spaces:', spaces)
    }

    return NextResponse.json({ data: article })
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
