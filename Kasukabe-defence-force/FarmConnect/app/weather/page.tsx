"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, ArrowLeft, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

export default function WeatherPage() {
  const [selectedDay, setSelectedDay] = useState(0)

  const weeklyForecast = [
    { day: "Today", date: "Jan 15", temp: "28°/22°", condition: "Partly Cloudy", rain: 20, icon: Cloud },
    { day: "Tomorrow", date: "Jan 16", temp: "30°/24°", condition: "Sunny", rain: 5, icon: Sun },
    { day: "Wednesday", date: "Jan 17", temp: "26°/20°", condition: "Rainy", rain: 80, icon: CloudRain },
    { day: "Thursday", date: "Jan 18", temp: "25°/19°", condition: "Cloudy", rain: 40, icon: Cloud },
    { day: "Friday", date: "Jan 19", temp: "29°/23°", condition: "Sunny", rain: 10, icon: Sun },
    { day: "Saturday", date: "Jan 20", temp: "31°/25°", condition: "Hot", rain: 0, icon: Sun },
    { day: "Sunday", date: "Jan 21", temp: "27°/21°", condition: "Partly Cloudy", rain: 30, icon: Cloud },
  ]

  const currentWeather = weeklyForecast[selectedDay]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="safe-area-top bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Weather Forecast</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Pune, Maharashtra
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Current Weather */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl font-bold">28°C</div>
                <p className="text-muted-foreground">{currentWeather.condition}</p>
              </div>
              <currentWeather.icon className="h-16 w-16 text-blue-600" />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <Droplets className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-semibold">65%</p>
              </div>
              <div className="text-center">
                <Wind className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="font-semibold">12 km/h</p>
              </div>
              <div className="text-center">
                <Eye className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <p className="text-xs text-muted-foreground">Visibility</p>
                <p className="font-semibold">10 km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              7-Day Forecast
            </CardTitle>
            <CardDescription>Detailed weather predictions for the week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {weeklyForecast.map((day, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedDay === index ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedDay(index)}
              >
                <div className="flex items-center gap-3">
                  <day.icon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium">{day.day}</p>
                    <p className="text-xs text-muted-foreground">{day.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{day.temp}</p>
                  <div className="flex items-center gap-1">
                    <Droplets className="h-3 w-3 text-blue-500" />
                    <span className="text-xs text-muted-foreground">{day.rain}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Farming Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Farming Recommendations</CardTitle>
            <CardDescription>Based on current weather conditions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Good for Irrigation</p>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Low humidity and moderate temperature - ideal for watering crops
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-200">Monitor for Pests</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Warm weather may increase pest activity - check crops regularly
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">Rain Expected Wednesday</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Plan harvesting activities before Wednesday's rain
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
