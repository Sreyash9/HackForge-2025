import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalLanguageButton } from "@/components/GlobalLanguageButton"
import { GlobalReadControls } from "@/components/GlobalReadControls"

export const metadata: Metadata = {
  title: "FarmConnect - Farmer Marketplace",
  description: "Connect farmers with buyers, track market prices, and manage agricultural logistics",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FarmConnect",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#F59E0B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="font-sans antialiased">
      <body className="bg-background text-foreground min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Non-functional language button on all pages except Home */}
          <GlobalLanguageButton />
          {/* Text-to-Speech controls available on all pages */}
          <GlobalReadControls />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
