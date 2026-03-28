import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import EnergySource from '@/models/EnergySource';
import DailySummary from '@/models/DailySummary';
import Alert from '@/models/Alert';
import { cityCoordinates } from '@/lib/locations';

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data
    await EnergySource.deleteMany({});
    await DailySummary.deleteMany({});
    await Alert.deleteMany({});

    // Seed Energy Sources across South India
    const sources = [
      { name: 'Kamuthi Solar Park', type: 'solar', state: 'Tamil Nadu', city: 'Sivakasi', capacityKW: 648000, status: 'active' },
      { name: 'Charanka Solar Park', type: 'solar', state: 'Tamil Nadu', city: 'Chennai', capacityKW: 345000, status: 'active' },
      { name: 'Ananthapuramu Solar Park', type: 'solar', state: 'Andhra Pradesh', city: 'Anantapur', capacityKW: 500000, status: 'active' },
      { name: 'Pavagada Solar Park', type: 'solar', state: 'Karnataka', city: 'Tumkur', capacityKW: 2050000, status: 'active' },
      { name: 'Kurnool Ultra Mega Solar', type: 'solar', state: 'Andhra Pradesh', city: 'Kurnool', capacityKW: 1000000, status: 'active' },
      { name: 'NP Kunta Solar Park', type: 'solar', state: 'Andhra Pradesh', city: 'Kadapa', capacityKW: 250000, status: 'active' },
      { name: 'Kayathar Wind Farm', type: 'wind', state: 'Tamil Nadu', city: 'Thoothukudi', capacityKW: 380000, status: 'active' },
      { name: 'Muppandal Wind Farm', type: 'wind', state: 'Tamil Nadu', city: 'Tirunelveli', capacityKW: 1500000, status: 'active' },
      { name: 'Jaisalmer Wind Park (South Hub)', type: 'wind', state: 'Karnataka', city: 'Hubli', capacityKW: 460000, status: 'active' },
      { name: 'Chitradurga Wind Farm', type: 'wind', state: 'Karnataka', city: 'Davangere', capacityKW: 180000, status: 'maintenance' },
      { name: 'Idukki Hydro Plant', type: 'hydro', state: 'Kerala', city: 'Kottayam', capacityKW: 780000, status: 'active' },
      { name: 'Srisailam Hydro Plant', type: 'hydro', state: 'Telangana', city: 'Mahbubnagar', capacityKW: 770000, status: 'active' },
      { name: 'Pallivasal Hydro Station', type: 'hydro', state: 'Kerala', city: 'Kochi', capacityKW: 37500, status: 'active' },
      { name: 'Kadamparai Hydro Station', type: 'hydro', state: 'Tamil Nadu', city: 'Coimbatore', capacityKW: 400000, status: 'active' },
      { name: 'Nagarjuna Sagar Hydro', type: 'hydro', state: 'Telangana', city: 'Nalgonda', capacityKW: 816000, status: 'active' },
      { name: 'Ramagundam Solar', type: 'solar', state: 'Telangana', city: 'Karimnagar', capacityKW: 500000, status: 'active' },
      { name: 'Adani Kamuthi Extension', type: 'solar', state: 'Tamil Nadu', city: 'Madurai', capacityKW: 100000, status: 'inactive' },
      { name: 'Rameshwaram Wind Farm', type: 'wind', state: 'Tamil Nadu', city: 'Madurai', capacityKW: 90000, status: 'active' },
    ];

    const createdSources = [];
    for (const s of sources) {
      const coords = cityCoordinates[s.city] || { lat: 13.0, lng: 80.0 };
      const source = await EnergySource.create({
        ...s,
        installedDate: new Date(2020 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), 1),
        lat: coords.lat + (Math.random() - 0.5) * 0.15,
        lng: coords.lng + (Math.random() - 0.5) * 0.15,
      });
      createdSources.push(source);
    }

    // Seed Daily Summaries for last 30 days
    const states = ['Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Kerala'];
    const citiesPerState: Record<string, string[]> = {
      'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
      'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli'],
      'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Kurnool'],
      'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar'],
      'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
    };

    const summaries = [];
    for (let d = 0; d < 30; d++) {
      const date = new Date();
      date.setDate(date.getDate() - d);
      date.setHours(0, 0, 0, 0);

      for (const state of states) {
        for (const city of citiesPerState[state]) {
          const solar = Math.round(800 + Math.random() * 1200);
          const wind = Math.round(400 + Math.random() * 800);
          const hydro = Math.round(200 + Math.random() * 500);
          const total = solar + wind + hydro;
          const co2 = Math.round(total * 0.85);

          summaries.push({
            date,
            totalEnergyKWh: total,
            solarEnergyKWh: solar,
            windEnergyKWh: wind,
            hydroEnergyKWh: hydro,
            co2SavedKg: co2,
            state,
            city,
          });
        }
      }
    }
    await DailySummary.insertMany(summaries);

    // Seed Alerts
    const alerts = [
      { severity: 'critical', title: 'Solar Inverter Failure', message: 'Inverter #3 at Kamuthi Solar Park has stopped responding. Immediate inspection required.', acknowledged: false },
      { severity: 'critical', title: 'Grid Connectivity Lost', message: 'Main connection to Muppandal Wind Farm sector 4 lost. Backup power initiated.', acknowledged: false },
      { severity: 'warning', title: 'High Temperature Alert', message: 'Solar panels at Ananthapuramu park detecting temps above 85°C. Efficiency may be reduced.', acknowledged: false },
      { severity: 'warning', title: 'Wind Speed Below Threshold', message: 'Wind speed at Kayathar farm below 3.5 m/s. Generation temporarily reduced.', acknowledged: true },
      { severity: 'warning', title: 'Battery Degradation', message: 'Storage unit at Bengaluru hub reporting health below 60%.', acknowledged: false },
      { severity: 'info', title: 'Scheduled Maintenance', message: 'Chitradurga Wind Farm turbine #12 maintenance scheduled for tomorrow 6 AM.', acknowledged: false },
      { severity: 'info', title: 'New Source Online', message: 'Ramagundam Solar 500MW plant connected to grid successfully.', acknowledged: true },
      { severity: 'info', title: 'Monthly Report Available', message: 'March 2026 energy generation report is ready for download.', acknowledged: false },
      { severity: 'warning', title: 'Voltage Fluctuation', message: 'Detected unstable voltage in Hyderabad substation. Monitoring in progress.', acknowledged: false },
      { severity: 'critical', title: 'Hydro Water Level Low', message: 'Idukki dam water level dropped below minimum generation threshold.', acknowledged: false },
    ];
    await Alert.insertMany(alerts);

    return NextResponse.json({
      message: 'Database seeded successfully',
      counts: {
        sources: createdSources.length,
        summaries: summaries.length,
        alerts: alerts.length,
      },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Seed failed: ' + error.message }, { status: 500 });
  }
}
