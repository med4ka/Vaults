"use client";

import React, { useState } from "react";
import { Plus, Check, Trash2 } from "lucide-react";

interface Task { id: string; name: string; checked: boolean; protocol_id: string; }

interface StandardDashboardProps {
  activeProtocol: any;
  updateTaskText: (taskId: string, newText: string) => Promise<void>;
  toggleTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  insertTaskDirectly: (nameStr: string) => Promise<void>;
  progressPercentage: number;
  t: any;
}

export default function StandardDashboard({
  activeProtocol,
  updateTaskText,
  toggleTask,
  deleteTask,
  insertTaskDirectly,
  progressPercentage,
  t
}: StandardDashboardProps) {
  // STATE INPUT PINDAH KESINI!
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const addTask = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTaskName.trim()) {
      await insertTaskDirectly(newTaskName);
      setNewTaskName(""); 
      setIsAdding(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-3 font-bold tracking-widest uppercase">
          <span>{t.progress}</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="h-1.5 w-full bg-[var(--border)] rounded-full overflow-hidden transition-colors duration-500">
          <div className="h-full bg-[var(--accent)] rounded-full transition-all duration-700 ease-out" style={{ width: `${progressPercentage}%` }} />
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5">
        {activeProtocol?.tasks.map((task: Task) => (
          <div key={task.id} className="group flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[var(--bg-hover)]/80 backdrop-blur-sm transition-colors">
            <button onClick={() => toggleTask(task)} className={`shrink-0 w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all duration-200 ${task.checked ? 'bg-[var(--accent)] border-[var(--accent)] scale-110' : 'border-[var(--text-muted)] hover:border-[var(--accent)]'}`}>
              {task.checked && <Check className="w-3.5 h-3.5 text-white font-bold" />}
            </button>
            <div className="flex-1 flex items-center justify-between min-w-0">
              <input type="text" defaultValue={task.name} onChange={e => updateTaskText(task.id, e.target.value)} className={`w-full bg-transparent outline-none text-[15px] transition-colors duration-200 ${task.checked ? 'text-[var(--text-muted)] line-through' : 'text-[var(--text-main)] font-medium'}`} />
              <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-500 transition-opacity px-2"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        
        {isAdding ? (
          <div className="flex items-center gap-3 py-2 px-2 mt-2">
            <div className="shrink-0 w-5 h-5 rounded-[4px] border border-[var(--border)]" />
            <input autoFocus type="text" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} onKeyDown={addTask} onBlur={() => { setIsAdding(false); setNewTaskName(""); }} placeholder={t.newTask} className="w-full bg-transparent outline-none text-[15px] text-[var(--text-main)] placeholder-[var(--text-muted)] font-medium" />
          </div>
        ) : (
          <div onClick={() => setIsAdding(true)} className="flex items-center gap-3 py-2 px-2 mt-2 rounded-lg cursor-pointer text-[var(--text-muted)] hover:bg-[var(--bg-hover)]/80 hover:text-[var(--text-main)] backdrop-blur-sm transition-colors">
            <Plus className="w-5 h-5" />
            <span className="text-[15px] font-medium">{t.newTask}</span>
          </div>
        )}
      </div>
    </div>
  );
}