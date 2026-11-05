import { sql } from 'drizzle-orm';
import { NextResponse, type NextRequest } from 'next/server';
import { USERNAME } from '@/lib/account';
import { db, schema } from '@/server/db';

export async function GET(request: NextRequest) {
  const u = request.nextUrl.searchParams.get('u') ?? '';
  if (!USERNAME.test(u)) return NextResponse.json({ available: false, reason: 'Use 3 to 20 letters, numbers or underscores.' });
  const taken = await db.$count(schema.profiles, sql`lower(${schema.profiles.username}) = ${u.toLowerCase()}`);
  return NextResponse.json({ available: !taken, reason: taken ? 'That username is taken.' : null });
}
