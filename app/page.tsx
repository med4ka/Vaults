"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [hasTemplate, setHasTemplate] = useState(false);
  const [isScattered, setIsScattered] = useState(false);
  const [motif, setMotif] = useState('grid'); 

  useEffect(() => {
    const checkSetup = localStorage.getItem("vaults_setup");
    const savedMotif = localStorage.getItem("vaults_motif");
    if (checkSetup) setHasTemplate(true);
    if (savedMotif) setMotif(savedMotif);
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  const handleEnter = () => {
    if (hasTemplate) router.push("/daily");
    else router.push("/templates");
  };

  const letters = "Vaults".split("");
  const scatterTransforms = [
    "-translate-x-12 -translate-y-12 rotate-[-30deg] opacity-40 blur-[2px] scale-110",
    "translate-x-8 -translate-y-16 rotate-[25deg] opacity-60 blur-[1px] scale-90",
    "-translate-x-14 translate-y-10 rotate-[45deg] opacity-30 blur-[3px] scale-125",
    "translate-x-16 translate-y-8 rotate-[-20deg] opacity-70 scale-95",
    "-translate-x-8 translate-y-14 rotate-[35deg] opacity-50 blur-[1px] scale-105",
    "translate-x-12 -translate-y-10 rotate-[-40deg] opacity-60 blur-[2px] scale-110"
  ];

  return (
    <main className="relative flex h-screen w-full items-center justify-center bg-[#0d0d0d] font-sans overflow-hidden">
      
      {motif === 'grid' && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#333333_1px,transparent_1px),linear-gradient(to_bottom,#333333_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      )}
      
      {motif === 'noise' && (
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      )}

      {motif === 'waves' && (
        <div className="absolute inset-0 opacity-10 bg-[repeating-radial-gradient(circle_at_0_0,transparent_0,#444_1px,transparent_1px,transparent_40px)] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_60%,transparent_100%)]"></div>
      )}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#2EAADC]/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 mb-8 rounded-2xl bg-white text-[#111111] flex items-center justify-center text-4xl font-black shadow-[0_0_40px_rgba(255,255,255,0.15)] ring-1 ring-white/20">V</div>

        <div onMouseEnter={() => setIsScattered(true)} onMouseLeave={() => setIsScattered(false)} className="flex cursor-crosshair mb-4 px-8 py-4">
          {letters.map((char, i) => (
            <span key={i} className={`text-7xl font-black text-white transition-all duration-700 ease-out inline-block ${isScattered ? scatterTransforms[i] : "translate-x-0 translate-y-0 rotate-0 opacity-100 blur-0 scale-100"}`}>
              {char}
            </span>
          ))}
        </div>

        <p className="text-[#A3A3A3] mb-12 text-center max-w-[340px] text-sm leading-relaxed font-medium">Your personal protocol, architect your day, track your progress</p>

        <button onClick={handleEnter} className="group flex items-center gap-3 px-8 py-3.5 bg-white text-[#111111] text-sm font-bold rounded-full hover:scale-105 hover:shadow-[0_0_30px_rgba(46,170,220,0.3)] transition-all duration-300">
          {hasTemplate ? "Open Workspace" : "Initialize System"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

      </div>
    </main>
  );
}