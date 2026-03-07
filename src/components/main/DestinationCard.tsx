"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, CheckCircle2, Star, Info } from "lucide-react";
import { getDestinationImages } from "@/lib/pexels";
import Image from "next/image";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  index: number;
  name: string;
  tagline: string;
  distance: string;
  travel_time: string;
  why_it_works: string[];
  things_to_visit: string[];
  best_for: string;
}

export function DestinationCard({
  index,
  name,
  tagline,
  distance,
  travel_time,
  why_it_works,
  things_to_visit,
  best_for,
}: DestinationCardProps) {
  const { t } = useLanguage();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      const fetchedImages = await getDestinationImages(`${name} travel`, 3);
      setImages(fetchedImages);
      setLoading(false);
    }
    loadImages();
  }, [name]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-500 group"
    >
      <div className="flex flex-col gap-6 md:gap-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-sky-500 font-bold text-xs md:text-sm tracking-widest uppercase">
                <span className="bg-sky-50 px-3 py-1 rounded-full">{index + 1}. {t("destination")}</span>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 group-hover:text-sky-600 transition-colors">
                {name}
              </h2>
              <p className="text-base md:text-lg text-slate-500 font-medium italic">
                "{tagline}"
              </p>
            </div>
            <div className="hidden md:block">
               <div className="bg-sky-50 p-4 rounded-3xl text-sky-600">
                  <Star size={32} fill="currentColor" opacity={0.2} />
               </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4 pt-2">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 text-slate-600 font-bold text-xs md:text-sm">
              <MapPin size={18} className="text-sky-500" />
              <span>{t("distance")}: {distance}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 text-slate-600 font-bold text-xs md:text-sm">
              <Clock size={18} className="text-sky-500" />
              <span>{t("travel")}: {travel_time}</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="aspect-video sm:aspect-[4/3] bg-slate-100 animate-pulse rounded-2xl" />
            ))
          ) : (
            images.map((src, i) => (
              <div 
                key={i} 
                className={cn(
                  "relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-md group/img",
                  i === 2 ? "sm:col-span-2 lg:col-span-1" : ""
                )}
              >
                <Image 
                  src={src} 
                  alt={`${name} view ${i + 1}`}
                  fill
                  className="object-cover transform hover:scale-110 transition duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity" />
              </div>
            ))
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div>
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-4">
                <CheckCircle2 size={24} className="text-emerald-500" />
                {t("whyItWorks")}
              </h3>
              <ul className="space-y-3">
                {why_it_works.map((point, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2.5 shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-sky-50/50 p-6 rounded-3xl border border-sky-100/50">
              <h3 className="flex items-center gap-2 text-lg font-bold text-sky-800 mb-2">
                <Info size={20} className="text-sky-500" />
                {t("bestFor")}
              </h3>
              <p className="text-sky-700 font-medium leading-relaxed">
                {best_for}
              </p>
            </div>
          </div>

          <div>
             <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-4">
                <MapPin size={24} className="text-rose-500" />
                {t("thingsToVisit")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {things_to_visit.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-sky-200 transition-colors group/item">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-sky-50 group-hover/item:text-sky-500 transition-colors">
                       <span className="text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Divider logic is handled by the parent */}
    </motion.div>
  );
}
