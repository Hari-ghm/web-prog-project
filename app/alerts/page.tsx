export default function AlertsPage() {
  const alerts = [
    { id: 1, severity: 'Critical', title: 'Grid Connectivity Lost', message: 'Main connection to sector 4 lost. Backup power initiated.', time: '10 mins ago' },
    { id: 2, severity: 'Warning', title: 'High Temperature Warning', message: 'Solar Inverter B detecting temps above 85°C.', time: '45 mins ago' },
    { id: 3, severity: 'Info', title: 'Maintenance Schedule', message: 'Routine check scheduled for Wind Turbine 2 tomorrow.', time: '2 hours ago' },
    { id: 4, severity: 'Critical', title: 'Battery Degradation', message: 'Storage Unit 3 reported health below 60%.', time: '1 day ago' },
    { id: 5, severity: 'Warning', title: 'Voltage Fluctuation', message: 'Detected unstable voltage in Substation Alpha.', time: '1 day ago' },
  ];
//hi guyss
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">System Alerts</h1>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 rounded-xl border-l-4 ${
            alert.severity === 'Critical' ? 'bg-rose-500/10 border-rose-500' :
            alert.severity === 'Warning' ? 'bg-amber-500/10 border-amber-500' :
            'bg-blue-500/10 border-blue-500'
          }`}>
             <div className="flex justify-between items-start">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      {alert.severity === 'Critical' && <span className="text-xl">🚨</span>}
                      {alert.severity === 'Warning' && <span className="text-xl">⚠️</span>}
                      {alert.severity === 'Info' && <span className="text-xl">ℹ️</span>}
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
      </div>
    </div>
  );
}
