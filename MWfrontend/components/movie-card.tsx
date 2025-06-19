import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { Movie } from "@/types/movie"

interface MovieCardProps {
  movie: Movie
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movies/${movie.id}`} className="block">
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-xl hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700 h-full flex flex-col">
        <div className="relative aspect-[2/3] w-full">
          <Image
            src={movie.poster || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Genre and Runtime badges positioned on the left */}
          <div className="absolute top-3 left-3 flex flex-col gap-2"></div>
        </div>

        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg line-clamp-2 mb-3" title={movie.title}>
            {movie.title}
          </h3>

          <div className="flex flex-col gap-2">
            {/* Release Year */}
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md w-fit">{movie.year || "N/A"}</div>

            {/* Genres */}
            {movie.genre && (
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md w-fit">
                <span className="line-clamp-1" title={movie.genre}>
                  {movie.genre}
                </span>
              </div>
            )}

            {/* Runtime */}
            {movie.runtime && (
              <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-md w-fit">{movie.runtime} min</div>
            )}
          </div>

          <div className="flex items-center mt-auto pt-3">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-bold">{movie.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm ml-1 dark:text-gray-400">/10</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
