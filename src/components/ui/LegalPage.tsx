import type { ReactNode } from 'react';
import { Container } from './Container';

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Container className="mt-8 mb-20 flex max-w-[760px]! flex-col gap-4">
      <h1 className="text-[41px] lg:text-[56px]">{title}</h1>
      {children}
    </Container>
  );
}
