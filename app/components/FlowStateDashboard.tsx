"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface FlowStateProps {
  activeProtocol: any;
  updateTaskText: (taskId: string, newText: string) => Promise<void>;
}

export default function FlowStateDashboard({ activeProtocol, updateTaskText }: FlowStateProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (secs: number) => 
    `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col items-center mt-6 animate-[fadeIn_0.5s_ease-out]">
      <div className="w-40 h-40 rounded-full border-[3px] border-[var(--border)] flex flex-col items-center justify-center mb-8 relative shadow-[0_0_40px_rgba(46,170,220,0.1)]">
        <div className="absolute inset-0 rounded-full border-[3px] border-[var(--accent)] transition-all duration-1000 ease-linear" style={{ clipPath: `polygon(50% 50%, 50% 0, ${timeLeft % 2 === 0 ? '100% 0' : '100% 0'}, 100% 100%, 0 100%, 0 0, 50% 0)`}}></div>
        <span className="text-4xl font-black text-[var(--text-main)] tracking-tighter z-10">{formatTime(timeLeft)}</span>
        <span className="text-[var(--text-muted)] text-[10px] font-bold tracking-widest mt-1 z-10">FOCUS</span>
      </div>
      <div className="flex gap-4 mb-10">
        <button onClick={() => setIsRunning(!isRunning)} className="flex items-center gap-2 px-6 py-2.5 bg-[var(--text-main)] text-[var(--bg-main)] text-sm font-bold rounded-full hover:scale-105 transition-transform">
          {isRunning ? <><Pause className="w-4 h-4"/> PAUSE</> : <><Play className="w-4 h-4"/> START</>}
        </button>
        <button onClick={() => { setIsRunning(false); setTimeLeft(25*60); }} className="flex items-center gap-2 px-6 py-2.5 bg-[var(--bg-hover)] text-[var(--text-main)] text-sm font-bold rounded-full hover:bg-[var(--border)] transition-colors">
          <RotateCcw className="w-4 h-4"/> RESET
        </button>
      </div>
      <div className="w-full max-w-[600px] flex flex-col gap-3">
        {activeProtocol?.tasks.map((task: any) => (
          <div key={task.id} className="flex bg-[var(--bg-hover)]/50 backdrop-blur-sm p-4 rounded-xl border border-[var(--border)]">
            <input type="text" defaultValue={task.name} onChange={e => updateTaskText(task.id, e.target.value)} className="w-full bg-transparent outline-none text-[15px] text-[var(--text-main)] font-medium" placeholder="Write your focus here..."/>
          </div>
        ))}
      </div>
    </div>
  );
}