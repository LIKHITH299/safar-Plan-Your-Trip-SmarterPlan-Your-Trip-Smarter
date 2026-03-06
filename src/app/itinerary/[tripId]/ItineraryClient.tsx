"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DayCard } from "@/components/main/DayCard";
import { ExpenseModal } from "@/components/main/ExpenseModal";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Clock, Users, Tag, Plus, Share2, Printer, ChevronRight, Wallet, ArrowRight, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItineraryClientProps {
  tripId: string;
  initialTrip: any;
  initialMembers: any[];
  isMock: boolean;
}

export default function ItineraryClient({ tripId, initialTrip, initialMembers, isMock }: ItineraryClientProps) {
  const [trip, setTrip] = useState<any>(initialTrip ? { ...initialTrip, members: initialMembers } : null);
  const [loading, setLoading] = useState(!initialTrip);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [expenses, setExpenses] = useState<any[]>([]);
  const [splits, setSplits] = useState<any[]>([]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");

  const [mounted, setMounted] = useState(false);

  const fetchExpenses = async () => {
    if (isMock) {
      const storedExp = sessionStorage.getItem(`expenses-${tripId}`);
      if (storedExp) setExpenses(JSON.parse(storedExp));

      const storedSplits = sessionStorage.getItem(`splits-${tripId}`);
      if (storedSplits) setSplits(JSON.parse(storedSplits));
      return;
    }

    // We still fetch expenses on the client for real-time updates
    const { data: expData } = await supabase
      .from("expenses")
      .select("*")
      .eq("trip_id", tripId)
      .order("created_at", { ascending: false });
    
    if (expData) setExpenses(expData);

    const { data: splitData } = await supabase
      .from("expense_splits")
      .select("*, expenses!inner(trip_id)")
      .eq("expenses.trip_id", tripId);
    
    if (splitData) setSplits(splitData);
  };

  useEffect(() => {
    setMounted(true);
    if (isMock || !initialTrip) {
      const stored = sessionStorage.getItem(`itinerary-${tripId}`);
      if (stored) {
        const parsedItinerary = JSON.parse(stored);
        setTrip({
          id: tripId,
          destination: parsedItinerary.destination || "Your Trip",
          itinerary: parsedItinerary,
          members: [{ id: "me", name: "Me" }]
        });
        setLoading(false);
      } else if (!initialTrip && !isMock) {
          // Final fallback try to fetch from client if server failed
          async function tryClientFetch() {
              const { data } = await supabase.from("trips").select("*").eq("id", tripId).single();
              if (data) setTrip({ ...data, members: [] });
              setLoading(false);
          }
          tryClientFetch();
      }
    }
    fetchExpenses();
  }, [tripId, isMock, initialTrip]);

  const calculateBalances = () => {
    const balances: Record<string, { paid: number; share: number }> = {};
    
    trip?.members?.forEach((p: any) => {
      balances[p.name] = { paid: 0, share: 0 };
    });

    expenses.forEach(exp => {
      if (!balances[exp.paid_by]) balances[exp.paid_by] = { paid: 0, share: 0 };
      balances[exp.paid_by].paid += exp.amount;
    });

    splits.forEach(split => {
      if (!balances[split.participant_name]) balances[split.participant_name] = { paid: 0, share: 0 };
      balances[split.participant_name].share += split.share_amount;
    });

    return Object.entries(balances).map(([name, data]) => ({
      name,
      paid: data.paid,
      share: data.share,
      balance: data.paid - data.share
    }));
  };

  const balances = calculateBalances();

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="w-24 h-24 border-4 border-slate-100 border-t-sky-500 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center font-black text-sky-500">
          Safar
        </div>
      </div>
      <p className="text-slate-400 font-medium animate-pulse">Loading adventure...</p>
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6 p-6 text-center">
      <div className="bg-slate-50 p-6 rounded-[2.5rem]">
         <MapPin size={48} className="text-slate-200" />
      </div>
      <div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">Trip Not Found</h2>
        <p className="text-slate-500 max-w-sm">We couldn't locate this itinerary. It might have expired or the link is invalid.</p>
      </div>
      <button 
        onClick={() => window.location.href = "/"}
        className="px-8 py-4 bg-sky-500 text-white rounded-2xl font-bold shadow-xl shadow-sky-100 hover:scale-105 transition-all"
      >
        Plan a New Trip
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sky-600 font-bold text-sm tracking-wider uppercase">
                <MapPin size={16} /> <span>{trip?.starting_point} → {trip?.destination}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                {trip?.destination} Adventure
              </h1>
              <div className="flex flex-wrap gap-4 text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Calendar size={16} /> 
                  {mounted ? (
                    <>
                      {trip?.start_date ? new Date(trip.start_date).toLocaleDateString() : ""} - {trip?.end_date ? new Date(trip.end_date).toLocaleDateString() : ""}
                    </>
                  ) : (
                    "Loading dates..."
                  )}
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <Users size={16} /> {trip?.travelers} Travelers
                </div>
                <div className="flex items-center gap-1.5 bg-sky-50 text-sky-700 px-3 py-1.5 rounded-lg border border-sky-100">
                  <Wallet size={16} /> {trip?.itinerary?.estimated_budget?.total || "N/A"}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied!");
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                <Share2 size={18} /> <span>Share</span>
              </button>
              <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                <Printer size={18} /> <span>Download PDF</span>
              </button>
            </div>
          </div>

          <div className="flex gap-8 mt-12 border-b border-slate-100">
            {["itinerary", "group", "budget"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "pb-4 text-sm font-bold capitalize transition-all relative",
                  activeTab === tab ? "text-sky-600" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab === "group" ? "Group" : tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-1 bg-sky-500 rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === "itinerary" && (
            <motion.div 
              key="itinerary"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-2 space-y-12">
                {trip?.itinerary?.days?.map((day: any) => (
                  <DayCard key={day.day} {...day} />
                ))}
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-sky-100/50 border border-sky-50">
                  <h3 className="text-xl font-bold text-slate-800 mb-6">Packing Suggestions</h3>
                  <div className="space-y-3">
                    {trip?.itinerary?.packing_suggestions?.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-slate-600">
                        <div className="w-2 h-2 rounded-full bg-sky-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-sky-500 to-ocean-blue rounded-[2rem] p-8 text-white shadow-2xl shadow-sky-200">
                  <h3 className="text-xl font-bold mb-6">Estimated Budget</h3>
                  <div className="space-y-4">
                    {Object.entries(trip?.itinerary?.estimated_budget || {}).map(([key, value]: [string, any]) => (
                      key !== "total" && (
                        <div key={key} className="flex justify-between items-center text-sky-50">
                          <span className="capitalize">{key}</span>
                          <span className="font-bold">{value}</span>
                        </div>
                      )
                    ))}
                    <div className="pt-4 border-t border-white/20 flex justify-between items-center text-xl font-black">
                      <span>Total</span>
                      <span>{trip?.itinerary?.estimated_budget?.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "group" && (
             <motion.div 
              key="group"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              {/* Traveler Management */}
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2">Travelers</div>
                  
                  {/* Member Chips */}
                  {trip?.members?.map((p: any, i: number) => (
                    <div 
                      key={p.id} 
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:border-sky-200 shadow-sm"
                    >
                      <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", [`bg-sky-400`, `bg-emerald-400`, `bg-rose-400`, `bg-amber-400`, `bg-indigo-400`, `bg-teal-400`][i % 6])} />
                      <span className="text-sm font-bold text-slate-700">{p.name}</span>
                      {p.name !== "Me" && (
                        <button 
                          onClick={async () => {
                            if (confirm(`Remove ${p.name} from the trip?`)) {
                              setTrip((prev: any) => ({
                                ...prev,
                                members: prev.members.filter((m: any) => m.id !== p.id)
                              }));

                              if (isMock) {
                                const stored = sessionStorage.getItem(`itinerary-${tripId}`);
                                if (stored) {
                                  const parsed = JSON.parse(stored);
                                  parsed.members = (parsed.members || []).filter((m: any) => m.id !== p.id);
                                  sessionStorage.setItem(`itinerary-${tripId}`, JSON.stringify(parsed));
                                }
                                return;
                              }
                              await supabase.from("members").delete().eq("id", p.id);
                            }
                          }}
                          className="text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Inline Add Member */}
                  <AnimatePresence mode="wait">
                    {isAddingMember ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-full border border-sky-100"
                      >
                        <input 
                          autoFocus
                          type="text"
                          placeholder="Name..."
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                              const name = newMemberName.trim();
                              if (name) {
                                const newId = Math.random().toString(36).substring(2);
                                const newMember = { id: newId, name };
                                
                                setTrip((prev: any) => ({
                                  ...prev,
                                  members: [...(prev.members || []), newMember]
                                }));
                                setIsAddingMember(false);
                                setNewMemberName("");

                                if (isMock) {
                                  const stored = sessionStorage.getItem(`itinerary-${tripId}`);
                                  if (stored) {
                                    const parsed = JSON.parse(stored);
                                    parsed.members = [...(parsed.members || [{ id: "me", name: "Me" }]), newMember];
                                    sessionStorage.setItem(`itinerary-${tripId}`, JSON.stringify(parsed));
                                  }
                                  return;
                                }
                                await supabase.from("members").insert({ trip_id: tripId, name });
                              }
                            } else if (e.key === "Escape") {
                              setIsAddingMember(false);
                              setNewMemberName("");
                            }
                          }}
                          className="px-4 py-1.5 bg-transparent border-none focus:outline-none text-sm font-bold text-slate-700 w-24 md:w-32"
                        />
                        <button 
                          onClick={async () => {
                            const name = newMemberName.trim();
                            if (name) {
                              const newId = Math.random().toString(36).substring(2);
                              const newMember = { id: newId, name };
                              
                              setTrip((prev: any) => ({
                                ...prev,
                                members: [...(prev.members || []), newMember]
                              }));
                              setIsAddingMember(false);
                              setNewMemberName("");

                              if (isMock) {
                                const stored = sessionStorage.getItem(`itinerary-${tripId}`);
                                if (stored) {
                                  const parsed = JSON.parse(stored);
                                  parsed.members = [...(parsed.members || [{ id: "me", name: "Me" }]), newMember];
                                  sessionStorage.setItem(`itinerary-${tripId}`, JSON.stringify(parsed));
                                }
                                return;
                              }
                              await supabase.from("members").insert({ trip_id: tripId, name });
                            }
                          }}
                          className="p-1.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => {
                            setIsAddingMember(false);
                            setNewMemberName("");
                          }}
                          className="p-1.5 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ) : (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => setIsAddingMember(true)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-sky-50 text-sky-600 border border-sky-100 font-bold text-sm hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                      >
                        <Plus size={16} /> Add
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-slate-800">Recent Expenses</h2>
                    <button 
                      onClick={() => setShowExpenseModal(true)}
                      className="bg-sky-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-600 transition-all flex items-center gap-2 shadow-lg shadow-sky-100"
                    >
                      <Plus size={20} /> Add Expense
                    </button>
                  </div>

                  <div className="space-y-4">
                    {expenses.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium italic">No expenses added yet.</p>
                      </div>
                    ) : (
                      expenses.map((exp) => (
                        <div key={exp.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:border-sky-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:text-sky-500 transition-colors">
                              <Wallet size={24} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800">{exp.description}</h4>
                              <p className="text-xs text-slate-500">Paid by <span className="font-bold text-slate-700">{exp.paid_by}</span> • {exp.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-black text-slate-900">₹{exp.amount}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Day {exp.day_number}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="w-full md:w-80 space-y-6">
                  <h2 className="text-xl font-bold text-slate-800">Balance Summary</h2>
                  <div className="space-y-4">
                    {balances.length <= 1 ? (
                      <div className="bg-white p-8 rounded-[2rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-3">
                        <Users className="text-slate-200" size={40} />
                        <p className="text-slate-400 text-sm font-medium">Add travel companions to split costs</p>
                      </div>
                    ) : (
                      balances.map((b, i) => (
                        <div key={b.name} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", [`bg-sky-400`, `bg-emerald-400`, `bg-rose-400`, `bg-amber-400`, `bg-indigo-400`, `bg-teal-400`][i % 6])} />
                              <span className="font-bold text-slate-700">{b.name}</span>
                            </div>
                            <span className={cn(
                              "text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md",
                              b.balance > 0 ? "bg-emerald-50 text-emerald-600" : b.balance < 0 ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-400"
                            )}>
                              {b.balance > 0 ? "Gets back" : b.balance < 0 ? "Owes" : "Settled"}
                            </span>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="text-xs text-slate-400">
                              <div>Paid: ₹{b.paid.toFixed(2)}</div>
                            </div>
                            <div className={cn(
                              "text-lg font-black",
                              b.balance > 0 ? "text-emerald-500" : b.balance < 0 ? "text-rose-500" : "text-slate-400"
                            )}>
                              ₹{Math.abs(b.balance).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "budget" && (
            <motion.div 
              key="budget"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl font-black text-slate-800 mb-8">Budget Analyst</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
                    <h3 className="text-xl font-bold mb-6">Planned vs Actual</h3>
                    <div className="space-y-6">
                      {Object.entries(trip?.itinerary?.estimated_budget || {}).map(([key, value]: [string, any]) => (
                        key !== "total" && (
                          <div key={key}>
                            <div className="flex justify-between text-sm font-bold mb-2">
                              <span className="capitalize">{key}</span>
                              <span className="text-slate-400">{value}</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "45%" }}
                                className="h-full bg-sky-500"
                              />
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showExpenseModal && (
          <ExpenseModal 
            tripId={tripId as string} 
            members={trip?.members}
            onClose={() => setShowExpenseModal(false)}
            onRefresh={fetchExpenses}
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}
