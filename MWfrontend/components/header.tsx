"use client"

import type React from "react"
import { useState, Suspense } from "react"
import { Search, X, Moon, Sun, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import Image from "next/image"

function HeaderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "")
  const { theme, setTheme } = useTheme()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    router.push("/")
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Social link handler function
  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Left side - Theme toggle */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        {/* Center - Title and Search */}
        <div className="flex items-center space-x-6">
          <h1 className="font-bold text-lg">
            MovieWiz
          </h1>
          
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus-visible:ring-slate-500"
            />
            {searchQuery && (
              <Button type="button" variant="ghost" size="icon" onClick={handleClearSearch}>
                <X className="h-4 w-4" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </form>
        </div>

        {/* Right side - Social Links */}
        <div className="flex items-center space-x-2">
          {/* Portfolio Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSocialClick('https://csyoung.com/')}
            className="hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Image
              src="/portfolio.png"
              alt="Portfolio"
              width={20}
              height={20}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
            <span className="sr-only">Portfolio</span>
          </Button>

          {/* GitHub Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSocialClick('https://github.com/Sebrey-young')}
            className="hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Image
              src="/github.png"
              alt="GitHub"
              width={20}
              height={20}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
            <span className="sr-only">GitHub</span>
          </Button>

          {/* LinkedIn Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleSocialClick('https://www.linkedin.com/in/carlos-young-697802203/')}
            className="hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Image
              src="/linkedin.png"
              alt="LinkedIn"
              width={20}
              height={20}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
            <span className="sr-only">LinkedIn</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

export default function Header() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="w-10 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          
          <div className="flex items-center space-x-6">
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="flex items-center space-x-2">
              <div className="h-9 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    }>
      <HeaderContent />
    </Suspense>
  )
}