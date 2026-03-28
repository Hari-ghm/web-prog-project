'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, DownloadCloud } from 'lucide-react';
import { allStates, getCitiesForState } from '@/lib/locations';

export default function ReportsPage() {
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [dates, setDates] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

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
    fetchReports();
  }, [selectedState, selectedCity, dates]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedState) params.set('state', selectedState);
      if (selectedCity) params.set('city', selectedCity);
      if (dates.from) params.set('from', dates.from);
      if (dates.to) params.set('to', dates.to);
      
      const res = await fetch(`/api/reports?${params}`);
      const data = await res.json();
      setSummaries(data.summaries || []);
    } catch (err) {
      console.error('Fetch reports error:', err);
    }
    setLoading(false);
  };

  const handleExportCSV = () => {
    if (summaries.length === 0) return;
    
    const headers = ['Date', 'State', 'City', 'Total Energy (kWh)', 'Solar (kWh)', 'Wind (kWh)', 'Hydro (kWh)', 'CO2 Saved (kg)'];
    const rows = summaries.map(s => [
      new Date(s.date).toLocaleDateString(),
      s.state,
      s.city,
      s.totalEnergyKWh,
      s.solarEnergyKWh,
      s.windEnergyKWh,
      s.hydroEnergyKWh,
      s.co2SavedKg
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `energrid_report_${dates.from}_to_${dates.to}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Generation Reports</h1>
          <p className="text-secondary mt-1">Export daily energy production data</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <DownloadCloud size={16} /> CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <FileText size={16} /> Print / PDF
          </button>
        </div>
      </div>

      {/* Filters - Hidden in Print */}
      <div className="glass rounded-xl p-5 mb-8 border border-border/50 grid grid-cols-1 md:grid-cols-4 gap-4 print:hidden">
        <div>
          <label className="block text-xs font-semibold text-secondary mb-1">State</label>
          <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            <option value="">All States</option>
            {allStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary mb-1">City</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary mb-1">From Date</label>
          <input type="date" value={dates.from} onChange={(e) => setDates(prev => ({ ...prev, from: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-secondary mb-1">To Date</label>
          <input type="date" value={dates.to} onChange={(e) => setDates(prev => ({ ...prev, to: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
        </div>
      </div>

      {/* Print Header */}
      <div className="hidden print:block mb-8 text-black">
        <h1 className="text-3xl font-bold">EnerGrid Generation Report</h1>
        <p className="text-sm mt-1">Period: {dates.from} to {dates.to}</p>
        <p className="text-sm mt-1">Location: {selectedCity ? `${selectedCity}, ${selectedState}` : selectedState ? selectedState : 'All Regions (India)'}</p>
      </div>

      <div className="glass rounded-2xl border border-border/50 overflow-hidden shadow-sm print:shadow-none print:border-black/20">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border/50 print:divide-black/20 text-foreground print:text-black">
             <thead className="bg-black/5 dark:bg-white/5 print:bg-transparent">
                 <tr>
                     <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Date</th>
                     <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Location</th>
                     <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Total (kWh)</th>
                     <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Solar</th>
                     <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Wind</th>
                     <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">Hydro</th>
                     <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider">CO₂ Saved (kg)</th>
                 </tr>
             </thead>
             <tbody className="divide-y divide-border/20 print:divide-black/10">
                {loading ? (
                  <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-secondary">Loading report data...</td></tr>
                ) : summaries.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-10 text-center text-sm text-secondary">No data found for selected period and filters.</td></tr>
                ) : (
                  summaries.map(s => (
                    <tr key={`${s.date}-${s.city}`} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors print:hover:bg-transparent">
                       <td className="px-6 py-4 text-sm whitespace-nowrap">{new Date(s.date).toLocaleDateString()}</td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <div className="text-sm font-medium">{s.city}</div>
                         <div className="text-xs text-secondary print:text-gray-500">{s.state}</div>
                       </td>
                       <td className="px-6 py-4 text-sm font-semibold text-right">{s.totalEnergyKWh.toLocaleString()}</td>
                       <td className="px-6 py-4 text-sm text-amber-500 print:text-amber-700 text-right">{s.solarEnergyKWh.toLocaleString()}</td>
                       <td className="px-6 py-4 text-sm text-cyan-500 print:text-cyan-700 text-right">{s.windEnergyKWh.toLocaleString()}</td>
                       <td className="px-6 py-4 text-sm text-blue-500 print:text-blue-700 text-right">{s.hydroEnergyKWh.toLocaleString()}</td>
                       <td className="px-6 py-4 text-sm text-emerald-500 print:text-emerald-700 text-right font-medium">{s.co2SavedKg.toLocaleString()}</td>
                    </tr>
                  ))
                )}
             </tbody>
          </table>
        </div>
      </div>
      
      {/* Print Footer */}
      <div className="hidden print:flex justify-between mt-8 text-black text-xs">
        <p>Generated by EnerGrid Smart Platform</p>
        <p>Generated on {new Date().toLocaleString()}</p>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:block { visibility: visible; }
          .print\\:block * { visibility: visible; }
          .print\\:hidden { display: none !important; }
          html, body { background: white; color: black; }
          .glass { background: transparent; backdrop-filter: none; border-color: #ccc; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border-bottom: 1px solid #ddd; padding: 8px; }
          /* Ensure table and contents are visible */
          table, table * { visibility: visible; }
          .max-w-6xl { max-width: 100%; margin: 0; padding: 0; }
        }
      `}</style>
    </div>
  );
}
