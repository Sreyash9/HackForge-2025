"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cloud } from 'lucide-react'

export default function WeatherHome() {
  const [weather, setWeather] = useState<any | null>(null)
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/weather?q=Mumbai`, { cache: 'no-store' })
        const data = await res.json()
        setWeather(data)
        const day0 = data?.forecast?.forecastday?.[0]
        const heavyRain = day0?.day?.totalprecip_mm >= 50 || day0?.day?.daily_chance_of_rain >= 80
        const sysAlerts = Array.isArray(data?.alerts?.alert) ? data.alerts.alert : []
        const computed: any[] = []
        if (heavyRain) computed.push({ title: 'Heavy Rain Warning', desc: 'High chance of heavy rain within 48h.' })
        for (const a of sysAlerts) computed.push({ title: a?.event || 'Weather Alert', desc: a?.headline || '' })
        setAlerts(computed)
      } catch {}
    }
    load()
  }, [])

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="h-5 w-5" /> Today’s Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{weather?.current?.temp_c ?? '--'}°C</div>
            <p className="text-sm text-muted-foreground">{weather?.current?.condition?.text ?? '--'}</p>
          </div>
          <div className="text-right">
            <p className="text-sm">Rain: {weather?.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain ?? '--'}%</p>
            <p className="text-sm text-muted-foreground">Humidity: {weather?.current?.humidity ?? '--'}%</p>
          </div>
        </div>
        {alerts.length > 0 && (
          <div className="mt-3 text-xs text-red-600">
            {alerts[0].title}: {alerts[0].desc}
          </div>
        )}
      </CardContent>
    </Card>
  )
}


