import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  let requestData: any = {};
  
  try {
    requestData = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON request" }, { status: 400 });
  }

  const { destination, startDate, endDate, travelers, interests, startingLocation } = requestData;

  try {
    const diffTime = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const prompt = `
      Generate a detailed travel itinerary for a ${days}-day trip to ${destination}.
      Starting Location: ${startingLocation}
      Number of Travelers: ${travelers}
      Interests: ${interests?.join(", ")}
      
      Return the response in STRICT JSON format with the following structure:
      {
        "days": [
          {
            "day": 1,
            "places": [
              { "name": "Place Name", "description": "Short description", "time": "Morning/Afternoon/Evening" }
            ],
            "food_recommendations": ["Recommendation 1", "Recommendation 2"],
            "transport_tips": "How to get around",
            "alternative_places": ["Alt 1", "Alt 2"]
          }
        ],
        "estimated_budget": {
          "accommodation": "Estimated price",
          "food": "Estimated price",
          "transport": "Estimated price",
          "activities": "Estimated price",
          "total": "Total estimated price"
        },
        "packing_suggestions": ["Item 1", "Item 2"]
      }
      
      Make it feel like a professional travel guide.
    `;

    const response = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const itinerary = JSON.parse(response.choices[0].message.content || "{}");

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
      })
      .select("id")
      .single();

    if (tripError) throw tripError;

    return NextResponse.json({ tripId: tripData.id });
  } catch (error: any) {
    console.error("Error generating itinerary:", error);
    
    // Fallback to mock itinerary if quota error or fetch failed (likely network)
    const isQuotaError = error.status === 429 || error.message?.includes("quota") || error.code === "insufficient_quota";
    const isFetchFailed = error.message?.includes("fetch failed");

    if (isQuotaError || isFetchFailed) {
       console.log("OpenAI limit or network error. Generating mock itinerary...");
       

       const mockItinerary = {
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
