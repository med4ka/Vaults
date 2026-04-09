"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Lock, Mail, Key, LogIn, UserPlus, Loader2 } from "lucide-react";

// 🔥 KAMUS MINI KHUSUS LAYAR LOGIN 🔥
const authDict = {
  en: { 
    title: "Vaults Access", sub: "Encrypted protocol management system.", 
    email: "Email Address", pass: "Password", 
    login: "LOGIN", reg: "REGISTER", 
    successL: "Access Granted! Entering Vaults...", successR: "Registration successful! Please login." 
  },
  id: { 
    title: "Akses Vaults", sub: "Sistem manajemen protokol terenkripsi.", 
    email: "Alamat Email", pass: "Kata Sandi", 
    login: "MASUK", reg: "DAFTAR", 
    successL: "Akses Diterima! Memasuki Vaults...", successR: "Registrasi berhasil! Silakan masuk." 
  },
  zh: { 
    title: "Vaults 访问", sub: "加密协议管理系统。", 
    email: "电子邮件地址", pass: "密码", 
    login: "登录", reg: "注册", 
    successL: "访问受权！正在进入 Vaults...", successR: "注册成功！请登录。" 
  }
};

type Lang = 'en' | 'id' | 'zh';

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [lang, setLang] = useState<Lang>('en'); 
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const savedLang = localStorage.getItem("vaults_lang") as Lang;
    if (savedLang && authDict[savedLang]) setLang(savedLang);
  }, []);

  const t = authDict[lang];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setMsg(`Error: ${error.message}`); 
      setLoading(false);
    } else {
      setMsg(t.successL); 
      setTimeout(() => {
        window.location.reload(); 
      }, 1000);
    }
  };

  const triggerCooldown = () => {
    setCooldown(3); 
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg("");
    const { error } = await supabase.auth.signUp({ email, password });
    
    if (error) setMsg(`Error: ${error.message}`); 
    else setMsg(t.successR); 
    setLoading(false);
  };

  if (cooldown > 0) return; 
    triggerCooldown();        

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#050505] bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,#151515_0%,#000_100%)] text-[var(--text-main)] font-sans relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md p-10 rounded-[32px] border border-[#222] bg-[#111]/80 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center animate-[fadeIn_0.5s_ease-out] relative z-10">
        
        <div className="w-20 h-20 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(46,170,220,0.2)] animate-[pulse_3s_ease-in-out_infinite]">
          <Lock className="w-10 h-10 text-[var(--accent)] drop-shadow-[0_0_10px_rgba(46,170,220,0.8)]" />
        </div>
        
        <h1 className="text-3xl font-black tracking-tight mb-2 text-white">{t.title}</h1>
        <p className="text-[#888] text-sm mb-10 font-medium text-center">{t.sub}</p>

        <form className="w-full flex flex-col gap-5">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] group-focus-within:text-[var(--accent)] transition-colors" />
            <input 
              type="email" placeholder={t.email} 
              value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all text-sm font-medium text-white placeholder-[#555]"
            />
          </div>
          <div className="relative group">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666] group-focus-within:text-[var(--accent)] transition-colors" />
            <input 
              type="password" placeholder={t.pass} 
              value={password} onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#333] rounded-xl pl-12 pr-4 py-4 outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all text-sm font-medium text-white placeholder-[#555]"
            />
          </div>

          {msg && (
            <div className={`text-xs font-bold text-center p-3 rounded-xl border ${msg.includes('error') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
              {msg}
            </div>
          )}

          <div className="flex gap-4 mt-2">
            <button onClick={handleLogin} disabled={loading || cooldown > 0} className="flex-1 bg-[var(--accent)] hover:opacity-80 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_20px_var(--accent)]/30">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : cooldown > 0 ? `Tunggu ${cooldown}s...` : <><LogIn className="w-5 h-5" /> {t.login}</>}
            </button>
            <button onClick={handleSignup} disabled={loading || cooldown > 0} className="flex-1 bg-[#1A1A1A] hover:bg-[#252525] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all border border-[#333] disabled:opacity-50">
              {cooldown > 0 ? `Tunggu ${cooldown}s...` : <><UserPlus className="w-5 h-5 text-[#888]" /> {t.reg}</>}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
}