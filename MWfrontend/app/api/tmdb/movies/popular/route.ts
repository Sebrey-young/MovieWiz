import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "1"

    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

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
    console.error("Error fetching popular movies:", error)
    return NextResponse.json({ error: "Failed to fetch popular movies" }, { status: 500 })
  }
}
