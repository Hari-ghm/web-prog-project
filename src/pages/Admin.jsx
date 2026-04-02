import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const Admin = () => {
  const { mergedStates, mergedCities, addCustomState, addCustomCity, addNotification, auditLogs } = useData();

  const [newState, setNewState] = useState({ id: '', name: '' });
  const [newCity, setNewCity] = useState({ stateId: mergedStates[0]?.id || '', id: '', name: '', lat: '', lon: '' });
  const [submittingState, setSubmittingState] = useState(false);
  const [submittingCity, setSubmittingCity] = useState(false);

  const handleAddState = async (e) => {
    e.preventDefault();
    if (!newState.id || !newState.name) return;

    const stateExists = mergedStates.some((state) => state.id === newState.id);
    if (stateExists) {
      addNotification(`State "${newState.name}" already exists`, 'warning');
      return;
    }

    try {
      setSubmittingState(true);
      await addCustomState({ ...newState, active: true });
      addNotification(`State "${newState.name}" added successfully`, 'success');
      setNewState({ id: '', name: '' });
    } catch (error) {
      addNotification(error.message || 'Failed to add state', 'error');
    } finally {
      setSubmittingState(false);
    }
  };

  const handleAddCity = async (e) => {
    e.preventDefault();
    if (!newCity.stateId || !newCity.id || !newCity.name || !newCity.lat || !newCity.lon) return;

    const existingCities = mergedCities[newCity.stateId] || [];
    const cityExists = existingCities.some((city) => city.id === newCity.id);
    if (cityExists) {
      addNotification(`City "${newCity.name}" already exists in this state`, 'warning');
      return;
    }

    try {
      setSubmittingCity(true);
      await addCustomCity({
        stateId: newCity.stateId,
        id: newCity.id,
        name: newCity.name,
        lat: parseFloat(newCity.lat),
        lon: parseFloat(newCity.lon)
      });
      addNotification(`City "${newCity.name}" added successfully`, 'success');
      setNewCity({ ...newCity, id: '', name: '', lat: '', lon: '' });
    } catch (error) {
      addNotification(error.message || 'Failed to add city', 'error');
    } finally {
      setSubmittingCity(false);
    }
  };

  return (
    <div className="animate-fade-in pb-8">
      <h1 className="text-2xl font-bold mb-6">Admin Console</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-borderLight dark:border-gray-800 pb-2">Add Regional State</h2>
            <form onSubmit={handleAddState} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textSecondary dark:text-gray-400 mb-1">State Name</label>
                  <input type="text" value={newState.name} onChange={(e) => setNewState({ ...newState, name: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="e.g. Maharashtra" className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary dark:text-gray-400 mb-1">State ID (Auto)</label>
                  <input type="text" value={newState.id} readOnly className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-lg p-2.5 text-sm border-none cursor-not-allowed" />
                </div>
              </div>
              <button type="submit" disabled={submittingState} className="w-full btn-primary py-2.5 font-medium disabled:opacity-70">{submittingState ? 'Adding...' : '+ Add State'}</button>
            </form>
          </div>

          <div className="card-base p-6">
            <h2 className="text-lg font-semibold mb-4 border-b border-borderLight dark:border-gray-800 pb-2">Add City Location</h2>
            <form onSubmit={handleAddCity} className="space-y-4">
              <div>
                <label className="block text-xs text-textSecondary dark:text-gray-400 mb-1">Select Parent State</label>
                <select value={newCity.stateId} onChange={(e) => setNewCity({ ...newCity, stateId: e.target.value })} className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none">
                  {mergedStates.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textSecondary dark:text-gray-400 mb-1">City Name</label>
                  <input type="text" value={newCity.name} onChange={(e) => setNewCity({ ...newCity, name: e.target.value, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="e.g. Mumbai" className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary dark:text-gray-400 mb-1">City ID (Auto)</label>
                  <input type="text" value={newCity.id} readOnly className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-lg p-2.5 text-sm border-none cursor-not-allowed" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-textSecondary dark:text-gray-400 mb-1">Latitude</label>
                  <input type="number" step="0.0001" value={newCity.lat} onChange={(e) => setNewCity({ ...newCity, lat: e.target.value })} placeholder="19.0760" className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs text-textSecondary dark:text-gray-400 mb-1">Longitude</label>
                  <input type="number" step="0.0001" value={newCity.lon} onChange={(e) => setNewCity({ ...newCity, lon: e.target.value })} placeholder="72.8777" className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-2.5 text-sm outline-none" required />
                </div>
              </div>
              <button type="submit" disabled={submittingCity} className="w-full btn-primary py-2.5 font-medium disabled:opacity-70">{submittingCity ? 'Adding...' : '+ Add City'}</button>
            </form>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-base overflow-hidden flex flex-col h-96">
            <div className="p-4 border-b border-borderLight dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
              <h2 className="font-semibold">System Audit Log</h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal rounded-full animate-pulse"></span>
                <span className="text-xs bg-teal text-white px-2 py-1 rounded">DB</span>
              </div>
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 font-mono text-xs">
              {auditLogs.map((log, i) => (
                <div key={`${log.time}-${log.action}-${i}`} className="flex border-b border-gray-100 dark:border-gray-800 pb-2 mb-2 last:border-0 items-start gap-2 animate-[fadeIn_0.3s_ease-in]">
                  <span className="text-gray-400 dark:text-gray-500 w-20 shrink-0">{log.time}</span>
                  <span className="text-blue w-16 px-2 shrink-0">{log.user}</span>
                  <span className="flex-1 text-textPrimary dark:text-gray-300">{log.action}</span>
                  <span className={`shrink-0 ${log.status.includes('Success') ? 'text-green-500' : log.status.includes('Warning') || log.status.includes('Warn') ? 'text-amber-500' : 'text-red-500'}`}>
                    {log.status.split(':')[0]}
                  </span>
                </div>
              ))}
              {auditLogs.length === 0 && <p className="text-textSecondary dark:text-gray-400">No audit entries yet.</p>}
            </div>
          </div>

          <div className="card-base p-6">
            <h2 className="text-lg font-semibold border-b border-borderLight dark:border-gray-800 pb-2 mb-4">Configuration Overview</h2>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-textSecondary dark:text-gray-400">Total Registered States</span>
              <span className="font-bold">{mergedStates.length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-textSecondary dark:text-gray-400">Total Registered Cities</span>
              <span className="font-bold">{Object.values(mergedCities).flat().length}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
              <span className="text-textSecondary dark:text-gray-400">Total Audit Logs</span>
              <span className="font-bold">{auditLogs.length}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-textSecondary dark:text-gray-400">Database Status</span>
              <span className="font-bold text-teal">MongoDB Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
