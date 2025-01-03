import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  // Check if user is authenticated (you'll need to implement your auth check logic)
  const isAuthenticated = true; // Replace with your actual auth check

  if (isAuthenticated) {
    return new NextResponse(null, { status: 200 });
  }

  return new NextResponse(null, { status: 401 });
} 