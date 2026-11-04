import Image from 'next/image';

export const AVATARS = ['lucia', 'jason', 'cal', 'boobie', 'drequan', 'real_dimez', 'raul', 'brian'] as const;

export function Avatar({ avatar, size = 28, alt = '' }: { avatar: string | null | undefined; size?: number; alt?: string }) {
  return <Image src={`/media/characters/${avatar ?? 'lucia'}.webp`} alt={alt} width={size} height={size} className="shrink-0 rounded-control object-cover" style={{ width: size, height: size }} />;
}
