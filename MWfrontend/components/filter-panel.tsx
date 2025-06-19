"use client"

import { useState, useEffect, Suspense } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { FilterX } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getGenres, type TMDBGenre } from "@/lib/tmdb"

function FilterPanelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [genres, setGenres] = useState<TMDBGenre[]>([])
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get("genre") || "all")
  const [yearRange, setYearRange] = useState([
    Number.parseInt(searchParams.get("yearFrom") || "1970"),
    Number.parseInt(searchParams.get("yearTo") || "2025"),
  ])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoading(true)
      try {
        const genreList = await getGenres()
        setGenres(genreList)
      } catch (error) {
        console.error("Failed to fetch genres:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGenres()
  }, [])

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams()

    if (selectedGenre && selectedGenre !== "all") {
      params.set("genre", selectedGenre)
    }

    params.set("yearFrom", yearRange[0].toString())
    params.set("yearTo", yearRange[1].toString())

    // Preserve search query if it exists
    const query = searchParams.get("query")
    if (query) {
      params.set("query", query)
    }

    router.push(`/?${params.toString()}`)
  }

  // Reset filters
  const handleReset = () => {
    setSelectedGenre("all")
    setYearRange([1970, 2023])

    // Preserve only search query if it exists
    const query = searchParams.get("query")
    if (query) {
      router.push(`/?query=${encodeURIComponent(query)}`)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Genre
          </label>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Year Range
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {yearRange[0]} - {yearRange[1]}
            </span>
          </div>

          <Slider
            value={yearRange}
            onValueChange={setYearRange}
            min={1970}
            max={2025}
            step={1}
            className="w-full"
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1"
          >
            <FilterX className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={applyFilters}
            className="flex-1"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function FilterPanel() {
  return (
    <Suspense fallback={
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          </div>
        </div>
      </div>
    }>
      <FilterPanelContent />
    </Suspense>
  )
}