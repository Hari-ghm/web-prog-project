'use client';

import { useState } from 'react';

export default function AdminSourcesPage() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'solar',
    location: '',
    capacityKW: '',
    status: 'active',
    installedDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Add logic to save to database
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Admin Control Center
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Register and configure new energy resources for the grid.
        </p>
      </div>

      <div className="glass p-8 rounded-2xl border border-slate-700/50 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-slate-900/40">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"></div>
        
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
          Input Source Data
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-300">
                Resource Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Solar Field Alpha"
                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 hover:border-slate-600"
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium text-slate-300">
                Resource Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-slate-600"
              >
                <option value="solar">Solar</option>
                <option value="wind">Wind</option>
                <option value="hydro">Hydro</option>
              </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium text-slate-300">
                Location Coordinates / Address
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Sector 7, North Wing"
                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 hover:border-slate-600"
              />
            </div>

            {/* Capacity */}
            <div className="space-y-2">
              <label htmlFor="capacityKW" className="text-sm font-medium text-slate-300">
                Capacity (kW)
              </label>
              <input
                type="number"
                id="capacityKW"
                name="capacityKW"
                required
                min="0"
                value={formData.capacityKW}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 hover:border-slate-600"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-slate-300">
                Operational Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-slate-600"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

             {/* Installed Date */}
             <div className="space-y-2">
              <label htmlFor="installedDate" className="text-sm font-medium text-slate-300">
                Installation Date
              </label>
              <input
                type="date"
                id="installedDate"
                name="installedDate"
                required
                value={formData.installedDate}
                onChange={handleChange}
                className="w-full bg-slate-950/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-600 hover:border-slate-600 [color-scheme:dark]"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transform transition-all hover:-translate-y-1 active:translate-y-0"
            >
              Add Resource to Grid
            </button>
          </div>
        </form>
      </div>

       {/* Brief Table Preview for Context */}
       <div className="mt-12">
        <h3 className="text-xl font-semibold text-white mb-4">Recent Entries</h3>
         <div className="overflow-hidden rounded-lg border border-slate-800">
             <table className="min-w-full divide-y divide-slate-800 bg-slate-900/50">
                 <thead className="bg-slate-950">
                     <tr>
                         <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Source</th>
                         <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                         <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-800">
                    <tr>
                         <td className="px-6 py-4 text-sm text-slate-300">Solar Array Alpha</td>
                         <td className="px-6 py-4 text-sm text-slate-300">Solar</td>
                         <td className="px-6 py-4"><span className="text-green-400 text-xs px-2 py-1 bg-green-400/10 rounded-full">Active</span></td>
                    </tr>
                    <tr>
                         <td className="px-6 py-4 text-sm text-slate-300">Wind Turbine X1</td>
                         <td className="px-6 py-4 text-sm text-slate-300">Wind</td>
                         <td className="px-6 py-4"><span className="text-yellow-400 text-xs px-2 py-1 bg-yellow-400/10 rounded-full">Maintenance</span></td>
                    </tr>
                 </tbody>
             </table>
         </div>
       </div>
    </div>
  );
}
