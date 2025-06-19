import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function MovieNotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
        <p className="text-gray-600 mb-8">
          We couldn't find the movie you're looking for. It may have been removed or doesn't exist.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Movies
          </Link>
        </Button>
      </div>
    </main>
  )
}
