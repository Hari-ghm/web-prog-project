import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Alert from '@/models/Alert';

export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const severity = searchParams.get('severity');
    const acknowledged = searchParams.get('acknowledged');

    const filter: any = {};
    if (severity && severity !== 'All') filter.severity = severity.toLowerCase();
    if (acknowledged !== null && acknowledged !== undefined && acknowledged !== '') {
      filter.acknowledged = acknowledged === 'true';
    }

    const alerts = await Alert.find(filter).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ alerts });
  } catch (error: any) {
    console.error('Get alerts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { severity, title, message, sourceId } = body;

    if (!severity || !title || !message) {
      return NextResponse.json({ error: 'Severity, title, and message are required' }, { status: 400 });
    }

    const alert = await Alert.create({ severity, title, message, sourceId });
    return NextResponse.json({ alert }, { status: 201 });
  } catch (error: any) {
    console.error('Create alert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }

    const alert = await Alert.findByIdAndUpdate(id, { acknowledged: true }, { new: true });
    if (!alert) {
      return NextResponse.json({ error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ alert });
  } catch (error: any) {
    console.error('Acknowledge alert error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
