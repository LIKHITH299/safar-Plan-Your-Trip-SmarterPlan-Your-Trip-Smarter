export async function getPlaceThumbnail(placeName: string, destination: string = ""): Promise<string> {
  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_API_KEY || process.env.GOOGLE_SEARCH_API_KEY;
  const googleSearchEngineId = process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID || process.env.GOOGLE_SEARCH_ENGINE_ID;
  const pexelsApiKey = "zxgfNP2XxQOOkmFnMyJJCe8ZVtU8TZqlnHT3kd5h9JHwFV4MeIURWt31"; // Used existing key from pexels.ts
  const unsplashApiKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || process.env.UNSPLASH_ACCESS_KEY;

  // 1. Construct the highly specific query
  const query = `${placeName} ${destination} India`.trim();

  // Tier 1: Google Custom Search API
  if (googleApiKey && googleSearchEngineId) {
    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${googleApiKey}&cx=${googleSearchEngineId}&q=${encodeURIComponent(query)}&searchType=image&num=1`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          return data.items[0].link;
        }
      }
    } catch (error) {
      console.warn("Google Custom Search failed, falling back to Pexels:", error);
    }
  }

  // Tier 2: Pexels API
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: pexelsApiKey,
        },
      }
    );

    if (response.ok) {
      const data = await response.json() as { photos: { src: { medium: string, large: string } }[] };
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.large || data.photos[0].src.medium;
      }
    }
  } catch (error) {
    console.warn("Pexels failed, falling back to Unsplash:", error);
  }

  // Tier 3: Unsplash API
  if (unsplashApiKey) {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${unsplashApiKey}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json() as { results: { urls: { regular: string } }[] };
        if (data.results && data.results.length > 0) {
          return data.results[0].urls.regular;
        }
      }
    } catch (error) {
       console.warn("Unsplash failed, using fallback images:", error);
    }
  }

  // Final Fallback: Static high-quality placeholder specifically for Indian contexts
  const fallbacks = [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop", // India landscape
    "https://images.unsplash.com/photo-1506461883276-594a12b11dc3?q=80&w=2070&auto=format&fit=crop", // Indian architecture
    "https://images.unsplash.com/photo-1596895111956-bf57c2c9d2f6?q=80&w=2070&auto=format&fit=crop"  // Nature
  ];
  
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}
