import { supabase } from "@/lib/supabase";
import { MyTripsClient } from "./MyTripsClient";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const dynamic = "force-dynamic";

export default async function MyTripsPage() {
  const { data: trips, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching trips:", error);
  }

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Navbar />
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <MyTripsClient initialTrips={trips || []} />
      </div>
      <Footer />
    </main>
  );
}
