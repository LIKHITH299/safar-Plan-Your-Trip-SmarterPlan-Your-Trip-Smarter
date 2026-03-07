"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Wifi, Loader2 } from "lucide-react";
import { useOffline } from "@/hooks/useOffline";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { useState, useEffect } from "react";

export function OfflineBanner() {
  const { isOffline, showBackOnline } = useOffline();
  const { t } = useLanguage();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const handleSyncStart = () => setIsSyncing(true);
    const handleSyncEnd = () => setIsSyncing(false);

    window.addEventListener("safar-sync-start", handleSyncStart);
    window.addEventListener("safar-sync-end", handleSyncEnd);

    return () => {
      window.removeEventListener("safar-sync-start", handleSyncStart);
      window.removeEventListener("safar-sync-end", handleSyncEnd);
    };
  }, []);

  return (
    <AnimatePresence>
      {(isOffline || showBackOnline || isSyncing) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-3rem)] max-w-md"
        >
          <div className={cn(
            "p-4 rounded-2xl shadow-2xl flex items-center gap-4 border backdrop-blur-md",
            isOffline ? "bg-slate-900/90 border-slate-700 text-white" : 
            isSyncing ? "bg-sky-600/90 border-sky-500 text-white" :
            "bg-emerald-600/90 border-emerald-500 text-white"
          )}>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              {isOffline ? <WifiOff size={20} /> : 
               isSyncing ? <Loader2 size={20} className="animate-spin" /> :
               <Wifi size={20} />}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">
                {isOffline ? t("offlineMode") : 
                 isSyncing ? t("syncing") :
                 t("backOnline")}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
