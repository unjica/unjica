import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { supabase } from '@/lib/supabase';

// POST handler to update user profile
export async function POST(request: Request) {
  try {
    // Get authorization header for Supabase auth
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const token = authHeader.split(' ')[1];
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      console.error('Supabase auth error:', error);
      return NextResponse.json(
        { error: 'Authentication error', details: error?.message },
        { status: 401 }
      );
    }
    
    const userId = data.user.id;
    const body = await request.json();
    const { name } = body;
    
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Update user metadata in Supabase
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        name
      }
    });
    
    if (updateError) {
      console.error('Error updating Supabase user:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile', details: updateError.message },
        { status: 500 }
      );
    }
    
    // Update user in database
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { name }
      });
    } catch (dbError) {
      console.error('Error updating user in database:', dbError);
      // Continue even if database update fails, as Supabase is the primary source
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// Make this API route dynamic to avoid caching
export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 1 minute max execution time (Vercel Hobby plan limit) 