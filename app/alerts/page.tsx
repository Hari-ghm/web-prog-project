'use client';

import { useState, useEffect, useMemo } from 'react';

interface AlertData {
  _id: string;
  severity: string;
  title: string;
  message: string;
  acknowledged: boolean;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('All');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/alerts');
      const data = await res.json();
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error('Fetch alerts error', err);
    }
    setLoading(false);
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setAlerts(alerts.map(a => a._id === id ? { ...a, acknowledged: true } : a));
    } catch (err) {
      console.error('Acknowledge error', err);
    }
  };

  const severities = ['All', 'Critical', 'Warning', 'Info'];

  const filteredAlerts = useMemo(() => {
    let result = [...alerts];
    if (searchTerm) {
      result = result.filter((a) => a.title.toLowerCase().includes(searchTerm.toLowerCase()) || a.message.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterSeverity !== 'All') {
      result = result.filter((a) => a.severity.toLowerCase() === filterSeverity.toLowerCase());
    }
    return result;
  }, [searchTerm, filterSeverity, alerts]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <h1 className="text-3xl font-bold text-foreground mb-8">System Alerts</h1>
      
      <div className="glass rounded-xl p-4 mb-8 border border-border/50 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-secondary mb-1">Search Alerts</label>
          <input
            type="text"
            placeholder="Search by title or message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-secondary mb-1">Filter by Severity</label>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
          >
            {severities.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-secondary">Loading alerts...</div>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center text-secondary glass rounded-xl border border-border/50">No alerts found. System normal.</div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert._id} className={`p-5 rounded-xl border-l-4 glass shadow-sm transition-all ${
                alert.acknowledged ? 'opacity-60 border-slate-500' :
                alert.severity === 'critical' ? 'bg-rose-500/5 dark:bg-rose-500/10 border-rose-500' :
                alert.severity === 'warning' ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500' :
                'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500'
              }`}>
                 <div className="flex justify-between items-start">
                    <div>
                       <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-sm uppercase ${
                            alert.acknowledged ? 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400' :
                            alert.severity === 'critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400' :
                            alert.severity === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' :
                            'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                          }`}>
                            {alert.severity}
                          </span>
                          <h3 className={`font-semibold ${alert.acknowledged ? 'text-secondary' : 'text-foreground'}`}>
                            {alert.title}
                          </h3>
                       </div>
                       <p className="text-secondary text-sm mt-2">{alert.message}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-xs text-secondary whitespace-nowrap">
                        {new Date(alert.createdAt).toLocaleString()}
                      </span>
                      {!alert.acknowledged && (
                        <button 
                          onClick={() => handleAcknowledge(alert._id)}
                          className="text-xs font-medium px-3 py-1 bg-background border border-border hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                      {alert.acknowledged && (
                        <span className="text-xs text-green-500 italic">Acknowledged</span>
                      )}
                    </div>
                 </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
