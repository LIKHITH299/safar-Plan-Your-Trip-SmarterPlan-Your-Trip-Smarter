import { Palmtree, Github, Twitter, Instagram } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-100 py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
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
            Your personal AI travel assistant. Plan your next adventure with ease and style.
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
          <h4 className="font-bold text-slate-800 mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-sky-600 transition-colors">Features</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">AI Planner</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">Expense Tracker</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">Community</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500">
            <li><Link href="#" className="hover:text-sky-600 transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">Press</Link></li>
            <li><Link href="#" className="hover:text-sky-600 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-slate-800 mb-4">Newsletter</h4>
          <p className="text-sm text-slate-500 mb-4">
            Get travel tips and AI updates directly in your inbox.
          </p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email" 
              className="bg-white px-3 py-2 rounded-lg border border-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 w-full"
            />
            <button suppressHydrationWarning className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-sky-600 transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div suppressHydrationWarning className="container mx-auto mt-12 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Safar AI. All rights reserved.
      </div>
    </footer>
  );
}
