import { NextResponse } from 'next/server';

// GET handler to fetch environment variables for debugging
export async function GET(request: Request) {
  try {
    return NextResponse.json(process.env);
  } catch (error) {
    console.error('Error fetching environment variables:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch environment variables',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic'; 