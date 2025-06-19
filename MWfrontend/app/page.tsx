import { Suspense } from "react"
import Header from "@/components/header"
import FilterPanel from "@/components/filter-panel"
import MovieGridSkeleton from "@/components/movie-grid-skeleton"
import HomeContent from "@/components/home-content"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <FilterPanel />
        <Suspense fallback={<MovieGridSkeleton />}>
          <HomeContent />
        </Suspense>
      </div>
    </main>
  )
}