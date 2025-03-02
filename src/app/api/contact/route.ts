import { NextResponse } from 'next/server';
import { sendNotificationEmail } from '@/lib/email';

type ContactRequest = {
  name: string;
  email: string;
  message: string;
};

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json() as ContactRequest;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are all required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Use the existing email service but format for contact form
    await sendNotificationEmail(email, {
      isContactForm: true,
      name,
      message
    });

    return NextResponse.json(
      { message: 'Your message has been sent successfully! We will get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again later.' },
      { status: 500 }
    );
  }
} 