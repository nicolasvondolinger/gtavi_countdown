'use client';

import { Icon } from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/icon-paths';
import { authClient } from '@/server/auth/client';

type Provider = 'discord' | 'google' | 'apple';
const STYLE: Record<Provider, { label: string; icon: IconName; className: string }> = {
  discord: { label: 'Continue with Discord', icon: 'discord', className: 'bg-[#5865f2] text-white' },
  google: { label: 'Continue with Google', icon: 'google', className: 'bg-white text-[#1f1f1f]' },
  apple: { label: 'Continue with Apple', icon: 'apple', className: 'border border-edge bg-black text-white' },
};

export function OAuthButtons({ enabled, next }: { enabled: Record<Provider, boolean>; next: string }) {
  const providers = (Object.keys(STYLE) as Provider[]).filter(p => enabled[p]);
  if (providers.length === 0) return null;
  return (
    <>
      <div className="flex flex-col gap-2.5">
        {providers.map(p => (
          <button key={p} type="button" onClick={() => authClient.signIn.social({ provider: p, callbackURL: `/onboarding?next=${encodeURIComponent(next)}` })} className={`flex items-center justify-center gap-2.5 rounded-control px-3.5 py-3 text-[15px] font-semibold ${STYLE[p].className}`}>
            <Icon name={STYLE[p].icon} size={20} />
            {STYLE[p].label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 text-[13px] text-muted">
        <hr className="flex-1 border-line" />or with email<hr className="flex-1 border-line" />
      </div>
    </>
  );
}
