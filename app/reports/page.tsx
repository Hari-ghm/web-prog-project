export default function ReportsPage() {
  const reports = [
    { name: 'Monthly Energy Summary - Jan 2026', date: '2026-01-31', id: 'RPT-001' },
    { name: 'Annual Sustainability Report 2025', date: '2026-01-15', id: 'RPT-002' },
    { name: 'Q4 2025 Cost Analysis', date: '2026-01-10', id: 'RPT-003' },
    { name: 'Grid Efficiency Audit', date: '2025-12-28', id: 'RPT-004' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-12 text-slate-300">
      <div className="border-b border-slate-700 pb-6 mb-8">
        <h1 className="text-lg uppercase tracking-widest text-slate-100">System Reports Directory</h1>
        <p className="text-xs text-slate-500 mt-1">/var/logs/energy-grid/reports</p>
      </div>

      <div className="space-y-0">
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
           <div className="col-span-2">ID</div>
           <div className="col-span-6">Filename</div>
           <div className="col-span-2">Date Created</div>
           <div className="col-span-2 text-right">Action</div>
        </div>

        {reports.map((report) => (
          <div key={report.id} className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-slate-900 border-b border-slate-800/50 transition-colors cursor-default text-sm group">
            <div className="col-span-2 text-slate-500">{report.id}</div>
            <div className="col-span-6 text-slate-200 group-hover:text-blue-400 transition-colors">
              {report.name}
            </div>
            <div className="col-span-2 text-slate-500 text-xs flex items-center">{report.date}</div>
            <div className="col-span-2 text-right">
              <span className="text-xs text-blue-500 hover:text-blue-400 hover:underline cursor-pointer">
                [DOWNLOAD]
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-slate-800 text-xs text-slate-600">
        <p>Total Files: {reports.length}</p>
        <p>Disk Usage: 45.2MB</p>
        <p>Last Sync: {new Date().toISOString()}</p>
      </div>
    </div>
  );
}
