'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Sun, 
  Wind, 
  Droplets,
  ChevronDown,
  Filter
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface EnergyData {
  date: string;
  solar: number;
  wind: number;
  hydro: number;
  total: number;
  co2Saved: number;
}

export default function ReportsPage() {
  const [reportType, setReportType] = useState<'daily' | 'monthly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [reportType, selectedDate]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?type=${reportType}&date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setEnergyData(data);
      } else {
        generateMockData();
      }
    } catch (error) {
      generateMockData();
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockData: EnergyData[] = [];
    const days = reportType === 'daily' ? 24 : 30;
    
    for (let i = 0; i < days; i++) {
      const solar = Math.floor(Math.random() * 500) + 200;
      const wind = Math.floor(Math.random() * 400) + 150;
      const hydro = Math.floor(Math.random() * 300) + 100;
      
      mockData.push({
        date: reportType === 'daily' 
          ? `${i}:00` 
          : new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        solar,
        wind,
        hydro,
        total: solar + wind + hydro,
        co2Saved: Math.floor((solar + wind + hydro) * 0.85)
      });
    }
    setEnergyData(mockData);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(`Renewable Energy ${reportType === 'daily' ? 'Daily' : 'Monthly'} Report`, 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Report Date: ${selectedDate}`, 14, 38);

    const totalEnergy = energyData.reduce((sum, d) => sum + d.total, 0);
    const totalCO2 = energyData.reduce((sum, d) => sum + d.co2Saved, 0);
    
    doc.text(`Total Energy Generated: ${totalEnergy.toLocaleString()} kWh`, 14, 50);
    doc.text(`Total CO₂ Saved: ${totalCO2.toLocaleString()} kg`, 14, 58);

    autoTable(doc, {
      startY: 70,
      head: [['Date/Time', 'Solar (kWh)', 'Wind (kWh)', 'Hydro (kWh)', 'Total (kWh)', 'CO₂ Saved (kg)']],
      body: energyData.map(d => [
        d.date,
        d.solar,
        d.wind,
        d.hydro,
        d.total,
        d.co2Saved
      ]),
    });

    doc.save(`energy-report-${selectedDate}.pdf`);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(energyData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Energy Report');
    XLSX.writeFile(workbook, `energy-report-${selectedDate}.xlsx`);
  };

  const totalEnergy = energyData.reduce((sum, d) => sum + d.total, 0);
  const totalCO2 = energyData.reduce((sum, d) => sum + d.co2Saved, 0);
  const avgSolar = energyData.length ? Math.floor(energyData.reduce((sum, d) => sum + d.solar, 0) / energyData.length) : 0;
  const avgWind = energyData.length ? Math.floor(energyData.reduce((sum, d) => sum + d.wind, 0) / energyData.length) : 0;

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-500" />
            Energy Reports
          </h1>
          <p className="text-slate-400 mt-2">Generate and download detailed energy production reports</p>
        </div>

        {/* Controls */}
        <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Report Type
              </label>
              <div className="relative">
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as 'daily' | 'monthly')}
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 appearance-none bg-slate-800 text-slate-100"
                >
                  <option value="daily">Daily Report</option>
                  <option value="monthly">Monthly Report</option>
                </select>
                <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-700 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-green-600 bg-slate-800 text-slate-100"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={downloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button
                onClick={downloadExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Download className="w-4 h-4" />
                Excel
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-900/50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-sm text-slate-400">Total Energy</span>
            </div>
            <p className="text-2xl font-bold text-slate-50">{totalEnergy.toLocaleString()} kWh</p>
          </div>

          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-900/50 rounded-lg">
                <Sun className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-sm text-slate-400">Avg Solar</span>
            </div>
            <p className="text-2xl font-bold text-slate-50">{avgSolar.toLocaleString()} kWh</p>
          </div>

          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-cyan-900/50 rounded-lg">
                <Wind className="w-6 h-6 text-cyan-400" />
              </div>
              <span className="text-sm text-slate-400">Avg Wind</span>
            </div>
            <p className="text-2xl font-bold text-slate-50">{avgWind.toLocaleString()} kWh</p>
          </div>

          <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-900/50 rounded-lg">
                <Filter className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-sm text-slate-400">CO₂ Saved</span>
            </div>
            <p className="text-2xl font-bold text-slate-50">{totalCO2.toLocaleString()} kg</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-400" />
            <h3 className="font-semibold text-slate-50">
              {reportType === 'daily' ? 'Hourly Breakdown' : 'Daily Breakdown'}
            </h3>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading report data...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-950">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {reportType === 'daily' ? 'Hour' : 'Date'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Solar (kWh)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Wind (kWh)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Hydro (kWh)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Total (kWh)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      CO₂ Saved (kg)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {energyData.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                        {row.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Sun className="w-3 h-3 text-yellow-400" />
                          {row.solar}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Wind className="w-3 h-3 text-cyan-400" />
                          {row.wind}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-400" />
                          {row.hydro}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-200">
                        {row.total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                        {row.co2Saved}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}