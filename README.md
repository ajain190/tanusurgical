# Tanu Surgical Industries

Welcome to the official website of **Tanu Surgical Industries** - Premium Hospital & Scientific Appliances.

## About Us

Tanu Surgical Industries specializes in providing high-quality hospital and scientific appliances for medical professionals and institutions.

## Website Features

- Modern, responsive design
- Product showcase with images
- Professional medical industry presentation
- Built with Tailwind CSS for optimal performance

## Products

We offer a range of surgical and medical instruments including:
- Autoclaves
- Dressing Drums
- Instrument Boxes
- Instrument Trays
- Trolleys
- And more...

## Local Development

To view the website locally, simply open `index.html` in your web browser.

## Deployment

This website is deployed and accessible online. Visit our site to explore our complete product range and services.

## WhatsApp RFQ notifications

The RFQ form in index.html now continues to submit to FormSubmit for email and also calls the Vercel serverless endpoint /api/whatsapp-notify.

### Required environment variables for Vercel

Set these in your Vercel project:

- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_WHATSAPP_FROM (for example `whatsapp:+14155238886`)
- TWILIO_WHATSAPP_TO (your WhatsApp-enabled number, for example `whatsapp:+9194xxxxxxx`)

### Install dependency

The endpoint uses the Twilio SDK:

```bash
npm install twilio
```

If you prefer a different provider, replace the Twilio client calls in api/whatsapp-notify.js with your provider-specific implementation.

---

**Tanu Surgical Industries**  
Premium Hospital & Scientific Appliances
