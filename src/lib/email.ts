import nodemailer from 'nodemailer';

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // This should be an App Password, not your regular password
  },
});

export async function sendNotificationEmail(subscriberEmail: string) {
  try {
    // Send email to admin (you)
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Sending to yourself
      subject: 'New Newsletter Subscription | Unjica',
      text: `New subscription request from: ${subscriberEmail}`,
      html: `
        <h2>New Newsletter Subscription</h2>
        <p>You have a new subscription request from: <strong>${subscriberEmail}</strong></p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `,
    });

    // Send confirmation to subscriber
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: subscriberEmail,
      subject: 'Welcome to Modern Art News!',
      text: 'Thank you for subscribing to Modern Art News. We\'ll keep you updated with the latest in contemporary art.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Modern Art News!</h1>
          <p style="color: #666; font-size: 16px;">
            Thank you for subscribing to our newsletter. We're excited to share the latest insights 
            from the world of modern art with you.
          </p>
          <p style="color: #666; font-size: 16px;">
            You'll be among the first to know when we launch!
          </p>
          <div style="margin: 30px 0;">
            <p style="color: #888; font-size: 14px;">Follow us on social media:</p>
            <a href="https://x.com/sanjaUnjica" style="color: #6366f1; text-decoration: none; margin-right: 15px;">Twitter</a>
            <a href="https://www.instagram.com/theunjica/" style="color: #6366f1; text-decoration: none; margin-right: 15px;">Instagram</a>
            <a href="https://www.linkedin.com/company/unjica" style="color: #6366f1; text-decoration: none;">LinkedIn</a>
          </div>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
} 