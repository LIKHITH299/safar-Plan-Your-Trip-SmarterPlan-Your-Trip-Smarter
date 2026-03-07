"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Users, Wallet, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

const CATEGORY_KEYS = ["accommodation", "food", "transport", "activities", "shopping", "misc"];

export function ExpenseModal({ 
  tripId, 
  onClose, 
  onRefresh,
  members: initialMembers = []
}: { 
  tripId: string, 
  onClose: () => void, 
  onRefresh: () => void,
  members?: any[]
}) {
  const { t, language } = useLanguage();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [dayNumber, setDayNumber] = useState(1);
  const [paidBy, setPaidBy] = useState("Me");
  const [members, setMembers] = useState<string[]>(initialMembers.length > 0 ? initialMembers.map(m => m.name) : ["Me"]);
  const [splitAmong, setSplitAmong] = useState<string[]>(initialMembers.length > 0 ? initialMembers.map(m => m.name) : ["Me"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialMembers.length > 0) {
      const names = initialMembers.map(m => m.name);
      setMembers(names);
      setSplitAmong(names);
      if (names.includes("Me")) setPaidBy("Me");
      else setPaidBy(names[0]);
      return;
    }

    async function fetchMembers() {
      const isMock = tripId.startsWith("mock-");
      if (isMock) {
        const stored = sessionStorage.getItem(`itinerary-${tripId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          const memberList = parsed.members || [{ id: "me", name: "Me" }];
          const names = memberList.map((m: any) => m.name);
          setMembers(names);
          setSplitAmong(names);
          if (names.includes("Me")) setPaidBy("Me");
          else setPaidBy(names[0]);
        }
        return;
      }
      
      const { data, error } = await supabase
        .from("members")
        .select("name")
        .eq("trip_id", tripId);
      
      if (data && data.length > 0) {
        const names = data.map((p: any) => p.name);
        setMembers(names);
        setSplitAmong(names);
        if (names.includes("Me")) setPaidBy("Me");
        else setPaidBy(names[0]);
      }
    }
    fetchMembers();
  }, [tripId, initialMembers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (splitAmong.length === 0) {
      alert("Please select at least one person to split with.");
      return;
    }
    setLoading(true);

    try {
      const isMock = tripId.startsWith("mock-");
      const newExpenseId = crypto.randomUUID?.() || Math.random().toString(36).substring(2);

      const splitAmount = parseFloat(amount) / splitAmong.length;

      // Handle Offline Mode
      if (!navigator.onLine && !isMock) {
        const pendingExpense = {
          id: `pending-${newExpenseId}`,
          trip_id: tripId,
          description,
          amount: parseFloat(amount),
          category,
          paid_by: paidBy,
          day_number: dayNumber,
          created_at: new Date().toISOString(),
          splits: splitAmong.map(name => ({
            participant_name: name,
            share_amount: splitAmount
          }))
        };

        const existingPending = JSON.parse(localStorage.getItem(`pending_expenses_${tripId}`) || "[]");
        localStorage.setItem(`pending_expenses_${tripId}`, JSON.stringify([pendingExpense, ...existingPending]));
        
        onRefresh();
        onClose();
        return;
      }

      if (isMock) {
        const expense = {
          id: newExpenseId,
          trip_id: tripId,
          description,
          amount: parseFloat(amount),
          category,
          paid_by: paidBy,
          day_number: dayNumber,
          created_at: new Date().toISOString()
        };

        const existingExp = JSON.parse(sessionStorage.getItem(`expenses-${tripId}`) || "[]");
        sessionStorage.setItem(`expenses-${tripId}`, JSON.stringify([expense, ...existingExp]));

        const newSplits = splitAmong.map(name => ({
          id: Math.random().toString(36).substring(2),
          expense_id: newExpenseId,
          participant_name: name,
          share_amount: splitAmount
        }));

        const existingSplits = JSON.parse(sessionStorage.getItem(`splits-${tripId}`) || "[]");
        sessionStorage.setItem(`splits-${tripId}`, JSON.stringify([...existingSplits, ...newSplits]));

        onRefresh();
        onClose();
        return;
      }

      const { data: expense, error: expenseError } = await supabase
        .from("expenses")
        .insert({
          trip_id: tripId,
          description,
          amount: parseFloat(amount),
          category,
          paid_by: paidBy,
          day_number: dayNumber
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      const splits = splitAmong.map(name => ({
        expense_id: expense.id,
        participant_name: name,
        share_amount: splitAmount
      }));

      const { error: splitError } = await supabase
        .from("expense_splits")
        .insert(splits);

      if (splitError) throw splitError;

      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert(t("errorAddingExpense"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] md:rounded-[3rem] shadow-2xl p-6 sm:p-8 max-h-[95vh] md:max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Plus size={24} />
            </div>
            {t("addExpense")}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">{t("description")}</label>
            <input 
              required
              type="text" 
              placeholder={language === "kn" ? "ಉದಾ: ಹೋಟೆಲ್ ಬಿಲ್" : "e.g. Dinner at Beach Club"}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50 transition-all font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">{t("amount")}</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                <input 
                  required
                  type="number" 
                  placeholder="0.00"
                  step="0.01"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full pl-10 pr-5 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50 transition-all font-bold"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">{t("day")}</label>
              <input 
                type="number" 
                min="1"
                value={dayNumber}
                onChange={e => setDayNumber(parseInt(e.target.value))}
                className="w-full px-5 py-4 rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-400 bg-slate-50 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">{t("category")}</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_KEYS.map(key => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategory(key)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-bold transition-all border",
                    category === key 
                      ? "bg-sky-500 text-white border-sky-500"
                      : "bg-white text-slate-500 border-slate-100 hover:border-sky-200"
                  )}
                >
                  {t(key as any)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">{t("paidBy")}</label>
              <select 
                value={paidBy}
                onChange={e => setPaidBy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 font-bold focus:ring-2 focus:ring-sky-400 outline-none"
              >
                {members.map(p => <option key={p} value={p}>{p === "Me" ? t("me") : p}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center justify-between">
                <span>{t("splitAmong")}</span>
                <span className="text-[10px] text-sky-600 lowercase">{splitAmong.length} {t("peopleCount")}</span>
              </label>
              <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                {members.map(p => (
                  <label key={p} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer hover:bg-white transition-colors">
                    <input 
                      type="checkbox" 
                      checked={splitAmong.includes(p)}
                      onChange={() => {
                        setSplitAmong(prev => 
                          prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                        );
                      }}
                      className="w-4 h-4 rounded text-sky-500 accent-sky-500"
                    />
                    <span className="text-sm font-bold text-slate-700">{p === "Me" ? t("me") : p}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-sky-400 to-ocean-blue text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-sky-200 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all active:scale-95"
          >
            {loading ? t("adding") : t("confirmExpense")}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
