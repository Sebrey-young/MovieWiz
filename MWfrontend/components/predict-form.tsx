"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Sparkles } from "lucide-react"
import { getGenres, type TMDBGenre } from "@/lib/tmdb"
import { on } from "events"

interface PredictFormProps {
  // Called with the predicted rating once api responds
  onPredict: (rating: number, title: string) => void
}

export default function PredictForm({ onPredict }: PredictFormProps) {
  const [genres, setGenres] = useState<TMDBGenre[]>([])
  const [isLoadingGenres, setIsLoadingGenres] = useState(true)

  const [formData, setFormData] = useState({
    title: "",
    year: 2023,
    runtime: 120,
    genre: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      setIsLoadingGenres(true)
      try {
        const genreList = await getGenres()
        setGenres(genreList)
      } catch (error) {
        console.error("Failed to fetch genres:", error)
      } finally {
        setIsLoadingGenres(false)
      }
    }

    fetchGenres()
  }, [])

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // 1. Look up the genre NAME from the TMDBGenre list
      // the ML model expects a string like "Action", not the TMDBGenre ID
      const selectedGenreObj = genres.find((g) => g.id.toString() === formData.genre)
      const genreName = selectedGenreObj ? selectedGenreObj.name : ""

      // 2. Build the payload for the ML service
      const payload = {
        // the ML model doesnt use 'title' in traiing but incase I want to use it later use:
        // title: formData.title,
        year: Number(formData.year),
        runtime: Number(formData.runtime),
        genre: genreName,
      }

      // 3. Call the ML endpoint using NEXT__PUBLIC_PREDICT_URL env var
      const response = await fetch(process.env.NEXT_PUBLIC_PREDICT_URL!, {
        method: "POST",
        headers: {"Content-Type": "application/json",},
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`Prediction API error: ${response.status}`)
      }

      const data: {predictedRating : number } = await response.json()

      // 4. Notify parent component with the predicted rating
      onPredict(data.predictedRating, formData.title)
    } catch (error) {
      console.error("Failed to get prediction:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardHeader className="bg-slate-50 dark:bg-gray-700 border-b dark:border-gray-600">
        <CardTitle>Predict Movie Rating</CardTitle>
        <CardDescription className="dark:text-gray-300">
          Enter movie details to get an AI-powered rating prediction
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Movie Title
            </label>
            <Input
              id="title"
              name="title"
              placeholder="Enter movie title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="year" className="text-sm font-medium">
              Release Year
            </label>
            <Input
              id="year"
              name="year"
              type="number"
              min="1900"
              max="2030"
              value={formData.year}
              onChange={handleInputChange}
              required
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label htmlFor="runtime" className="text-sm font-medium">
                Runtime (minutes)
              </label>
              <span className="text-sm text-gray-500 dark:text-gray-400">{formData.runtime} min</span>
            </div>
            <Slider
              id="runtime"
              min={60}
              max={240}
              step={1}
              defaultValue={[formData.runtime]}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, runtime: value[0] }))}
              className="py-4"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="genre" className="text-sm font-medium">
              Primary Genre
            </label>
            <Select
              value={formData.genre}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, genre: value }))}
              disabled={isLoadingGenres}
              required
            >
              <SelectTrigger id="genre" className="dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre.id} value={genre.id.toString()}>
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            <Sparkles className="mr-2 h-4 w-4" />
            {isSubmitting ? "Predicting..." : "Predict Rating"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
