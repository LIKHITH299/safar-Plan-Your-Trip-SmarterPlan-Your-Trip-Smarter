"use client";

import { MapPin, Sparkles, PlaneTakeoff } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  {
    title: "Step 1",
    subtitle: "Enter your destination",
    description: "Tell us where you want to go and what you love.",
    icon: MapPin,
    color: "bg-sky-500"
  },
  {
    title: "Step 2",
    subtitle: "AI builds itinerary",
    description: "Our AI crafts a personalized plan in seconds.",
    icon: Sparkles,
    color: "bg-ocean-blue"
  },
  {
    title: "Step 3",
    subtitle: "Travel smarter",
    description: "Follow your plan, track expenses, and enjoy!",
    icon: PlaneTakeoff,
    color: "bg-palm-green"
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-16">
          How Safar Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
