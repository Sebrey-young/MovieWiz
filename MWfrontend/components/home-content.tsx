"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import MovieGrid from "@/components/movie-grid"
import PredictForm from "@/components/predict-form"
import ResultCard from "@/components/result-card"
import MovieGridSkeleton from "@/components/movie-grid-skeleton"
import {
  getPopularMovies,
  searchMovies,
  discoverMovies,
  type Movie,
} from "@/lib/tmdb"

export default function HomeContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const genre = searchParams.get("genre") || ""
  const yearFrom = Number(searchParams.get("yearFrom") || "1970")
  const yearTo = Number(searchParams.get("yearTo") || "2025")
  const pageParam = Number(searchParams.get("page") || "1")

  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [predictedRating, setPredictedRating] = useState<number | null>(null)
  const [predictedTitle, setPredictedTitle] = useState("")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(false)
      try {
        let resultMovies: Movie[] = []
        if (query.trim()) {
          const { movies: searchResults } = await searchMovies(query, pageParam)
          resultMovies = searchResults
        } else if (genre || yearFrom || yearTo) {
          const { movies: discoverResults } = await discoverMovies({
            genre, yearFrom, yearTo, page: pageParam
          })
          resultMovies = discoverResults
        } else {
          const { movies: popularResults } = await getPopularMovies(pageParam)
          resultMovies = popularResults
        }
        setMovies(resultMovies)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [query, genre, yearFrom, yearTo, pageParam])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      <div className="lg:col-span-2">
        {loading
          ? <MovieGridSkeleton />
          : error
            ? <div className="text-center text-red-500 py-8">Failed to load movies.</div>
            : <MovieGrid initialMovies={movies} />
        }
      </div>
      <div className="space-y-6">
        <PredictForm
          onPredict={(rating, title) => {
            setPredictedRating(rating)
            setPredictedTitle(title)
          }}
        />
        {predictedRating !== null && predictedTitle !== "" && (
          <ResultCard
            movieTitle={predictedTitle}
            rating={predictedRating}
          />
        )}
      </div>
    </div>
  )
}