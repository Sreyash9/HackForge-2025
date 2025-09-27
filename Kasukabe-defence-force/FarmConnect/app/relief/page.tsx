"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ArrowLeft, LifeBuoy, Phone, ExternalLink } from "lucide-react"

export default function ReliefPage() {
  const [district, setDistrict] = useState("")
  const [commodity, setCommodity] = useState("")
  const [aiHelp, setAiHelp] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const askAI = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Provide concise relief guidance for farmers in district ${district}. Include:
1) Key government schemes and subsidies during floods/droughts with links (if known).
2) NGOs operating in ${district} that support agriculture relief.
3) Emergency crop price/demand tips for ${commodity || "local staples"}.
Answer primarily in simple Hindi.`,
        }),
      })
      const data = await res.json()
      setAiHelp(data?.text || "")
    } catch {
      setAiHelp("AI सहायता अभी उपलब्ध नहीं है। बाद में पुनः प्रयास करें।")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="safe-area-top bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Relief & Emergency</h1>
            <p className="text-sm text-muted-foreground">Government subsidies, NGOs, and emergency info</p>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-4 max-w-md mx-auto">
        <Card className="border-red-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Flood/Drought Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>District</Label>
                <Input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="e.g., Pune" />
              </div>
              <div>
                <Label>Commodity</Label>
                <Input value={commodity} onChange={(e) => setCommodity(e.target.value)} placeholder="e.g., Onion" />
              </div>
            </div>
            <Button onClick={askAI} disabled={loading} className="w-full">
              <LifeBuoy className="h-4 w-4 mr-2" /> {loading ? "Asking AI..." : "Get Relief Guidance"}
            </Button>
            {aiHelp && (
              <div className="mt-3 text-sm whitespace-pre-wrap">{aiHelp}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Important Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> Disaster Helpline</span>
              <a className="text-primary flex items-center gap-1" href="tel:1077">Call 1077 <ExternalLink className="h-3 w-3" /></a>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> Agriculture Dept.</span>
              <a className="text-primary flex items-center gap-1" href="tel:18001801551">Call 1800-180-1551 <ExternalLink className="h-3 w-3" /></a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


