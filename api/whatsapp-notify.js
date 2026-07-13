const twilio = require('twilio');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  try {
    const payload = req.body || {};
    const organization = payload.organization || 'Unknown organization';
    const name = payload.name || 'N/A';
    const phone = payload.phone || 'N/A';
    const email = payload.email || 'N/A';
    const specialty = payload.specialty || 'N/A';
    const volume = payload.volume || 'N/A';
    const message = payload.message || 'N/A';

    const bodyText = [
      `New RFQ from ${organization}`,
      `Representative: ${name}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Specialty: ${specialty}`,
      `Volume: ${volume}`,
      `Message: ${message}`
    ].join('\n');

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_WHATSAPP_FROM;
    const toNumber = process.env.TWILIO_WHATSAPP_TO;

    if (!accountSid || !authToken || !fromNumber || !toNumber) {
      res.status(500).json({ ok: false, message: 'WhatsApp env vars missing' });
      return;
    }

    const client = twilio(accountSid, authToken);
    await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: bodyText
    });

    res.status(200).json({ ok: true, message: 'WhatsApp notification sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Failed to send WhatsApp notification' });
  }
};
