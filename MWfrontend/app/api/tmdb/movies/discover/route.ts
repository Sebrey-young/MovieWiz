import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get("genre")
    const yearFrom = searchParams.get("yearFrom")
    const yearTo = searchParams.get("yearTo")
    const page = searchParams.get("page") || "1"

    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
    let url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${page}`

    if (genre && genre !== "all") {
      url += `&with_genres=${genre}`
    }

    if (yearFrom) {
      url += `&primary_release_date.gte=${yearFrom}-01-01`
    }

    if (yearTo) {
      url += `&primary_release_date.lte=${yearTo}-12-31`
    }

    const response = await fetch(url, { next: { revalidate: 3600 } }) // Cache for 1 hour

    if (response.status === 429) {
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 })
    }

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()

    // Return data without fetching additional details
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error discovering movies:", error)
    return NextResponse.json({ error: "Failed to discover movies" }, { status: 500 })
  }
}
