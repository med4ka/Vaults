"use client";

import AuthScreen from "../components/AuthScreen";
import { Session } from "@supabase/supabase-js";
import { LogOut } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { BarChart3 } from "lucide-react";
import { Plus, Check, Trash2, Home, Settings, X, Globe, Palette, Hexagon, Target, Zap, Code, FolderDot, Dumbbell, Book, Bot, Coffee, Briefcase, Music, Heart, Star, LayoutTemplate, Play, Pause, RotateCcw, Wallet, Save, Hourglass, CalendarDays} from "lucide-react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { dict, Lang } from "../lib/dictionary";
import FinanceDashboard from "../components/FinanceDashboard";
import FlowStateDashboard from "../components/FlowStateDashboard";
import DeveloperPathDashboard from "../components/DeveloperPathDashboard";
import WeeklyRoutineDashboard from "../components/WeeklyRoutineDashboard";
import StandardDashboard from "../components/StandardDashboard";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import CalendarDashboard from "../components/CalendarDashboard";

type Task = { id: string; name: string; checked: boolean; protocol_id: string };
type Protocol = { id: string; name: string; icon: string; tasks: Task[] };

const iconMap: Record<string, any> = { Target, Zap, Code, FolderDot, Dumbbell, Book, Bot, Coffee, Briefcase, Music, Heart, Star, Wallet, CalendarDays };

const getLogo = (iconName: string, titleName: string) => {
  if (iconMap[iconName]) return iconMap[iconName];
  const n = titleName.toLowerCase();
  if (n.includes("weekly") || n.includes("weekly")) return Target;
  if (n.includes("weekend") || n.includes("deep") || n.includes("flow")) return Zap;
  if (n.includes("developer") || n.includes("code")) return Code;
  if (n.includes("finance") || n.includes("wallet")) return Wallet;
  return FolderDot;
};

const themeStyles: Record<string, React.CSSProperties> = {
  default: { '--bg-main': '#191919', '--bg-sidebar': '#202020', '--bg-hover': '#2C2C2C', '--border': '#2C2C2C', '--text-main': '#E5E5E5', '--text-sec': '#D4D4D4', '--text-muted': '#737373', '--accent': '#2EAADC' } as React.CSSProperties,
  light: { '--bg-main': '#FAFAFA', '--bg-sidebar': '#F0F0F0', '--bg-hover': '#E5E5E5', '--border': '#D4D4D4', '--text-main': '#111111', '--text-sec': '#333333', '--text-muted': '#737373', '--accent': '#2EAADC' } as React.CSSProperties,
  oled: { '--bg-main': '#000000', '--bg-sidebar': '#080808', '--bg-hover': '#1A1A1A', '--border': '#1A1A1A', '--text-main': '#FFFFFF', '--text-sec': '#CCCCCC', '--text-muted': '#555555', '--accent': '#2EAADC' } as React.CSSProperties
};

export default function DailyProtocol() {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [localTitle, setLocalTitle] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [motif, setMotif] = useState('grid');
  const [lang, setLang] = useState<Lang>('en');
  const [theme, setTheme] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [accent, setAccent] = useState('#2EAADC'); 
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState(""); 
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [draggedOverItem, setDraggedOverItem] = useState<number | null>(null);


  const [finType, setFinType] = useState("OUT");
  const [finAmount, setFinAmount] = useState("");
  const [finDesc, setFinDesc] = useState("");

  const t = dict[lang];

  useEffect(() => {
    const savedLang = localStorage.getItem("vaults_lang") as Lang;
    const savedTheme = localStorage.getItem("vaults_theme");
    const savedMotif = localStorage.getItem("vaults_motif");
    const savedAccent = localStorage.getItem("vaults_accent");
    if (savedLang) setLang(savedLang);
    if (savedTheme) setTheme(savedTheme);
    if (savedMotif) setMotif(savedMotif);
    fetchData();

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session) {
        await fetchData(); 
      }
      
      setTimeout(() => setGlobalLoading(false), 800);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const handleSort = async () => {
    if (draggedItem === null || draggedOverItem === null) return;
    
    
    const _protocols = [...protocols];
    const draggedItemContent = _protocols.splice(draggedItem, 1)[0];
    _protocols.splice(draggedOverItem, 0, draggedItemContent);
    setProtocols(_protocols); 
    setDraggedItem(null);
    setDraggedOverItem(null);

    
    for (let i = 0; i < _protocols.length; i++) {
      await supabase
        .from('protocols')
        .update({ order_index: i }) 
        .eq('id', _protocols[i].id);
    }
  };
  
  const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

  const fetchData = async () => {
    setIsLoading(true);
    
    
    const { data: pData, error: pError } = await supabase.from('protocols').select('*').order('order_index', { ascending: true });
    const { data: tData, error: tError } = await supabase.from('tasks').select('*');
    
    
    if (pError) console.error("❌ ERROR DI PROTOCOL:", pError);
    if (tError) console.error("❌ ERROR DI TASKS:", tError);

    if (pData) {
      const formatted = pData.map((p: any) => ({ ...p, tasks: tData ? tData.filter((t: any) => t.protocol_id === p.id) : [] }));
      setProtocols(formatted);
      if (formatted.length > 0 && !activeId) setActiveId(formatted[0].id);
    }
    setIsLoading(false);
  };

  const activeProtocol = protocols.find(p => p.id === activeId);

  useEffect(() => {
    if (activeProtocol) setLocalTitle(activeProtocol.name);
  }, [activeProtocol?.id]);

  const startResizing = useCallback(() => setIsResizing(true), []);
  const stopResizing = useCallback(() => setIsResizing(false), []);
  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) setSidebarWidth(Math.min(Math.max(e.clientX, 200), 480));
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => { window.removeEventListener("mousemove", resize); window.removeEventListener("mouseup", stopResizing); };
  }, [resize, stopResizing]);

  const changeLanguage = (newLang: Lang) => { setLang(newLang); localStorage.setItem("vaults_lang", newLang); };
  const changeTheme = (newTheme: string) => { setTheme(newTheme); localStorage.setItem("vaults_theme", newTheme); };
  const changeAccent = (color: string) => { setAccent(color); localStorage.setItem("vaults_accent", color); };
  const changeMotif = (newMotif: string) => { setMotif(newMotif); localStorage.setItem("vaults_motif", newMotif); };

  const insertTaskDirectly = async (nameStr: string) => {
    const { data } = await supabase.from('tasks').insert([{ protocol_id: activeId, name: nameStr, checked: false }]).select();
    if (data && data.length > 0) setProtocols(prev => prev.map(p => p.id === activeId ? { ...p, tasks: [...p.tasks, data[0]] } : p));
  };

  const deployTemplate = async (type: string) => {
    let protocolName = "Untitled"; let iconName = "FolderDot"; let tasksList: string[] = [];
    
    
    
    if (type === "weekly") {
      protocolName = "Weekly Routine";
      iconName = "CalendarDays"; 
      tasksList = ["[Monday] Morning Review", "[Tuesday] Deep Work", "[Wednesday] Gym", "[Thursday] Learn Golang", "[Friday] Weekly Review", "[Saturday] Rest", "[Sunday] Planning"];
    } else if (type === "flow") {
      protocolName = "Flow State"; 
      iconName = "Zap";
      tasksList = ["Deep Work Session 1", "Dopamine Detox"];
    } else if (type === "dev") {
      protocolName = "Developer Path"; 
      iconName = "Code";
      tasksList = ["Vaults App||Next.js, Tailwind, Supabase||Connect to backend DB||||"];
    } else if (type === "finance") {
      protocolName = "Financial Assistant"; 
      iconName = "Wallet";
      tasksList = ["IN||1000000||Initial Balance", "OUT||50000||Coffee & Snacks"];
    } else {
      tasksList = ["New Task..."];
    }

    

    const { data } = await supabase.from('protocols').insert([{ name: protocolName, icon: iconName }]).select();
    if (data && data.length > 0) {
      const newId = data[0].id;
      if (tasksList.length > 0) {
        const tasksToInsert = tasksList.map(task => ({ protocol_id: newId, name: task, checked: false }));
        await supabase.from('tasks').insert(tasksToInsert);
      }
      setShowTemplateModal(false);
      fetchData(); 
      setActiveId(newId);
    }
  };

  const updateProtocolName = async (id: string, newName: string) => {
    if (!newName.trim()) return;
    setProtocols(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
    await supabase.from('protocols').update({ name: newName }).eq('id', id);
  };

  const updateProtocolIcon = async (iconStr: string) => {
    setProtocols(prev => prev.map(p => p.id === activeId ? { ...p, icon: iconStr } : p));
    await supabase.from('protocols').update({ icon: iconStr }).eq('id', activeId);
    setShowIconPicker(false);
  };

  const deleteProtocol = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setProtocols(prev => prev.filter(p => p.id !== id));
    if (activeId === id) setActiveId(protocols.filter(p => p.id !== id)[0]?.id || "");
    await supabase.from('tasks').delete().eq('protocol_id', id);
    await supabase.from('protocols').delete().eq('id', id);
  };

  const updateTaskText = async (taskId: string, newText: string) => {
    setProtocols(prev => prev.map(p => p.id === activeId ? { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, name: newText } : t) } : p));
    await supabase.from('tasks').update({ name: newText }).eq('id', taskId);
  };

  const toggleTask = async (task: Task) => {
    setProtocols(prev => prev.map(p => p.id === activeId ? { ...p, tasks: p.tasks.map(t => t.id === task.id ? { ...t, checked: !t.checked } : t) } : p));
    await supabase.from('tasks').update({ checked: !task.checked }).eq('id', task.id);
  };

  const handleFinanceAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finAmount || !finDesc) return;
    const cleanAmount = finAmount.replace(/\D/g, ""); // Hapus titik/koma
    if (!cleanAmount) return;
    await insertTaskDirectly(`${finType}||${cleanAmount}||${finDesc}`);
    setFinAmount(""); setFinDesc("");
  };

  const deleteTask = async (taskId: string) => {
    setProtocols(prev => prev.map(p => p.id === activeId ? { ...p, tasks: p.tasks.filter(t => t.id !== taskId) } : p));
    await supabase.from('tasks').delete().eq('id', taskId);
  };

  if (isLoading) return <main className="flex h-screen bg-[#191919]" />;

  const ActiveLogo = getLogo(activeProtocol?.icon || "", localTitle);
  const completedTasks = activeProtocol?.tasks.filter(t => t.checked).length || 0;
  const totalTasks = activeProtocol?.tasks.length || 0;
  const progressPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const isDevPath = localTitle.toLowerCase().includes("developer");
  const isWeekly = localTitle.toLowerCase().includes("weekly");
  const isFlowState = localTitle.toLowerCase().includes("flow state");
  const isFinance = localTitle.toLowerCase().includes("financ") || localTitle.toLowerCase().includes("wallet");
  const isCalendar = localTitle.toLowerCase().includes("calendar") || localTitle.toLowerCase().includes("jadwal");

  
  let totalIn = 0; let totalOut = 0;
  if (isFinance && activeProtocol) {
    activeProtocol.tasks.forEach(t => {
      const parts = t.name.split("||");
      if (parts.length >= 3) {
        const amt = parseInt(parts[1]) || 0;
        if (parts[0] === "IN") totalIn += amt;
        if (parts[0] === "OUT") totalOut += amt;
      }
    });
  }
  const netBalance = totalIn - totalOut;

  if (globalLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--bg-main)] text-[var(--text-main)] font-sans relative overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--accent)]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center gap-10 z-10 animate-[fadeIn_0.5s_ease-out]">
          <div className="relative flex items-center justify-center w-28 h-28">
            {/* Cincin luar pendar */}
            <div className="absolute inset-0 rounded-full border border-[var(--accent)]/10"></div>
            {/* Cincin luar muter */}
            <div className="absolute inset-0 rounded-full border border-[var(--accent)] border-t-transparent animate-spin duration-1500"></div>
            
            
            <Hourglass className="w-14 h-14 text-[var(--accent)] animate-pulse drop-shadow-[0_0_15px_var(--accent)]" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <h2 className="text-xl font-black tracking-[0.4em] text-[var(--text-main)] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">VAULTS</h2>
            <p className="text-xs font-bold tracking-widest text-[var(--text-muted)] animate-pulse">SECURING YOUR BRANKAS...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
      return <AuthScreen />;
    }

  return (
    <main style={{ ...themeStyles[theme], '--accent': accent } as React.CSSProperties} className="flex h-screen w-full bg-[var(--bg-main)] text-[var(--text-sec)] font-sans overflow-hidden flex-row relative transition-colors duration-500 ease-in-out">
      
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-[9999] animate-[fadeIn_0.3s_ease-out] bg-[#111] border border-[#333] text-white px-5 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-ping absolute"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] relative"></div>
          <span className="font-bold text-sm tracking-wide">{toastMsg}</span>
        </div>
      )}

      {showTemplateModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s_ease-out_forwards]">
          <div className="w-[600px] bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text-main)] flex items-center gap-2"><LayoutTemplate className="w-5 h-5"/> Deploy Protocol</h2>
              <button onClick={() => setShowTemplateModal(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <button onClick={() => deployTemplate('weekly')} className="flex flex-col items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] hover:border-[var(--accent)] transition-all text-left group">
                <CalendarDays className="w-6 h-6 mb-3 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
                <span className="font-bold text-[var(--text-main)] mb-1">Weekly Routine</span>
                <span className="text-xs text-[var(--text-muted)]">Monday to Sunday Kanban board</span>
              </button>
              <button onClick={() => deployTemplate('flow')} className="flex flex-col items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] hover:border-[var(--accent)] transition-all text-left group">
                <Zap className="w-6 h-6 mb-3 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
                <span className="font-bold text-[var(--text-main)] mb-1">Flow State Log</span>
                <span className="text-xs text-[var(--text-muted)]">Pomodoro Timer & Focus Target</span>
              </button>
              <button onClick={() => deployTemplate('dev')} className="flex flex-col items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] hover:border-[var(--accent)] transition-all text-left group">
                <Code className="w-6 h-6 mb-3 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
                <span className="font-bold text-[var(--text-main)] mb-1">Developer Path</span>
                <span className="text-xs text-[var(--text-muted)]">Project grids, tech stacks & tracking</span>
              </button>
              <button onClick={() => deployTemplate('finance')} className="flex flex-col items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] hover:border-[var(--accent)] transition-all text-left group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#2EAADC]/10 blur-[20px] group-hover:bg-[#2EAADC]/20 transition-colors"></div>
                <Wallet className="w-6 h-6 mb-3 text-[var(--text-muted)] group-hover:text-[var(--accent)] relative z-10" />
                <span className="font-bold text-[var(--text-main)] mb-1 relative z-10">Financial Assistant</span>
                <span className="text-xs text-[var(--text-muted)] relative z-10">Track expenses & calculate net balance</span>
              </button>
              <button onClick={() => deployTemplate('blank')} className="flex flex-col items-start p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] hover:border-[var(--text-main)] transition-all text-left group col-span-2 items-center justify-center text-center">
                <span className="font-bold text-[var(--text-main)]">Blank Protocol</span>
                <span className="text-xs text-[var(--text-muted)]">Start a generic checklist from scratch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-[fadeIn_0.2s_ease-out_forwards]">
          <div className="w-[440px] bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold text-[var(--text-main)]">{t.settings}</h2>
              <button onClick={() => {
            
              const confirmClose = window.confirm("Tutup tanpa menyimpan perubahan?");
              if (confirmClose) {

                setShowSettings(false);
                window.location.reload();
              }
            }} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-main)] p-2 rounded-full border border-[var(--border)] transition-colors">
              <X className="w-5 h-5"/>
            </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3 text-[var(--text-main)]"><Globe className="w-4 h-4" /><span className="font-medium text-sm">{t.lang || "Language"}</span></div>
                <div className="flex gap-2 bg-[var(--bg-main)] p-1 rounded-lg border border-[var(--border)]">
                  {['en', 'id', 'zh'].map(l => (
                    <button key={l} onClick={() => changeLanguage(l as Lang)} className={`flex-1 py-1.5 text-sm rounded-md transition-all ${lang === l ? 'bg-[var(--border)] text-[var(--text-main)] shadow-sm font-medium' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}>{l.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3 text-[var(--text-main)]"><Palette className="w-4 h-4" /><span className="font-medium text-sm">{t.theme || "Theme"}</span></div>
                <div className="grid grid-cols-3 gap-3">
                  {['default', 'light', 'oled'].map(th => (
                    <button key={th} onClick={() => changeTheme(th)} className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${theme === th ? 'border-[var(--accent)] bg-[var(--bg-hover)] ring-2 ring-[var(--accent)]/20' : 'border-[var(--border)] bg-[var(--bg-main)]'}`}>
                      <div className={`w-full h-8 rounded-md border ${th==='light' ? 'bg-[#FAFAFA] border-[#D4D4D4]' : th==='oled' ? 'bg-black border-[#1A1A1A]' : 'bg-[#191919] border-[#2C2C2C]'}`} />
                      <span className="text-xs text-[var(--text-muted)] font-medium capitalize">{th}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>

              <div className="flex items-center gap-2 mb-3 text-[var(--text-main)]"><Palette className="w-4 h-4" /><span className="font-medium text-sm">Accent Color</span></div>
                <div className="flex gap-3">
                  {[
                    { name: 'Cyan', hex: '#2EAADC' },
                    { name: 'Emerald', hex: '#10B981' },
                    { name: 'Purple', hex: '#A855F7' },
                    { name: 'Rose', hex: '#F43F5E' },
                    { name: 'Amber', hex: '#F59E0B' }
                  ].map(c => (
                    <button 
                      key={c.name} 
                      onClick={() => changeAccent(c.hex)} 
                      className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{ backgroundColor: c.hex, borderColor: accent === c.hex ? 'white' : 'transparent' }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3 text-[var(--text-main)]">
                  <Hexagon className="w-4 h-4" />
                  <span className="font-medium text-sm">Background Motif</span>
                </div>
                <div className="flex gap-2 bg-[var(--bg-main)] p-1 rounded-lg border border-[var(--border)]">
                  {['grid', 'noise', 'waves', 'none'].map(m => (
                    <button 
                      key={m} 
                      onClick={() => changeMotif(m)} 
                      className={`flex-1 py-1.5 text-xs font-bold rounded-md capitalize transition-all ${motif === m ? 'bg-[var(--border)] text-[var(--text-main)] shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <button 
                  onClick={() => {
                    localStorage.setItem("vaults_lang", lang);
                    localStorage.setItem("vaults_theme", theme);
                    localStorage.setItem("vaults_motif", motif);
                    localStorage.setItem("vaults_accent", accent);
                    
                    setToastMsg("Settings Saved Successfully!");
                    setTimeout(() => setToastMsg(""), 3000);
                    setShowSettings(false);
                  }} 
                  className="w-full py-3 bg-[var(--accent)] hover:opacity-90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_var(--accent)]/30"
                >
                  <Save className="w-5 h-5" /> SAVE CHANGES
                </button>
              </div>

            </div> 
          </div> 
        </div>
      )}
      

      {showIconPicker && (
        <div className="absolute top-16 left-[280px] z-40 w-64 bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-xl shadow-2xl p-4 animate-[fadeIn_0.1s_ease-out_forwards]">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-[var(--text-muted)] tracking-wider">SELECT ICON</span>
            <button onClick={() => setShowIconPicker(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]"><X className="w-4 h-4"/></button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {Object.keys(iconMap).map(iconName => {
              const IconComp = iconMap[iconName];
              return (
                <button key={iconName} onClick={() => updateProtocolIcon(iconName)} className="p-3 flex items-center justify-center rounded-lg hover:bg-[var(--bg-hover)] hover:text-[var(--accent)] text-[var(--text-sec)] transition-colors">
                  <IconComp className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <aside style={{ width: sidebarWidth }} className="flex-shrink-0 bg-[var(--bg-sidebar)] flex flex-col relative transition-none z-20 border-r border-[var(--border)]">
        <div className="h-12 flex items-center px-4 hover:bg-[var(--bg-hover)] cursor-pointer transition-colors">
          <div className="flex items-center gap-2 w-full">
            <div className="w-5 h-5 rounded bg-[var(--text-main)] text-[var(--bg-sidebar)] flex items-center justify-center text-xs font-bold transition-colors duration-500">V</div>
            <span className="text-sm font-semibold text-[var(--text-main)] truncate tracking-tight">{t.workspace}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 px-2 mt-4">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            <Home className="w-4 h-4" /><span className="text-sm font-medium">{t.home}</span>
          </Link>

          <button onClick={() => setShowSettings(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
            <Settings className="w-4 h-4" /><span className="text-sm font-medium">{t.settings}</span>
          </button>

          <button onClick={() => setShowAnalytics(!showAnalytics)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${showAnalytics ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-bold' : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'}`}>
            <BarChart3 className="w-4 h-4" /><span className="text-sm font-medium">Analytics</span>
          </button>
          </div>


        <div className="mt-8 px-5 mb-3">
          <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
            <span>{t.private}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-1 px-3 flex-grow overflow-y-auto relative custom-scrollbar pb-4">
          
          <div className="sticky top-0 z-10 pt-1 pb-3 mb-1 bg-[var(--bg-sidebar)]">
            <button 
              onClick={() => setShowTemplateModal(true)} 
              className="w-full py-2.5 bg-[var(--accent)] hover:opacity-90 text-white text-sm f ont-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_5px_20px_var(--accent)]/20"
            >
              <Plus className="w-4 h-4 text-white" /> New Protocol
            </button>
          </div>

          {protocols.map((p, index) => {
            const displayName = p.id === activeId ? localTitle : p.name;
            const LogoIcon = getLogo(p.icon, displayName);

            return (
              <div 
                key={p.id}
                draggable 
                onDragStart={() => setDraggedItem(index)}
                onDragEnter={() => setDraggedOverItem(index)}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
                className={`relative mb-1 transition-all ${draggedOverItem === index ? 'pt-8' : ''}`}
              >
                {draggedOverItem === index && (
                  <div className="absolute top-2 left-0 right-0 h-1 bg-[var(--accent)] rounded-full animate-pulse z-20 shadow-[0_0_10px_var(--accent)]" />
                )}
                
                
                <div 
                  onClick={() => { setActiveId(p.id); setShowAnalytics(false); }} 
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${activeId === p.id && !showAnalytics ? "bg-[var(--accent)] text-white shadow-[0_0_15px_var(--accent)]/30 font-medium" : "text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]"}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <LogoIcon className={`w-4 h-4 shrink-0 transition-colors ${activeId === p.id && !showAnalytics ? 'text-white' : ''}`} />
                    <span className="text-sm truncate">{displayName || t.untitled}</span>
                  </div>
                  <button onClick={(e) => deleteProtocol(e, p.id)} className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-500 transition-colors px-1"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            );
          })}

          <div className="p-3 mt-auto border-t border-[var(--border)]">
          <button onClick={() => supabase.auth.signOut()} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-[#F43F5E] hover:bg-[#F43F5E]/10 transition-colors">
            <LogOut className="w-4 h-4" /><span className="text-sm font-medium">Logout</span>
          </button>
        </div>
        
        </div>
        <div onMouseDown={startResizing} className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[var(--accent)] hover:opacity-100 opacity-0 transition-all z-30" />
      </aside>

      <div className="flex-1 flex flex-col h-full relative min-w-[400px] overflow-x-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          {motif === 'grid' && <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>}
          {motif === 'noise' && <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>}
          {motif === 'waves' && <div className="absolute inset-0 opacity-[0.08] bg-[repeating-radial-gradient(circle_at_0_0,transparent_0,var(--text-muted)_1px,transparent_1px,transparent_40px)] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]"></div>}
        </div>

        <header className="h-12 flex items-center px-6 shrink-0 w-full border-b border-[var(--border)] transition-colors duration-500 ease-in-out relative z-10 bg-[var(--bg-main)]/70 backdrop-blur-md">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)]"><ActiveLogo className="w-4 h-4" /><span>{localTitle || t.untitled}</span></div>
        </header>

        <div className="flex-1 overflow-y-auto relative z-10 w-full">
          <div className={`${isWeekly ? 'max-w-full' : 'max-w-[900px]'} w-full mx-auto px-12 pb-32 pt-16`}>
            
            {showAnalytics ? (
              <AnalyticsDashboard protocols={protocols} t={t} />
            ) : (
              <>
                <div className="group relative mb-8 flex items-center gap-4">
                  <button onClick={() => setShowIconPicker(true)} className="text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-hover)] p-3 rounded-xl transition-all duration-200">
                    <ActiveLogo className="w-10 h-10" />
                  </button>
                  <input type="text" value={localTitle} onChange={(e) => setLocalTitle(e.target.value)} onBlur={() => updateProtocolName(activeId, localTitle)} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }} className="text-5xl font-black text-[var(--text-main)] bg-transparent outline-none w-full placeholder-[var(--border)] tracking-tight transition-colors duration-500 ease-in-out" placeholder={t.untitled} />
                </div>

                
                {isFinance ? (
  <FinanceDashboard activeProtocol={activeProtocol} insertTaskDirectly={insertTaskDirectly} deleteTask={deleteTask} t={t} />
                    ) : isFlowState ? (
                          <FlowStateDashboard activeProtocol={activeProtocol} updateTaskText={updateTaskText} />
                    ) : isDevPath ? (
                          <DeveloperPathDashboard activeProtocol={activeProtocol} insertTaskDirectly={insertTaskDirectly} updateTaskText={updateTaskText} deleteTask={deleteTask} />
                    ) : isCalendar ? (
                          <CalendarDashboard activeProtocol={activeProtocol} insertTaskDirectly={insertTaskDirectly} updateTaskText={updateTaskText} toggleTask={toggleTask} deleteTask={deleteTask} />
                    ) : isWeekly ? (
                          <WeeklyRoutineDashboard activeProtocol={activeProtocol} insertTaskDirectly={insertTaskDirectly} updateTaskText={updateTaskText} toggleTask={toggleTask} deleteTask={deleteTask} />
                    ) : (
                          <StandardDashboard activeProtocol={activeProtocol} updateTaskText={updateTaskText} toggleTask={toggleTask} deleteTask={deleteTask} insertTaskDirectly={insertTaskDirectly} progressPercentage={progressPercentage} t={t} />
                )} 
              </>
            )}
            
            

          </div>
          
        </div>
      </div>

      
    </main>
  );
}