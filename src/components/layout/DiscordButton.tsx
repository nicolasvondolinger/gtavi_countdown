import { Icon } from '@/components/ui/Icon';
import { useT } from '@/i18n/t';
import { DISCORD_URL } from '@/lib/site';

const OPEN = { target: '_blank', rel: 'noopener noreferrer' } as const;

// Icon alone on narrow desktops, where the header has no room for the word.
export function DiscordLink() {
  const t = useT();
  return (
    <a href={DISCORD_URL} {...OPEN} aria-label={t('Join our Discord')} title={t('Join our Discord')} className="flex shrink-0 items-center gap-2 rounded-control text-muted hover:text-text 2xl:border 2xl:border-edge 2xl:px-3 2xl:py-1.5 2xl:text-text 2xl:hover:border-control">
      <Icon name="discord" size={22} />
      <span className="hidden text-[15px] font-semibold whitespace-nowrap 2xl:inline">Discord</span>
    </a>
  );
}

export function DiscordInvite({ stacked }: { stacked?: boolean }) {
  const t = useT();
  return (
    <section aria-label="Discord" className={`flex flex-col gap-3 rounded-panel border border-line bg-surface p-4 ${stacked ? '' : 'sm:flex-row sm:items-center sm:justify-between'}`}>
      <div className="flex flex-col gap-1">
        <h2 className="font-ui text-[17px] font-semibold">{t('Talk GTA on Discord')}</h2>
        <p className="font-read text-sm text-muted">{t('Trailer watch parties, launch-week chat and a place to ask the editors anything.')}</p>
      </div>
      <a href={DISCORD_URL} {...OPEN} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-control bg-[#5865f2] px-[18px] py-2.5 text-[15px] font-semibold text-white hover:bg-[#4752c4]">
        <Icon name="discord" size={20} />
        {t('Join our Discord')}
      </a>
    </section>
  );
}
