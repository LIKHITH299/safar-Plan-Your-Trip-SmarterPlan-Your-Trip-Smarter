"use client";

import { MapPin, Info, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface PlaceProps {
  name: string;
  description: string;
  time: string;
}

export function PlaceCard({ name, description, time }: PlaceProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5"
    >
      <div className="w-full md:w-32 h-24 bg-sky-100 rounded-xl flex items-center justify-center text-sky-400">
        <MapPin size={32} />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider bg-sky-50 px-2 py-1 rounded">
            {time}
          </span>
          <button suppressHydrationWarning className="text-slate-400 hover:text-sky-500 transition-colors">
            <ArrowUpRight size={18} />
          </button>
        </div>
        <h4 className="text-lg font-bold text-slate-800 mb-1">{name}</h4>
        <p className="text-sm text-slate-500 line-clamp-2">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
