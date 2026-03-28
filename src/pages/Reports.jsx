import React from 'react';

const Reports = () => {
  return (
    <div className="animate-fade-in pb-8">
      <h1 className="text-2xl font-bold mb-6">Report Generator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Generator Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold mb-6">Create Custom Report</h2>
            
            <div className="space-y-5 flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Report Type</label>
                  <select className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal outline-none transition-shadow">
                    <option>Performance Summary</option>
                    <option>Generation Details</option>
                    <option>Efficiency Audit</option>
                    <option>Financial Impact</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Date Range</label>
                  <select className="w-full bg-lightPrimary dark:bg-gray-800 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal outline-none transition-shadow">
                    <option>Last 7 Days</option>
                    <option>This Month</option>
                    <option>Last Quarter</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-2">Included Regions</label>
                <div className="flex gap-4 flex-wrap">
                  {['Chennai', 'Coimbatore', 'Madurai', 'Trichy'].map(city => (
                    <label key={city} className="flex items-center space-x-2 text-sm bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-teal focus:ring-teal accent-teal" />
                      <span>{city}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-borderLight dark:border-gray-800">
                <label className="block text-sm font-medium text-textSecondary dark:text-gray-400 mb-3">Export Format</label>
                <div className="flex gap-3">
                  {['PDF', 'CSV', 'JSON'].map((fmt, i) => (
                    <button key={fmt} className={`px-5 py-2 rounded-md text-sm font-medium ${i === 0 ? 'bg-navy text-white hover:bg-navy/90 dark:bg-teal dark:hover:bg-teal/90' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'} transition-colors`}>
                      Generate {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pre-built reports sidepanel */}
        <div className="space-y-6">
          <div className="card-base p-6">
            <h2 className="text-lg font-semibold mb-4">Scheduled Reports</h2>
            
            <div className="space-y-4">
              {[
                { title: 'Weekly Summary', freq: 'Every Monday', recipients: 3 },
                { title: 'Monthly Operations', freq: '1st of Month', recipients: 12 },
                { title: 'Daily Alert Log', freq: 'Every day 00:00', recipients: 2 },
              ].map((report, i) => (
                <div key={i} className="p-4 border border-borderLight dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-sm">{report.title}</h3>
                    <button className="text-xs text-textSecondary hover:text-teal font-medium">Edit</button>
                  </div>
                  <div className="flex justify-between text-xs text-textSecondary dark:text-gray-500">
                    <span>{report.freq}</span>
                    <span>{report.recipients} recipients</span>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-sm text-textSecondary hover:border-teal hover:text-teal dark:hover:border-teal transition-colors font-medium">
                + New Scheduled Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
