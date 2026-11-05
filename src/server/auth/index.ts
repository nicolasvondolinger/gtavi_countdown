import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { sql } from 'drizzle-orm';
import { USERNAME } from '@/lib/account';
import { db, schema } from '@/server/db';
import { emailEnabled, sendEmail } from '@/server/email';

const env = process.env;

function provider(id: string | undefined, secret: string | undefined) {
  return id && secret ? { clientId: id, clientSecret: secret } : undefined;
}

const google = provider(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
const discord = provider(env.DISCORD_CLIENT_ID, env.DISCORD_CLIENT_SECRET);
const apple = provider(env.APPLE_CLIENT_ID, env.APPLE_CLIENT_SECRET);

export const enabledProviders = { google: !!google, discord: !!discord, apple: !!apple };

// OAuth display names can hold anything, so make them fit and find one that is free.
export async function freeUsername(name: string) {
  const base = name.replace(/[^A-Za-z0-9_]/g, '').slice(0, 16).padEnd(3, '0');
  for (let i = 0; i < 50; i++) {
    const candidate = i ? `${base}${i}` : base;
    const taken = await db.$count(schema.profiles, sql`lower(${schema.profiles.username}) = ${candidate.toLowerCase()}`);
    if (!taken && USERNAME.test(candidate)) return candidate;
  }
  return `player${Date.now().toString(36)}`;
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: env.NODE_ENV === 'production' ? [] : ['http://localhost:3000', 'http://localhost:3100', 'http://localhost:3200'],
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: { user: schema.user, session: schema.session, account: schema.account, verification: schema.verificationToken },
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({ to: user.email, subject: 'Reset your GTA Wiki password', text: `Use this link to set a new password:\n\n${url}\n\nIf you did not ask for this, ignore this email.` });
    },
  },
  emailVerification: {
    sendOnSignUp: emailEnabled(),
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({ to: user.email, subject: 'Verify your GTA Wiki email', text: `Confirm your email address:\n\n${url}` });
    },
  },
  socialProviders: { ...(google && { google }), ...(discord && { discord }), ...(apple && { apple }) },
  rateLimit: { window: 60, max: 60, customRules: { '/sign-in/email': { window: 60, max: 5 }, '/sign-up/email': { window: 60, max: 5 }, '/request-password-reset': { window: 60, max: 3 } } },
  databaseHooks: {
    user: {
      create: {
        after: async user => {
          await db.insert(schema.profiles).values({ userId: user.id, username: await freeUsername(user.name) }).onConflictDoNothing();
        },
      },
    },
  },
  plugins: [nextCookies()],
});
