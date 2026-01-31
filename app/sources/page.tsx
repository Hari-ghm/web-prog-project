export default function SourcesPage() {
  const sources = [
    { id: 1, name: 'Solar Array Alpha', type: 'Solar', location: 'Roof Sector A', status: 'Active', capacity: '50 kW', output: '42 kW', efficiency: '84%' },
    { id: 2, name: 'Wind Turbine X1', type: 'Wind', location: 'Field B', status: 'Maintenance', capacity: '120 kW', output: '0 kW', efficiency: '0%' },
    { id: 3, name: 'Grid Connection Main', type: 'Grid', location: 'Substation', status: 'Active', capacity: '500 kW', output: '150 kW', efficiency: '99%' },
    { id: 4, name: 'Backup Battery Pack 1', type: 'Storage', location: 'Basement', status: 'Standby', capacity: '200 kWh', output: '0 kW', efficiency: '100%' },
    { id: 5, name: 'Solar Array Beta', type: 'Solar', location: 'Roof Sector B', status: 'Active', capacity: '45 kW', output: '38 kW', efficiency: '84%' },
    { id: 6, name: 'Geothermal unit', type: 'Geothermal', location: 'Ground', status: 'Warning', capacity: '30 kW', output: '15 kW', efficiency: '50%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Energy Sources</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          Add New Source
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((source) => (
          <div key={source.id} className="rounded-xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{source.name}</h3>
                <p className="text-sm text-slate-400">{source.location}</p>
              </div>
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                source.status === 'Active' ? 'bg-green-400/10 text-green-400 ring-green-400/20' :
                source.status === 'Maintenance' ? 'bg-slate-400/10 text-slate-400 ring-slate-400/20' :
                source.status === 'Standby' ? 'bg-blue-400/10 text-blue-400 ring-blue-400/20' :
                'bg-red-400/10 text-red-400 ring-red-400/20'
              }`}>
                {source.status}
              </span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Type</span>
                <span className="text-slate-300">{source.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Capacity</span>
                <span className="text-slate-300">{source.capacity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Current Output</span>
                <span className="text-slate-300">{source.output}</span>
              </div>
              
              <div className="pt-2">
                 <div className="flex justify-between text-xs mb-1">
                   <span className="text-slate-500">Efficiency</span>
                   <span className="text-slate-300">{source.efficiency}</span>
                 </div>
                 <div className="w-full bg-slate-800 rounded-full h-1.5">
                    <div 
                      className="bg-blue-600 h-1.5 rounded-full" 
                      style={{ width: source.efficiency === '0%' ? '0%' : source.efficiency }}
                    ></div>
                 </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
                <button className="flex-1 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 rounded hover:bg-slate-700 transition-colors">
                    Manage
                </button>
                <button className="flex-1 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 rounded hover:bg-slate-700 transition-colors">
                    History
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
