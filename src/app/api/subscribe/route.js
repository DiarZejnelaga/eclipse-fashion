import nodemailer from 'nodemailer';

export async function POST(request) {
  const responseHeaders = {
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: responseHeaders });
  }

  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('API Error in /api/subscribe: Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variables.');
      return new Response(
        JSON.stringify({ error: 'Server configuration error. Please contact support.' }),
        { status: 500, headers: responseHeaders }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('API Error in /api/subscribe: Failed to parse JSON body', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid request format. Please send JSON.' }),
        { status: 400, headers: responseHeaders }
      );
    }
    const { email } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email address is required' }),
        { status: 400, headers: responseHeaders }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: responseHeaders }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false, // Accept self-signed certificates (fixes ESOCKET error)
      },
    });

    const mailOptions = {
      from: `"Eclipse Fashion" <${process.env.GMAIL_USER}>`,
      to: 'zejnelagadiar@gmail.com',
      subject: 'New Newsletter Subscription!',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h1 style="color: #1a1a1a; border-bottom: 2px solid #eee; padding-bottom: 10px;">New Subscriber Alert!</h1>
          <p>You have a new subscriber to your newsletter:</p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #eee; background-color: #f9f9f9; font-weight: bold; width: 150px;">Subscriber Email:</td>
              <td style="padding: 8px; border: 1px solid #eee;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #eee; background-color: #f9f9f9; font-weight: bold;">Subscription Time:</td>
              <td style="padding: 8px; border: 1px solid #eee;">${new Date().toLocaleString()}</td>
            </tr>
          </table>
          <p>Make sure to welcome them or add them to your mailing list!</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 0.9em; color: #777; text-align: center;">This email was sent automatically from your website's newsletter subscription form.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: 'Subscription successful! Thank you for joining.' }),
      { status: 200, headers: responseHeaders }
    );

  } catch (error) {
    console.error('API Route /api/subscribe Server Error:', error);
    if (error.code === 'EAUTH' || error.responseCode === 535) {
      console.error('Nodemailer Authentication Error:', error.message);
      return new Response(
        JSON.stringify({ error: 'Email server authentication failed. Please check server configuration or credentials.' }),
        { status: 500, headers: responseHeaders }
      );
    }
    if (error.code === 'EENVELOPE') {
      console.error('Nodemailer Envelope Error (e.g., invalid "to" address):', error.message);
      return new Response(
        JSON.stringify({ error: 'Failed to send email due to an issue with the recipient address. Please contact support.' }),
        { status: 500, headers: responseHeaders }
      );
    }
    return new Response(
      JSON.stringify({ error: 'Internal server error. Please try again later.' }),
      { status: 500, headers: responseHeaders }
    );
  }
}
