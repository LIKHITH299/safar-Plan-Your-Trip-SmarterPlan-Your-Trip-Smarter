import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  let requestData: {
    destination: string;
    startDate: string;
    endDate: string;
    travelers: string;
    interests?: string[];
    startingLocation: string;
    language?: string;
  };
  
  try {
    requestData = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON request" }, { status: 400 });
  }

  const { destination, startDate, endDate, travelers, interests, startingLocation } = requestData;

  try {
    const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const language = requestData.language || "en";
    const isKannada = language === "kn";

    const prompt = `
      Generate a professional, smart travel guide and detailed itinerary for a ${days}-day trip to ${destination}.
      Starting Location: ${startingLocation}
      Number of Travelers: ${travelers}
      User's Activity Preferences: ${interests?.join(", ")}
      Target Language: ${isKannada ? "Kannada (ಕನ್ನಡ)" : "English"}.
      ${isKannada ? "IMPORTANT: Provide the ENTIRE itinerary and travel options in Kannada text. This includes all names, descriptions, tags, and suggestions. HOWEVER, ensure all numbers (dates, distances, prices, day numbers) ALWAYS use standard Arabic numerals (1, 2, 3, etc.) and NOT Kannada numerals." : ""}
      
      ITINERARY PRIORITY LOGIC (CRITICAL):
      1. PRIORITY 1: Include all iconic, famous, and must-visit tourist attractions in ${destination} (e.g. major landmarks, historical sites, famous beaches, top viewpoints). Users should NOT miss these regardless of their specific interests.
      2. PRIORITY 2: Use the user's preferences (${interests?.join(", ")}) as a secondary filter to fill remaining slots or customize descriptions.
      
      TRAVEL ROUTE LOGIC:
      Analyze the best ways to reach ${destination} from ${startingLocation}. Provide options for Flight, Train, Bus, and Car where applicable.
      
      PLANNING RULES:
      1. DURATION: Exactly ${days} days. Return Day 1 to Day ${days}.
      2. GEOGRAPHIC CLUSTERING: Group places visited each day by proximity to minimize travel time.
      3. LOGICAL FLOW: 3-5 places per day.
      4. DISTANCE: For every place, include the distance from the previous stop.
      
      Return the response in STRICT JSON format:
      {
        "destination": "${destination}",
        "travel_options": [
          { "mode": "flight", "time": "e.g. 1 hr", "details": "e.g. Direct flights available" },
          { "mode": "train", "time": "e.g. 10 hrs", "details": "e.g. Overnight express" },
          { "mode": "bus", "time": "e.g. 12 hrs", "details": "e.g. AC Sleeper" },
          { "mode": "car", "time": "e.g. 10 hrs", "details": "e.g. 560 km via NH-48" }
        ],
        "destinations": [
          {
            "name": "Destination Name",
            "tagline": "Vibe description",
            "distance": "Distance from start point",
            "travel_time": "Main travel mode time",
            "why_it_works": ["Point 1", "Point 2"],
            "things_to_visit": ["Famous Spot 1", "Famous Spot 2"],
            "best_for": "Main vibe"
          }
        ],
        "days": [
          {
            "day": 1,
            "places": [
              { 
                "name": "Place Name", 
                "description": "Engaging description", 
                "time": "Morning/Afternoon/Evening",
                "distance_from_previous": "e.g. 2 km",
                "must_visit": true/false (Set to true for famous/iconic locations)
              }
            ],
            "food_recommendations": ["Food 1", "Food 2"],
            "transport_tips": "Getting around info"
          }
        ],
        "famous_places": [
          { "name": "Place Name", "description": "Why it's iconic" }
        ],
        "estimated_budget": {
          "accommodation": "Price",
          "food": "Price",
          "transport": "Price",
          "activities": "Price",
          "total": "Total"
        },
        "packing_suggestions": ["Item 1", "Item 2"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const itinerary = JSON.parse(response.choices[0].message.content || "{}");
    const shareId = `${destination.toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;

    // Save to Supabase
    const { data: tripData, error: tripError } = await supabase
      .from("trips")
      .insert({
        destination,
        start_date: startDate,
        end_date: endDate,
        travelers: parseInt(travelers) || 1,
        interests: interests?.join(", ") || "",
        starting_point: startingLocation,
        itinerary: itinerary,
        share_id: shareId
      })
      .select("id")
      .single();

    if (tripError) throw tripError;

    return NextResponse.json({ tripId: tripData.id, shareId });
  } catch (error: any) {
    console.error("Error generating itinerary:", error);
    
    // Fallback to mock itinerary if quota error or fetch failed (likely network)
    const isQuotaError = error.status === 429 || error.message?.includes("quota") || error.code === "insufficient_quota";
    const isFetchFailed = error.message?.includes("fetch failed");

    if (isQuotaError || isFetchFailed) {
       console.log("OpenAI limit or network error. Generating mock itinerary...");
       

       const mockItinerary = {
         destinations: [
           {
             name: "Ooty",
             tagline: "Classic hill station parents love",
             distance: "~270 km",
             travel_time: "Car (6–7 hrs)",
             why_it_works: [
               "Scenic hill views",
               "Tea gardens",
               "Toy train experience"
             ],
             things_to_visit: [
               "Ooty Lake boating",
               "Nilgiri Mountain Railway",
               "Doddabetta Peak",
               "Tea factory"
             ],
             best_for: "Chill sightseeing"
           }
         ],
         days: [
           {
             day: 1,
             places: [
               { name: "Beautiful Beach", description: "A stunning white sand beach to relax.", time: "Morning" },
               { name: "Local Market", description: "Bustling market with local crafts.", time: "Afternoon" }
             ],
             food_recommendations: ["Beachside Cafe", "Spicy Street Food Stall"],
             transport_tips: "Rent a scooter or use local taxis.",
             alternative_places: ["Hidden Cove", "Mountain Viewpoint"]
           }
         ],
         estimated_budget: {
           accommodation: "$100",
           food: "$50",
           transport: "$20",
           activities: "$30",
           total: "$200"
         },
         packing_suggestions: ["Sunscreen", "Comfortable shoes", "Camera"]
       };

       try {
         // Attempt to save mock data
         const mockShareId = `${(destination || "trip").toLowerCase().replace(/\s+/g, "-")}-${Math.random().toString(36).substring(2, 7)}`;
         const { data: mockData, error: mockError } = await supabase
           .from("trips")
           .insert({
             destination: destination || "Mock Destination",
             start_date: startDate || new Date().toISOString(),
             end_date: endDate || new Date(Date.now() + 86400000).toISOString(),
             travelers: parseInt(travelers) || 1,
             interests: interests ? interests.join(", ") : "Sightseeing",
             starting_point: startingLocation || "Home",
             itinerary: mockItinerary,
             share_id: mockShareId
           })
           .select("id")
           .single();

         if (mockError) {
           console.error("Supabase Fallback Insert Error:", mockError);
           // If Supabase ALSO fails due to network, just return mock data without saving
           return NextResponse.json({ 
             tripId: "mock-" + Date.now(), 
             itinerary: mockItinerary,
             warning: "Saved locally only due to Supabase connection issue." 
           });
         }
         return NextResponse.json({ tripId: mockData.id, warning: "Used mock data due to API limits." });
       } catch (dbError: any) {
           console.error("Critical DB Catch Error:", dbError);
           // Return the mock itinerary directly as a last resort
           return NextResponse.json({ 
             tripId: "mock-direct-" + Date.now(), 
             itinerary: mockItinerary,
             warning: "Direct mock fallback triggered." 
           });
       }
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
