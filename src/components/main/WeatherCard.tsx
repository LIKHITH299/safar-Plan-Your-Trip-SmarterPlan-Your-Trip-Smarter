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
      className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/40"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-sky-50 rounded-2xl">
            {getWeatherIcon(data.weather, 40)}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {t("weatherIn")} {data.city}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900">{data.temperature}°C</span>
              <span className="text-slate-500 font-medium capitalize">{data.description}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
              <Thermometer size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("feelsLike")}</div>
              <div className="text-sm font-black text-slate-700">{data.feels_like}°C</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
              <CloudRain size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("rainChance")}</div>
              <div className="text-sm font-black text-slate-700">{data.rain_probability > 0 ? `${data.rain_probability}mm` : "0%"}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 rounded-xl text-sky-600">
              <Wind size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("windSpeed")}</div>
              <div className="text-sm font-black text-slate-700">{data.wind_speed} km/h</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
              <Droplets size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t("humidity")}</div>
              <div className="text-sm font-black text-slate-700">{data.humidity}%</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
