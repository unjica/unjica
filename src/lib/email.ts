import nodemailer from 'nodemailer';

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // This should be an App Password, not your regular password
  },
});

type ContactFormData = {
  isContactForm?: boolean;
  name?: string;
  message?: string;
};

export async function sendNotificationEmail(subscriberEmail: string, formData?: ContactFormData) {
  try {
    // Determine if this is a contact form submission or a subscription
    const isContactForm = formData?.isContactForm || false;
    const adminSubject = isContactForm 
      ? `New Contact Form Submission | Unjica` 
      : `New Newsletter Subscription | Unjica`;
    
    // Create the admin email content
    let adminTextContent = '';
    let adminHtmlContent = '';
    
    if (isContactForm && formData?.name && formData?.message) {
      // Contact form submission
      adminTextContent = `
        New contact form submission:
        Name: ${formData.name}
        Email: ${subscriberEmail}
        Message: ${formData.message}
        Time: ${new Date().toLocaleString()}
      `;
      
      adminHtmlContent = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${subscriberEmail}</p>
        <p><strong>Message:</strong></p>
        <p style="padding: 10px; background-color: #f5f5f5; border-left: 4px solid #3b82f6;">
          ${formData.message.replace(/\n/g, '<br>')}
        </p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `;
    } else {
      // Newsletter subscription
      adminTextContent = `New subscription request from: ${subscriberEmail}`;
      adminHtmlContent = `
        <h2>New Newsletter Subscription</h2>
        <p>You have a new subscription request from: <strong>${subscriberEmail}</strong></p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `;
    }

    // Send email to admin
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Sending to yourself
      subject: adminSubject,
      text: adminTextContent,
      html: adminHtmlContent,
    });

    // Only send confirmation to user for subscriptions, not contact forms
    if (!isContactForm) {
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
              <a href="https://www.facebook.com/share/18DXtaouUG/?mibextid=wwXIfr" style="color: #6366f1; text-decoration: none; margin-right: 15px;">Facebook</a>
              <a href="https://www.instagram.com/unjica_art/" style="color: #6366f1; text-decoration: none; margin-right: 15px;">Instagram</a>
              <a href="https://www.linkedin.com/company/unjica" style="color: #6366f1; text-decoration: none;">LinkedIn</a>
            </div>
          </div>
        `,
      });
    } else {
      // Send acknowledgment to the contact form submitter
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: subscriberEmail,
        subject: 'We received your message | Unjica',
        text: `
          Dear ${formData?.name},
          
          Thank you for contacting us. We have received your message and will get back to you shortly.
          
          Message details:
          ${formData?.message}
          
          Best regards,
          The Unjica Team
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">We Received Your Message</h1>
            <p style="color: #666; font-size: 16px;">
              Dear ${formData?.name},
            </p>
            <p style="color: #666; font-size: 16px;">
              Thank you for contacting us. We have received your message and will get back to you shortly.
            </p>
            <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #3b82f6;">
              <p style="color: #666; font-size: 14px; font-style: italic;">
                ${formData?.message?.replace(/\n/g, '<br>')}
              </p>
            </div>
            <p style="color: #666; font-size: 16px;">
              Best regards,<br>
              The Unjica Team
            </p>
            <div style="margin: 30px 0; border-top: 1px solid #eee; padding-top: 20px;">
              <p style="color: #888; font-size: 14px;">Follow us on social media:</p>
              <a href="https://www.facebook.com/share/18DXtaouUG/?mibextid=wwXIfr" style="color: #6366f1; text-decoration: none; margin-right: 15px;">Facebook</a>
              <a href="https://www.instagram.com/unjica_art/" style="color: #6366f1; text-decoration: none; margin-right: 15px;">Instagram</a>
              <a href="https://www.linkedin.com/company/unjica" style="color: #6366f1; text-decoration: none;">LinkedIn</a>
            </div>
          </div>
        `,
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
} 