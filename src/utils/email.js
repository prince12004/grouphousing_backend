const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`;

const sendEmail = async ({ to, subject, html }) => {
  try {
    const recipient = process.env.DEV_EMAIL_OVERRIDE || to;
    if (process.env.DEV_EMAIL_OVERRIDE) console.log(`[DEV] Email: ${to} → ${recipient}`);
    const { data, error } = await resend.emails.send({ from: FROM, to: recipient, subject, html });
    if (error) { console.error('Resend error:', error); return { success: false, error: error.message }; }
    console.log('✅ Email sent:', data?.id);
    return { success: true, id: data?.id };
  } catch (err) {
    console.error('Email exception:', err.message);
    return { success: false, error: err.message };
  }
};

/* ─── Shared layout wrapper ─────────────────────────────────────── */
const layout = (content) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Grouphousing</title></head>
<body style="margin:0;padding:0;background:#EEF2F7;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F7;padding:40px 16px">
  <tr><td align="center">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#0A4F4A 0%,#0F766E 45%,#14B8A6 100%);border-radius:16px 16px 0 0;padding:36px 40px;text-align:center">
        <div style="display:inline-flex;align-items:center;gap:10px;margin-bottom:8px">
          <div style="width:38px;height:38px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-block;line-height:38px;text-align:center;font-size:20px">🏠</div>
          <span style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.5px">Grouphousing</span>
        </div>
        <p style="color:rgba(255,255,255,0.7);margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase">Creating Dreams Together</p>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:#fff;padding:44px 40px">${content}</td></tr>

      <!-- Footer -->
      <tr><td style="background:#0F172A;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center">
        <p style="color:#475569;font-size:12px;margin:0 0 8px">Need help? <a href="mailto:support@grouphousing.com" style="color:#14B8A6;text-decoration:none">support@grouphousing.com</a></p>
        <p style="color:#334155;font-size:11px;margin:0">© ${new Date().getFullYear()} Grouphousing. All rights reserved.</p>
        <div style="margin-top:14px;display:flex;justify-content:center;gap:16px">
          <a href="#" style="color:#475569;font-size:11px;text-decoration:none">Privacy Policy</a>
          <span style="color:#334155">·</span>
          <a href="#" style="color:#475569;font-size:11px;text-decoration:none">Terms of Use</a>
          <span style="color:#334155">·</span>
          <a href="#" style="color:#475569;font-size:11px;text-decoration:none">Unsubscribe</a>
        </div>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

/* ─── Divider helper ─────────────────────────────────────────────── */
const divider = `<tr><td style="padding:0 0 28px"><div style="height:1px;background:linear-gradient(to right,transparent,#E2E8F0,transparent)"></div></td></tr>`;

/* ─── OTP Email ──────────────────────────────────────────────────── */
const sendOTPEmail = async ({ to, name, otp }) => {
  const html = layout(`
    <!-- Title -->
    <h2 style="color:#0F172A;font-size:22px;font-weight:700;margin:0 0 6px">Verify Your Email 🔐</h2>
    <p style="color:#64748B;font-size:14px;margin:0 0 28px;line-height:1.6">
      Hi <strong style="color:#0F172A">${name}</strong>, welcome to Grouphousing!<br>
      Use the code below to complete your registration.
    </p>

    <!-- OTP Box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px">
      <tr><td style="background:linear-gradient(135deg,#F0FDF9,#CCFBF1);border:2px solid #14B8A6;border-radius:16px;padding:36px 24px;text-align:center">
        <p style="color:#0F766E;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 12px">Your One-Time Password</p>
        <div style="letter-spacing:18px;font-size:52px;font-weight:900;color:#0F766E;font-family:'Courier New',monospace;line-height:1">${otp}</div>
        <p style="color:#0D9488;font-size:12px;margin:14px 0 0">⏱ &nbsp;Expires in <strong>10 minutes</strong></p>
      </td></tr>
    </table>

    <!-- Warning -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
      <tr><td style="background:#FFFBEB;border-left:4px solid #F59E0B;border-radius:0 10px 10px 0;padding:14px 18px">
        <p style="color:#92400E;font-size:13px;margin:0;line-height:1.5">
          🔒 &nbsp;<strong>Never share this code</strong> with anyone. Grouphousing will never ask for your OTP.
        </p>
      </td></tr>
    </table>

    <!-- Steps -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 8px">
      <tr>
        <td width="33%" style="text-align:center;padding:16px 8px;background:#F8FAFC;border-radius:12px;margin:0 4px">
          <div style="font-size:24px;margin-bottom:6px">📧</div>
          <p style="color:#0F172A;font-size:12px;font-weight:600;margin:0">Enter OTP</p>
          <p style="color:#94A3B8;font-size:11px;margin:4px 0 0">on the verify page</p>
        </td>
        <td width="4px"></td>
        <td width="33%" style="text-align:center;padding:16px 8px;background:#F8FAFC;border-radius:12px">
          <div style="font-size:24px;margin-bottom:6px">✅</div>
          <p style="color:#0F172A;font-size:12px;font-weight:600;margin:0">Get Verified</p>
          <p style="color:#94A3B8;font-size:11px;margin:4px 0 0">instantly</p>
        </td>
        <td width="4px"></td>
        <td width="33%" style="text-align:center;padding:16px 8px;background:#F8FAFC;border-radius:12px">
          <div style="font-size:24px;margin-bottom:6px">🏡</div>
          <p style="color:#0F172A;font-size:12px;font-weight:600;margin:0">Start Investing</p>
          <p style="color:#94A3B8;font-size:11px;margin:4px 0 0">from ₹5 Lakhs</p>
        </td>
      </tr>
    </table>

    <p style="color:#CBD5E1;font-size:11px;margin:24px 0 0;text-align:center">
      If you didn't create an account, you can safely ignore this email.
    </p>
  `);
  return sendEmail({ to, subject: '🔐 Your OTP – Grouphousing Email Verification', html });
};

/* ─── Booking Confirmation ───────────────────────────────────────── */
const sendBookingConfirmation = async ({ to, name, projectName, bookingId, amount }) => {
  const html = layout(`
    <!-- Success banner -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px">
      <tr><td style="background:linear-gradient(135deg,#ECFDF5,#D1FAE5);border:1px solid #6EE7B7;border-radius:14px;padding:20px 24px;text-align:center">
        <div style="font-size:40px;margin-bottom:8px">🎉</div>
        <h2 style="color:#065F46;font-size:20px;font-weight:800;margin:0 0 4px">Booking Confirmed!</h2>
        <p style="color:#047857;font-size:13px;margin:0">Your investment journey has begun.</p>
      </td></tr>
    </table>

    <p style="color:#64748B;font-size:14px;line-height:1.7;margin:0 0 24px">
      Dear <strong style="color:#0F172A">${name}</strong>,<br>
      We're thrilled to confirm your booking interest with <strong style="color:#0F766E">Grouphousing</strong>. Our team will reach out within 24 hours to guide you through the next steps.
    </p>

    <!-- Booking Details -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden">
      <tr><td style="background:linear-gradient(135deg,#0F766E,#14B8A6);padding:14px 20px">
        <p style="color:#fff;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0">📋 Booking Summary</p>
      </td></tr>
      <tr><td style="padding:0">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr style="border-bottom:1px solid #F1F5F9">
            <td style="padding:14px 20px;color:#64748B;font-size:13px;width:140px">Booking ID</td>
            <td style="padding:14px 20px;color:#0F172A;font-size:13px;font-weight:600;font-family:monospace">#${bookingId}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;background:#FAFAFA">
            <td style="padding:14px 20px;color:#64748B;font-size:13px">Project</td>
            <td style="padding:14px 20px;color:#0F172A;font-size:13px;font-weight:600">${projectName}</td>
          </tr>
          <tr>
            <td style="padding:14px 20px;color:#64748B;font-size:13px">Investment</td>
            <td style="padding:14px 20px;color:#0F766E;font-size:16px;font-weight:800">₹${amount?.toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- What's Next -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
      <tr><td style="background:#F8FAFC;border-radius:14px;padding:20px 24px">
        <p style="color:#0F172A;font-size:13px;font-weight:700;margin:0 0 14px">📌 What happens next?</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${['Our team reviews your booking request','Dedicated relationship manager assigned','Legal & financial documentation shared','Investment confirmation & onboarding'].map((step, i) => `
          <tr><td style="padding:6px 0;vertical-align:top">
            <div style="display:inline-block;width:22px;height:22px;background:linear-gradient(135deg,#0F766E,#14B8A6);border-radius:50%;text-align:center;line-height:22px;color:#fff;font-size:11px;font-weight:700;margin-right:10px;float:left">${i+1}</div>
            <span style="color:#475569;font-size:13px;line-height:22px;display:block;margin-left:32px">${step}</span>
          </td></tr>`).join('')}
        </table>
      </td></tr>
    </table>

    <!-- WhatsApp CTA -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="text-align:center">
        <a href="https://wa.me/${process.env.WHATSAPP_NUMBER}" style="display:inline-block;background:linear-gradient(135deg,#22C55E,#16A34A);color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:14px 32px;border-radius:12px">
          💬 &nbsp;Chat on WhatsApp
        </a>
        <p style="color:#94A3B8;font-size:12px;margin:12px 0 0">For faster response, connect with us on WhatsApp</p>
      </td></tr>
    </table>
  `);
  return sendEmail({ to, subject: `🎉 Booking Confirmed – ${projectName} | Grouphousing`, html });
};

/* ─── Admin Lead Notification ────────────────────────────────────── */
const sendAdminLeadNotification = async ({ projectName, leadName, leadEmail, leadMobile }) => {
  const html = layout(`
    <!-- Alert Badge -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px">
      <tr><td style="background:linear-gradient(135deg,#FEF3C7,#FDE68A);border:1px solid #F59E0B;border-radius:14px;padding:18px 24px">
        <p style="color:#92400E;font-size:14px;font-weight:700;margin:0">
          🔔 &nbsp;New Lead Alert &nbsp;·&nbsp; <span style="color:#B45309">${new Date().toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}</span>
        </p>
      </td></tr>
    </table>

    <h2 style="color:#0F172A;font-size:20px;font-weight:700;margin:0 0 6px">New Lead Received</h2>
    <p style="color:#64748B;font-size:14px;margin:0 0 24px">
      A new prospect has shown interest in <strong style="color:#0F766E">${projectName}</strong>. Follow up within <strong>2 hours</strong> for best conversion.
    </p>

    <!-- Lead Details -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #E2E8F0;border-radius:14px;overflow:hidden">
      <tr><td style="background:#0F172A;padding:14px 20px">
        <p style="color:#14B8A6;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin:0">👤 Lead Information</p>
      </td></tr>
      <tr><td style="padding:0">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr style="border-bottom:1px solid #F1F5F9">
            <td style="padding:14px 20px;color:#64748B;font-size:13px;width:120px">Name</td>
            <td style="padding:14px 20px;color:#0F172A;font-size:13px;font-weight:600">${leadName}</td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9;background:#FAFAFA">
            <td style="padding:14px 20px;color:#64748B;font-size:13px">Email</td>
            <td style="padding:14px 20px"><a href="mailto:${leadEmail}" style="color:#0F766E;font-size:13px;font-weight:600;text-decoration:none">${leadEmail}</a></td>
          </tr>
          <tr style="border-bottom:1px solid #F1F5F9">
            <td style="padding:14px 20px;color:#64748B;font-size:13px">Mobile</td>
            <td style="padding:14px 20px"><a href="tel:${leadMobile}" style="color:#0F766E;font-size:13px;font-weight:600;text-decoration:none">${leadMobile}</a></td>
          </tr>
          <tr style="background:#FAFAFA">
            <td style="padding:14px 20px;color:#64748B;font-size:13px">Project</td>
            <td style="padding:14px 20px;color:#0F172A;font-size:13px;font-weight:600">${projectName}</td>
          </tr>
        </table>
      </td></tr>
    </table>

    <!-- Quick Actions -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding-right:8px">
          <a href="https://wa.me/${leadMobile?.replace(/\D/g,'')}" style="display:block;text-align:center;background:linear-gradient(135deg,#22C55E,#16A34A);color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:13px 16px;border-radius:10px">
            💬 WhatsApp
          </a>
        </td>
        <td style="padding-left:8px">
          <a href="mailto:${leadEmail}" style="display:block;text-align:center;background:linear-gradient(135deg,#0F766E,#14B8A6);color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:13px 16px;border-radius:10px">
            📧 Send Email
          </a>
        </td>
      </tr>
    </table>

    <p style="color:#94A3B8;font-size:12px;text-align:center;margin:20px 0 0">
      View full details in the <a href="${process.env.CLIENT_URL}/admin/leads" style="color:#0F766E;text-decoration:none;font-weight:600">Admin Dashboard →</a>
    </p>
  `);
  return sendEmail({ to: process.env.ADMIN_EMAIL, subject: `🔔 New Lead: ${leadName} – ${projectName} | Grouphousing`, html });
};

module.exports = { sendEmail, sendOTPEmail, sendBookingConfirmation, sendAdminLeadNotification };
