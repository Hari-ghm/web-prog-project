'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Search, Filter } from 'lucide-react';
import { allStates, getCitiesForState } from '@/lib/locations';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

interface Source {
  _id: string;
  name: string;
  type: string;
  state: string;
  city: string;
  capacityKW: number;
  status: string;
  installedDate: string;
  lat?: number;
  lng?: number;
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

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
    fetchSources();
  }, [selectedState, selectedCity]);

  const fetchSources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedState) params.set('state', selectedState);
      if (selectedCity) params.set('city', selectedCity);
      const res = await fetch(`/api/energy-sources?${params}`);
      const data = await res.json();
      setSources(data.sources || []);
    } catch (err) {
      console.error('Fetch sources error:', err);
    }
    setLoading(false);
  };

  const filteredSources = useMemo(() => {
    let result = [...sources];
    if (searchTerm) {
      result = result.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterType !== 'All') result = result.filter(s => s.type === filterType.toLowerCase());
    if (filterStatus !== 'All') result = result.filter(s => s.status === filterStatus.toLowerCase());
    return result;
  }, [sources, searchTerm, filterType, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-400/10 text-green-400 ring-green-400/20';
      case 'maintenance': return 'bg-amber-400/10 text-amber-400 ring-amber-400/20';
      case 'inactive': return 'bg-slate-400/10 text-slate-400 ring-slate-400/20';
      default: return 'bg-slate-400/10 text-slate-400 ring-slate-400/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'solar': return '☀️';
      case 'wind': return '💨';
      case 'hydro': return '💧';
      default: return '⚡';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Energy Sources</h1>
          <p className="text-secondary mt-1">{filteredSources.length} sources found</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Grid View
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            <MapPin size={14} /> Map View
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 rounded-xl p-4 mb-8 border border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Search</label>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">State</label>
          <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="">All States</option>
            {allStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">City</label>
          <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" disabled={!selectedState}>
            <option value="">All Cities</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="All">All Types</option>
            <option value="solar">Solar</option>
            <option value="wind">Wind</option>
            <option value="hydro">Hydro</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
            <option value="All">All Statuses</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-secondary">Loading sources...</div>
      ) : viewMode === 'map' ? (
        <div className="rounded-2xl overflow-hidden border border-slate-800" style={{ height: '500px' }}>
          <MapView sources={filteredSources} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSources.map((source) => (
            <div key={source._id} className="rounded-xl bg-slate-900 border border-slate-800 p-6 hover:border-slate-700 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getTypeIcon(source.type)}</span>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{source.name}</h3>
                  </div>
                  <p className="text-sm text-slate-400 flex items-center gap-1">
                    <MapPin size={12} /> {source.city}, {source.state}
                  </p>
                </div>
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(source.status)}`}>
                  {source.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Type</span>
                  <span className="text-slate-300 capitalize">{source.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Capacity</span>
                  <span className="text-slate-300">{source.capacityKW >= 1000 ? `${(source.capacityKW / 1000).toFixed(0)} MW` : `${source.capacityKW} kW`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Installed</span>
                  <span className="text-slate-300">{new Date(source.installedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredSources.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No energy sources found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
