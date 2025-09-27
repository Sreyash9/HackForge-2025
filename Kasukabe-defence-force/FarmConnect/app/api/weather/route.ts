import { NextRequest } from 'next/server'

const WEATHER_BASE = 'https://api.weatherapi.com/v1'

export async function GET(req: NextRequest) {
  const apiKey = process.env.WEATHERAPI_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'WEATHERAPI_KEY missing' }), { status: 500 })
  }
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || 'Mumbai'
  const days = searchParams.get('days') || '3'

  const url = `${WEATHER_BASE}/forecast.json?key=${apiKey}&q=${encodeURIComponent(q)}&days=${days}&alerts=yes`
  const res = await fetch(url, { next: { revalidate: 1800 } })
  const data = await res.json()
  return Response.json(data)
}


