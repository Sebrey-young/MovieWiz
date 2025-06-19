// Server-side TMDB functions
// This file should only be imported in server components or API routes

// Helper function to add delay between requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getMovieDetails(movieId: number) {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=watch/providers`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    )

    // Handle rate limiting
    if (response.status === 429) {
      console.log(`Rate limited when fetching movie ${movieId}. Retrying after delay...`)
      // Get retry-after header or default to 1 second
      const retryAfter = Number.parseInt(response.headers.get("retry-after") || "1", 10)
      await delay(retryAfter * 1000)
      return getMovieDetails(movieId) // Retry the request
    }

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching movie details for ${movieId}:`, error)
    return { runtime: 0 }
  }
}

// Batch fetch movie details to reduce API calls
export async function batchGetMovieDetails(movieIds: number[], batchSize = 5) {
  const results = []

  // Process in batches to avoid rate limiting
  for (let i = 0; i < movieIds.length; i += batchSize) {
    const batch = movieIds.slice(i, i + batchSize)
    const batchPromises = batch.map((id) => getMovieDetails(id))

    // Add a small delay between batches
    if (i > 0) {
      await delay(500)
    }

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)
  }

  return results
}
