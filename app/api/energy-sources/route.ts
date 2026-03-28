import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import EnergySource from '@/models/EnergySource';
import { getUserFromRequest } from '@/lib/auth';
import { cityCoordinates } from '@/lib/locations';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const filter: any = {};
    if (state) filter.state = state;
    if (city) filter.city = city;
    if (type) filter.type = type;
    if (status) filter.status = status;

    const sources = await EnergySource.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ sources });
  } catch (error: any) {
    console.error('Get sources error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const { name, type, state, city, capacityKW, status, installedDate } = body;

    if (!name || !type || !state || !city || !capacityKW) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get lat/lng from city coordinates
    const coords = cityCoordinates[city] || { lat: 13.0, lng: 80.0 };

    const source = await EnergySource.create({
      name, type, state, city, capacityKW,
      status: status || 'active',
      installedDate: installedDate || new Date(),
      lat: coords.lat + (Math.random() - 0.5) * 0.1,
      lng: coords.lng + (Math.random() - 0.5) * 0.1,
    });

    return NextResponse.json({ source }, { status: 201 });
  } catch (error: any) {
    console.error('Create source error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await dbConnect();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Source ID is required' }, { status: 400 });
    }

    const source = await EnergySource.findByIdAndUpdate(id, updateData, { new: true });
    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    return NextResponse.json({ source });
  } catch (error: any) {
    console.error('Update source error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Source ID is required' }, { status: 400 });
    }

    const source = await EnergySource.findByIdAndDelete(id);
    if (!source) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Source deleted successfully' });
  } catch (error: any) {
    console.error('Delete source error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
