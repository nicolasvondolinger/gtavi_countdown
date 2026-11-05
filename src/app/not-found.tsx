import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <Container className="my-24 flex flex-col gap-4">
      <h1 className="text-[56px]">Page not found</h1>
      <p className="font-read text-[17px] text-body">This page does not exist yet.</p>
      <p><Link href="/games" className="font-semibold text-accent hover:underline">Browse all games</Link></p>
    </Container>
  );
}
