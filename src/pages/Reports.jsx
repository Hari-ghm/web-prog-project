import React, { useState, useCallback } from 'react';
import { useData } from '../context/DataContext';

const Reports = () => {
  const { energyData, mergedCities, selectedState, addNotification } = useData();
  const [reportType, setReportType] = useState('Performance Summary');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [selectedCities, setSelectedCities] = useState([]);
  const [scheduledReports, setScheduledReports] = useState([
    { id: 1, title: 'Weekly Summary', freq: 'Every Monday', recipients: 3, lastRun: new Date(Date.now() - 86400000) },
    { id: 2, title: 'Monthly Operations', freq: '1st of Month', recipients: 12, lastRun: new Date(Date.now() - 2592000000) },
    { id: 3, title: 'Daily Alert Log', freq: 'Every day 00:00', recipients: 2, lastRun: new Date(Date.now() - 3600000) },
  ]);
  const [newSchedule, setNewSchedule] = useState({ title: '', frequency: 'weekly', emails: '' });
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const cities = mergedCities[selectedState] || [];

  const toggleCity = (cityId) => {
    setSelectedCities(prev => 
      prev.includes(cityId) ? prev.filter(id => id !== cityId) : [...prev, cityId]
    );
  };

  const handleExport = useCallback((format) => {
    if (!energyData || !energyData.chartData) {
      addNotification('No data available to export', 'warning');
      return;
    }

    const citiesForExport = selectedCities.length > 0 ? selectedCities : cities.map(c => c.id);
    const timestamp = new Date().toLocaleString();
    const reportData = {
      timestamp,
      reportType,
      dateRange,
      cities: citiesForExport,
      energyData,
      summary: {
        totalGeneration: energyData.total,
        solarPower: energyData.solar.power,
        windPower: energyData.wind.power,
        solarTrend: energyData.solar.trend,
        windTrend: energyData.wind.trend
      }
    };

    if (format === 'CSV') {
      exportCSV(reportData);
    } else if (format === 'JSON') {
      exportJSON(reportData);
    } else if (format === 'PDF') {
      exportPDF(reportData);
    }
  }, [energyData, selectedCities, cities, reportType, dateRange, addNotification]);

  const exportCSV = (data) => {
    const headers = ['Time', 'Solar (MWh)', 'Wind (MWh)', 'Total (MWh)', 'Timestamp'];
    const rows = data.energyData.chartData.map(d => [
      d.time,
      d.solar,
      d.wind,
      (d.solar + d.wind),
      data.timestamp
    ]);

    const csvContent = [
      ['Report Type', data.reportType],
      ['Date Range', data.dateRange],
      ['Cities', data.cities.join(', ')],
      [],
      headers,
      ...rows
    ].map(row => row.join(',')).join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
    element.setAttribute('download', `energy-report-${Date.now()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addNotification('CSV exported successfully', 'success');
  };

  const exportJSON = (data) => {
    const jsonData = JSON.stringify(data, null, 2);
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonData));
    element.setAttribute('download', `energy-report-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addNotification('JSON exported successfully', 'success');
  };

  const exportPDF = (data) => {
    const pdfContent = `
    ENERGY GENERATION REPORT
    Generated: ${data.timestamp}
    Report Type: ${data.reportType}
    Date Range: ${data.dateRange}
    
    SUMMARY
    Total Generation: ${data.summary.totalGeneration} MWh
    Solar Power: ${data.summary.solarPower} MW (${data.summary.solarTrend}%)
    Wind Power: ${data.summary.windPower} MW (${data.summary.windTrend}%)
    
    DETAILED DATA
    ${data.energyData.chartData.map(d => `${d.time}: Solar ${d.solar}MW, Wind ${d.wind}MW`).join('\n    ')}
    `;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pdfContent));
    element.setAttribute('download', `energy-report-${Date.now()}.pdf`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addNotification('PDF generated successfully', 'success');
  };

  const handleAddScheduledReport = () => {
    if (!newSchedule.title || !newSchedule.emails) {
      addNotification('Please fill all fields', 'warning');
      return;
    }
    
    const newReport = {
      id: Math.max(...scheduledReports.map(r => r.id), 0) + 1,
      title: newSchedule.title,
      freq: newSchedule.frequency === 'daily' ? 'Every day 00:00' : 
            newSchedule.frequency === 'weekly' ? 'Every Monday' : '1st of Month',
      recipients: newSchedule.emails.split(',').length,
      lastRun: new Date()
    };
    
    setScheduledReports([...scheduledReports, newReport]);
    setNewSchedule({ title: '', frequency: 'weekly', emails: '' });
    setShowScheduleForm(false);
    addNotification('Scheduled report created successfully', 'success');
  };

  return (
    <div className="animate-fade-in pb-8">
      <h1 className="text-2xl font-bold mb-6">Report Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold mb-6">Create Custom Report</h2>
            
            <div className="space-y-5 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Report Type</label>
                  <select 
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal outline-none transition-shadow"
                  >
                    <option>Performance Summary</option>
                    <option>Generation Details</option>
                    <option>Efficiency Audit</option>
                    <option>Financial Impact</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Date Range</label>
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal outline-none transition-shadow"
                  >
                    <option>Last 7 Days</option>
                    <option>This Month</option>
                    <option>Last Quarter</option>
                    <option>This Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Included Cities</label>
                <div className="flex gap-4 flex-wrap max-h-32 overflow-y-auto p-2 border border-gray-200 dark:border-gray-700 rounded-lg">
                  {cities.length > 0 ? (
                    cities.map(city => (
                      <label key={city.id} className="flex items-center space-x-2 text-sm bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedCities.includes(city.id)}
                          onChange={() => toggleCity(city.id)}
                          className="rounded text-teal focus:ring-teal accent-teal" 
                        />
                        <span>{city.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">No cities available in this state</p>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-borderLight dark:border-gray-800">
                <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-3">Export Format</label>
                <div className="flex gap-3">
                  {['PDF', 'CSV', 'JSON'].map((fmt) => (
                    <button 
                      key={fmt}
                      onClick={() => handleExport(fmt)}
                      className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                        fmt === 'PDF' 
                          ? 'bg-navy text-white hover:bg-navy/90 dark:bg-teal dark:hover:bg-teal/90' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      Generate {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold mb-4">Scheduled Reports</h2>
            
            <div className="space-y-4">
              {scheduledReports.map((report) => (
                <div key={report.id} className="p-4 border border-borderLight dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{report.title}</h3>
                    <button className="text-xs text-textSecondary hover:text-teal font-medium">Edit</button>
                  </div>
                  <div className="flex justify-between text-xs text-textSecondary dark:text-gray-500 mb-2">
                    <span>{report.freq}</span>
                    <span>{report.recipients} recipients</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Last run: {report.lastRun.toLocaleString()}
                  </div>
                </div>
              ))}
              <button 
                onClick={() => setShowScheduleForm(!showScheduleForm)}
                className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-sm text-textSecondary hover:border-teal hover:text-teal dark:hover:border-teal transition-colors font-medium"
              >
                + New Scheduled Report
              </button>
              
              {showScheduleForm && (
                <div className="p-4 border border-teal rounded-lg bg-teal/5 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-textSecondary dark:text-gray-400 mb-1">Report Title</label>
                    <input 
                      type="text" 
                      value={newSchedule.title}
                      onChange={(e) => setNewSchedule({...newSchedule, title: e.target.value})}
                      placeholder="E.g., Weekly Solar Report"
                      className="w-full bg-lightPrimary dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-textSecondary dark:text-gray-400 mb-1">Frequency</label>
                    <select 
                      value={newSchedule.frequency}
                      onChange={(e) => setNewSchedule({...newSchedule, frequency: e.target.value})}
                      className="w-full bg-lightPrimary dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 text-sm"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-textSecondary dark:text-gray-400 mb-1">Recipients (comma-separated emails)</label>
                    <input 
                      type="text" 
                      value={newSchedule.emails}
                      onChange={(e) => setNewSchedule({...newSchedule, emails: e.target.value})}
                      placeholder="admin@ecodash.com, user@ecodash.com"
                      className="w-full bg-lightPrimary dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded p-2 text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleAddScheduledReport}
                      className="flex-1 px-3 py-2 bg-teal text-white rounded text-sm font-medium hover:bg-teal/90 transition"
                    >
                      Create
                    </button>
                    <button 
                      onClick={() => setShowScheduleForm(false)}
                      className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
