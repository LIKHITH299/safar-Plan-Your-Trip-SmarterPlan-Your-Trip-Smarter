"use client";

import { Palmtree, Github, Twitter, Instagram } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-12 px-4 md:px-6">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-sky-500 p-1.5 rounded-lg">
              <Palmtree className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-slate-800">
              Safar
            </span>
          </Link>
          <p className="text-slate-500 text-sm leading-relaxed">
            {t("footerDesc")}
          </p>
          <div className="flex gap-4">
            <button suppressHydrationWarning className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-sky-500 hover:border-sky-200 transition-all">
              <Twitter size={18} />
            </button>
            <button suppressHydrationWarning className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-sky-500 hover:border-sky-200 transition-all">
              <Instagram size={18} />
            </button>
            <button suppressHydrationWarning className="p-2 bg-white rounded-lg border border-slate-100 text-slate-400 hover:text-sky-500 hover:border-sky-200 transition-all">
              <Github size={18} />
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 mb-4">{t("product")}</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-sky-600 transition-colors">{t("explore")}</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">{t("featureAI")}</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">{t("featureSplitter")}</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">{t("community")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 mb-4">{t("company")}</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-sky-600 transition-colors">{t("about")}</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">{t("careers")}</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">{t("press")}</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">{t("contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 mb-4">{t("newsletter")}</h4>
          <p className="text-sm text-slate-500 mb-4">
            {t("newsletterDesc")}
          </p>
          <div className="flex gap-2">
            <input 
              suppressHydrationWarning
              type="email" 
              placeholder={t("emailPlaceholder")} 
              className="bg-white px-3 py-2 rounded-lg border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 w-full"
            />
            <button suppressHydrationWarning className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-sky-600 transition-colors">
              {t("join")}
            </button>
          </div>
        </div>
      </div>
      
      <div suppressHydrationWarning className="container mx-auto mt-12 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Safar AI. {t("allRightsReserved")}
      </div>
    </footer>
  );
}
