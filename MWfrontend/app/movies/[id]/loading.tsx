import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MovieDetailsLoading() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      {/* Back button (fixed position) */}
      <div className="fixed top-4 left-4 z-50">
        <Button size="icon" className="rounded-full bg-slate-900 hover:bg-slate-800 shadow-lg" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5 text-white" />
            <span className="sr-only">Back to Movies</span>
          </Link>
        </Button>
      </div>

      {/* Movie backdrop skeleton */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px]">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-10">
          {/* Movie poster skeleton */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden shadow-xl">
              <Skeleton className="aspect-[2/3] w-full" />
            </Card>

            {/* Streaming services skeleton */}
            <div className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="flex flex-wrap gap-3">
                    <Skeleton className="h-12 w-12 rounded" />
                    <Skeleton className="h-12 w-12 rounded" />
                    <Skeleton className="h-12 w-12 rounded" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Movie details skeleton */}
          <div className="md:col-span-2">
            <Card className="shadow-xl">
              <CardContent className="p-6 md:p-8">
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />

                <div className="flex flex-wrap gap-2 mb-6">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <div className="flex flex-wrap gap-6 mb-6">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>

                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
