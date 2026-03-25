'use client';

import { useState, useMemo } from 'react';

export default function SourcesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const sources = [
    { id: 1, name: 'Solar Array Alpha', type: 'Solar', location: 'Roof Sector A', status: 'Active', capacity: '50 kW', output: '42 kW', efficiency: '84%', image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Wind Turbine X1', type: 'Wind', location: 'Field B', status: 'Maintenance', capacity: '120 kW', output: '0 kW', efficiency: '0%', image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'Grid Connection Main', type: 'Grid', location: 'Substation', status: 'Active', capacity: '500 kW', output: '150 kW', efficiency: '99%', image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800' },
    { id: 4, name: 'Backup Battery Pack 1', type: 'Storage', location: 'Basement', status: 'Standby', capacity: '200 kWh', output: '0 kW', efficiency: '100%', image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&q=80&w=800' },
    { id: 5, name: 'Solar Array Beta', type: 'Solar', location: 'Roof Sector B', status: 'Active', capacity: '45 kW', output: '38 kW', efficiency: '84%', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800' },
    { id: 6, name: 'Geothermal unit', type: 'Geothermal', location: 'Ground', status: 'Warning', capacity: '30 kW', output: '15 kW', efficiency: '50%', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=800' },
  ];

  const types = ['All', ...Array.from(new Set(sources.map((s) => s.type)))];
  const statuses = ['All', ...Array.from(new Set(sources.map((s) => s.status)))];

  const filteredAndSortedSources = useMemo(() => {
    let result = [...sources];

    if (searchTerm) {
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== 'All') {
      result = result.filter((s) => s.type === filterType);
    }

    if (filterStatus !== 'All') {
      result = result.filter((s) => s.status === filterStatus);
    }

    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'type') return a.type.localeCompare(b.type);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      if (sortBy === 'capacity') return parseInt(a.capacity) - parseInt(b.capacity);
      if (sortBy === 'output') return parseInt(a.output) - parseInt(b.output);
      return 0;
    });

    return result;
  }, [searchTerm, sortBy, filterType, filterStatus]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-white">Energy Sources</h1>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
          Add New Source
        </button>
      </div>

      <div className="bg-slate-900 rounded-xl p-4 mb-8 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Filter by Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Filter by Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
          >
            <option value="name">Name (A-Z)</option>
            <option value="type">Type</option>
            <option value="status">Status</option>
            <option value="capacity">Capacity</option>
            <option value="output">Output</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedSources.map((source) => (
          <div key={source.id} className="rounded-xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition-all group">
            <div className="h-32 mb-4 w-full bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700 relative overflow-hidden">
              <img src={source.image} alt={source.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
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
        {filteredAndSortedSources.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No energy sources found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}

