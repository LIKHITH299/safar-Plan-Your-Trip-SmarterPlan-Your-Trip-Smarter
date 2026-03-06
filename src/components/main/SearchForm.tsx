"use client";

import { useState } from "react";
import { Calendar, MapPin, Users, Send } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const INTERESTS = [
  "Beaches", "Food", "Nightlife", "Temples", "Nature", "Adventure", "Shopping", "Culture", "Photography"
];

const SUGGESTIONS = [
  "3 day trip to Goa",
  "Weekend trip from Bangalore",
  "Solo trip to Bali",
  "Food tour in Delhi"
];

export function SearchForm() {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [travelers, setTravelers] = useState<number | "">(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [startingLocation, setStartingLocation] = useState("");

  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!destination || !startDate || !endDate) {
      alert("Please fill in destination and dates!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          travelers: travelers || 1,
          interests: selectedInterests,
          startingLocation,
        }),
      });

      const data = await response.json();
      if (data.tripId) {
        if (data.itinerary) {
          // If the server returned the itinerary directly (because it couldn't save to DB)
          sessionStorage.setItem(`itinerary-${data.tripId}`, JSON.stringify(data.itinerary));
        }
        window.location.href = `/itinerary/${data.tripId}`;
      } else {
        throw new Error(data.error || "Failed to generate itinerary");
      }
    } catch (error: any) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleSuggestion = (suggestion: string) => {
    // Basic parser for suggestions
    if (suggestion.includes("Goa")) setDestination("Goa");
    if (suggestion.includes("Bangalore")) setStartingLocation("Bangalore");
    if (suggestion.includes("Bali")) setDestination("Bali");
    if (suggestion.includes("Delhi")) setDestination("Delhi");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-sky-200/50 border border-sky-50"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 ml-1">
              <MapPin size={16} /> Destination
            </label>
            <input 
              type="text" 
              placeholder="Where to?" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50/50 transition-all font-medium"
              suppressHydrationWarning
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 ml-1">
              <Calendar size={16} /> Dates
            </label>
            <div className="flex gap-2 text-xs">
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-1/2 px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50/50 transition-all"
                suppressHydrationWarning
              />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-1/2 px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50/50 transition-all"
                suppressHydrationWarning
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-500 ml-1">
              <Users size={16} /> Travelers
            </label>
            <input 
              type="number" 
              min="1"
              value={travelers === "" ? "" : travelers}
              onChange={(e) => setTravelers(e.target.value ? parseInt(e.target.value) : "")}
              className="w-full px-4 py-3 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50/50 transition-all font-medium"
              suppressHydrationWarning
            />
          </div>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-slate-500 mb-3 ml-1 text-left">
            What are you interested in?
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <button
                suppressHydrationWarning
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                  selectedInterests.includes(interest) 
                    ? "bg-sky-500 text-white border-sky-500 scale-105 shadow-md shadow-sky-200"
                    : "bg-white text-slate-600 border-slate-100 hover:border-sky-300 hover:bg-sky-50"
                )}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-50">
          <div className="w-full md:w-1/3">
            <label className="block text-xs font-semibold text-slate-400 mb-1 ml-1 text-left uppercase">
              Starting Point
            </label>
            <input 
              type="text" 
              placeholder="Your city" 
              value={startingLocation}
              onChange={(e) => setStartingLocation(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50/50 transition-all"
              suppressHydrationWarning
            />
          </div>
          
          <motion.button 
            suppressHydrationWarning
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            onClick={handleGenerate}
            className={cn(
              "w-full md:w-auto px-10 py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all",
              loading 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                : "bg-gradient-to-br from-sky-400 to-ocean-blue text-white shadow-sky-200 active:shadow-inner"
            )}
          >
            {loading ? (
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : <Send size={20} />}
            {loading ? "Generating..." : "Generate Trip"}
          </motion.button>
        </div>
      </motion.div>


      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {SUGGESTIONS.map(suggestion => (
          <button
            suppressHydrationWarning
            key={suggestion}
            onClick={() => handleSuggestion(suggestion)}
            className="px-4 py-2 rounded-full text-sm bg-white/50 backdrop-blur-sm border border-sky-100 text-sky-700 hover:bg-sky-500 hover:text-white transition-all duration-300 cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
