"use client";

import { Target, Zap, Code, Wallet, CalendarDays } from "lucide-react"; 
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import TemplateCard from "../components/TemplateCard";

export default function Templates() {
  const router = useRouter();

  const handleSelectTemplate = async (templateName: string) => {
    let protocolName = "";
    let iconName = "";
    let tasksList: string[] = [];

    if (templateName === "Weekly Routine") {
      protocolName = "Weekly Routine"; 
      iconName = "CalendarDays";
      tasksList = ["[Monday] Morning Review", "[Tuesday] Deep Work", "[Wednesday] Gym", "[Thursday] Learn Golang", "[Friday] Weekly Review", "[Saturday] Rest", "[Sunday] Planning"];
    } else if (templateName === "Flow State") {
      protocolName = "Flow State"; 
      iconName = "Zap";
      tasksList = ["Phone on Airplane Mode", "90-Min Deep Work Block", "Review Daily Goals"];
    } else if (templateName === "Developer Path") {
      protocolName = "Developer Path"; iconName = "Code";
      tasksList = ["Setup Golang Backend API", "Design UI Components di Figma", "Fix Bugs & Code Review"];
    } else if (templateName === "Financial Assistant") {
      protocolName = "Financial Assistant"; iconName = "Wallet";
      tasksList = ["Catat Pengeluaran & Pemasukan", "Review Limit Budget Mingguan", "Develop & Sync API Backend Golang"];
    }

    const { data: pData } = await supabase.from('protocols').insert([{ name: protocolName, icon: iconName }]).select();

    if (pData && pData.length > 0) {
      const newProtocolId = pData[0].id;
      const tasksToInsert = tasksList.map(task => ({
        protocol_id: newProtocolId, name: task, checked: false
      }));
      await supabase.from('tasks').insert(tasksToInsert);
    }

    localStorage.setItem("vaults_setup", "true");
    router.push("/daily");
  };

  const templatesData = [
    { name: "Weekly Routine", desc: "Track your weekly calendar, tasks, and repetitive routines.", icon: CalendarDays },
    { name: "Flow State", desc: "Designed for intensive study blocks, dopamine detox, and eliminating distractions.", icon: Zap },
    { name: "Developer Path", desc: "Track your coding projects, backend architectures, UI designs, and tech stacks.", icon: Code, isSpecial: true },
    { name: "Financial Assistant", desc: "Track expenses, review budgets, and sync with your Golang backend API.", icon: Wallet, isSpecial: true } 
  ];

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#0a0a0a] text-[#D4D4D4] font-sans overflow-hidden py-12">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#333333_1px,transparent_1px),linear-gradient(to_bottom,#333333_1px,transparent_1px)] bg-[size:40px_40px] opacity-10 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#2EAADC]/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-[1200px] w-full px-8 flex flex-col items-center animate-[fadeIn_0.8s_ease-out]">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-6 rounded-full bg-[#2EAADC]/10 border border-[#2EAADC]/20 text-[#2EAADC] text-xs font-bold tracking-widest uppercase">
            Initialization
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Choose your protocol</h1>
          <p className="text-[#A3A3A3] text-sm md:text-base max-w-lg mx-auto">
            Select a foundational template to start architecting your digital workspace. You can modify this later.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {templatesData.map((tpl) => (
            <TemplateCard 
              key={tpl.name}
              title={tpl.name}
              description={tpl.desc}
              Icon={tpl.icon}
              isSpecial={tpl.isSpecial}
              onClick={() => handleSelectTemplate(tpl.name)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}