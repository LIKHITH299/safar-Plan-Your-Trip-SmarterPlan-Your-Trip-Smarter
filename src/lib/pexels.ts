export async function getDestinationImages(query: string, limit: number = 3): Promise<string[]> {
  const apiKey = "zxgfNP2XxQOOkmFnMyJJCe8ZVtU8TZqlnHT3kd5h9JHwFV4MeIURWt31";
  
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${limit}&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json() as { photos: { src: { large: string } }[] };
    return data.photos.map((photo) => photo.src.large);
  } catch (error) {
    console.error("Error fetching images from Pexels:", error);
    // Return placeholder images if API fails
    return [
      "https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1043458/pexels-photo-1043458.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800",
    ];
  }
}

export async function fetchPlaceImage(placeName: string, locationContext: string = ""): Promise<string> {
  const apiKey = "zxgfNP2XxQOOkmFnMyJJCe8ZVtU8TZqlnHT3kd5h9JHwFV4MeIURWt31";
  const query = `${placeName} ${locationContext}`.trim();

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: apiKey,
        },
      }
    );

    if (!response.ok) throw new Error("Pexels error");

    const data = await response.json() as { photos: { src: { medium: string } }[] };
    return data.photos[0]?.src.medium || "https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=800";
  } catch (error) {
    return "https://images.pexels.com/photos/1043458/pexels-photo-1043458.jpeg?auto=compress&cs=tinysrgb&w=800";
  }
}
