'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { allStates, getCitiesForState } from '@/lib/locations';

interface Source {
  _id: string;
  name: string;
  type: string;
  state: string;
  city: string;
  capacityKW: number;
  status: string;
}

export default function AdminSourcesPage() {
  const { user, loading: authLoading, token } = useAuth();
  const router = useRouter();
  
  const [sources, setSources] = useState<Source[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'solar',
    state: '',
    city: '',
    capacityKW: '',
    status: 'active',
  });

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (formData.state) {
      setCities(getCitiesForState(formData.state));
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [formData.state]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSources();
    }
  }, [user]);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/energy-sources');
      const data = await res.json();
      setSources(data.sources || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/energy-sources', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...formData,
          capacityKW: Number(formData.capacityKW)
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Energy source added successfully!');
        setFormData({ name: '', type: 'solar', state: '', city: '', capacityKW: '', status: 'active' });
        fetchSources();
      } else {
        setError(data.error || 'Failed to add source');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this source?')) return;
    
    try {
      const res = await fetch(`/api/energy-sources?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        setSuccess('Source deleted successfully');
        fetchSources();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  if (authLoading || loading) return <div className="flex justify-center py-20">Loading...</div>;
  if (!user || user.role !== 'admin') return null; // Will redirect

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          Admin Control Center
        </h1>
        <p className="text-slate-400 mt-2 text-lg">
          Register and configure new energy resources for the grid.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass p-6 rounded-2xl border border-border/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
          <h2 className="text-xl font-semibold text-foreground mb-6">Add New Source</h2>

          {error && <div className="mb-4 p-3 bg-red-500/10 text-red-500 rounded-lg text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-500/10 text-green-500 rounded-lg text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-secondary mb-1 block">Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary mb-1 block">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="solar">Solar</option>
                <option value="wind">Wind</option>
                <option value="hydro">Hydro</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary mb-1 block">State</label>
              <select name="state" required value={formData.state} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="">Select State</option>
                {allStates.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary mb-1 block">City</label>
              <select name="city" required value={formData.city} onChange={handleChange} disabled={!formData.state} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="">Select City</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary mb-1 block">Capacity (kW)</label>
              <input type="number" name="capacityKW" required min="1" value={formData.capacityKW} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary mb-1 block">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors mt-2">
              Add Resource
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 glass rounded-2xl border border-border/50 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-border/50 bg-black/5 dark:bg-white/5">
            <h3 className="text-xl font-semibold text-foreground">Registered Sources</h3>
          </div>
          <div className="overflow-x-auto">
             <table className="min-w-full divide-y divide-border/50">
                 <thead className="bg-black/5 dark:bg-slate-900/50">
                     <tr>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Source</th>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Location</th>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Capacity</th>
                         <th className="px-6 py-3 text-left text-xs font-semibold text-secondary uppercase tracking-wider">Status</th>
                         <th className="px-6 py-3 text-right text-xs font-semibold text-secondary uppercase tracking-wider">Action</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-border/50 bg-background/50">
                    {sources.map(source => (
                      <tr key={source._id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                           <td className="px-6 py-4">
                             <div className="text-sm font-medium text-foreground">{source.name}</div>
                             <div className="text-xs text-secondary capitalize">{source.type}</div>
                           </td>
                           <td className="px-6 py-4">
                             <div className="text-sm text-foreground">{source.city}</div>
                             <div className="text-xs text-secondary">{source.state}</div>
                           </td>
                           <td className="px-6 py-4 text-sm text-secondary">
                             {source.capacityKW >= 1000 ? `${(source.capacityKW / 1000).toFixed(1)} MW` : `${source.capacityKW} kW`}
                           </td>
                           <td className="px-6 py-4">
                             <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                               source.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400' :
                               source.status === 'maintenance' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                               'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400'
                             }`}>
                               {source.status}
                             </span>
                           </td>
                           <td className="px-6 py-4 text-right text-sm">
                             <button onClick={() => handleDelete(source._id)} className="text-red-500 hover:text-red-600 font-medium">Delete</button>
                           </td>
                      </tr>
                    ))}
                    {sources.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-secondary text-sm">No sources found</td>
                      </tr>
                    )}
                 </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
}