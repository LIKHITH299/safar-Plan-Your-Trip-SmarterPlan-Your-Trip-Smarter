"use client";

import Link from "next/link";
import { Palmtree, Search, User } from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-sky-100 px-6 py-4 flex items-center justify-between"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div className="bg-sky-500 p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
          <Palmtree className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-ocean-blue bg-clip-text text-transparent">
          Safar
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
        <Link href="#" className="hover:text-sky-600 transition-colors">Explore</Link>
        <Link href="#" className="hover:text-sky-600 transition-colors">My Trips</Link>
        <Link href="#" className="hover:text-sky-600 transition-colors">About</Link>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-sky-50 rounded-full transition-colors text-slate-500">
          <Search className="w-5 h-5" />
        </button>
        <button className="flex items-center gap-2 bg-gradient-to-br from-sky-400 to-ocean-blue text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-sky-200 hover:scale-105 transition-all duration-300">
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </div>
    </motion.nav>
  );
}
