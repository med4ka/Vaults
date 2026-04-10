"use client";

import React, { useState } from "react";
import { ArrowUpCircle, ArrowDownCircle, Wallet, Send, Trash2 } from "lucide-react";

interface FinanceProps {
  activeProtocol: any;
  insertTaskDirectly: (nameStr: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  t: any; // Kamus bahasa
}

export default function FinanceDashboard({ activeProtocol, insertTaskDirectly, deleteTask, t }: FinanceProps) {
  const [finType, setFinType] = useState("OUT");
  const [finAmount, setFinAmount] = useState("");
  const [finDesc, setFinDesc] = useState("");

  const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

const handleFinanceAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finAmount || !finDesc) return;
    const cleanAmount = finAmount.replace(/\D/g, "");
    if (!cleanAmount) return;

    
    await insertTaskDirectly(`${finType}||${cleanAmount}||${finDesc}`);

    
    try {
      const response = await fetch("http://localhost:8080/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: finType,
          amount: parseInt(cleanAmount),
          description: finDesc
        }),
      });

      if (response.ok) {
        console.log("BERHASIL NYAMBUNG KE GOLANG!");
      }
    } catch (error) {
      console.error("Gagal nyambung ke Golang. Pastikan server nyala!", error);
    }

    
    setFinAmount(""); 
    setFinDesc("");
  };

  let totalIn = 0; let totalOut = 0;
  if (activeProtocol) {
    activeProtocol.tasks.forEach((task: any) => {
      const parts = task.name.split("||");
      if (parts.length >= 3) {
        const amt = parseInt(parts[1]) || 0;
        if (parts[0] === "IN") totalIn += amt;
        if (parts[0] === "OUT") totalOut += amt;
      }
    });
  }
  const netBalance = totalIn - totalOut;

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-hover)]/40 backdrop-blur-sm flex flex-col items-center text-center shadow-sm">
          <span className="text-[var(--text-muted)] text-xs font-bold tracking-widest mb-2 flex items-center gap-1"><ArrowUpCircle className="w-4 h-4 text-emerald-500"/> {t.income}</span>
          <span className="text-2xl font-bold text-emerald-500">{formatRupiah(totalIn)}</span>
        </div>
        <div className="p-6 rounded-2xl border border-[var(--accent)] bg-[var(--accent)]/5 backdrop-blur-sm flex flex-col items-center text-center shadow-[0_0_30px_rgba(46,170,220,0.1)] scale-105">
          <span className="text-[var(--accent)] text-xs font-bold tracking-widest mb-2 flex items-center gap-1"><Wallet className="w-4 h-4"/> {t.netBalance}</span>
          <span className="text-3xl font-black text-[var(--text-main)]">{formatRupiah(netBalance)}</span>
        </div>
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-hover)]/40 backdrop-blur-sm flex flex-col items-center text-center shadow-sm">
          <span className="text-[var(--text-muted)] text-xs font-bold tracking-widest mb-2 flex items-center gap-1"><ArrowDownCircle className="w-4 h-4 text-red-500"/> {t.expense}</span>
          <span className="text-2xl font-bold text-red-500">{formatRupiah(totalOut)}</span>
        </div>
      </div>

      <form onSubmit={handleFinanceAdd} className="flex flex-wrap md:flex-nowrap gap-3 mb-10 p-2 rounded-xl border border-[var(--border)] bg-[var(--bg-main)]/50 backdrop-blur-sm items-center">
        <div className="flex bg-[var(--bg-sidebar)] p-1 rounded-lg border border-[var(--border)] shrink-0">
          <button type="button" onClick={() => setFinType("IN")} className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${finType === "IN" ? "bg-emerald-500/20 text-emerald-500 shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}>+ IN</button>
          <button type="button" onClick={() => setFinType("OUT")} className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${finType === "OUT" ? "bg-red-500/20 text-red-500 shadow-sm" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}>- OUT</button>
        </div>
        <div className="relative w-full md:w-1/3 flex items-center">
          <span className="absolute left-4 text-[var(--text-muted)] font-bold">Rp</span>
          <input type="text" placeholder="0" value={finAmount ? new Intl.NumberFormat('id-ID').format(Number(finAmount)) : ""} onChange={e => setFinAmount(e.target.value.replace(/\D/g, ""))} className="w-full bg-transparent pl-11 pr-4 py-2 outline-none text-[var(--text-main)] font-bold placeholder-[var(--border)]" required />
        </div>
        <input type="text" placeholder={t.descPlaceholder} value={finDesc} onChange={e => setFinDesc(e.target.value)} className="flex-1 bg-transparent px-4 py-2 outline-none text-[var(--text-main)] placeholder-[var(--text-muted)] md:border-l border-[var(--border)]" required />
        <button type="submit" className="bg-[var(--accent)] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shrink-0"><Send className="w-4 h-4"/> {t.addBtn}</button>
      </form>

      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-bold text-[var(--text-muted)] tracking-widest mb-2">{t.transHistory}</h3>
        {activeProtocol?.tasks.map((task: any) => {
          const parts = task.name.split('||');
          if (parts.length < 3) return null; 
          const type = parts[0]; const amount = parseInt(parts[1]) || 0; const desc = parts[2];
          const isIncome = type === "IN";
          return (
            <div key={task.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)]/40 hover:bg-[var(--bg-hover)] transition-colors group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isIncome ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                  {isIncome ? <ArrowUpCircle className="w-5 h-5"/> : <ArrowDownCircle className="w-5 h-5"/>}
                </div>
                <div>
                  <p className="text-[var(--text-main)] font-bold">{desc}</p>
                  <p className="text-[var(--text-muted)] text-xs">{isIncome ? t.income : t.expense}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-bold text-lg ${isIncome ? 'text-emerald-500' : 'text-red-500'}`}>
                  {isIncome ? '+' : '-'}{formatRupiah(amount)}
                </span>
                <button onClick={() => deleteTask(task.id)} className="opacity-40 hover:opacity-100 text-[var(--text-muted)] hover:text-red-500 transition-opacity p-2 ml-2"><Trash2 className="w-5 h-5" /></button>
              </div>
            </div>
          )
        }).reverse()}
      </div>
    </div>
  );
}