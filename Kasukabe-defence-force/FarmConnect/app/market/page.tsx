"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Search, ArrowLeft, MapPin, Phone, Star } from "lucide-react"
import Link from "next/link"

export default function MarketPage() {
  const [selectedCrop, setSelectedCrop] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const demoData = [
    {
      crop: "Tomato",
      market: "APMC Market A",
      price: 28,
      change: +2,
      trend: "up",
      distance: "5 km",
      contact: "+91 98765 43210",
      rating: 4.5,
      lastUpdated: "2 hours ago",
    },
    {
      crop: "Potato",
      market: "Wholesale Market B",
      price: 19,
      change: -1,
      trend: "down",
      distance: "8 km",
      contact: "+91 98765 43211",
      rating: 4.2,
      lastUpdated: "1 hour ago",
    },
    {
      crop: "Onion",
      market: "Mandi Market C",
      price: 35,
      change: +5,
      trend: "up",
      distance: "12 km",
      contact: "+91 98765 43212",
      rating: 4.7,
      lastUpdated: "30 min ago",
    },
    {
      crop: "Wheat",
      market: "Grain Market D",
      price: 22,
      change: 0,
      trend: "stable",
      distance: "15 km",
      contact: "+91 98765 43213",
      rating: 4.0,
      lastUpdated: "3 hours ago",
    },
    {
      crop: "Rice",
      market: "Agricultural Hub E",
      price: 45,
      change: +3,
      trend: "up",
      distance: "20 km",
      contact: "+91 98765 43214",
      rating: 4.3,
      lastUpdated: "1 hour ago",
    },
  ]

  const filteredData = (records.length > 0 ? records : demoData).filter(
    (item) =>
      (selectedCrop === "all" || (item.crop || item.commodity || "").toLowerCase() === selectedCrop) &&
      (searchQuery === "" ||
        (item.crop || item.commodity || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.market || item.market_center || "").toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const bestPrice = Math.max(...filteredData.map((item) => Number(item.price || item.modal_price || 0)))
  const avgPrice = Math.round(
    filteredData.reduce((sum, item) => sum + Number(item.price || item.modal_price || 0), 0) /
      Math.max(filteredData.length, 1),
  )

  useEffect(() => {
    const fetchMarket = async () => {
      try {
        const res = await fetch(`/api/market?state=Maharashtra&limit=50`, { cache: "no-store" })
        const data = await res.json()
        const recs = Array.isArray(data?.records) ? data.records : []
        const normalized = recs.map((r: any) => ({
          crop: r.commodity,
          market: `${r.market} (${r.district})`,
          price: Number(r.modal_price),
          change: 0,
          trend: "stable",
          distance: "-",
          contact: "",
          rating: 4.5,
          lastUpdated: r.arrival_date,
          market_center: r.market,
          commodity: r.commodity,
          modal_price: r.modal_price,
        }))
        setRecords(normalized)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchMarket()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="safe-area-top bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Market Prices {loading ? "(loading...)" : ""}</h1>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Pune Region
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops or markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="tomato">Tomato</SelectItem>
              <SelectItem value="potato">Potato</SelectItem>
              <SelectItem value="onion">Onion</SelectItem>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="rice">Rice</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Price Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Best Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₹{bestPrice}/kg</div>
              <p className="text-xs text-muted-foreground">Highest in region</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{avgPrice}/kg</div>
              <p className="text-xs text-muted-foreground">Market average</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Listings */}
        <div className="space-y-4">
          {filteredData.map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{item.crop || item.commodity}</h3>
                    <p className="text-sm text-muted-foreground">{item.market || item.market_center}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.distance}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{item.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">₹{Number(item.price || item.modal_price)}/kg</div>
                    <div className="flex items-center gap-1">
                      {item.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {item.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                      <Badge
                        variant={item.change > 0 ? "default" : item.change < 0 ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {item.change > 0 ? "+" : ""}₹{item.change}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Updated {item.lastUpdated}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Phone className="h-3 w-3 mr-1" />
                      Contact
                    </Button>
                    <Button size="sm">Get Directions</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No markets found for your search criteria</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCrop("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Price Alert */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Price Alert</p>
                <p className="text-sm text-muted-foreground">
                  Tomato prices increased by 8% this week. Good time to sell!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
