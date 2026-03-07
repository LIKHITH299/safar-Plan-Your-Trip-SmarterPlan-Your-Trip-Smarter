import { supabase } from "@/lib/supabase";
import ItineraryClient from "../../itinerary/[tripId]/ItineraryClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ shareId: string }>;
}

export default async function SharedTripPage({ params }: PageProps) {
  const { shareId } = await params;

  // Fetch data on the server by share_id
  const { data: tripData, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("share_id", shareId)
    .single();

  if (tripError || !tripData) {
    // Also try UUID just in case it's an old link or the ID was passed
    const { data: idData } = await supabase
      .from("trips")
      .select("*")
      .eq("id", shareId)
      .single();
    
    if (!idData) {
      return notFound();
    }
    
    // If found by ID, continue with those details
    const { data: members } = await supabase
      .from("members")
      .select("*")
      .eq("trip_id", idData.id);

    return (
      <ItineraryClient 
        tripId={idData.id} 
        initialTrip={idData} 
        initialMembers={members || []} 
        isMock={false}
      />
    );
  }

  const { data: members } = await supabase
    .from("members")
    .select("*")
    .eq("trip_id", tripData.id);

  return (
    <ItineraryClient 
      tripId={tripData.id} 
      initialTrip={tripData} 
      initialMembers={members || []} 
      isMock={false}
    />
  );
}
