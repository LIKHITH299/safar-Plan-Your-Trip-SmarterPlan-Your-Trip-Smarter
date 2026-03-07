import { useState, useEffect, useCallback } from "react";

export function useOffline() {
  const [isOffline, setIsOffline] = useState(() => 
    typeof window !== "undefined" ? !navigator.onLine : false
  );
  const [showBackOnline, setShowBackOnline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowBackOnline(true);
      setTimeout(() => setShowBackOnline(false), 5000);
      
      // Trigger sync event
      window.dispatchEvent(new CustomEvent("safar-sync"));
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowBackOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return { isOffline, showBackOnline };
}
