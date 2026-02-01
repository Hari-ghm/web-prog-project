import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { authOptions } from '../../auth/[...nextauth]/route';

// GET all sources
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const client = await clientPromise;
    const db = client.db('renewable_energy');
    const sources = await db.collection('energySources').find({}).toArray();

    return NextResponse.json(sources);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
  }
}

// POST new source
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const data = await request.json();
    const client = await clientPromise;
    const db = client.db('renewable_energy');

    const result = await db.collection('energySources').insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ id: result.insertedId, ...data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create source' }, { status: 500 });
  }
}