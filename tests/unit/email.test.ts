import { afterEach, describe, expect, it, vi } from 'vitest';
import { emailEnabled, sendEmail } from '@/server/email';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('sendEmail', () => {
  it('sends through the provider when a key is set', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
    await sendEmail({ to: 'a@example.invalid', subject: 'Hi', text: 'Body' });
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.headers.Authorization).toBe('Bearer test-key');
    expect(JSON.parse(init.body)).toMatchObject({ to: 'a@example.invalid', subject: 'Hi', text: 'Body' });
  });

  it('surfaces a provider failure', async () => {
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    await expect(sendEmail({ to: 'a@example.invalid', subject: 'Hi', text: 'Body' })).rejects.toThrow('500');
  });

  it('refuses to drop mail silently in production', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    vi.stubEnv('NODE_ENV', 'production');
    expect(emailEnabled()).toBe(false);
    await expect(sendEmail({ to: 'a@example.invalid', subject: 'Hi', text: 'Body' })).rejects.toThrow('RESEND_API_KEY');
  });
});
