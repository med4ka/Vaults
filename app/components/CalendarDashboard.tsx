"use client";

import React, { useState, useEffect } from "react";
import { Plus, Check, X, ChevronLeft, ChevronRight, Calendar as CalIcon } from "lucide-react";

interface Task { id: string; name: string; checked: boolean; protocol_id: string; }
interface CalendarProps {
  activeProtocol: any;
  insertTaskDirectly: (nameStr: string) => Promise<void>;
  updateTaskText: (taskId: string, newText: string) => Promise<void>;
  toggleTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

export default function CalendarDashboard({ activeProtocol, insertTaskDirectly, updateTaskText, toggleTask, deleteTask }: CalendarProps) {
  const [addingDate, setAddingDate] = useState<string | null>(null);
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
        const nextDate = new Date(startOfWeek);
        nextDate.setDate(startOfWeek.getDate() + i);
        dates.push(nextDate);
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

  const formatDate = (date: Date) => date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  const getDayName = (date: Date) => date.toLocaleDateString('en-US', { weekday: 'short' });
  const getDayNumber = (date: Date) => date.getDate();

  const handleTaskAdd = async (e: React.KeyboardEvent<HTMLInputElement>, dateStr: string) => {
    if (e.key === 'Enter') {
      const val = e.currentTarget.value;
      if (val.trim()) await insertTaskDirectly(`[${dateStr}] ${val}`);
      setAddingDate(null);
    }
  };

  const todayStr = formatDate(new Date());

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] w-full flex flex-col h-full">
      
      
      <div className="flex items-center justify-between mb-6 bg-[var(--bg-hover)]/40 p-4 rounded-2xl border border-[var(--border)] backdrop-blur-sm shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded-lg border border-[var(--accent)]/20">
            <CalIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-[var(--text-main)] tracking-wider">
            {weekDates.length > 0 ? `${weekDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : "Loading..."}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => changeWeek(-1)} className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--text-muted)] transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentWeekStart(new Date())} className="px-4 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--text-muted)] transition-all uppercase tracking-widest">
            Today
          </button>
          <button onClick={() => changeWeek(1)} className="p-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--text-muted)] transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 flex-1">
        {weekDates.map(date => {
          const dateStr = formatDate(date);
          const isToday = dateStr === todayStr;
          const dayTasks = activeProtocol?.tasks.filter((t: Task) => t.name.startsWith(`[${dateStr}]`)) || [];
          
          return (
            <div key={dateStr} className={`flex flex-col h-[500px] rounded-2xl border transition-all duration-300 ${isToday ? 'border-[var(--accent)] bg-[var(--accent)]/5 shadow-[0_0_20px_rgba(46,170,220,0.05)]' : 'border-[var(--border)] bg-[var(--bg-hover)]/40 hover:border-[var(--text-muted)]/30'} backdrop-blur-sm overflow-hidden`}>
              
            
              <div className={`p-4 border-b border-[var(--border)] flex items-center justify-between ${isToday ? 'bg-[var(--accent)]/10' : 'bg-[var(--bg-main)]/50'}`}>
                <span className={`font-bold text-sm tracking-widest uppercase ${isToday ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>
                  {getDayName(date)}
                </span>
                <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-black ${isToday ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-main)]'}`}>
                  {getDayNumber(date)}
                </span>
              </div>

              
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 custom-scrollbar">
                {dayTasks.map((task: Task) => {
                  const cleanName = task.name.replace(`[${dateStr}] `, '');
                  return (
                    <div key={task.id} className="group flex items-start gap-2 p-2 rounded-lg hover:bg-[var(--bg-main)] transition-colors border border-transparent hover:border-[var(--border)]">
                      <button onClick={() => toggleTask(task)} className={`shrink-0 w-4 h-4 mt-0.5 rounded-[4px] border flex items-center justify-center transition-all ${task.checked ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--text-muted)]'}`}>
                        {task.checked && <Check className="w-3 h-3 text-white font-bold" />}
                      </button>
                      <input type="text" defaultValue={cleanName} onBlur={e => updateTaskText(task.id, `[${dateStr}] ${e.target.value}`)} onKeyDown={e => {if(e.key==='Enter') e.currentTarget.blur()}} className={`w-full bg-transparent outline-none text-[13px] font-medium leading-tight ${task.checked ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-sec)]'}`} />
                      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-500"><X className="w-3 h-3"/></button>
                    </div>
                  )
                })}
                
                {addingDate === dateStr ? (
                  <div className="flex items-center gap-2 p-2">
                    <input autoFocus type="text" onKeyDown={(e) => handleTaskAdd(e, dateStr)} onBlur={() => setAddingDate(null)} className="w-full bg-transparent outline-none text-[13px] text-[var(--text-main)] font-medium" placeholder="New task..." />
                  </div>
                ) : (
                  <button onClick={() => setAddingDate(dateStr)} className="flex items-center gap-1 p-2 text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors w-full mt-1">
                    <Plus className="w-3 h-3" /> ADD TASK
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}