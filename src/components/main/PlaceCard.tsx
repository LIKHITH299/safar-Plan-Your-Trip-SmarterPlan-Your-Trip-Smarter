"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Navigation, Star } from "lucide-react";
import { motion } from "framer-motion";
import { getPlaceThumbnail } from "@/lib/image-search";
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
      const img = await getPlaceThumbnail(name, destinationContext);
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
      <div className="flex flex-col md:flex-row h-full relative">
        {/* Mobile: Image First with Overlay | Desktop: Side Image */}
        <div className="relative w-full md:w-52 h-[220px] md:h-auto shrink-0 overflow-hidden">
          {loading ? (
            <div className="w-full h-full bg-slate-100 animate-pulse" />
          ) : (
            <>
              <Image 
                src={image} 
                alt={name}
                fill
                className="object-cover transform group-hover:scale-105 transition duration-700"
                sizes="(max-width: 768px) 100vw, 200px"
              />
              {/* Mobile Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:hidden" />
            </>
          )}

          {/* Top Left Tag */}
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-slate-800 uppercase tracking-widest shadow-sm">
              {time}
            </span>
          </div>

          {/* Mobile Overlay Text (Hidden on Desktop) */}
          <div className="absolute bottom-4 left-4 right-4 z-10 md:hidden">
            <div className="flex flex-col gap-1.5">
              {must_visit && (
                <div className="flex items-center gap-1 text-[10px] font-black text-amber-400 uppercase tracking-widest bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md inline-flex w-fit border border-white/10">
                  <Star size={10} fill="currentColor" />
                  <span>{t("mustVisit")}</span>
                </div>
              )}
              <h4 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
                {name}
              </h4>
            </div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="flex-1 flex flex-col p-4 md:p-6 bg-white">
          
          {/* Desktop Only: Title & Tags Header */}
          <div className="hidden md:flex items-start justify-between mb-3">
            <div className="space-y-1.5">
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
            
            <button suppressHydrationWarning className="text-slate-300 hover:text-sky-500 transition-colors p-2 hover:bg-sky-50 rounded-xl">
              <ArrowUpRight size={18} />
            </button>
          </div>

          {/* Description: Hidden on Mobile, Visible on Desktop */}
          <p className="hidden md:block text-sm text-slate-500 leading-relaxed line-clamp-2 md:line-clamp-3 font-medium mb-4">
            {description}
          </p>

          <div className="mt-auto pt-2 flex items-center justify-between md:justify-start gap-4">
             {/* Mobile Distance indicator (since title header is hidden) */}
             {distance_from_previous && (
                <div className="md:hidden flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
                  <Navigation size={12} className="text-sky-500" />
                  <span>{distance_from_previous}</span>
                </div>
              )}

             {/* Thumb-friendly Action Buttons */}
            <div className="flex gap-2 w-full md:w-auto mt-auto shrink-0 justify-end md:justify-start">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + (destinationContext ? " " + destinationContext : ""))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-sky-50 text-slate-600 hover:text-sky-600 px-5 h-[42px] rounded-xl text-xs sm:text-[11px] font-black uppercase tracking-widest transition-all border border-slate-100 hover:border-sky-200 w-full md:w-auto active:scale-95 shadow-sm"
              >
                <Navigation size={16} className="shrink-0" />
                <span>{t("directions")}</span>
              </a>
              <button suppressHydrationWarning className="md:hidden flex items-center justify-center text-slate-400 bg-slate-50 border border-slate-100 hover:text-sky-500 transition-colors h-[42px] w-[42px] hover:bg-sky-50 rounded-xl active:scale-95 shrink-0">
                <ArrowUpRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
