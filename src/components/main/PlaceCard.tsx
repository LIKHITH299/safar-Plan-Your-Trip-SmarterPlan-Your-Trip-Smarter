"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Navigation, Star } from "lucide-react";
import { motion } from "framer-motion";
import { fetchPlaceImage } from "@/lib/pexels";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface PlaceProps {
  name: string;
  description: string;
  time: string;
  distance_from_previous?: string;
  destinationContext?: string;
  must_visit?: boolean;
}

export function PlaceCard({ name, description, time, distance_from_previous, destinationContext, must_visit }: PlaceProps) {
  const { t } = useLanguage();
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImage() {
      const img = await fetchPlaceImage(name, destinationContext);
      setImage(img);
      setLoading(false);
    }
    loadImage();
  }, [name, destinationContext]);

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="relative w-full md:w-52 h-48 md:h-auto overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-slate-100 animate-pulse" />
          ) : (
            <Image 
              src={image} 
              alt={name}
              fill
              className="object-cover transform group-hover:scale-110 transition duration-700"
              sizes="(max-width: 768px) 100vw, 200px"
              priority={false}
            />
          )}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-sky-600 uppercase tracking-widest shadow-sm">
              {time}
            </span>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
          <div className="flex items-start justify-between mb-2">
            <div className="space-y-1">
              {must_visit && (
                <div className="flex items-center gap-1 text-[10px] font-black text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-md inline-flex w-fit mb-1 border border-amber-100">
                  <Star size={10} fill="currentColor" />
                  <span>{t("mustVisit")}</span>
                </div>
              )}
              <h4 className="text-xl font-black text-slate-800 group-hover:text-sky-600 transition-colors uppercase tracking-tight">
                {name}
              </h4>
              {distance_from_previous && (
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">
                  <Navigation size={10} className="text-sky-500" />
                  <span>{distance_from_previous}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2 shrink-0">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + (destinationContext ? " " + destinationContext : ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 hover:border-sky-200"
              >
                <Navigation size={12} />
                <span>{t("directions")}</span>
              </a>
              <button suppressHydrationWarning className="text-slate-300 hover:text-sky-500 transition-colors p-2 hover:bg-sky-50 rounded-xl">
                <ArrowUpRight size={20} />
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 font-medium">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
