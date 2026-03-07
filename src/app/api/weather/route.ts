import { NextResponse } from "next/server";

const API_KEY = "7bb91e0d9124fb495f820f0e7d9787d7";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");

  if (!city) {
    return NextResponse.json({ error: "City is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
      {
        next: { revalidate: 600 } // Cache for 10 minutes (600 seconds)
      }
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Simplify the response for our frontend
    const weatherData = {
      city: data.name,
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      weather: data.weather[0]?.main || "Unknown",
      description: data.weather[0]?.description || "",
      icon: data.weather[0]?.icon || "",
      rain_probability: data.rain ? (data.rain["1h"] || data.rain["3h"] || 0) : 0, // OpenWeather free API doesn't give direct rain % often in current weather, using precipitation as proxy
      wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      humidity: data.main.humidity
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Error fetching weather:", error);
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 });
  }
}
