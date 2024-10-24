import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/dbConnect';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({ message: 'Database connection successful!' });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Database connection failed!' }, { status: 500 });
  }
}
