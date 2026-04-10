"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AnalyticsProps {
  protocols: any[]; 
  t: any;
}

export default function AnalyticsDashboard({ protocols, t }: AnalyticsProps) {
  let totalIn = 0;
  let totalOut = 0;
  let completedTasks = 0;
  let pendingTasks = 0;

  
  if (protocols && protocols.length > 0) {
    protocols.forEach((protocol) => {
      protocol.tasks.forEach((task: any) => {
        
        
        if (task.name.startsWith("IN||") || task.name.startsWith("OUT||")) {
          const parts = task.name.split("||");
          const type = parts[0];
          const amt = parseInt(parts[1]) || 0;
          if (type === "IN") totalIn += amt;
          if (type === "OUT") totalOut += amt;
        } 
        
        else {
          if (task.checked) completedTasks++;
          else pendingTasks++;
        }

      });
    });
  }

  const financeData = [
    { name: 'Financial Overview', Income: totalIn, Expense: totalOut }
  ];

  const productivityData = [
    { name: 'Completed', value: completedTasks },
    { name: 'Pending', value: pendingTasks }
  ];
  
  const COLORS = ['#10B981', '#F43F5E']; 
  const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);

  return (
    <div className="animate-[fadeIn_0.5s_ease-out] w-full flex flex-col gap-8 mt-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-xs font-bold tracking-widest uppercase">
          INSIGHTS
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-[var(--text-main)] tracking-tight">Analytics Dashboard</h2>
        <p className="text-[var(--text-muted)] text-sm mt-2">Visualisasi data protokol dan keuangan lu secara global.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-hover)]/40 backdrop-blur-sm shadow-lg h-[400px] flex flex-col group hover:border-[var(--accent)] transition-colors">
          <h3 className="text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--accent)] tracking-widest mb-6 uppercase text-center transition-colors">Cashflow (IN vs OUT)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value / 1000}k`} />
                <Tooltip cursor={{ fill: 'var(--bg-main)', opacity: 0.5 }} contentStyle={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--text-main)', fontWeight: 'bold' }} formatter={(value: any) => formatRupiah(Number(value))} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Income" fill="#10B981" radius={[6, 6, 0, 0]} barSize={50} />
                <Bar dataKey="Expense" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-hover)]/40 backdrop-blur-sm shadow-lg h-[400px] flex flex-col group hover:border-[var(--accent)] transition-colors">
          <h3 className="text-xs font-bold text-[var(--text-muted)] group-hover:text-[var(--accent)] tracking-widest mb-6 uppercase text-center transition-colors">Task Completion Rate</h3>
          <div className="flex-1 w-full flex items-center justify-center">
            {completedTasks === 0 && pendingTasks === 0 ? (
              <p className="text-[var(--text-muted)] text-sm font-bold">Belum ada task di workspace ini.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={productivityData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={5} dataKey="value" stroke="none">
                    {productivityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border)', borderRadius: '12px', color: 'var(--text-main)', fontWeight: 'bold' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}