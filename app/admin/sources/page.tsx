export default function AdminSourcesPage() {
  const sources = [
    { id: 1, name: 'Solar Array Alpha', location: 'Roof Sector A', status: 'Active', lastMaintained: '2025-12-10' },
    { id: 2, name: 'Wind Turbine X1', location: 'Field B', status: 'Maintenance', lastMaintained: '2026-01-05' },
    { id: 3, name: 'Grid Connection Main', location: 'Substation', status: 'Active', lastMaintained: '2025-11-20' },
    { id: 4, name: 'Backup Battery Pack 1', location: 'Basement', status: 'Standby', lastMaintained: '2025-10-15' },
    { id: 5, name: 'Geothermal unit', location: 'Ground', status: 'Warning', lastMaintained: '2025-08-30' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Admin: Manage Sources</h1>
            <p className="text-slate-400 text-sm mt-1">Add, edit, or remove energy sources from the network.</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          + Add Source
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-950">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Maintained</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {sources.map((source) => (
                    <tr key={source.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{source.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{source.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                source.status === 'Active' ? 'bg-green-400/10 text-green-400 ring-green-400/20' :
                                source.status === 'Maintenance' ? 'bg-slate-400/10 text-slate-400 ring-slate-400/20' :
                                source.status === 'Standby' ? 'bg-blue-400/10 text-blue-400 ring-blue-400/20' :
                                'bg-red-400/10 text-red-400 ring-red-400/20'
                            }`}>
                                {source.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{source.lastMaintained}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-400 hover:text-blue-300 mr-4">Edit</button>
                            <button className="text-rose-400 hover:text-rose-300">Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
