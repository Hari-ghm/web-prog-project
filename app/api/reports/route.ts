import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const date = searchParams.get('date');

    // Generate mock data for demonstration
    const mockData = [];
    const days = type === 'daily' ? 24 : 30;
    
    for (let i = 0; i < days; i++) {
      const solar = Math.floor(Math.random() * 500) + 200;
      const wind = Math.floor(Math.random() * 400) + 150;
      const hydro = Math.floor(Math.random() * 300) + 100;
      
      mockData.push({
        date: type === 'daily' ? `${i}:00` : new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        solar,
        wind,
        hydro,
        total: solar + wind + hydro,
        co2Saved: Math.floor((solar + wind + hydro) * 0.85)
      });
    }

    return NextResponse.json(mockData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}