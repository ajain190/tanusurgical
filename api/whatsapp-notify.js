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

    res.status(200).json({ ok: true, message: 'WhatsApp notification sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: 'Failed to send WhatsApp notification' });
  }
};
