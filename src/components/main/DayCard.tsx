"use client";

import { motion } from "framer-motion";
import { PlaceCard } from "./PlaceCard";
import { Utensils, Info, Lightbulb } from "lucide-react";

interface DayProps {
  day: number;
  places: any[];
  food_recommendations: string[];
  transport_tips: string;
  alternative_places: string[];
}

export function DayCard({ day, places, food_recommendations, transport_tips, alternative_places }: DayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-sky-200">
          {day}
        </div>
        <h3 className="text-2xl font-extrabold text-slate-800">Day {day}</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {places.map((place, i) => (
          <PlaceCard key={i} {...place} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 font-bold mb-3">
            <Utensils size={18} />
            <span>Food Suggestions</span>
          </div>
          <ul className="text-sm text-amber-800 space-y-1">
            {food_recommendations.map((food, i) => (
              <li key={i} className="flex gap-2">• {food}</li>
            ))}
          </ul>
        </div>

        <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
          <div className="flex items-center gap-2 text-sky-600 font-bold mb-3">
            <Lightbulb size={18} />
            <span>Pro Tips</span>
          </div>
          <p className="text-sm text-sky-800">
            {transport_tips}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
