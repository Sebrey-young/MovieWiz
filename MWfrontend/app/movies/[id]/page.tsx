import { Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getMovieDetails } from "@/lib/tmdb-server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Star, Clock, Calendar } from "lucide-react"
import StreamingServices from "@/components/streaming-services"

interface MovieDetailsPageProps {
  params: {
    id: string
  }
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const movieId = Number.parseInt(params.id, 10)

  if (isNaN(movieId)) {
    notFound()
  }

  const movie = await getMovieDetails(movieId)

  if (!movie || !movie.id) {
    notFound()
  }

  // Extract watch providers
  const watchProviders = movie["watch/providers"] || null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12 transition-colors">
      {/* Back button (fixed position) */}
      <div className="fixed top-4 left-4 z-50">
        <Button size="icon" className="rounded-full bg-slate-900 hover:bg-slate-800 shadow-lg" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5 text-white" />
            <span className="sr-only">Back to Movies</span>
          </Link>
        </Button>
      </div>

      {/* Movie backdrop */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-10">
          {/* Movie poster */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden shadow-xl dark:bg-gray-800 dark:border-gray-700">
              <div className="relative aspect-[2/3] w-full">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.svg?height=450&width=300"
                  }
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority
                />
              </div>
            </Card>

            {/* Streaming services */}
            <div className="mt-6">
              <Suspense fallback={<div>Loading streaming options...</div>}>
                <StreamingServices providers={watchProviders} />
              </Suspense>
            </div>
          </div>

          {/* Movie details */}
          <div className="md:col-span-2">
            <Card className="shadow-xl dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>

                {movie.tagline && <p className="text-gray-500 dark:text-gray-400 italic mb-4">{movie.tagline}</p>}

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres?.map((genre: any) => (
                    <Badge key={genre.id} variant="secondary">
                      {genre.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-6 mb-6 text-sm">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="font-bold">{movie.vote_average?.toFixed(1)}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-1">/10</span>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-1" />
                    <span>{movie.runtime} minutes</span>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-1" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Overview</h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{movie.overview}</p>
                </div>

                {/* Additional details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {movie.production_companies?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Production</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {movie.production_companies.map((company: any) => company.name).join(", ")}
                      </p>
                    </div>
                  )}

                  {movie.production_countries?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Country</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {movie.production_countries.map((country: any) => country.name).join(", ")}
                      </p>
                    </div>
                  )}

                  {movie.spoken_languages?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Language</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {movie.spoken_languages.map((language: any) => language.english_name).join(", ")}
                      </p>
                    </div>
                  )}

                  {movie.budget > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold mb-1">Budget</h3>
                      <p className="text-gray-600 dark:text-gray-400">${movie.budget.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
