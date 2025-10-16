const nodemailer = require('nodemailer');

function transporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function buildHtml({ careers }) {
  const items = careers.map(c => `
    <li style="margin-bottom:8px">
      <div style="font-weight:600">${c.title}</div>
      <div style="color:#666">${c.summary || ''}</div>
    </li>
  `).join('');
  return `
  <div style="font-family:system-ui, -apple-system, Segoe UI, Roboto, Arial">
    <h2>CareerVerse — Your Career Summary</h2>
    <p>Here are your top paths and suggestions:</p>
    <ol>${items}</ol>
    <p style="margin-top:16px">Keep exploring with CareerVerse!</p>
  </div>`;
}

async function sendSummaryEmail({ to, careers }) {
  const t = transporter();
  const html = buildHtml({ careers });
  const info = await t.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject: 'Your Career Summary Report — CareerVerse',
    html,
  });
  return { messageId: info.messageId };
}

module.exports = { sendSummaryEmail };


