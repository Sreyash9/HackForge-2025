"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Truck, Users, MapPin, Calendar, Clock, IndianRupee, Plus } from "lucide-react"
import Link from "next/link"

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState("active")

  const activePooling = [
    {
      id: 1,
      destination: "APMC Market A",
      date: "Jan 18, 2025",
      time: "6:00 AM",
      organizer: "Suresh Patel",
      participants: 4,
      maxParticipants: 6,
      costPerKg: 2.5,
      distance: "25 km",
      vehicleType: "Truck",
      status: "open",
      myParticipation: true,
    },
    {
      id: 2,
      destination: "Wholesale Market B",
      date: "Jan 20, 2025",
      time: "5:30 AM",
      organizer: "Anita Singh",
      participants: 3,
      maxParticipants: 5,
      costPerKg: 3.0,
      distance: "35 km",
      vehicleType: "Tempo",
      status: "open",
      myParticipation: false,
    },
    {
      id: 3,
      destination: "City Market Hub",
      date: "Jan 22, 2025",
      time: "7:00 AM",
      organizer: "Ramesh Kumar",
      participants: 5,
      maxParticipants: 5,
      costPerKg: 2.0,
      distance: "15 km",
      vehicleType: "Tractor Trolley",
      status: "full",
      myParticipation: false,
    },
  ]

  const completedTrips = [
    {
      id: 1,
      destination: "APMC Market A",
      date: "Jan 15, 2025",
      participants: 6,
      costPerKg: 2.5,
      totalSaved: 450,
      rating: 4.8,
      organizer: "Suresh Patel",
    },
    {
      id: 2,
      destination: "Wholesale Market B",
      date: "Jan 12, 2025",
      participants: 4,
      costPerKg: 3.2,
      totalSaved: 320,
      rating: 4.5,
      organizer: "Anita Singh",
    },
    {
      id: 3,
      destination: "Local Mandi",
      date: "Jan 10, 2025",
      participants: 8,
      costPerKg: 1.8,
      totalSaved: 600,
      rating: 4.9,
      organizer: "Ramesh Kumar",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "default"
      case "full":
        return "secondary"
      case "completed":
        return "outline"
      default:
        return "secondary"
    }
  }

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
            <h1 className="text-lg font-semibold">Pooling Logistics</h1>
            <p className="text-sm text-muted-foreground">Share transport costs with other farmers</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Active Pools</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Active Pooling */}
          <TabsContent value="active" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Available Transport Pools</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Pool
              </Button>
            </div>

            {/* Summary Card */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">₹1,370</div>
                    <p className="text-xs text-muted-foreground">Total Saved</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">18</div>
                    <p className="text-xs text-muted-foreground">Trips Joined</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">4.7</div>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {activePooling.map((pool) => (
              <Card key={pool.id} className={pool.myParticipation ? "border-primary/50 bg-primary/5" : ""}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{pool.destination}</h3>
                        <p className="text-sm text-muted-foreground">Organized by {pool.organizer}</p>
                      </div>
                      <Badge variant={getStatusColor(pool.status)} className="text-xs">
                        {pool.status === "open" ? "Open" : pool.status === "full" ? "Full" : pool.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{pool.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{pool.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span>{pool.distance}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3 text-muted-foreground" />
                        <span>{pool.vehicleType}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {pool.participants}/{pool.maxParticipants}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-semibold">₹{pool.costPerKg}/kg</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {pool.myParticipation ? (
                          <Button variant="outline" size="sm">
                            Leave Pool
                          </Button>
                        ) : pool.status === "open" ? (
                          <Button size="sm">Join Pool</Button>
                        ) : (
                          <Button size="sm" disabled>
                            Full
                          </Button>
                        )}
                      </div>
                    </div>

                    {pool.myParticipation && (
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <p className="text-xs text-primary font-medium">You're part of this pool</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="space-y-4">
            <h2 className="text-lg font-semibold">Completed Trips</h2>

            {completedTrips.map((trip) => (
              <Card key={trip.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{trip.destination}</h3>
                        <p className="text-sm text-muted-foreground">Organized by {trip.organizer}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Completed
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span>{trip.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span>{trip.participants} farmers</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">
                          Saved ₹{trip.totalSaved}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Cost: ₹{trip.costPerKg}/kg • Rating: {trip.rating}/5
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Rate Trip
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
