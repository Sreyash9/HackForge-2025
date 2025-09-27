import { NextRequest } from 'next/server'

// Simple proxy to Data.gov.in Agmarknet dataset
// Example dataset: agmarknet - Market Price (Daily) JSON
const DATAGOV_BASE = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070'

export async function GET(req: NextRequest) {
  const apiKey = process.env.DATAGOV_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'DATAGOV_API_KEY missing' }), { status: 500 })
  }

  const { searchParams } = new URL(req.url)
  const state = searchParams.get('state') || 'Maharashtra'
  const commodity = searchParams.get('commodity') || ''
  const limit = searchParams.get('limit') || '50'

  const params = new URLSearchParams({
    api_key: apiKey,
    format: 'json',
    'filters[state]': state,
    limit,
  })
  if (commodity) params.set('filters[commodity]', commodity)

  const url = `${DATAGOV_BASE}?${params.toString()}`
  const res = await fetch(url, { next: { revalidate: 1800 } })
  const data = await res.json()
  return Response.json(data)
}


