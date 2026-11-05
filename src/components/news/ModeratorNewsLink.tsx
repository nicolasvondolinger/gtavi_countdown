'use client';

import { useViewer } from '@/components/layout/useViewer';
import { LinkButton } from '@/components/ui/Button';

export function ModeratorNewsLink({ href, label }: { href: string; label: string }) {
  const viewer = useViewer();
  if (viewer?.role !== 'moderator') return null;
  return <LinkButton href={href} kind="secondary" className="shrink-0 px-3! py-1.5! text-sm!">{label}</LinkButton>;
}
