"use client";

import React, { useState } from "react";
import { Plus, Trash2, Code, X } from "lucide-react";

interface Task { id: string; name: string; checked: boolean; protocol_id: string; }
interface DeveloperPathProps {
  activeProtocol: any;
  insertTaskDirectly: (nameStr: string) => Promise<void>;
  updateTaskText: (taskId: string, newText: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
}

const AVAILABLE_STACKS = [
  "Next.js", "React", "Vue", "Svelte", 
  "Golang", "Python", "Lua", "Java", "C++", "C#", "PHP", "Ruby", "Rust", "Swift", "Kotlin",
  "JavaScript", "TypeScript", "HTML/CSS", "Tailwind",                   
  "Node.js", "Express", "Laravel", "Spring Boot",
  "Supabase", "Firebase", "PostgreSQL", "MongoDB", "MySQL", "Redis",
  "Figma", "Docker", "Kubernetes", "AWS", "Git", "Web3", "Solidity"
];

export default function DeveloperPathDashboard({ activeProtocol, insertTaskDirectly, updateTaskText, deleteTask }: DeveloperPathProps) {
  const [editingDevTask, setEditingDevTask] = useState<Task | null>(null);

  
  const toggleTechStack = (stack: string) => {
    if (!editingDevTask) return;
    const parts = editingDevTask.name.split('||');
    let currentStacks = (parts[1] || '').split(', ').filter(Boolean);
    
    if (currentStacks.includes(stack)) {
      currentStacks = currentStacks.filter(s => s !== stack); // Kalo udah ada, hapus (Toggle Off)
    } else {
      currentStacks.push(stack); // Kalo blm ada, tambahin (Toggle On)
    }

    const newStackString = currentStacks.join(', ');
    const newVal = `${parts[0]||''}||${newStackString}||${parts[2]||''}||${parts[3]||''}||${parts[4]||''}`;
    
    setEditingDevTask({...editingDevTask, name: newVal}); 
    updateTaskText(editingDevTask.id, newVal);
  };

  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {activeProtocol?.tasks.map((task: Task) => {
          const parts = task.name.split('||');
          const pName = parts[0] || 'Untitled Project';
          const pStack = parts[1] || '';
          const pStart = parts[3] || '';
          const pEnd = parts[4] || '';

          return (
            <div 
              key={task.id} 
              onClick={() => setEditingDevTask(task)} 
              className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-hover)]/40 backdrop-blur-sm hover:border-[var(--accent)] transition-all flex flex-col group shadow-lg cursor-pointer hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[var(--text-main)] truncate pr-4">{pName}</h3>
                <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-500 transition-opacity"><Trash2 className="w-4 h-4" /></button>
              </div>
              
              
              <div className="flex flex-wrap gap-2 mb-4">
                {pStack ? pStack.split(', ').map(stack => (
                  <span key={stack} className="text-[10px] font-bold px-2 py-1 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 rounded-md">
                    {stack}
                  </span>
                )) : <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Code className="w-3 h-3"/> No stack</span>}
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold tracking-widest text-[var(--text-muted)] mt-auto pt-4 border-t border-[var(--border)]/50 uppercase">
                <span>{pStart || "NO START"}</span>
                <span>→</span>
                <span className={pEnd ? "text-[var(--accent)]" : ""}>{pEnd || "NO DEADLINE"}</span>
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={(e) => { 
        e.preventDefault(); 
        insertTaskDirectly("New Project||Next.js, Golang||What needs to be done?||||"); 
      }} className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-2xl text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all font-bold tracking-widest flex items-center justify-center gap-2 text-sm">
        <Plus className="w-4 h-4" /> ADD NEW PROJECT
      </button>

      
      {editingDevTask && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-[fadeIn_0.1s_ease-out]">
          <div className="w-full max-w-[600px] bg-[var(--bg-sidebar)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col relative m-4">
            <button onClick={() => setEditingDevTask(null)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-main)] p-2 rounded-full border border-[var(--border)] transition-colors"><X className="w-5 h-5"/></button>
            <div className="p-8 flex flex-col gap-6">
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold tracking-widest text-[var(--accent)] uppercase">Project Name</label>
                <input type="text" value={editingDevTask.name.split('||')[0] || ''} onChange={e => {
                  const parts = editingDevTask.name.split('||');
                  const newVal = `${e.target.value}||${parts[1]||''}||${parts[2]||''}||${parts[3]||''}||${parts[4]||''}`;
                  setEditingDevTask({...editingDevTask, name: newVal}); updateTaskText(editingDevTask.id, newVal);
                }} className="text-3xl font-black bg-transparent outline-none text-[var(--text-main)] w-full placeholder-[var(--text-muted)]/50" placeholder="Project Name" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold tracking-widest text-[var(--text-muted)] uppercase">Start Date</label>
                  <input type="date" value={editingDevTask.name.split('||')[3] || ''} onChange={e => {
                    const parts = editingDevTask.name.split('||');
                    const newVal = `${parts[0]||''}||${parts[1]||''}||${parts[2]||''}||${e.target.value}||${parts[4]||''}`;
                    setEditingDevTask({...editingDevTask, name: newVal}); updateTaskText(editingDevTask.id, newVal);
                  }} className="bg-[var(--bg-main)] border border-[var(--border)] rounded-lg p-3 outline-none text-[var(--text-sec)] text-sm [color-scheme:dark]" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold tracking-widest text-[var(--text-muted)] uppercase">Deadline</label>
                  <input type="date" value={editingDevTask.name.split('||')[4] || ''} onChange={e => {
                    const parts = editingDevTask.name.split('||');
                    const newVal = `${parts[0]||''}||${parts[1]||''}||${parts[2]||''}||${parts[3]||''}||${e.target.value}`;
                    setEditingDevTask({...editingDevTask, name: newVal}); updateTaskText(editingDevTask.id, newVal);
                  }} className="bg-[var(--bg-main)] border border-[var(--border)] rounded-lg p-3 outline-none text-[var(--text-sec)] text-sm [color-scheme:dark]" />
                </div>
              </div>

              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold tracking-widest text-[var(--text-muted)] uppercase">Tech Stack</label>
                <div className="flex overflow-x-auto pb-2 gap-2 custom-scrollbar">
                  {AVAILABLE_STACKS.map(stack => {
                    const currentStacks = (editingDevTask.name.split('||')[1] || '').split(', ').filter(Boolean);
                    const isSelected = currentStacks.includes(stack);
                    return (
                      <button 
                        key={stack}
                        onClick={() => toggleTechStack(stack)}
                        className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                          isSelected 
                            ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-[0_0_15px_rgba(46,170,220,0.3)]" 
                            : "bg-[var(--bg-main)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--text-muted)]"
                        }`}
                      >
                        {stack}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold tracking-widest text-[var(--text-muted)] uppercase">Tasks & Issues</label>
                <textarea value={editingDevTask.name.split('||')[2] || ''} onChange={e => {
                    const parts = editingDevTask.name.split('||');
                    const newVal = `${parts[0]||''}||${parts[1]||''}||${e.target.value}||${parts[3]||''}||${parts[4]||''}`;
                    setEditingDevTask({...editingDevTask, name: newVal}); updateTaskText(editingDevTask.id, newVal);
                }} className="bg-[var(--bg-main)] border border-[var(--border)] rounded-lg p-4 outline-none text-[var(--text-sec)] text-sm h-32 resize-none" placeholder="What's missing? What needs to be done?" />
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}