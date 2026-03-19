import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

type ContactPayload = {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const name = (payload.name ?? '').trim();
    const email = (payload.email ?? '').trim();
    const topic = (payload.topic ?? 'General support').trim();
    const message = (payload.message ?? '').trim();

    if (!email || !message) {
      return NextResponse.json({ success: false, error: 'Email and message are required.' }, { status: 400 });
    }

    const html = `
      <h2>New Contact Form Message</h2>
      <p><strong>Name:</strong> ${escapeHtml(name || 'N/A')}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Topic:</strong> ${escapeHtml(topic || 'N/A')}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replaceAll('\n', '<br />')}</p>
    `;

    await sendEmail({
      to: process.env.CONTACT_FORM_TO ?? 'your-personal-email@gmail.com',
      subject: 'New Contact Form Message',
      html
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[contact] Email send failed:', error);
    return NextResponse.json({ success: false, error: 'Unable to send message right now.' }, { status: 500 });
  }
}
