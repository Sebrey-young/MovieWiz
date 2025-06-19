"use client"

import { useState, useEffect, Suspense } from "react"
import MovieCard from "./movie-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { getPopularMovies, searchMovies, discoverMovies } from "@/lib/tmdb"
import type { Movie } from "@/types/movie"
import MovieGridSkeleton from "./movie-grid-skeleton"

interface MovieGridProps {
  initialMovies: Movie[]
}

function MovieGridContent({ initialMovies }: MovieGridProps) {
  const searchParams = useSearchParams()
  const query = searchParams.get("query")
  const genre = searchParams.get("genre")
  const yearFrom = searchParams.get("yearFrom")
  const yearTo = searchParams.get("yearTo")

  const [movies, setMovies] = useState<Movie[]>(initialMovies)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch movies when search params change
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        let result

        if (query) {
          // Search movies by query
          result = await searchMovies(query, currentPage)
        } else if (genre || yearFrom || yearTo) {
          // Discover movies with filters
          result = await discoverMovies({
            genre: genre ? Number.parseInt(genre) : undefined,
            yearFrom: yearFrom ? Number.parseInt(yearFrom) : undefined,
            yearTo: yearTo ? Number.parseInt(yearTo) : undefined,
            page: currentPage,
          })
        } else {
          // Get popular movies
          result = await getPopularMovies(currentPage)
        }

        setMovies(result.movies)
        setTotalPages(result.totalPages)
      } catch (error) {
        console.error("Failed to fetch movies:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [query, genre, yearFrom, yearTo, currentPage])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (isLoading) {
    return <MovieGridSkeleton />
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">No movies found</h3>
        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Show limited page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
            let pageNumber

            // Calculate which page numbers to show
            if (totalPages <= 5) {
              pageNumber = index + 1
            } else if (currentPage <= 3) {
              pageNumber = index + 1
            } else if (currentPage >= totalPages - 2) {
              pageNumber = totalPages - 4 + index
            } else {
              pageNumber = currentPage - 2 + index
            }

            return (
              <Button
                key={index}
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNumber)}
                className="w-8 h-8 p-0"
              >
                {pageNumber}
              </Button>
            )
          })}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default function MovieGrid({ initialMovies }: MovieGridProps) {
  return (
    <Suspense fallback={<MovieGridSkeleton />}>
      <MovieGridContent initialMovies={initialMovies} />
    </Suspense>
  )
}