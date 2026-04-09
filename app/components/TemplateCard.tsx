"use client";

import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react"; 

interface TemplateCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  onClick: () => void;
  isSpecial?: boolean;
}

export default function TemplateCard({ title, description, Icon, onClick, isSpecial }: TemplateCardProps) {
  return (
    <button 
      onClick={onClick}
      className="group relative flex flex-col text-left p-8 rounded-2xl border border-[#2C2C2C] bg-[#111]/80 backdrop-blur-sm hover:border-[#2EAADC] hover:bg-[#151515] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(46,170,220,0.15)] overflow-hidden"
    >
      {isSpecial && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2EAADC]/10 blur-[50px] group-hover:bg-[#2EAADC]/20 transition-colors duration-500"></div>
      )}
      
      <div className="w-12 h-12 rounded-xl bg-[#202020] border border-[#2C2C2C] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2EAADC]/10 group-hover:border-[#2EAADC]/30 transition-all duration-500 relative z-10">
        <Icon className="w-6 h-6 text-[#737373] group-hover:text-[#2EAADC] transition-colors" />
      </div>
      
      <h3 className="text-xl text-white font-bold mb-3 relative z-10">{title}</h3>
      <p className="text-[#737373] text-sm leading-relaxed mb-8 flex-grow relative z-10">{description}</p>
      
      <div className="flex items-center text-xs font-bold text-[#5A5A5A] group-hover:text-[#2EAADC] transition-colors relative z-10">
        DEPLOY PROTOCOL <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </div>
    </button>
  );
}