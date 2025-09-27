"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Phone, MessageCircle, MapPin, Star, Filter } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const BuyersMap = dynamic(() => import("./buyersMap"), { ssr: false })

export default function BuyersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [coordsReady, setCoordsReady] = useState(false)

  const buyers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      company: "Fresh Mart Wholesale",
      rating: 4.8,
      location: "Pune, 5 km",
      speciality: "Vegetables",
      lastOrder: "2 days ago",
      totalOrders: 45,
      phone: "+91 98765 43210",
      avatar: "/diverse-businessman.png",
      verified: true,
      crops: ["Tomato", "Potato", "Onion"],
      priceRange: "₹20-35/kg",
      lat: 18.5204, lon: 73.8567,
    },
    {
      id: 2,
      name: "Priya Sharma",
      company: "Green Valley Traders",
      rating: 4.9,
      location: "Mumbai, 25 km",
      speciality: "Organic Produce",
      lastOrder: "1 week ago",
      totalOrders: 78,
      phone: "+91 98765 43211",
      avatar: "/confident-businesswoman.png",
      verified: true,
      crops: ["Organic Vegetables", "Fruits"],
      priceRange: "₹25-45/kg",
      lat: 19.076, lon: 72.8777,
    },
    {
      id: 3,
      name: "Suresh Patel",
      company: "City Market Hub",
      rating: 4.5,
      location: "Nashik, 15 km",
      speciality: "Bulk Orders",
      lastOrder: "3 days ago",
      totalOrders: 32,
      phone: "+91 98765 43212",
      avatar: "/diverse-group-traders.png",
      verified: true,
      crops: ["Wheat", "Rice", "Pulses"],
      priceRange: "₹18-28/kg",
      lat: 19.9975, lon: 73.7898,
    },
    {
      id: 4,
      name: "Anita Singh",
      company: "Premium Foods Ltd",
      rating: 4.7,
      location: "Aurangabad, 35 km",
      speciality: "Export Quality",
      lastOrder: "5 days ago",
      totalOrders: 67,
      phone: "+91 98765 43213",
      avatar: "/diverse-executive-team.png",
      verified: true,
      crops: ["Premium Vegetables", "Spices"],
      priceRange: "₹30-50/kg",
      lat: 19.8762, lon: 75.3433,
    },
    {
      id: 5,
      name: "Vikram Joshi",
      company: "Local Mandi",
      rating: 4.2,
      location: "Solapur, 45 km",
      speciality: "Traditional Market",
      lastOrder: "1 day ago",
      totalOrders: 23,
      phone: "+91 98765 43214",
      avatar: "/bustling-marketplace.png",
      verified: false,
      crops: ["Mixed Vegetables"],
      priceRange: "₹15-25/kg",
      lat: 17.6599, lon: 75.9064,
    },
  ]

  useEffect(() => {
    // Leaflet CSS inject (for Next.js app router minimal setup)
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    document.head.appendChild(link)
    setCoordsReady(true)
  }, [])

  const filteredBuyers = buyers
    .filter((buyer) => {
      const matchesSearch =
        buyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.speciality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        buyer.crops.some((crop) => crop.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesFilter =
        filterType === "all" ||
        (filterType === "verified" && buyer.verified) ||
        (filterType === "nearby" && Number.parseInt(buyer.location.split(" ")[1]) <= 20) ||
        buyer.speciality.toLowerCase().includes(filterType)

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "distance":
          return Number.parseInt(a.location.split(" ")[1]) - Number.parseInt(b.location.split(" ")[1])
        case "orders":
          return b.totalOrders - a.totalOrders
        default:
          return 0
      }
    })

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
            <h1 className="text-lg font-semibold">Find Buyers</h1>
            <p className="text-sm text-muted-foreground">Connect with verified buyers in your area</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search buyers, companies, or crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="flex-1">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buyers</SelectItem>
                <SelectItem value="verified">Verified Only</SelectItem>
                <SelectItem value="nearby">Nearby (≤20km)</SelectItem>
                <SelectItem value="organic">Organic Buyers</SelectItem>
                <SelectItem value="bulk">Bulk Orders</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="orders">Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Buyers Map */}
      <div className="p-4">
        {coordsReady && (
          <BuyersMap buyers={buyers} />
        )}
      </div>

      {/* Buyers List */}
      <div className="p-4 space-y-4">
        {filteredBuyers.map((buyer) => (
          <Card key={buyer.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={buyer.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{buyer.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{buyer.name}</h3>
                        {buyer.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{buyer.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{buyer.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{buyer.totalOrders} orders</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{buyer.location}</span>
                      <Badge variant="outline" className="text-xs">
                        {buyer.speciality}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {buyer.crops.map((crop, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Price Range: {buyer.priceRange}</p>
                        <p className="text-xs text-muted-foreground">Last order: {buyer.lastOrder}</p>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/chat?buyer=${buyer.id}`}>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Chat
                          </Button>
                        </Link>
                        <Button size="sm">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredBuyers.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No buyers found matching your criteria</p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => {
                  setSearchQuery("")
                  setFilterType("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
