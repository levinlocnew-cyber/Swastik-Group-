import nodemailer from 'nodemailer';
import { db } from './db';

// Create a transport with robust fallback configuration
export async function sendEmail(to: string, subject: string, htmlContent: string) {
  const smtpUser = process.env.SMTP_USER || '';
  const smtpPass = process.env.SMTP_PASS || '';
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');

  console.log(`[Email Service] Attempting to send email. Subject: "${subject}", To: "${to}"`);

  if (!smtpUser || !smtpPass) {
    // Graceful developer logging fallback
    console.log(`[Email Service Fallback Logging]
    --------------------------------------------------
    EMAIL TO: ${to}
    SUBJECT: ${subject}
    --- HTML CONTENT ---
    ${htmlContent.replace(/<[^>]*>/g, ' ')}
    --------------------------------------------------
    (SMTP_USER or SMTP_PASS environment variables are missing. Configure them to enable real emails.)`);

    // Log to DB ActivityLogs so the admin can always view generated emails directly in the Dashboard!
    db.logs.add(
      'EMAIL_SIMULATED',
      `Sent to ${to} | Subject: "${subject}". SMTP not active, logged details here.`
    );
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    await transporter.sendMail({
      from: `"Swastik Group Lucknow" <${smtpUser}>`,
      to,
      subject,
      html: htmlContent
    });

    console.log(`[Email Service] Email sent successfully to ${to}`);
    db.logs.add('EMAIL_SENT', `Real SMTP email sent to ${to} with subject "${subject}"`);
    return true;
  } catch (err: any) {
    console.error('[Email Service Error]', err);
    db.logs.add('EMAIL_FAILED', `Failed to send email to ${to}: ${err?.message || err}`);
    return false;
  }
}

// Pre-defined template helper engines
export const emailTemplates = {
  newLeadAlert: (inquiry: { name: string; email: string; phone: string; message: string; propertyName?: string }) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #b2944b; padding-bottom: 15px;">
          <h2 style="color: #0b1528; margin: 0; font-size: 24px;">🏢 SWASTIK GROUP LUCKNOW</h2>
          <p style="color: #64748b; font-size: 13px; margin: 5px 0 0 0;">New High-Intent Premium Lead Registered</p>
        </div>
        <div style="padding: 20px 0; line-height: 1.6; color: #334155;">
          <p>Hello Admin,</p>
          <p>A visitor has submitted a new inquiry on the Swastik Group platform. Below are their complete details:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 35%;">Visitor Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #0b1528;">${inquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Mobile Number:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="tel:${inquiry.phone}" style="color: #b2944b; text-decoration: none; font-weight: bold;">${inquiry.phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Email Address:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${inquiry.email}" style="color: #0b1528; text-decoration: none;">${inquiry.email}</a></td>
            </tr>
            ${inquiry.propertyName ? `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Property Profile:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #b2944b; font-weight: bold;">${inquiry.propertyName}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; vertical-align: top;">Visitor Message:</td>
              <td style="padding: 8px; border-bottom: 1px solid #f1f5f9; white-space: pre-wrap; color: #475569;">${inquiry.message}</td>
            </tr>
          </table>
          
          <div style="margin-top: 25px; text-align: center;">
            <a href="https://wa.me/${inquiry.phone.replace(/\+/g, '')}" style="background-color: #25d366; color: #ffffff; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 8px; margin-right: 10px; display: inline-block;">WhatsApp Lead</a>
            <a href="tel:${inquiry.phone}" style="background-color: #0b1528; color: #ffffff; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block;">Call Instantly</a>
          </div>
        </div>
        <div style="border-top: 1px solid #f1f5f9; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
          © ${new Date().getFullYear()} Swastik Group Lucknow. All Rights Reserved.
        </div>
      </div>
    `;
  },

  passwordReset: (resetUrl: string) => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #b2944b; padding-bottom: 15px;">
          <h2 style="color: #0b1528; margin: 0; font-size: 24px;">🔑 SWASTIK ADMIN CONTROL</h2>
        </div>
        <div style="padding: 20px 0; line-height: 1.6; color: #334155;">
          <p>Hello Swastik Administrator,</p>
          <p>A request was raised to reset the Swastik Group Admin dashboard password. Please click the button below to configure a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #b2944b; color: #ffffff; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; font-size: 14px;">Reset Admin Password</a>
          </div>
          <p style="color: #e11d48; font-size: 12px; font-weight: bold;">Note: This secure Link expires automatically in 1 hour. If you didn't initiate this request, please audit security immediately.</p>
        </div>
        <div style="border-top: 1px solid #f1f5f9; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
          © ${new Date().getFullYear()} Swastik Group Lucknow Security Desk.
        </div>
      </div>
    `;
  },

  passwordChangeSuccess: () => {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #b2944b; padding-bottom: 15px;">
          <h2 style="color: #22c55e; margin: 0; font-size: 24px;">✓ PASSWORD CHANGED</h2>
          <p style="color: #64748b; font-size: 13px; margin: 5px 0 0 0;">Swastik Admin Security Alert</p>
        </div>
        <div style="padding: 20px 0; line-height: 1.6; color: #334155;">
          <p>Hello Admin,</p>
          <p>The password for the Swastik Group administrative portal was <strong>successfully modified</strong>.</p>
          <p>If you made this update, no action is required. If this change was unexpected, please contact your developer or database admin immediately to protect critical Lucknow lead datasets.</p>
        </div>
        <div style="border-top: 1px solid #f1f5f9; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
          © ${new Date().getFullYear()} Swastik Group Security Control.
        </div>
      </div>
    `;
  }
};
