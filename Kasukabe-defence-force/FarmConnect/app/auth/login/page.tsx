"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wheat, ArrowLeft, Mail, Lock } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState<string | null>(null)
  const router = useRouter()

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const normalized = email.trim()
      if (!normalized) throw new Error("Email required")
      const { error } = await supabase.auth.signInWithOtp({
        email: normalized,
      })
      if (error) throw error
      setInfo("Check your email for a sign-in link. After opening, you will be redirected to the dashboard.")
    } catch (err) {
      console.error(err)
      alert("Failed to send sign-in link. Please check your email address.")
    } finally {
      setLoading(false)
    }
  }

  const devBypass = () => {
    // Dev-only bypass: skip auth and go to dashboard
    try { localStorage.setItem("dev_auth", "1") } catch {}
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/30 p-4">
      <div className="safe-area-top">
        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="max-w-sm mx-auto">
        <div className="text-center mb-8">
          <Wheat className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your HarvestHub account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enter Email</CardTitle>
            <CardDescription>
              We'll send you a magic link to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Sign-in Link"}
                </Button>
                <Button type="button" variant="secondary" onClick={devBypass}>
                  Dev Login
                </Button>
              </div>
            </form>
            {info && <p className="text-xs text-muted-foreground text-center mt-4">{info}</p>}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
