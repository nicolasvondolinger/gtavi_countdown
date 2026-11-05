import { useT } from '@/i18n/t';
import { Link } from '@/i18n/navigation';
import { DiscordInvite } from './DiscordButton';
import { Wordmark } from './Wordmark';

const COLUMNS: { title: string; links: [string, string][] }[] = [
  { title: 'Games', links: [['GTA VI', '/gta-6'], ['GTA V', '/gta-5'], ['GTA Online', '/gta-online'], ['San Andreas', '/gta-san-andreas'], ['All games', '/games']] },
  { title: 'Community', links: [['Forums', '/forums'], ['News', '/news'], ['Videos', '/videos'], ['Recent changes', '/changes']] },
  { title: 'Site', links: [['About', '/about'], ['Wiki policies', '/policies'], ['Privacy', '/privacy'], ['Terms', '/terms']] },
];

export function Footer() {
  const t = useT();
  return (
    <footer className="border-t border-line pb-24 lg:pb-0">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-4 py-10 lg:px-20 lg:pb-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
          <div className="flex max-w-[360px] flex-col gap-2.5">
            <div><Wordmark size={20} /></div>
            <p className="font-read text-sm/[1.6] text-muted">{t('A fan-run encyclopedia and forum for Grand Theft Auto. Anyone with an account can edit; edits that fail community review are rolled back.')}</p>
          </div>
          <div className="flex gap-12 lg:gap-16">
            {COLUMNS.map(c => (
              <div key={c.title} className="flex flex-col gap-2">
                <h2 className="font-ui text-sm font-semibold">{t(c.title)}</h2>
                {c.links.map(([label, href]) => (
                  <Link key={href} href={href} className="text-sm text-muted hover:text-text">{t(label)}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <DiscordInvite />
        <hr className="border-line" />
        <p className="font-read text-[13px]/[1.6] text-dim">{t('GTA Wiki is an independent fan project. It is not affiliated with, endorsed or sponsored by Rockstar Games or Take-Two Interactive. Grand Theft Auto, its logos and artwork belong to their owners and are used here for reference and commentary.')}</p>
      </div>
    </footer>
  );
}
