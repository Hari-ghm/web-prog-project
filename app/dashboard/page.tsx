'use client';
import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar
} from 'recharts';
import { Activity, Zap, Sun, Wind, BatteryFull, Leaf, MapPin } from 'lucide-react';
import { allStates, getCitiesForState } from '@/lib/locations';

export default function DashboardPage() {
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveData, setLiveData] = useState<any[]>([]);
  const [liveCurrent, setLiveCurrent] = useState<any>(null);

  useEffect(() => {
    if (selectedState) {
      setCities(getCitiesForState(selectedState));
      setSelectedCity('');
    } else {
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedState]);

  useEffect(() => {
    fetchDashboard();
  }, [selectedState, selectedCity]);

  useEffect(() => {
    const eventSource = new EventSource('/api/stream');
    eventSource.onmessage = (event) => {
      const newPoint = JSON.parse(event.data);
      setLiveCurrent(newPoint);
      setLiveData((prev) => {
        const updated = [...prev, newPoint];
        return updated.length > 20 ? updated.slice(updated.length - 20) : updated;
      });
    };
    eventSource.onerror = () => eventSource.close();
    return () => eventSource.close();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedState) params.set('state', selectedState);
      if (selectedCity) params.set('city', selectedCity);
      const res = await fetch(`/api/dashboard?${params}`);
      const data = await res.json();
      setStats(data.stats);
      setChartData(data.chartData || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    }
    setLoading(false);
  };

  const statCards = stats ? [
    { name: 'Total Capacity', value: `${(stats.totalCapacityKW / 1000).toFixed(0)} MW`, icon: <Zap className="w-6 h-6 text-blue-500" />, color: 'blue' },
    { name: 'Solar Capacity', value: `${(stats.solarCapacityKW / 1000).toFixed(0)} MW`, icon: <Sun className="w-6 h-6 text-amber-500" />, color: 'amber' },
    { name: 'Wind Capacity', value: `${(stats.windCapacityKW / 1000).toFixed(0)} MW`, icon: <Wind className="w-6 h-6 text-cyan-500" />, color: 'cyan' },
    { name: 'Battery Level', value: `${stats.batteryLevel}%`, icon: <BatteryFull className="w-6 h-6 text-green-500" />, color: 'green' },
    { name: "Today's Production", value: `${stats.todayProduction.toLocaleString()} kWh`, icon: <Activity className="w-6 h-6 text-purple-500" />, color: 'purple' },
    { name: 'CO₂ Saved', value: `${(stats.co2Saved / 1000).toFixed(1)} tons`, icon: <Leaf className="w-6 h-6 text-emerald-500" />, color: 'emerald' },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-secondary mt-1">Renewable energy overview & real-time telemetry</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-blue-400" />
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All States</option>
              {allStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          {cities.length > 0 && (
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">All Cities</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-secondary">Loading dashboard data...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {statCards.map((stat, idx) => (
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
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/5 to-transparent blur-2xl"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Weekly Chart */}
            <div className="lg:col-span-2 rounded-2xl glass border border-border/50 p-6 flex flex-col">
              <h2 className="text-xl font-semibold text-foreground mb-6 font-display">Weekly Energy Production</h2>
              <div className="flex-1 min-h-[350px] w-full">
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-secondary">No data available for this period</div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}kWh`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1e293b' }} />
                      <Legend verticalAlign="top" height={36} iconType="circle" />
                      <Bar dataKey="solar" name="Solar" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="wind" name="Wind" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="hydro" name="Hydro" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Battery Monitor */}
            <div className="rounded-2xl glass border border-border/50 p-6 flex flex-col">
              <h2 className="text-xl font-semibold text-foreground mb-6 font-display">Battery Reserve</h2>
              <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
                <div className="relative w-48 h-48 rounded-full border-[12px] border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden">
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-green-500 to-emerald-400 transition-all duration-1000 ease-in-out"
                    style={{ height: `${stats?.batteryLevel || 0}%` }}
                  ></div>
                  <div className="relative z-10 text-center">
                    <span className="text-5xl font-extrabold text-foreground">{stats?.batteryLevel || 0}%</span>
                    <span className="block text-sm text-secondary font-medium mt-1">Capacity</span>
                  </div>
                </div>
                <div className="mt-8 text-center space-y-2">
                  <p className="text-sm text-secondary">Active Sources: <span className="font-semibold text-foreground">{stats?.totalSources || 0}</span></p>
                  <p className="text-sm text-secondary">Solar Units: <span className="font-semibold text-amber-500">{stats?.solarSources || 0}</span></p>
                  <p className="text-sm text-secondary">Wind Units: <span className="font-semibold text-cyan-500">{stats?.windSources || 0}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chart */}
          <div className="rounded-2xl glass border border-border/50 p-6">
            <h2 className="text-xl font-semibold text-foreground mb-6 font-display">Real-Time Grid Telemetry (UK National Grid)</h2>
            <div className="min-h-[350px] w-full">
              {liveData.length === 0 ? (
                <div className="flex items-center justify-center h-[350px] text-secondary animate-pulse">Connecting to live data stream...</div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={liveData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v: number) => `${v}W`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#1e293b' }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Area type="monotone" dataKey="gridUsage" name="Grid Load" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorGrid)" isAnimationActive={false} />
                    <Area type="monotone" dataKey="solarOutput" name="Renewables" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorSolar)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
