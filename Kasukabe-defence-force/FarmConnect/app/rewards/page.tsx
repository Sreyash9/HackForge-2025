"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Award, Star, Gift, Trophy, Calendar } from "lucide-react"
import Link from "next/link"

export default function RewardsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const userStats = {
    totalPoints: 1250,
    currentLevel: "Gold Farmer",
    nextLevel: "Platinum Farmer",
    pointsToNext: 250,
    totalEarned: 2100,
    badges: 8,
    rank: 15,
  }

  const badges = [
    { id: 1, name: "First Sale", description: "Complete your first transaction", earned: true, date: "Dec 15, 2024" },
    { id: 2, name: "Market Explorer", description: "Visit 5 different markets", earned: true, date: "Dec 20, 2024" },
    { id: 3, name: "Community Helper", description: "Help 10 fellow farmers", earned: true, date: "Jan 5, 2025" },
    {
      id: 4,
      name: "Quality Producer",
      description: "Maintain 4.5+ rating for 30 days",
      earned: true,
      date: "Jan 10, 2025",
    },
    { id: 5, name: "Bulk Seller", description: "Sell 1000kg in a month", earned: false, progress: 75 },
    { id: 6, name: "Weather Wise", description: "Use weather insights 50 times", earned: false, progress: 60 },
  ]

  const challenges = [
    {
      id: 1,
      title: "Weekly Market Visit",
      description: "Visit any market 3 times this week",
      reward: 50,
      progress: 2,
      target: 3,
      deadline: "Jan 21, 2025",
      status: "active",
    },
    {
      id: 2,
      title: "Community Engagement",
      description: "Help 5 farmers in the cluster",
      reward: 100,
      progress: 3,
      target: 5,
      deadline: "Jan 25, 2025",
      status: "active",
    },
    {
      id: 3,
      title: "Quality Maintenance",
      description: "Maintain 4+ rating for all sales",
      reward: 75,
      progress: 7,
      target: 10,
      deadline: "Jan 30, 2025",
      status: "active",
    },
  ]

  const leaderboard = [
    { rank: 1, name: "Suresh Patel", points: 2850, badge: "Platinum" },
    { rank: 2, name: "Anita Singh", points: 2650, badge: "Platinum" },
    { rank: 3, name: "Ramesh Kumar", points: 2400, badge: "Gold" },
    { rank: 4, name: "Priya Sharma", points: 2200, badge: "Gold" },
    { rank: 5, name: "Vikram Joshi", points: 1950, badge: "Gold" },
    { rank: 15, name: "You", points: 1250, badge: "Gold" },
  ]

  const rewardHistory = [
    { id: 1, action: "Completed sale", points: 25, date: "Jan 16, 2025" },
    { id: 2, action: "Helped farmer in cluster", points: 15, date: "Jan 15, 2025" },
    { id: 3, action: "Used weather insights", points: 5, date: "Jan 14, 2025" },
    { id: 4, action: "Joined transport pool", points: 20, date: "Jan 13, 2025" },
    { id: 5, action: "Market price update", points: 10, date: "Jan 12, 2025" },
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
            <h1 className="text-lg font-semibold">Rewards & Achievements</h1>
            <p className="text-sm text-muted-foreground">Track your farming journey</p>
          </div>
        </div>
      </header>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            {/* Points Summary */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-primary">{userStats.totalPoints}</div>
                  <p className="text-muted-foreground">Total Points</p>
                  <Badge className="text-sm">{userStats.currentLevel}</Badge>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to {userStats.nextLevel}</span>
                    <span>{userStats.pointsToNext} points to go</span>
                  </div>
                  <Progress value={83} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{userStats.badges}</div>
                  <p className="text-xs text-muted-foreground">Badges Earned</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">#{userStats.rank}</div>
                  <p className="text-xs text-muted-foreground">Community Rank</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rewardHistory.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      +{item.points} pts
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges" className="space-y-4">
            <h2 className="text-lg font-semibold">Achievement Badges</h2>

            <div className="grid grid-cols-1 gap-4">
              {badges.map((badge) => (
                <Card key={badge.id} className={badge.earned ? "border-primary/50 bg-primary/5" : "opacity-60"}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-full ${
                          badge.earned ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Award className="h-6 w-6" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{badge.name}</h3>
                            <p className="text-sm text-muted-foreground">{badge.description}</p>
                          </div>
                          {badge.earned && (
                            <Badge variant="default" className="text-xs">
                              Earned
                            </Badge>
                          )}
                        </div>

                        {badge.earned ? (
                          <p className="text-xs text-muted-foreground">Earned on {badge.date}</p>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{badge.progress}%</span>
                            </div>
                            <Progress value={badge.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Challenges */}
          <TabsContent value="challenges" className="space-y-4">
            <h2 className="text-lg font-semibold">Active Challenges</h2>

            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        <Gift className="h-3 w-3 mr-1" />
                        {challenge.reward} pts
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Progress: {challenge.progress}/{challenge.target}
                        </span>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {challenge.deadline}
                        </div>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard" className="space-y-4">
            <h2 className="text-lg font-semibold">Community Leaderboard</h2>

            <div className="space-y-2">
              {leaderboard.map((user) => (
                <Card key={user.rank} className={user.name === "You" ? "border-primary/50 bg-primary/5" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            user.rank <= 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {user.rank}
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {user.badge}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{user.points}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
