"use client";

import { motion } from "framer-motion";
import { Sparkles, Wallet, Utensils, Users, Share2 } from "lucide-react";

import { useLanguage } from "@/components/providers/LanguageProvider";

export function FeatureCards() {
  const { t } = useLanguage();

  const FEATURES = [
    {
      title: t("featureAI"),
      description: t("featureAIDesc"),
      icon: Sparkles,
      color: "bg-amber-100 text-amber-600"
    },
    {
      title: t("featureBudget"),
      description: t("featureBudgetDesc"),
      icon: Wallet,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      title: t("featureFood"),
      description: t("featureFoodDesc"),
      icon: Utensils,
      color: "bg-rose-100 text-rose-600"
    },
    {
      title: t("featureSplitter"),
      description: t("featureSplitterDesc"),
      icon: Users,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      title: t("featureShareable"),
      description: t("featureShareableDesc"),
      icon: Share2,
      color: "bg-sky-100 text-sky-600"
    }
  ];

  return (
    <section className="py-20 px-4 md:px-6 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-800 mb-16">
          {t("featuresTitle")}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-sky-100/50 transition-all duration-300"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
