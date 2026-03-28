import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import DailySummary from '@/models/DailySummary';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    const filter: any = {};
    if (state) filter.state = state;
    if (city) filter.city = city;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) filter.date.$lte = new Date(to);
    }

    const summaries = await DailySummary.find(filter).sort({ date: -1 }).limit(365);

    // Aggregate totals
    const totals = summaries.reduce(
      (acc, s) => ({
        totalEnergyKWh: acc.totalEnergyKWh + s.totalEnergyKWh,
        solarEnergyKWh: acc.solarEnergyKWh + s.solarEnergyKWh,
        windEnergyKWh: acc.windEnergyKWh + s.windEnergyKWh,
        hydroEnergyKWh: acc.hydroEnergyKWh + s.hydroEnergyKWh,
        co2SavedKg: acc.co2SavedKg + s.co2SavedKg,
      }),
      { totalEnergyKWh: 0, solarEnergyKWh: 0, windEnergyKWh: 0, hydroEnergyKWh: 0, co2SavedKg: 0 }
    );

    return NextResponse.json({ summaries, totals });
  } catch (error: any) {
    console.error('Get reports error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
