import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { configuration } from "@/config/site"
import { sans } from "@/lib/fonts"
import { cn } from "@/lib/utils"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: configuration.name,
    template: `%s - ${configuration.name}`,
  },
  metadataBase: new URL(
    `${configuration.protocol}://${configuration.domain}${configuration.port ? ":" + configuration.port : ""}`,
  ),
  description: configuration.description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
    "Vercel",
    "TypeScript",
    "URL Shortener",
  ],
  authors: [
    {
      name: "Daniel Gaievskyi",
      url: "https://gaievskyi.com",
    },
  ],
  creator: "Daniel Gaievskyi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${configuration.protocol}://${configuration.domain}`,
    title: configuration.name,
    description: configuration.description,
    siteName: configuration.name,
  },
  twitter: {
    card: "summary_large_image",
    title: configuration.name,
    description: configuration.description,
    creator: "@dgaievskyi",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  minimumScale: 1,
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(sans.className, "antialiased overflow-x-clip")}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
