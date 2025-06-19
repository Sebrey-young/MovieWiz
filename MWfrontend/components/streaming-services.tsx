import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Define streaming service data
const streamingServices = [
  {
    id: "netflix",
    name: "Netflix",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "hulu",
    name: "Hulu",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "disney_plus",
    name: "Disney+",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "amazon_prime",
    name: "Amazon Prime",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "hbo_max",
    name: "HBO Max",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "apple_tv",
    name: "Apple TV+",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "peacock",
    name: "Peacock",
    logo: "/placeholder.svg?height=60&width=60",
  },
  {
    id: "paramount_plus",
    name: "Paramount+",
    logo: "/placeholder.svg?height=60&width=60",
  },
]

// Mapping of provider IDs to their home page URLs
const providerUrls = {
  8: "https://www.netflix.com", // Netflix
  15: "https://www.hulu.com", // Hulu
  337: "https://www.disneyplus.com", // Disney+
  119: "https://www.amazon.com/prime", // Amazon Prime Video
  384: "https://www.max.com", // HBO Max (now Max)
  350: "https://tv.apple.com", // Apple TV+
  386: "https://www.peacocktv.com", // Peacock
  531: "https://www.paramountplus.com", // Paramount+
  2: "https://tv.apple.com", // Apple iTunes
  3: "https://play.google.com/store", // Google Play Movies & TV
  68: "https://www.microsoft.com/en-us/store", // Microsoft Store
  279: "https://www.youtube.com/movies", // YouTube Movies
  // Add more provider IDs and URLs as needed
}

// Function to get the URL for a provider
const getProviderUrl = (providerId) => {
  return providerUrls[providerId] || "https://www.google.com/search?q=" + encodeURIComponent("streaming service")
}

interface StreamingServicesProps {
  providers: Record<string, any> | null
}

export default function StreamingServices({ providers }: StreamingServicesProps) {
  if (!providers || !providers.results || !providers.results.US) {
    return (
      <Card className="dark:bg-gray-800">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Streaming Availability</h3>
          <p className="text-gray-500 dark:text-gray-400">No streaming information available for this movie.</p>
        </CardContent>
      </Card>
    )
  }

  const usProviders = providers.results.US
  const flatrate = usProviders.flatrate || []
  const rent = usProviders.rent || []
  const buy = usProviders.buy || []

  // Combine all providers and remove duplicates
  const allProviders = [...new Map([...flatrate, ...rent, ...buy].map((item) => [item.provider_id, item])).values()]

  if (allProviders.length === 0) {
    return (
      <Card className="dark:bg-gray-800">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">Streaming Availability</h3>
          <p className="text-gray-500 dark:text-gray-400">No streaming information available for this movie.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="dark:bg-gray-800">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Where to Watch</h3>

        {flatrate.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Subscription</h4>
            <div className="flex flex-wrap gap-3">
              {flatrate.map((provider) => (
                <Button
                  key={provider.provider_id}
                  variant="outline"
                  className="p-1 h-auto rounded-lg hover:scale-105 transition-transform"
                  asChild
                >
                  <a 
                    href={getProviderUrl(provider.provider_id)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title={provider.provider_name}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}

        {rent.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Rent</h4>
            <div className="flex flex-wrap gap-3">
              {rent.map((provider) => (
                <Button
                  key={provider.provider_id}
                  variant="outline"
                  className="p-1 h-auto rounded-lg hover:scale-105 transition-transform"
                  asChild
                >
                  <a 
                    href={getProviderUrl(provider.provider_id)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title={provider.provider_name}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}

        {buy.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Buy</h4>
            <div className="flex flex-wrap gap-3">
              {buy.map((provider) => (
                <Button
                  key={provider.provider_id}
                  variant="outline"
                  className="p-1 h-auto rounded-lg hover:scale-105 transition-transform"
                  asChild
                >
                  <a 
                    href={getProviderUrl(provider.provider_id)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    title={provider.provider_name}
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                      alt={provider.provider_name}
                      width={50}
                      height={50}
                      className="rounded"
                    />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}