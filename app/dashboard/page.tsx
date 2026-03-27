'use client';
import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart 
} from 'recharts';
import { Activity, Zap, Sun, BatteryFull } from 'lucide-react';

type DataPoint = {
  time: string;
  solarOutput: number;
  gridUsage: number;
  batteryLevel: number;
};

export default function DashboardPage() {
  const [data, setData] = useState<DataPoint[]>([]);
  const [current, setCurrent] = useState<DataPoint | null>(null);

  useEffect(() => {
    // Open connection to our new SSE API route
    const eventSource = new EventSource('/api/stream');

    eventSource.onmessage = (event) => {
      const newPoint: DataPoint = JSON.parse(event.data);
      setCurrent(newPoint);
      setData((prevData) => {
        // Keep only the last 20 data points for performance and smooth scrolling
        const updated = [...prevData, newPoint];
        return updated.length > 20 ? updated.slice(updated.length - 20) : updated;
      });
    };

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const stats = [
    { 
      name: 'Grid Usage (W)', 
      value: current ? `${current.gridUsage}W` : '...', 
      icon: <Zap className="w-6 h-6 text-blue-500" />
    },
    { 
      name: 'Solar Generation (W)', 
      value: current ? `${current.solarOutput}W` : '...', 
      icon: <Sun className="w-6 h-6 text-amber-500" />
    },
    { 
      name: 'Battery Level (%)', 
      value: current ? `${current.batteryLevel}%` : '...', 
      icon: <BatteryFull className="w-6 h-6 text-green-500" />
    },
    { 
      name: 'System Status', 
      value: current ? 'Optimal' : 'Connecting...', 
      icon: <Activity className="w-6 h-6 text-cyan-500" />
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Live Dashboard</h1>
          <p className="text-secondary mt-1">Real-time telemetry and energy distribution.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Live Stream
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-2xl glass border border-border/50 p-6 hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-4">
              <p className="font-medium text-secondary text-sm">{stat.name}</p>
              <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</span>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/5 to-transparent blur-2xl"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 rounded-2xl glass border border-border/50 p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-foreground mb-6 font-display">Power Load Profile (Real-Time)</h2>
          <div className="flex-1 min-h-[400px] w-full relative">
            {data.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-secondary">
                Connecting to data stream...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickMargin={10} 
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value: number) => `${value}W`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'var(--card)' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area 
                    type="monotone" 
                    dataKey="gridUsage" 
                    name="Grid Load" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorGrid)" 
                    isAnimationActive={false} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="solarOutput" 
                    name="Solar Generation" 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorSolar)" 
                    isAnimationActive={false} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Battery Monitor */}
        <div className="rounded-2xl glass border border-border/50 p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-foreground mb-6 font-display">Battery Reserve</h2>
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
            {current ? (
              <>
                <div className="relative w-48 h-48 rounded-full border-[12px] border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                  <div 
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-emerald-400 transition-all duration-1000 ease-in-out" 
                    style={{ height: `${current.batteryLevel}%` }}
                  ></div>
                  <div className="relative z-10 text-center">
                    <span className="text-5xl font-extrabold text-foreground">{current.batteryLevel}%</span>
                    <span className="block text-sm text-secondary font-medium mt-1">Capacity</span>
                  </div>
                </div>
                <div className="mt-8 text-center space-y-2">
                  <p className="text-sm text-secondary">Est. Runtime: <span className="font-semibold text-foreground">4h 23m</span></p>
                  <p className="text-sm text-secondary">Charge Rate: <span className="font-semibold text-green-500">+120W</span></p>
                </div>
              </>
            ) : (
               <div className="text-secondary animate-pulse">Waiting for telemetry...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
