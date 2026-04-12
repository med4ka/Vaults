"use client";

import React, { useState, useEffect } from "react";
import { Plus, Check, X, ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";

interface Task { id: string; name: string; checked: boolean; protocol_id: string; }

interface WeeklyRoutineProps {
  activeProtocol: any;
  insertTaskDirectly: (nameStr: string) => Promise<void>;
  updateTaskText: (taskId: string, newText: string) => Promise<void>;
  toggleTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export default function WeeklyRoutineDashboard({ 
  activeProtocol, 
  insertTaskDirectly, 
  updateTaskText, 
  toggleTask, 
  deleteTask 
}: WeeklyRoutineProps) {
  
  const [addingDay, setAddingDay] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  
  useEffect(() => {
    const getWeekDates = (baseDate: Date) => {
      const dates = [];
      const currentDay = baseDate.getDay();
      const distance = currentDay === 0 ? -6 : 1 - currentDay; 
      
      const startOfWeek = new Date(baseDate);
      startOfWeek.setDate(baseDate.getDate() + distance);
      startOfWeek.setHours(0, 0, 0, 0);

      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        dates.push(d);
      }
      return dates;
    };
  

    setWeekDates(getWeekDates(currentWeekStart));
  }, [currentWeekStart]);

  const changeWeek = (offset: number) => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(currentWeekStart.getDate() + (offset * 7));
    setCurrentWeekStart(newDate);
  };

  const handleKanbanAdd = async (e: React.KeyboardEvent<HTMLInputElement>, dateStr: string) => {
    if (e.key === 'Enter') {
      const val = e.currentTarget.value;
      if (val.trim()) await insertTaskDirectly(`[${dateStr}] ${val}`);
      setAddingDay(null);
    }
  };

    const getLocalYYYYMMDD = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
    };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      
      <div className="flex items-center justify-between mb-8 bg-[var(--bg-hover)]/30 p-4 rounded-2xl border border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--accent)]/10 rounded-lg text-[var(--accent)]">
            <CalIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black text-[var(--text-main)] tracking-tight">WEEKLY SCHEDULE</h2>
            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
              {weekDates[0]?.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => changeWeek(-1)} className="p-2 hover:bg-[var(--bg-hover)] rounded-xl border border-[var(--border)] transition-colors">
            <ChevronLeft className="w-4 h-4 text-[var(--text-main)]" />
          </button>
          <button onClick={() => setCurrentWeekStart(new Date())} className="px-3 py-1 text-[10px] font-bold border border-[var(--border)] rounded-xl hover:bg-[var(--bg-hover)] text-[var(--text-main)]">
            TODAY
          </button>
          <button onClick={() => changeWeek(1)} className="p-2 hover:bg-[var(--bg-hover)] rounded-xl border border-[var(--border)] transition-colors">
            <ChevronRight className="w-4 h-4 text-[var(--text-main)]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDates.map((date) => {
          const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
          const dateStr = getLocalYYYYMMDD(date);
          const isToday = getLocalYYYYMMDD(new Date()) === dateStr;

          return (
            <div key={dateStr} className={`flex flex-col min-h-[200px] rounded-2xl border transition-all ${isToday ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-[0_0_20px_rgba(46,170,220,0.1)]' : 'border-[var(--border)] bg-[var(--bg-hover)]/20'}`}>
              <div className="p-3 border-b border-[var(--border)]">
                <span className={`block text-[10px] font-black tracking-tighter ${isToday ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                  {dayName.toUpperCase()}
                </span>
                <span className="text-xs font-bold text-[var(--text-main)]">
                  {date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                </span>
              </div>

              <div className="flex-1 p-2 space-y-2">
                {activeProtocol?.tasks?.filter((t: any) => t.name.startsWith(`[${dateStr}]`)).map((task: any) => {
                  const cleanName = task.name.replace(/^\[.*?\]\s*/, '');
                  return (
                    <div key={task.id} className="group flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] hover:border-[var(--text-muted)] transition-all">
                      <button onClick={() => toggleTask(task)} className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${task.checked ? 'bg-emerald-500 border-emerald-500' : 'border-[var(--border)]'}`}>
                        {task.checked && <Check className="w-3 h-3 text-white font-bold" />}
                      </button>
                      <input type="text" defaultValue={cleanName} onBlur={e => updateTaskText(task.id, `[${dateStr}] ${e.target.value}`)} onKeyDown={e => {if(e.key==='Enter') e.currentTarget.blur()}} className={`w-full bg-transparent outline-none text-[12px] font-medium leading-tight ${task.checked ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-sec)]'}`} />
                      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-500"><X className="w-3 h-3"/></button>
                    </div>
                  )
                })}

                {addingDay === dateStr ? (
                  <div className="flex items-center gap-2 p-2">
                    <input autoFocus type="text" onKeyDown={(e) => handleKanbanAdd(e, dateStr)} onBlur={() => setAddingDay(null)} className="w-full bg-transparent outline-none text-[12px] text-[var(--text-main)] font-medium" placeholder="New task..." />
                  </div>
                ) : (
                  <button onClick={() => setAddingDay(dateStr)} className="flex items-center gap-1 p-2 text-[10px] font-bold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors w-full mt-1">
                    <Plus className="w-3 h-3" /> ADD
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}