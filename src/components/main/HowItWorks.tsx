"use client";

import { MapPin, Sparkles, PlaneTakeoff } from "lucide-react";
import { motion } from "framer-motion";

import { useLanguage } from "@/components/providers/LanguageProvider";

export function HowItWorks() {
  const { t } = useLanguage();

  const STEPS = [
    {
      title: t("step1Title"),
      subtitle: t("step1Subtitle"),
      description: t("step1Desc"),
      icon: MapPin,
      color: "bg-sky-500"
    },
    {
      title: t("step2Title"),
      subtitle: t("step2Subtitle"),
      description: t("step2Desc"),
      icon: Sparkles,
      color: "bg-ocean-blue"
    },
    {
      title: t("step3Title"),
      subtitle: t("step3Subtitle"),
      description: t("step3Desc"),
      icon: PlaneTakeoff,
      color: "bg-palm-green"
    }
  ];

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-800 mb-16">
          {t("howItWorksTitle")}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="flex flex-col items-center text-center group"
            >
              <div className={`w-20 h-20 rounded-3xl ${step.color} flex items-center justify-center text-white mb-6 shadow-xl shadow-sky-200/50 group-hover:rotate-6 transition-transform duration-300`}>
                <step.icon size={36} />
              </div>
              <span className="text-sky-600 font-bold tracking-widest uppercase text-xs mb-2">
                {step.title}
              </span>
              <h3 className="text-2xl font-bold text-slate-800 mb-4">{step.subtitle}</h3>
              <p className="text-slate-600 max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-sky-100 -translate-y-1/2 -z-0 hidden md:block" />
    </section>
  );
}
