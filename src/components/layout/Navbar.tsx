"use client";

import Link from "next/link";
import { Palmtree, Search, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "#", label: t("explore") },
    { href: "/my-trips", label: t("myTrips") },
    { href: "#", label: t("about") },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-sky-100 px-4 md:px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-sky-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <Palmtree className="text-white w-6 h-6" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-sky-600 to-ocean-blue bg-clip-text text-transparent">
              Safar
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="hover:text-sky-600 transition-colors uppercase tracking-wide text-xs font-bold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center bg-slate-100 rounded-xl p-1 text-[10px] font-black tracking-tighter shadow-inner">
            <button 
              suppressHydrationWarning
              onClick={() => setLanguage("en")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all",
                language === "en" ? "bg-white text-sky-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              EN
            </button>
            <button 
              suppressHydrationWarning
              onClick={() => setLanguage("kn")}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all",
                language === "kn" ? "bg-white text-sky-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
              )}
            >
              ಕನ್ನಡ
            </button>
          </div>

          <button 
            suppressHydrationWarning 
            aria-label={t("search")}
            title={t("search")}
            className="p-2 hover:bg-sky-50 rounded-full transition-colors text-slate-500 hidden md:block"
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button suppressHydrationWarning className="hidden md:flex items-center gap-2 bg-gradient-to-br from-sky-400 to-ocean-blue text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-sky-200 hover:scale-105 transition-all duration-300">
            <User className="w-4 h-4" />
            <span className="text-sm">{t("profile")}</span>
          </button>

          <button 
            suppressHydrationWarning
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden fixed top-[73px] left-0 w-full bg-white z-40 border-b border-sky-100 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.label} 
                    href={link.href} 
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-slate-700 hover:text-sky-600 transition-colors uppercase tracking-wide border-b border-slate-50 pb-2"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold text-slate-500 uppercase">{t("language")}</span>
                <div className="flex items-center bg-slate-100 rounded-xl p-1 text-[10px] font-black tracking-tighter">
                  <button 
                    suppressHydrationWarning
                    onClick={() => setLanguage("en")}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-all",
                      language === "en" ? "bg-white text-sky-600 shadow-sm" : "text-slate-400"
                    )}
                  >
                    EN
                  </button>
                  <button 
                    suppressHydrationWarning
                    onClick={() => setLanguage("kn")}
                    className={cn(
                      "px-4 py-2 rounded-lg transition-all",
                      language === "kn" ? "bg-white text-sky-600 shadow-sm" : "text-slate-400"
                    )}
                  >
                    ಕನ್ನಡ
                  </button>
                </div>
              </div>

              <button suppressHydrationWarning className="flex items-center justify-center gap-3 bg-gradient-to-br from-sky-400 to-ocean-blue text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-sky-100">
                <User className="w-5 h-5" />
                <span>{t("profile")}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
