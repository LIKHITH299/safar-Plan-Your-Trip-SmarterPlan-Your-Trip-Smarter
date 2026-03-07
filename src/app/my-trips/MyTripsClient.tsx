"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Trash2, ArrowRight, Loader2, Plane } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { fetchPlaceImage } from "@/lib/pexels";

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
  share_id?: string;
  itinerary: any;
}

export function MyTripsClient({ initialTrips }: { initialTrips: Trip[] }) {
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { t } = useLanguage();
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch a single high-quality thumbnail for the first landmark
    const loadImages = async () => {
      const newImages: Record<string, string> = {};
      
      for (const trip of trips) {
        const firstLandmark = getFirstLandmark(trip);
        const cacheKey = trip.id;
        
        if (!images[cacheKey]) {
          // Use the first landmark + destination for the query
          const query = firstLandmark ? `${firstLandmark} ${trip.destination}` : trip.destination;
          const img = await fetchPlaceImage(query);
          newImages[cacheKey] = img;
        }
      }

      if (Object.keys(newImages).length > 0) {
        setImages(prev => ({ ...prev, ...newImages }));
      }
    };
    loadImages();
  }, [trips]);

  const getFirstLandmark = (trip: Trip) => {
    if (trip.itinerary?.days?.[0]?.places?.[0]?.name) {
      return trip.itinerary.days[0].places[0].name;
    }
    return null;
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(t("confirmDelete"));
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("trips").delete().eq("id", id);
      if (error) throw error;

      setTrips(trips.filter(t => t.id !== id));
      setMessage(t("tripDeleted"));
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
      alert(t("failedDelete"));
    } finally {
      setDeletingId(null);
    }
  };

  const getDuration = (start: string, end: string) => {
    const diff = Math.abs(new Date(end).getTime() - new Date(start).getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
          {t("myTripsTitle")}
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl text-lg">
          {t("manageTripsDesc")}
        </p>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-3"
          >
            <div className="bg-white/20 p-1 rounded-full">
               <Loader2 className="w-4 h-4 animate-spin" />
            </div>
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {trips.length === 0 ? (
        <div className="bg-white rounded-[3rem] p-12 md:p-20 text-center border-2 border-dashed border-slate-200 flex flex-col items-center gap-8">
          <div className="bg-slate-50 p-8 rounded-[2.5rem]">
            <Plane size={64} className="text-slate-200" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-800">{t("noTripsFound")}</h2>
            <p className="text-slate-500 max-w-sm mx-auto font-medium">{t("travelHistoryDesc")}</p>
          </div>
          <Link 
            href="/"
            className="flex items-center gap-3 bg-sky-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-sky-100 hover:scale-105 transition-all"
          >
            {t("startPlanning")} <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <motion.div
              key={trip.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-sky-100 transition-all duration-500 flex flex-col h-full"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img 
                  src={images[trip.id] || "https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=800"} 
                  alt={trip.destination}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest mb-1">
                    <MapPin size={14} className="text-sky-400" />
                    {getDuration(trip.start_date, trip.end_date)} {t("daysCount")}
                  </div>
                  <h3 className="text-2xl font-black text-white leading-tight">
                    {trip.destination}
                  </h3>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow gap-8">
                <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
                  <Calendar size={18} className="text-sky-500" />
                  <span suppressHydrationWarning>{t("createdLabel")}: {new Date(trip.created_at).toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })}</span>
                </div>

                <div className="mt-auto flex gap-3">
                  <Link 
                    href={`/itinerary/${trip.id}`}
                    className="flex-grow flex items-center justify-center gap-2 bg-slate-900 text-white py-4 px-6 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
                  >
                    {t("openTrip")} <ArrowRight size={18} />
                  </Link>
                  <button
                    onClick={() => handleDelete(trip.id)}
                    disabled={deletingId === trip.id}
                    className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {deletingId === trip.id ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Trash2 size={24} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
