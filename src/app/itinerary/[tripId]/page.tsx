import { supabase } from "@/lib/supabase";
import ItineraryClient from "./ItineraryClient";
import Link from "next/link";

interface PageProps {
  params: Promise<{ tripId: string }>;
}

export default async function ItineraryPage({ params }: PageProps) {
  const { tripId } = await params;
  const isMock = tripId.startsWith("mock-");

  // Fetch data on the server only if not a mock
  let tripData = null;
  let memData: any[] = [];

  if (!isMock) {
    const { data, error: tripError } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .single();
    
    if (data) {
      tripData = data;
      const { data: members } = await supabase
        .from("members")
        .select("*")
        .eq("trip_id", tripId);
      memData = members || [];
    }
  }

  // If we couldn't find it in Supabase (or it's a mock), 
  // we'll let the client-side component try to load it from sessionStorage.
  // We'll pass a flag to tell the client to check local storage.
  
  return (
    <ItineraryClient 
      tripId={tripId} 
      initialTrip={tripData} 
      initialMembers={memData} 
      isMock={isMock}
    />
  );
}
