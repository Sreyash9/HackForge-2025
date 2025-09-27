"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Cloud,
  TrendingUp,
  Users,
  MessageCircle,
  Calculator,
  Bot,
  Bell,
  Award,
  Menu,
  X,
  Home,
  BarChart3,
  Wheat,
  Settings,
  LifeBuoy,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function DashboardPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [weather, setWeather] = useState<any | null>(null)
  const [alerts, setAlerts] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/weather?q=Mumbai`, { cache: "no-store" })
        const data = await res.json()
        setWeather(data)
        const day0 = data?.forecast?.forecastday?.[0]
        const heavyRain = day0?.day?.totalprecip_mm >= 50 || day0?.day?.daily_chance_of_rain >= 80
        const sysAlerts = Array.isArray(data?.alerts?.alert) ? data.alerts.alert : []
        const computed: any[] = []
        if (heavyRain) computed.push({ title: "Heavy Rain Warning", desc: "High chance of heavy rain within 48h. Secure crops and plan transport." })
        for (const a of sysAlerts) {
          computed.push({ title: a?.event || "Weather Alert", desc: a?.desc || a?.headline || "" })
        }
        setAlerts(computed)
      } catch (e) {
        console.warn(e)
      }
    }
    load()
  }, [])

  const menuItems = [
    { icon: Home, label: "Dashboard", active: true, href: "/dashboard" },
    { icon: Bot, label: "AI Assistant", href: "/ai-assistant" },
    { icon: Users, label: "Farmer Cluster", href: "/cluster" },
    { icon: BarChart3, label: "Pooling Logistics", href: "/logistics" },
    { icon: Settings, label: "My Account", href: "/account" },
    { icon: Award, label: "Rewards", href: "/rewards" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/20">
      {/* Mobile Menu Overlay */}
      {menuOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)} />}

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-80 bg-card border-r border-border transform transition-transform duration-300",
          menuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="safe-area-top p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Wheat className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">FarmConnect</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setMenuOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href || "#"}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className="w-full justify-start gap-3"
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content - Mobile First */}
      <div className="p-4">
        <div className="safe-area-top">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={() => setMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Wheat className="h-6 w-6 text-primary" />
              <span className="font-semibold">FarmConnect</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mr-12 md:mr-16 relative z-0"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Good morning, Ramesh!</h2>
            <p className="text-muted-foreground">Here's your farm overview</p>
          </div>
        </div>

        <div className="max-w-md mx-auto space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today's Best Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">₹28/kg</div>
                <p className="text-xs text-muted-foreground">Tomato - Market A</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Rewards Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">120</div>
                <p className="text-xs text-muted-foreground">+50 this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Weather Card */}
          <Link href="/weather">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Weather Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{weather?.current?.temp_c ?? "--"}°C</div>
                    <p className="text-sm text-muted-foreground">{weather?.current?.condition?.text ?? "--"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Rain: {weather?.forecast?.forecastday?.[0]?.day?.daily_chance_of_rain ?? "--"}%</p>
                    <p className="text-sm text-muted-foreground">Humidity: {weather?.current?.humidity ?? "--"}%</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="text-xs">
                    <p className="font-medium">Today</p>
                    <p>
                      {weather?.forecast?.forecastday?.[0]?.day?.maxtemp_c ?? "--"}°/
                      {weather?.forecast?.forecastday?.[0]?.day?.mintemp_c ?? "--"}°
                    </p>
                  </div>
                  <div className="text-xs">
                    <p className="font-medium">Tomorrow</p>
                    <p>
                      {weather?.forecast?.forecastday?.[1]?.day?.maxtemp_c ?? "--"}°/
                      {weather?.forecast?.forecastday?.[1]?.day?.mintemp_c ?? "--"}°
                    </p>
                  </div>
                  <div className="text-xs">
                    <p className="font-medium">Day 3</p>
                    <p>
                      {weather?.forecast?.forecastday?.[2]?.day?.maxtemp_c ?? "--"}°/
                      {weather?.forecast?.forecastday?.[2]?.day?.mintemp_c ?? "--"}°
                    </p>
                  </div>
                </div>
                {alerts.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {alerts.slice(0, 2).map((a, i) => (
                      <div key={i} className="text-xs text-red-600">{a.title}: {a.desc}</div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>

          {/* Market Prices */}
          <Link href="/market">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Prices
                </CardTitle>
                <CardDescription>Live prices from nearby markets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Tomato</p>
                      <p className="text-xs text-muted-foreground">Market A</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹28/kg</p>
                    <Badge variant="secondary" className="text-xs">
                      +₹2
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Potato</p>
                      <p className="text-xs text-muted-foreground">Market B</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹19/kg</p>
                    <Badge variant="outline" className="text-xs">
                      -₹1
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Onion</p>
                      <p className="text-xs text-muted-foreground">Market C</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹35/kg</p>
                    <Badge variant="secondary" className="text-xs">
                      +₹5
                    </Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  View All Prices
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/buyers">
              <Button variant="outline" className="h-16 flex-col gap-2 bg-transparent w-full">
                <Users className="h-5 w-5" />
                <span className="text-xs">Find Buyers</span>
              </Button>
            </Link>
            <Link href="/calculator">
              <Button variant="outline" className="h-16 flex-col gap-2 bg-transparent w-full">
                <Calculator className="h-5 w-5" />
                <span className="text-xs">Cost Calculator</span>
              </Button>
            </Link>
          </div>

          <div className="h-20"></div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border/50 safe-area-bottom shadow-lg">
        <div className="flex justify-around items-center px-2 py-1">
          <Link href="/dashboard" className="flex-1">
            <div className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-primary/10 border border-primary/20">
              <div className="p-2 rounded-full bg-primary/20">
                <Home className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-medium text-primary mt-1">Home</span>
            </div>
          </Link>

          <Link href="/chat" className="flex-1">
            <div className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-full">
                <MessageCircle className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">Chat</span>
            </div>
          </Link>

          <Link href="/buyers" className="flex-1">
            <div className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-full">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">Buyers</span>
            </div>
          </Link>

          <Link href="/calculator" className="flex-1">
            <div className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-full">
                <Calculator className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">Calculator</span>
            </div>
          </Link>

          <Link href="/ai-assistant" className="flex-1">
            <div className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-full">
                <Bot className="h-6 w-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground mt-1">AI Help</span>
            </div>
          </Link>
          <Link href="/relief" className="flex-1">
            <div className="flex flex-col items-center justify-center py-2 px-1 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="p-2 rounded-full">
                <LifeBuoy className="h-6 w-6 text-red-500" />
              </div>
              <span className="text-xs text-red-600 mt-1">Relief</span>
            </div>
          </Link>
        </div>
      </nav>
    </div>
  )
}

