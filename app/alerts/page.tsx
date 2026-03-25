'use client';

import { useState, useMemo } from 'react';

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [sortBy, setSortBy] = useState('severity');

  const alerts = [
    { id: 1, severity: 'Critical', title: 'Grid Connectivity Lost', message: 'Main connection to sector 4 lost. Backup power initiated.', time: '10 mins ago' },
    { id: 2, severity: 'Warning', title: 'High Temperature Warning', message: 'Solar Inverter B detecting temps above 85°C.', time: '45 mins ago' },
    { id: 3, severity: 'Info', title: 'Maintenance Schedule', message: 'Routine check scheduled for Wind Turbine 2 tomorrow.', time: '2 hours ago' },
    { id: 4, severity: 'Critical', title: 'Battery Degradation', message: 'Storage Unit 3 reported health below 60%.', time: '1 day ago' },
    { id: 5, severity: 'Warning', title: 'Voltage Fluctuation', message: 'Detected unstable voltage in Substation Alpha.', time: '1 day ago' },
  ];

  const severities = ['All', 'Critical', 'Warning', 'Info'];

  const severityWeight: Record<string, number> = {
    'Critical': 3,
    'Warning': 2,
    'Info': 1
  };

  const filteredAndSortedAlerts = useMemo(() => {
    let result = [...alerts];

    if (searchTerm) {
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSeverity !== 'All') {
      result = result.filter((a) => a.severity === filterSeverity);
    }

    result.sort((a, b) => {
      if (sortBy === 'severity') {
        const weightDiff = severityWeight[b.severity] - severityWeight[a.severity];
        if (weightDiff !== 0) return weightDiff;
        // If same severity, sort by id desc (proxy for recentness since we don't have real dates)
        return b.id - a.id;
      }
      if (sortBy === 'recent') {
        return a.id - b.id; // Just using id as a proxy for date since time is a string like "10 mins ago"
      }
      return 0;
    });

    return result;
  }, [searchTerm, filterSeverity, sortBy, alerts]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">System Alerts</h1>
      
      <div className="bg-slate-900 rounded-xl p-4 mb-8 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Filter by Severity</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {severities.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="severity">Severity (High to Low)</option>
            <option value="recent">Most Recent</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAndSortedAlerts.map((alert) => (
          <div key={alert.id} className={`p-4 rounded-xl border-l-4 ${
            alert.severity === 'Critical' ? 'bg-rose-500/10 border-rose-500' :
            alert.severity === 'Warning' ? 'bg-amber-500/10 border-amber-500' :
            'bg-blue-500/10 border-blue-500'
          }`}>
             <div className="flex justify-between items-start">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      {alert.severity === 'Critical' && <span className="text-xl font-bold text-rose-500">CRITICAL</span>}
                      {alert.severity === 'Warning' && <span className="text-xl font-bold text-amber-500">WARNING</span>}
                      {alert.severity === 'Info' && <span className="text-xl font-bold text-blue-500">INFO</span>}
                      <h3 className={`font-semibold ${
                        alert.severity === 'Critical' ? 'text-rose-400' :
                        alert.severity === 'Warning' ? 'text-amber-400' :
                        'text-blue-400'
                      }`}>{alert.title}</h3>
                   </div>
                   <p className="text-slate-300 text-sm ml-8">{alert.message}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{alert.time}</span>
             </div>
             <div className="mt-3 ml-8 flex gap-3">
                 <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors">Acknowledge</button>
                 <button className="text-xs font-medium text-slate-400 hover:text-white transition-colors">View Details</button>
             </div>
          </div>
        ))}
        {filteredAndSortedAlerts.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            No alerts found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
