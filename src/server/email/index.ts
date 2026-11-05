import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export type Email = { to: string; subject: string; text: string };

const OUTBOX = path.join(process.cwd(), '.outbox', 'emails.jsonl');

export const emailEnabled = () => !!process.env.RESEND_API_KEY || process.env.NODE_ENV !== 'production';

// Resend in production. Elsewhere mail lands in a local file, so flows can be tested without a provider.
export async function sendEmail(email: Email) {
  const key = process.env.RESEND_API_KEY;
  if (key) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.EMAIL_FROM ?? 'GTA Wiki <no-reply@example.invalid>', to: email.to, subject: email.subject, text: email.text }),
    });
    if (!res.ok) throw new Error(`Email provider returned ${res.status}`);
    return;
  }
  if (process.env.NODE_ENV === 'production') throw new Error('RESEND_API_KEY is not set');
  await mkdir(path.dirname(OUTBOX), { recursive: true });
  await appendFile(OUTBOX, `${JSON.stringify(email)}\n`);
}
