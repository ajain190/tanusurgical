module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  try {
    const { organization, name, phone, email, specialty, volume, message } = req.body || {};
    const bodyText = [
      `New RFQ from ${organization || 'Unknown organization'}`,
      `Representative: ${name || 'N/A'}`,
      `Phone: ${phone || 'N/A'}`,
      `Email: ${email || 'N/A'}`,
      `Specialty: ${specialty || 'N/A'}`,
      `Volume: ${volume || 'N/A'}`,
      `Message: ${message || 'N/A'}`
    ].join('\n');

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
    const toNumber = process.env.TWILIO_WHATSAPP_TO;

    if (!accountSid || !authToken || !fromNumber || !toNumber) {
      res.status(500).json({ ok: false, message: 'WhatsApp environment not configured' });
      return;
    }

    const twilio = require('twilio');
    const client = twilio(accountSid, authToken);

    await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: bodyText
    });

    const emailTo = process.env.RFQ_EMAIL_TO || 'tanu.surgicals@gmail.com';
    const emailSubject = `New RFQ Submission from ${organization || 'Website'}`;
    const emailBody = `Organization: ${organization || 'N/A'}\nRepresentative: ${name || 'N/A'}\nPhone: ${phone || 'N/A'}\nEmail: ${email || 'N/A'}\nSpecialty: ${specialty || 'N/A'}\nVolume: ${volume || 'N/A'}\n\nMessage:\n${message || 'N/A'}`;

    if (process.env.SENDGRID_API_KEY) {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      await sgMail.send({
        to: emailTo,
        from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@tanusurgical.vercel.app',
        subject: emailSubject,
        text: emailBody
      });
    }

    res.status(200).json({ ok: true, message: 'WhatsApp and email notifications sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Failed to send notifications' });
  }
};
