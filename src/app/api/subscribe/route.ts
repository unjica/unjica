import { NextResponse } from 'next/server';
import { sendNotificationEmail } from '@/lib/email';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    try {
      // Check if email already exists
      const existingSubscriber = await prisma.subscriber.findUnique({
        where: { email }
      });

      if (existingSubscriber) {
        return NextResponse.json(
          { error: 'Email already subscribed' },
          { status: 400 }
        );
      }

      // Save subscriber to database
      await prisma.subscriber.create({
        data: { email }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save subscription to database' },
        { status: 500 }
      );
    }

    try {
      // Send notification emails
      await sendNotificationEmail(email);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // We don't return an error here because the subscription was saved successfully
      // We just log the email error
    }

    return NextResponse.json(
      { message: 'Subscription successful! Please check your email for confirmation.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription. Please try again later.' },
      { status: 500 }
    );
  }
} 