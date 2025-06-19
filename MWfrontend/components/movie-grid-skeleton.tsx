import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MovieGridSkeleton() {
  // Create an array of 6 items for the skeleton
  const skeletonItems = Array.from({ length: 6 }, (_, i) => i)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {skeletonItems.map((item) => (
          <Card key={item} className="overflow-hidden h-full flex flex-col">
            <div className="relative aspect-[2/3] w-full">
              <Skeleton className="w-full h-full" />
              {/* Skeleton badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-16 rounded-md" />
              </div>
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start gap-2 mb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
              <div className="flex items-center mt-auto">
                <Skeleton className="h-5 w-5 mr-1" />
                <Skeleton className="h-5 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 mt-8">
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
  )
}
