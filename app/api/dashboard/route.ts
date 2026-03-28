import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import EnergySource from '@/models/EnergySource';
import DailySummary from '@/models/DailySummary';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');

    const sourceFilter: any = {};
    const summaryFilter: any = {};
    if (state) {
      sourceFilter.state = state;
      summaryFilter.state = state;
    }
    if (city) {
      sourceFilter.city = city;
      summaryFilter.city = city;
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Active sources count
    const totalSources = await EnergySource.countDocuments({ ...sourceFilter, status: 'active' });
    const solarSources = await EnergySource.countDocuments({ ...sourceFilter, type: 'solar', status: 'active' });
    const windSources = await EnergySource.countDocuments({ ...sourceFilter, type: 'wind', status: 'active' });

    // Total capacity
    const capacityAgg = await EnergySource.aggregate([
      { $match: { ...sourceFilter, status: 'active' } },
      { $group: { _id: '$type', totalCapacity: { $sum: '$capacityKW' } } },
    ]);

    const capacityByType: Record<string, number> = {};
    capacityAgg.forEach((item: any) => {
      capacityByType[item._id] = item.totalCapacity;
    });

    // Today's summary
    const todaySummaries = await DailySummary.find({
      ...summaryFilter,
      date: { $gte: today, $lt: tomorrow },
    });

    const todayTotals = todaySummaries.reduce(
      (acc, s) => ({
        totalEnergyKWh: acc.totalEnergyKWh + s.totalEnergyKWh,
        solarEnergyKWh: acc.solarEnergyKWh + s.solarEnergyKWh,
        windEnergyKWh: acc.windEnergyKWh + s.windEnergyKWh,
        co2SavedKg: acc.co2SavedKg + s.co2SavedKg,
      }),
      { totalEnergyKWh: 0, solarEnergyKWh: 0, windEnergyKWh: 0, co2SavedKg: 0 }
    );

    // Last 7 days for chart
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weekSummaries = await DailySummary.find({
      ...summaryFilter,
      date: { $gte: weekAgo, $lt: tomorrow },
    }).sort({ date: 1 });

    // Battery level simulation based on solar capacity ratio
    const totalCapacity = Object.values(capacityByType).reduce((a, b) => a + b, 0);
    const renewableCapacity = (capacityByType['solar'] || 0) + (capacityByType['wind'] || 0);
    const batteryLevel = totalCapacity > 0 ? Math.round((renewableCapacity / totalCapacity) * 100) : 72;

    return NextResponse.json({
      stats: {
        totalSources,
        solarSources,
        windSources,
        totalCapacityKW: totalCapacity,
        solarCapacityKW: capacityByType['solar'] || 0,
        windCapacityKW: capacityByType['wind'] || 0,
        batteryLevel: Math.min(100, batteryLevel),
        todayProduction: todayTotals.totalEnergyKWh,
        todaySolar: todayTotals.solarEnergyKWh,
        todayWind: todayTotals.windEnergyKWh,
        co2Saved: todayTotals.co2SavedKg,
      },
      chartData: weekSummaries.map((s) => ({
        date: s.date.toISOString().split('T')[0],
        solar: s.solarEnergyKWh,
        wind: s.windEnergyKWh,
        hydro: s.hydroEnergyKWh,
        total: s.totalEnergyKWh,
      })),
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
