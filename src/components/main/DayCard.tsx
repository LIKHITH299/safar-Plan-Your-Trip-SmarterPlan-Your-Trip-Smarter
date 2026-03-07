"use client";

import { motion } from "framer-motion";
import { PlaceCard } from "./PlaceCard";
import { Utensils, Info, Lightbulb, Navigation } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface DayProps {
  day: number;
  places: any[];
  food_recommendations: string[];
  transport_tips: string;
  alternative_places: string[];
  destinationContext?: string;
}

export function DayCard({ day, places, food_recommendations, transport_tips, alternative_places, destinationContext }: DayProps) {
  const { t } = useLanguage();
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold text-lg md:text-xl shadow-lg shadow-sky-200 shrink-0">
          {day}
        </div>
        <h3 className="text-xl md:text-2xl font-extrabold text-slate-800">{t("dayOrdinal")} {day}</h3>
        
        <a 
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(places[places.length - 1].name + " " + destinationContext)}&waypoints=${places.slice(0, -1).map(p => encodeURIComponent(p.name + " " + destinationContext)).join('%7C')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto flex items-center gap-2 bg-white text-sky-600 hover:text-white hover:bg-sky-500 px-4 py-2 rounded-xl text-xs font-bold transition-all border border-sky-100 hover:border-sky-500 shadow-sm"
        >
          <Navigation size={14} />
          <span className="hidden sm:inline">{t("startDayRoute")}</span>
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {places.map((place, i) => (
          <PlaceCard key={i} {...place} destinationContext={destinationContext} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 font-bold mb-4">
            <Utensils size={20} />
            <span className="uppercase tracking-widest text-xs">{t("foodSuggestions")}</span>
          </div>
          <ul className="text-sm text-amber-800 space-y-2">
            {food_recommendations.map((food, i) => (
              <li key={i} className="flex gap-2 font-medium">• {food}</li>
            ))}
          </ul>
        </div>

        <div className="bg-sky-50 rounded-[2rem] p-6 border border-sky-100">
          <div className="flex items-center gap-2 text-sky-600 font-bold mb-4">
            <Lightbulb size={20} />
            <span className="uppercase tracking-widest text-xs">{t("proTips")}</span>
          </div>
          <p className="text-sm text-sky-800 font-medium leading-relaxed">
            {transport_tips}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
