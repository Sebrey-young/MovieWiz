// TMDB API Types
export interface TMDBMovie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  vote_average: number
  runtime?: number
  genre_ids: number[]
  overview: string
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number
  genres: TMDBGenre[]
}

export interface TMDBResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

export interface Movie {
  id: number
  title: string
  year: number
  runtime?: number
  rating: number
  genre: string
  poster: string
  overview: string
}

// Convert TMDB movie to our app's movie format
export function formatMovie(movie: TMDBMovie, genres: TMDBGenre[] = [], runtime?: number): Movie {
  // Extract year from release_date (YYYY-MM-DD)
  const year = movie.release_date ? Number.parseInt(movie.release_date.split("-")[0]) : 0

  // Map genre_ids to genre names
  const movieGenres =
    movie.genre_ids
      ?.map((id) => genres.find((g) => g.id === id)?.name || "")
      .filter(Boolean)
      .join(", ") || ""

  return {
    id: movie.id,
    title: movie.title,
    year: year,
    runtime: runtime || movie.runtime, // Use provided runtime or fallback to movie.runtime
    rating: movie.vote_average,
    genre: movieGenres,
    poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/placeholder.svg?height=450&width=300",
    overview: movie.overview,
  }
}

// API Functions
export async function getGenres(): Promise<TMDBGenre[]> {
  try {
    const response = await fetch("/api/tmdb/genres")
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.")
      }
      throw new Error("Failed to fetch genres")
    }
    const data = await response.json()
    return data.genres
  } catch (error) {
    console.error("Error fetching genres:", error)
    return []
  }
}

export async function getMovieDetails(movieId: number): Promise<TMDBMovieDetails> {
  try {
    const response = await fetch(`/api/tmdb/movies/details/${movieId}`)
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.")
      }
      throw new Error(`Failed to fetch details for movie ${movieId}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching movie details for ${movieId}:`, error)
    return {} as TMDBMovieDetails
  }
}

export async function getPopularMovies(page = 1): Promise<{ movies: Movie[]; totalPages: number }> {
  try {
    const genres = await getGenres()
    const response = await fetch(`/api/tmdb/movies/popular?page=${page}`)
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.")
      }
      throw new Error("Failed to fetch popular movies")
    }

    const data: TMDBResponse = await response.json()

    // Fetch runtime for each movie
    const moviesWithRuntime = await Promise.all(
      data.results.map(async (movie) => {
        try {
          const details = await getMovieDetails(movie.id)
          return formatMovie(movie, genres, details.runtime)
        } catch (error) {
          console.error(`Failed to fetch runtime for movie ${movie.id}:`, error)
          return formatMovie(movie, genres)
        }
      }),
    )

    return {
      movies: moviesWithRuntime,
      totalPages: data.total_pages > 500 ? 500 : data.total_pages, // TMDB limits to 500 pages
    }
  } catch (error) {
    console.error("Error fetching popular movies:", error)
    return { movies: [], totalPages: 0 }
  }
}

export async function searchMovies(query: string, page = 1): Promise<{ movies: Movie[]; totalPages: number }> {
  if (!query.trim()) {
    return { movies: [], totalPages: 0 }
  }

  try {
    const genres = await getGenres()
    const response = await fetch(`/api/tmdb/movies/search?query=${encodeURIComponent(query)}&page=${page}`)
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.")
      }
      throw new Error("Failed to search movies")
    }

    const data: TMDBResponse = await response.json()

    // Fetch runtime for each movie
    const moviesWithRuntime = await Promise.all(
      data.results.map(async (movie) => {
        try {
          const details = await getMovieDetails(movie.id)
          return formatMovie(movie, genres, details.runtime)
        } catch (error) {
          console.error(`Failed to fetch runtime for movie ${movie.id}:`, error)
          return formatMovie(movie, genres)
        }
      }),
    )

    return {
      movies: moviesWithRuntime,
      totalPages: data.total_pages > 500 ? 500 : data.total_pages,
    }
  } catch (error) {
    console.error("Error searching movies:", error)
    return { movies: [], totalPages: 0 }
  }
}

export async function discoverMovies(options: {
  genre?: number | string
  yearFrom?: number
  yearTo?: number
  page?: number
}): Promise<{ movies: Movie[]; totalPages: number }> {
  const { genre, yearFrom, yearTo, page = 1 } = options

  try {
    const genres = await getGenres()

    let url = `/api/tmdb/movies/discover?page=${page}`

    if (genre && genre !== "all") {
      url += `&genre=${genre}`
    }

    if (yearFrom) {
      url += `&yearFrom=${yearFrom}`
    }

    if (yearTo) {
      url += `&yearTo=${yearTo}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.")
      }
      throw new Error("Failed to discover movies")
    }

    const data: TMDBResponse = await response.json()

    // Fetch runtime for each movie
    const moviesWithRuntime = await Promise.all(
      data.results.map(async (movie) => {
        try {
          const details = await getMovieDetails(movie.id)
          return formatMovie(movie, genres, details.runtime)
        } catch (error) {
          console.error(`Failed to fetch runtime for movie ${movie.id}:`, error)
          return formatMovie(movie, genres)
        }
      }),
    )

    return {
      movies: moviesWithRuntime,
      totalPages: data.total_pages > 500 ? 500 : data.total_pages,
    }
  } catch (error) {
    console.error("Error discovering movies:", error)
    return { movies: [], totalPages: 0 }
  }
}
