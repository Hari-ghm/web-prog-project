'use client';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    { name: 'Total Energy Output', value: '...', change: '...', type: 'positive' },
    { name: 'Active Sources', value: '...', change: '...', type: 'warning' },
    { name: 'Efficiency Rating', value: '...', change: '...', type: 'positive' },
    { name: 'Active Alerts', value: '...', change: '...', type: 'negative' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setStats(data.stats);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    // Initial fetch
    fetchStats();

    // Set up polling every 3 seconds
    const intervalId = setInterval(fetchStats, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  const activities: any[] = [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 p-6 shadow-sm hover:border-slate-700 transition-all">
            <dt>
              <p className="truncate text-sm font-medium text-slate-400">{stat.name}</p>
            </dt>
            <dd className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-semibold text-white">{stat.value}</span>
            </dd>
            <div className={`mt-2 flex items-center text-sm ${
              stat.type === 'positive' ? 'text-green-400' : 
              stat.type === 'warning' ? 'text-amber-400' : 
              'text-rose-400'
            }`}>
               {stat.change}
            </div>
            {/* Decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-gradient-to-br from-white/5 to-white/0 blur-2xl"></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area Placeholder */}
        <div className="lg:col-span-2 rounded-xl bg-slate-900 border border-slate-800 p-6 flex flex-col">
          <h2 className="text-xl font-semibold text-white mb-4">Facility Overview</h2>
          <div className="flex-1 min-h-[320px] w-full bg-slate-950/50 rounded-lg flex items-center justify-center border border-slate-800 border-dashed overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=1200" alt="Facility Overview" className="w-full h-full object-cover rounded-lg" />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <ul role="list" className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="relative flex gap-x-4">
                <div className={`absolute left-0 top-0 flex w-6 justify-center -bottom-6`}>
                  <div className="w-px bg-slate-800"></div>
                </div>
                <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-slate-900">
                  <div className={`h-2 w-2 rounded-full ring-1 ring-slate-700 ${
                    activity.status === 'Warning' ? 'bg-amber-500' :
                    activity.status === 'Success' ? 'bg-green-500' :
                    activity.status === 'Info' ? 'bg-blue-500' : 'bg-rose-500'
                  }`} />
                </div>
                <div className="flex-auto py-0.5 text-xs leading-5 text-slate-400 mb-4">
                  <span className="font-medium text-white block">{activity.source}</span>
                  <span className="block mb-1">{activity.event}</span>
                  <span className="text-slate-500">{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
          <button className="w-full mt-4 py-2 text-sm text-blue-400 hover:text-blue-300 border border-slate-800 rounded-lg hover:border-blue-900/50 transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
