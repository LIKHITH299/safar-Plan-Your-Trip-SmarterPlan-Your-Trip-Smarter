"use client";

import { motion } from "framer-motion";
import { Cloud, CloudRain, Sun, Wind, Thermometer, Droplets, CloudLightning, CloudSnow, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface WeatherData {
  city: string;
  temperature: number;
  feels_like: number;
  weather: string;
  description: string;
  icon: string;
  rain_probability: number;
  wind_speed: number;
  humidity: number;
}

interface WeatherCardProps {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const getWeatherIcon = (weather: string, size = 24) => {
  const w = weather.toLowerCase();
  if (w.includes("rain") || w.includes("drizzle")) return <CloudRain size={size} className="text-blue-500" />;
  if (w.includes("thunderstorm")) return <CloudLightning size={size} className="text-purple-500" />;
  if (w.includes("snow")) return <CloudSnow size={size} className="text-blue-200" />;
  if (w.includes("cloud")) return <Cloud size={size} className="text-slate-400" />;
  if (w.includes("clear") || w.includes("sun")) return <Sun size={size} className="text-amber-500" />;
  return <Cloud size={size} className="text-slate-400" />;
};

export function WeatherCard({ data, loading, error }: WeatherCardProps) {
  const { t } = useLanguage();

  if (loading) {
    return (
      <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-center min-h-[140px]">
        <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return null; // Don't show anything if there's an error or no data
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/40 w-full"
    >
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-50 rounded-2xl shrink-0">
            {getWeatherIcon(data.weather, 28)}
          </div>
          <div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">
              {t("weatherIn")} {data.city}
            </h3>
            <p className="text-sm text-slate-500 font-medium capitalize hidden md:block">
              {data.description}
            </p>
          </div>
        </div>

        {/* Stats List */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center gap-3 text-sm md:text-base font-medium text-slate-700 bg-slate-50 p-3 rounded-xl">
            <Thermometer size={18} className="text-rose-500 shrink-0" />
            <span className="font-bold w-24">Temperature:</span>
            <span>{data.temperature}°C</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm md:text-base font-medium text-slate-700 bg-slate-50 p-3 rounded-xl">
            <CloudRain size={18} className="text-blue-500 shrink-0" />
            <span className="font-bold w-24">Rain chance:</span>
            <span>{data.rain_probability > 0 ? `${data.rain_probability}mm` : "0%"}</span>
          </div>
          
          <div className="flex items-center gap-3 text-sm md:text-base font-medium text-slate-700 bg-slate-50 p-3 rounded-xl">
            <Wind size={18} className="text-sky-500 shrink-0" />
            <span className="font-bold w-24">Wind:</span>
            <span>{data.wind_speed} km/h</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
