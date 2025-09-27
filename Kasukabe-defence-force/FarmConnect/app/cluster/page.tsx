"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, MapPin, Phone, MessageCircle, Plus, Calendar } from "lucide-react"
import Link from "next/link"

export default function ClusterPage() {
  const [activeTab, setActiveTab] = useState("nearby")

  const nearbyFarmers = [
    {
      id: 1,
      name: "Suresh Patel",
      location: "2 km away",
      crops: ["Tomato", "Potato"],
      farmSize: "5 acres",
      experience: "15 years",
      phone: "+91 98765 43210",
      avatar: "/diverse-farmers-harvest.png",
      status: "online",
      lastActive: "2 min ago",
    },
    {
      id: 2,
      name: "Anita Singh",
      location: "3.5 km away",
      crops: ["Onion", "Wheat"],
      farmSize: "8 acres",
      experience: "12 years",
      phone: "+91 98765 43211",
      avatar: "/diverse-woman-portrait.png",
      status: "offline",
      lastActive: "1 hour ago",
    },
    {
      id: 3,
      name: "Ramesh Kumar",
      location: "4 km away",
      crops: ["Rice", "Sugarcane"],
      farmSize: "12 acres",
      experience: "20 years",
      phone: "+91 98765 43212",
      avatar: "/man.jpg",
      status: "online",
      lastActive: "5 min ago",
    },
  ]

  const myGroups = [
    {
      id: 1,
      name: "Tomato Growers Alliance",
      members: 24,
      description: "Sharing best practices for tomato cultivation",
      lastActivity: "2 hours ago",
      category: "Crop Specific",
      avatar: "/diverse-group-traders.png",
    },
    {
      id: 2,
      name: "Organic Farmers Network",
      members: 18,
      description: "Promoting organic farming methods",
      lastActivity: "1 day ago",
      category: "Organic",
      avatar: "/diverse-executive-team.png",
    },
    {
      id: 3,
      name: "Local Market Collective",
      members: 35,
      description: "Coordinating market visits and bulk sales",
      lastActivity: "3 hours ago",
      category: "Marketing",
      avatar: "/bustling-marketplace.png",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Organic Farming Workshop",
      date: "Jan 20, 2025",
      time: "10:00 AM",
      location: "Community Center",
      attendees: 15,
      organizer: "Anita Singh",
    },
    {
      id: 2,
      title: "Bulk Seed Purchase",
      date: "Jan 25, 2025",
      time: "2:00 PM",
      location: "Agricultural Store",
      attendees: 8,
      organizer: "Suresh Patel",
    },
    {
      id: 3,
      title: "Market Price Discussion",
      date: "Jan 28, 2025",
      time: "4:00 PM",
      location: "Village Hall",
      attendees: 22,
      organizer: "Ramesh Kumar",
    },
  ]

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
            <h1 className="text-lg font-semibold">Farmer Cluster</h1>
            <p className="text-sm text-muted-foreground">Connect with local farming community</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
            <TabsTrigger value="groups">My Groups</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Nearby Farmers */}
          <TabsContent value="nearby" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Farmers Near You</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Connect
              </Button>
            </div>

            {nearbyFarmers.map((farmer) => (
              <Card key={farmer.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={farmer.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{farmer.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {farmer.status === "online" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{farmer.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {farmer.location}
                          </div>
                        </div>
                        <Badge variant={farmer.status === "online" ? "default" : "secondary"} className="text-xs">
                          {farmer.status}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {farmer.crops.map((crop, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>
                            {farmer.farmSize} • {farmer.experience}
                          </span>
                          <span>Active {farmer.lastActive}</span>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* My Groups */}
          <TabsContent value="groups" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">My Groups</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Join Group
              </Button>
            </div>

            {myGroups.map((group) => (
              <Card key={group.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={group.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{group.name}</h3>
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {group.category}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {group.members} members
                        </div>
                        <span>Active {group.lastActivity}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Open Chat
                        </Button>
                        <Button size="sm" className="flex-1">
                          View Group
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Upcoming Events</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">Organized by {event.organizer}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {event.attendees} attending
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        Maybe
                      </Button>
                      <Button size="sm" className="flex-1">
                        Join Event
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
