import { NextResponse, type NextRequest } from 'next/server';
import { suggest } from '@/server/search/queries';

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get('q') ?? '').slice(0, 80);
  return NextResponse.json({ suggestions: await suggest(q, request.nextUrl.searchParams.get('locale') ?? 'en') }, { headers: { 'Cache-Control': 'public, max-age=60' } });
}
