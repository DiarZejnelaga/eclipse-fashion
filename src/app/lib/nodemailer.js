import nodemailer from 'nodemailer';

let transporterInstance;

async function getTransporter() {
  if (transporterInstance) {
    return transporterInstance;
  }

  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.EMAIL_FROM
  ) {
    console.log("NODEMAILER: Attempting to use SMTP settings from environment variables (likely Gmail).");
    transporterInstance = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  } else {
    console.log("NODEMAILER: Primary SMTP settings not found. Using Ethereal for email in development.");
    try {
      let testAccount = await nodemailer.createTestAccount();
      transporterInstance = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`NODEMAILER: Ethereal account ready. User: ${testAccount.user}`);
      console.log(`NODEMAILER: Ethereal Preview URL structure: ${nodemailer.getTestMessageUrl({ FakeMessageId: 'test' })}`);
    } catch (etherealError) {
      console.error("NODEMAILER: Failed to create Ethereal test account:", etherealError);
      return null;
    }
  }

  if (transporterInstance) {
    try {
      await transporterInstance.verify();
      console.log('NODEMAILER: Transporter verified and is ready.');
    } catch (error) {
      console.error('NODEMAILER: Transporter verification failed:', error.message);
      transporterInstance = null;
      return null;
    }
  }

  return transporterInstance;
}

async function sendGenericEmail({ to, subject, html, text }) {
  const currentTransporter = await getTransporter();

  if (!currentTransporter) {
    console.error("NODEMAILER: Transporter not available. Email not sent.");
    throw new Error("Email service is not configured or failed to initialize.");
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Your App Name" <noreply@example.com>',
    to,
    subject,
    html,
    text,
  };

  try {
    console.log(`NODEMAILER: Attempting to send email. To: ${to}, Subject: ${subject}`);
    let info = await currentTransporter.sendMail(mailOptions);
    console.log('NODEMAILER: Email sent successfully. Message ID: %s', info.messageId);
    if (currentTransporter.options?.host === 'smtp.ethereal.email') {
      console.log('NODEMAILER: Preview URL (Ethereal): %s', nodemailer.getTestMessageUrl(info));
    }
    return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (error) {
    console.error('NODEMAILER: Error sending email:', error.message, error);
    throw error;
  }
}

async function sendWelcomeEmail(toEmail, userName) {
  const subject = 'Welcome to Eclipse App!';
  const text = `Hi ${userName || 'there'},\n\nWelcome to Eclipse App! We're excited to have you.\n\nBest,\nThe Eclipse App Team`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #0056b3; text-align: center;">Welcome, ${userName || 'friend'}!</h2>
        <p>Thanks for signing up for <strong>Eclipse App</strong>. We're thrilled to have you on board.</p>
        <p>Get started by exploring your new account.</p>
        <p>Best regards,<br/>The Eclipse App Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.9em; color: #777; text-align: center;">
          If you did not sign up for this account, please ignore this email.
        </p>
      </div>
    </div>
  `;

  return await sendGenericEmail({
    to: toEmail,
    subject,
    text,
    html,
  });
}

async function sendPasswordResetEmail(toEmail, resetLink, resetTokenValue) {
  const subject = 'Reset Your Eclipse App Password';
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h2 style="color: #0056b3; text-align: center;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>A password reset was requested for your Eclipse App account associated with this email address.</p>
        <p>If you did not request this, please ignore this email. No changes will be made to your account.</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">Reset Your Password</a>
        </p>
        <p>If the button above doesn't work, please copy and paste the following link into your browser:</p>
        <p><a href="${resetLink}" style="color: #007bff; word-break: break-all;">${resetLink}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>Thanks,<br>The Eclipse App Team</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.9em; color: #777; text-align: center;">
          Debug Token: ${resetTokenValue}
        </p>
      </div>
    </div>
  `;
  const text = `
    Password Reset Request
    Hello,
    A password reset was requested for your Eclipse App account.
    If you did not request this, please ignore this email.
    To reset your password, click or copy this link: ${resetLink}
    This link expires in 1 hour.
    Thanks, The Eclipse App Team
    (Debug Token: ${resetTokenValue})
  `;

  return await sendGenericEmail({
    to: toEmail,
    subject,
    html,
    text,
  });
}

// ✅ Export all relevant functions
export {
  getTransporter,
  sendGenericEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
};
