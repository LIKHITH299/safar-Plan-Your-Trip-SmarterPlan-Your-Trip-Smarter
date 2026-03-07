"use client";

import { motion } from "framer-motion";
import { Cloud } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function HeroSection({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-20 pb-10 overflow-hidden">
      {/* Background clouds */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, -20, 0]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute top-20 left-[10%] opacity-40 text-white"
      >
        <Cloud size={100} />
      </motion.div>
      
      <motion.div 
        animate={{ 
          x: [0, -40, 0],
          y: [0, 30, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute top-40 right-[15%] opacity-30 text-white"
      >
        <Cloud size={140} />
      </motion.div>

      <div className="container px-4 sm:px-6 relative z-10 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-slate-800 mb-6 leading-tight"
        >
          {t("heroTitle").split("—")[0]} — <span className="text-sky-600">{t("heroTitle").split("—")[1]}</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto px-4"
        >
          {t("heroSubtitle")}
        </motion.p>

        {children}
      </div>

      {/* Beach decoration at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-sand-beige to-transparent opacity-50 pointer-events-none" />
    </section>
  );
}
