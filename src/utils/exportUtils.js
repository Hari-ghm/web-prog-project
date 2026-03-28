export const downloadCSV = (energyData) => {
  if (!energyData) {
    alert("No data available to export.");
    return;
  }
  
  const headers = ['Metric', 'Value', 'Trend/Details'];
  const rows = [
    ['Total Energy Generated (MWh)', energyData.total, ''],
    ['Solar Power Output (MWh)', energyData.solar.power, `Trend: ${energyData.solar.trend}% | Irradiance: ${energyData.solar.irradiance}`],
    ['Wind Power Output (MWh)', energyData.wind.power, `Trend: ${energyData.wind.trend}% | Speed: ${energyData.wind.speed} km/h`]
  ];
  
  if (energyData.cityData && energyData.cityData.length > 0) {
    rows.push(['']);
    rows.push(['City Breakdown', 'Solar Generation (MWh)', 'Wind Generation (MWh)']);
    energyData.cityData.forEach(c => {
      rows.push([c.name, c.solar, c.wind]);
    });
  }
  
  if (energyData.chartData && energyData.chartData.length > 0) {
    rows.push(['']);
    rows.push(['Time Series Data', 'Solar (MWh)', 'Wind (MWh)']);
    energyData.chartData.forEach(d => {
      rows.push([d.time, d.solar, d.wind]);
    });
  }

  const csvContent = "data:text/csv;charset=utf-8," 
    + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10);
  
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `EcoDash_Report_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
