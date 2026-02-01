'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Sun, 
  Wind, 
  Droplets, 
  MapPin, 
  Zap, 
  AlertCircle,
  X,
  Save,
  Activity,
  CheckCircle
} from 'lucide-react';
// import { useSession } from 'next-auth/react';
// import { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

interface EnergySource {
  _id: string;
  name: string;
  type: 'solar' | 'wind' | 'hydro';
  location: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  currentOutput: number;
  efficiency: number;
  installedDate: string;
}

const SESSION = { user: { role: 'admin' } };
const STATUS = 'authenticated';

export default function AdminSourcesPage() {
  // const { data: session, status } = useSession();
  const session = SESSION;
  const status = STATUS;
  const router = useRouter();
  
  const [sources, setSources] = useState<EnergySource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSource, setEditingSource] = useState<EnergySource | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: 'solar' as 'solar' | 'wind' | 'hydro',
    location: '',
    capacity: '',
    status: 'active' as 'active' | 'inactive' | 'maintenance',
    currentOutput: '',
    efficiency: ''
  });

  // Check if user is admin
  useEffect(() => {
    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        setError('Access Denied: Only administrators can access this page.');
        setLoading(false);
        return;
      }
      fetchSources();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, session]);

  const fetchSources = async () => {
    try {
      const response = await fetch('/api/admin/sources');
      if (response.ok) {
        const data = await response.json();
        setSources(data);
      } else {
        // Mock data for demonstration
        setSources([
          {
            _id: '1',
            name: 'Solar Farm Alpha',
            type: 'solar',
            location: 'Arizona, USA',
            capacity: 500,
            status: 'active',
            currentOutput: 420,
            efficiency: 84,
            installedDate: '2023-01-15'
          },
          {
            _id: '2',
            name: 'Wind Park Beta',
            type: 'wind',
            location: 'Texas, USA',
            capacity: 800,
            status: 'active',
            currentOutput: 650,
            efficiency: 81,
            installedDate: '2022-08-20'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch sources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      const url = editingSource 
        ? `/api/admin/sources/${editingSource._id}`
        : '/api/admin/sources';
      
      const method = editingSource ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          capacity: Number(formData.capacity),
          currentOutput: Number(formData.currentOutput),
          efficiency: Number(formData.efficiency)
        })
      });

      if (response.ok) {
        setSuccessMessage(editingSource ? 'Source updated successfully!' : 'Source added successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        setShowModal(false);
        resetForm();
        fetchSources();
      } else {
        throw new Error('Failed to save source');
      }
    } catch (error) {
      setError('Failed to save energy source. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this energy source? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/sources/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccessMessage('Source deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
        fetchSources();
      } else {
        throw new Error('Failed to delete source');
      }
    } catch (error) {
      setError('Failed to delete energy source.');
    }
  };

  const openEditModal = (source: EnergySource) => {
    setEditingSource(source);
    setFormData({
      name: source.name,
      type: source.type,
      location: source.location,
      capacity: source.capacity.toString(),
      status: source.status,
      currentOutput: source.currentOutput.toString(),
      efficiency: source.efficiency.toString()
    });
    setShowModal(true);
  };

  const openAddModal = () => {
    setEditingSource(null);
    resetForm();
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'solar',
      location: '',
      capacity: '',
      status: 'active',
      currentOutput: '',
      efficiency: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'solar': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'wind': return <Wind className="w-5 h-5 text-cyan-500" />;
      case 'hydro': return <Droplets className="w-5 h-5 text-blue-500" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error && !showModal) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-xl shadow-lg p-8 max-w-md w-full text-center border border-slate-800">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Zap className="w-8 h-8 text-green-500" />
              Manage Energy Sources
            </h1>
            <p className="text-slate-400 mt-1">Add, edit, or remove renewable energy sources</p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Source
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-center gap-3 text-green-400">
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Sources</p>
                <p className="text-2xl font-bold text-white">{sources.length}</p>
              </div>
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active</p>
                <p className="text-2xl font-bold text-green-500">
                  {sources.filter(s => s.status === 'active').length}
                </p>
              </div>
              <div className="p-3 bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Capacity</p>
                <p className="text-2xl font-bold text-white">
                  {sources.reduce((sum, s) => sum + s.capacity, 0).toLocaleString()} kW
                </p>
              </div>
              <div className="p-3 bg-purple-900/30 rounded-lg">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Current Output</p>
                <p className="text-2xl font-bold text-white">
                  {sources.reduce((sum, s) => sum + s.currentOutput, 0).toLocaleString()} kW
                </p>
              </div>
              <div className="p-3 bg-yellow-900/30 rounded-lg">
                <Sun className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Sources Table */}
        <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-950/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Efficiency</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {sources.map((source) => (
                  <tr key={source._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                          {getTypeIcon(source.type)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{source.name}</div>
                          <div className="text-xs text-slate-500">ID: {source._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-800 text-slate-300 capitalize">
                        {source.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-slate-400">
                        <MapPin className="w-4 h-4 mr-1 text-slate-500" />
                        {source.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {source.capacity.toLocaleString()} kW
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(source.status)}`}>
                        {source.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${source.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-slate-400">{source.efficiency}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(source)}
                          className="p-2 text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(source._id)}
                          className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {sources.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <Zap className="w-12 h-12 mx-auto mb-4 text-slate-700" />
              <p>No energy sources found. Click "Add New Source" to get started.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {editingSource ? 'Edit Energy Source' : 'Add New Energy Source'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {error && (
              <div className="mx-6 mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Source Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-slate-500"
                    placeholder="e.g., Solar Farm Alpha"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'solar' | 'wind' | 'hydro' })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                    required
                  >
                    <option value="solar">Solar Panel</option>
                    <option value="wind">Wind Turbine</option>
                    <option value="hydro">Hydro Plant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-slate-500"
                      placeholder="e.g., Arizona, USA"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Capacity (kW)
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-slate-500"
                    placeholder="e.g., 500"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Current Output (kW)
                  </label>
                  <input
                    type="number"
                    value={formData.currentOutput}
                    onChange={(e) => setFormData({ ...formData, currentOutput: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-slate-500"
                    placeholder="e.g., 420"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Efficiency (%)
                  </label>
                  <input
                    type="number"
                    value={formData.efficiency}
                    onChange={(e) => setFormData({ ...formData, efficiency: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-slate-500"
                    placeholder="e.g., 85"
                    required
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'maintenance' })}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Save className="w-4 h-4" />
                  {editingSource ? 'Update Source' : 'Add Source'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}