const https = require('https');
const querystring = require('querystring');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, message: 'Method not allowed' });
    return;
  }

  const payload = typeof req.body === 'string'
    ? JSON.parse(req.body)
    : (req.body || {});

  const formData = {
    _captcha: 'false',
    _subject: 'New RFQ Submission from Tanu Surgical Site',
    _template: 'table',
    _replyto: payload.email || '',
    organization: payload.organization || '',
    name: payload.name || '',
    phone: payload.phone || '',
    email: payload.email || '',
    specialty: payload.specialty || '',
    volume: payload.volume || '',
    message: payload.message || ''
  };

  const body = querystring.stringify(formData);
  const options = {
    hostname: 'formsubmit.co',
    path: '/tanu.surgicals@gmail.com',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(body),
      'Accept': 'application/json'
    }
  };

  const request = https.request(options, (response) => {
    let responseBody = '';

    response.on('data', (chunk) => {
      responseBody += chunk;
    });

    response.on('end', () => {
      if (response.statusCode >= 200 && response.statusCode < 300) {
        res.status(200).json({ ok: true, message: 'Email notification sent' });
      } else {
        res.status(502).json({
          ok: false,
          message: 'Email service returned an unexpected response',
          details: responseBody
        });
      }
    });
  });

  request.on('error', (error) => {
    res.status(500).json({
      ok: false,
      message: 'Failed to send email notification',
      error: error.message
    });
  });

  request.write(body);
  request.end();
};
