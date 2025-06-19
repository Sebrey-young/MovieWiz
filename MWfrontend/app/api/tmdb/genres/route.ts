import { NextResponse } from "next/server"

export async function GET() {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    )

    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching genres:", error)
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 })
  }
}
