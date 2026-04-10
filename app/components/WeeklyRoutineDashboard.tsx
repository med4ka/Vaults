"use client";

import React, { useState } from "react";
import { Plus, Check, X } from "lucide-react";

interface Task { id: string; name: string; checked: boolean; protocol_id: string; }

interface WeeklyRoutineProps {
  activeProtocol: any;
  insertTaskDirectly: (nameStr: string) => Promise<void>;
  updateTaskText: (taskId: string, newText: string) => Promise<void>;
  toggleTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WeeklyRoutineDashboard({ 
  activeProtocol, 
  insertTaskDirectly, 
  updateTaskText, 
  toggleTask, 
  deleteTask 
}: WeeklyRoutineProps) {
  
  const [addingDay, setAddingDay] = useState<string | null>(null);

  const handleKanbanAdd = async (e: React.KeyboardEvent<HTMLInputElement>, day: string) => {
    if (e.key === 'Enter') {
      const val = e.currentTarget.value;
      if (val.trim()) await insertTaskDirectly(`[${day}] ${val}`);
      setAddingDay(null);
    }
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {WEEK_DAYS.map(day => {
          const dayTasks = activeProtocol?.tasks.filter((t: Task) => t.name.startsWith(`[${day}]`)) || [];
          return (
            <div key={day} className="flex flex-col h-[500px] rounded-2xl border border-[var(--border)] bg-[var(--bg-hover)]/40 backdrop-blur-sm overflow-hidden shadow-md">
              <div className="p-3 border-b border-[var(--border)] bg-[var(--bg-main)]/50 text-center">
                <span className="font-bold text-[var(--text-main)] text-sm tracking-widest uppercase">{day.substring(0,3)}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
                {dayTasks.map((task: Task) => {
                  const cleanName = task.name.replace(`[${day}] `, '');
                  return (
                    <div key={task.id} className="group flex items-start gap-2 p-2 rounded-lg hover:bg-[var(--bg-main)] transition-colors border border-transparent hover:border-[var(--border)]">
                      <button onClick={() => toggleTask(task)} className={`shrink-0 w-4 h-4 mt-0.5 rounded-[4px] border flex items-center justify-center transition-all ${task.checked ? 'bg-[var(--accent)] border-[var(--accent)]' : 'border-[var(--text-muted)]'}`}>
                        {task.checked && <Check className="w-3 h-3 text-white font-bold" />}
                      </button>
                      <input type="text" defaultValue={cleanName} onBlur={e => updateTaskText(task.id, `[${day}] ${e.target.value}`)} onKeyDown={e => {if(e.key==='Enter') e.currentTarget.blur()}} className={`w-full bg-transparent outline-none text-[13px] font-medium leading-tight ${task.checked ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-sec)]'}`} />
                      <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-500"><X className="w-3 h-3"/></button>
                    </div>
                  )
                })}
                {addingDay === day ? (
                  <div className="flex items-center gap-2 p-2">
                    <input autoFocus type="text" onKeyDown={(e) => handleKanbanAdd(e, day)} onBlur={() => setAddingDay(null)} className="w-full bg-transparent outline-none text-[13px] text-[var(--text-main)] font-medium" placeholder="New..." />
                  </div>
                ) : (
                  <button onClick={() => setAddingDay(day)} className="flex items-center gap-1 p-2 text-[11px] font-bold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors w-full mt-1">
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