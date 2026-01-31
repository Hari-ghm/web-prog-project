export default function ReportsPage() {
  const reports = [
    { name: 'Monthly Energy Summary - Jan 2026', date: 'Jan 31, 2026', size: '2.4 MB', type: 'PDF' },
    { name: 'Annual Sustainability Report 2025', date: 'Jan 15, 2026', size: '15.8 MB', type: 'PDF' },
    { name: 'Q4 2025 Cost Analysis', date: 'Jan 10, 2026', size: '4.1 MB', type: 'Excel' },
    { name: 'Grid Efficiency Audit', date: 'Dec 28, 2025', size: '1.2 MB', type: 'PDF' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Reports & Analysis</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          Generate New Report
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800">
           <h3 className="text-lg font-medium text-white">Available Downloads</h3>
        </div>
        <ul role="list" className="divide-y divide-slate-800">
          {reports.map((report, idx) => (
            <li key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center">
                 <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                    {report.type === 'PDF' ? '📄' : '📊'}
                 </div>
                 <div className="ml-4">
                    <p className="text-sm font-medium text-white">{report.name}</p>
                    <p className="text-xs text-slate-500">Generated on {report.date} • {report.size}</p>
                 </div>
              </div>
              <div>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                  Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Scheduled Reports</h3>
              <p className="text-slate-400 text-sm mb-4">Configure automatic report generation and delivery.</p>
               <button className="text-sm text-blue-400 underline decoration-blue-400/30 hover:decoration-blue-400 transition-all">Manage Schedules</button>
          </div>
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Custom Analysis</h3>
              <p className="text-slate-400 text-sm mb-4">Create custom queries and export raw data for external tools.</p>
              <button className="text-sm text-blue-400 underline decoration-blue-400/30 hover:decoration-blue-400 transition-all">Open Data Explorer</button>
          </div>
      </div>
    </div>
  );
}
