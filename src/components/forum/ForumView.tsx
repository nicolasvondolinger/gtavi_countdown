import { getLocale } from 'next-intl/server';
import { TimeAgo } from '@/components/ui/TimeAgo';
import { getT } from '@/i18n/server';
import { Link } from '@/i18n/navigation';
import { AdSlot } from '@/components/ui/AdSlot';
import { Avatar } from '@/components/ui/Avatar';
import { LinkButton } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Icon } from '@/components/ui/Icon';
import { Tag } from '@/components/ui/Tag';
import { MyVotes, Votes } from '@/components/ui/Votes';
import { compact } from '@/lib/format';
import { getChannels, getTags, getThreads, type Sort } from '@/server/forum/queries';
import { DiscordInvite } from '@/components/layout/DiscordButton';
import { BlurToggle, SpoilerImage, SpoilerScope } from './Spoilers';

const RULES = ['Tag spoilers, including leaked images.', 'Link the source when you post news.', 'Theories are welcome; present them as theories.', 'No piracy or leaked build downloads.'];
const SORTS: [Sort, string][] = [['hot', 'Hot'], ['new', 'New'], ['top', 'Top']];
const ROLE: Record<string, string> = { moderator: 'Moderator', reviewer: 'Reviewer', member: 'Member' };

type Params = { sort?: string; tag?: string; q?: string };

export async function ForumView({ channelSlug, params }: { channelSlug: string; params: Params }) {
  const tr = await getT();
  const [channels, tags] = await Promise.all([getChannels(await getLocale()), getTags()]);
  const channel = channels.find(c => c.slug === channelSlug);
  if (!channel) return null;
  const sort: Sort = SORTS.some(([s]) => s === params.sort) ? (params.sort as Sort) : 'hot';
  const threads = await getThreads(channel.id, { sort, tag: params.tag, q: params.q });
  const base = `/forums/${channel.slug}`;
  const link = (change: Params) => {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries({ sort, tag: params.tag, q: params.q, ...change })) if (v && !(k === 'sort' && v === 'hot')) next.set(k, v);
    const s = next.toString();
    return s ? `${base}?${s}` : base;
  };

  return (
    <Container className="mt-5 mb-16 grid gap-6 lg:mt-8 lg:mb-20 lg:grid-cols-[220px_minmax(0,1fr)_300px] lg:gap-10 xl:gap-12">
      <nav aria-label={tr('Channels')} className="hidden flex-col gap-1 lg:flex">
        <p className="mb-1.5 text-[13px] font-semibold text-muted">{tr('Channels')}</p>
        {channels.map(c => (
          <Link key={c.slug} href={`/forums/${c.slug}`} aria-current={c.slug === channel.slug ? 'page' : undefined} className={`flex items-center justify-between gap-2 rounded-control px-2.5 py-2 text-[15px] ${c.slug === channel.slug ? 'bg-raised font-semibold' : 'text-muted hover:text-text'}`}>
            {c.name}<span className="font-data text-xs font-normal text-muted">{c.count}</span>
          </Link>
        ))}
      </nav>
      <section aria-label={channel.name} className="flex min-w-0 flex-col gap-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:hidden">
          {channels.map(c => <span key={c.slug} className="shrink-0"><Tag href={`/forums/${c.slug}`} active={c.slug === channel.slug}>{c.name}</Tag></span>)}
        </div>
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[33px] lg:text-[56px]">{channel.name}</h1>
          <LinkButton href={`${base}/new`} className="shrink-0 px-3.5! py-2! lg:px-[18px]! lg:py-2.5!"><span className="hidden lg:inline">{tr('New thread')}</span><span className="lg:hidden">{tr('New')}</span></LinkButton>
        </div>
        <p className="font-read text-[15px] text-muted">{channel.description}</p>
        <div className="flex items-center justify-between gap-5 border-b border-line">
          <div className="flex gap-5">
            {SORTS.map(([s, label]) => <Link key={s} href={link({ sort: s })} aria-current={s === sort ? 'true' : undefined} className={`-mb-px border-b-2 py-1.5 text-[15px] ${s === sort ? 'border-accent font-semibold' : 'border-transparent text-muted hover:text-text'}`}>{tr(label)}</Link>)}
          </div>
          <form action={base} className="mb-1.5 hidden w-[260px] items-center gap-2 rounded-control border border-line bg-surface px-2.5 py-1.5 sm:flex">
            <Icon name="search" size={16} className="text-muted" />
            <input name="q" defaultValue={params.q} aria-label={tr('Search this forum')} placeholder={tr('Search this forum')} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-dim" />
          </form>
        </div>
        <SpoilerScope>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {tags.map(t => <Tag key={t.slug} href={link({ tag: params.tag === t.slug ? undefined : t.slug })} active={params.tag === t.slug}>{t.slug}</Tag>)}
                </div>
                <BlurToggle />
              </div>
              <MyVotes ids={{ thread: threads.map(t => t.id) }}>
                <div>
                  {threads.length === 0 && <p className="border-t border-line py-6 font-read text-[15px] text-muted">{tr('No threads here yet.')}</p>}
                  {threads.map((t, i) => (
                    <div key={t.id}>
                      {i === 2 && !params.q && !params.tag && (
                        <div className="flex items-center gap-4 border-t border-line py-4">
                          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                            <p className="text-[17px] font-semibold lg:text-[19px]">{tr('Native ad slot, set like a thread')}</p>
                            <p className="text-[13px] text-muted">{tr('Sponsored · advertiser name')}</p>
                          </div>
                          <div className="hidden h-[74px] w-[132px] shrink-0 border border-dashed border-line sm:block" />
                        </div>
                      )}
                      <article className="flex items-start gap-3.5 border-t border-line py-3.5 lg:gap-4 lg:py-4">
                        {t.pinned ? <span className="flex w-[34px] shrink-0 justify-center pt-0.5 text-leak"><Icon name="pin" size={20} /></span> : <span className="hidden lg:block"><Votes kind="thread" id={t.id} score={t.score} /></span>}
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          {t.pinned && <p className="text-[13px] font-semibold text-leak">{tr('Pinned by the moderators')}</p>}
                          <h2 className="font-ui text-[17px] leading-snug font-semibold lg:text-[19px]"><Link href={`${base}/${t.slug}`} className="hover:text-accent">{t.title}</Link></h2>
                          {t.tags.length > 0 && <div className="flex flex-wrap gap-1.5">{t.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</div>}
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted">
                            {!t.pinned && <span className="lg:hidden"><Votes kind="thread" id={t.id} score={t.score} row /></span>}
                            <Avatar avatar={t.avatar} size={20} />
                            <span className="font-semibold text-text">{t.author ?? tr('Former member')}</span>
                            {t.role && <span className="hidden lg:inline">{tr(ROLE[t.role] ?? t.role)}</span>}
                            <span><TimeAgo date={t.createdAt} /></span>
                            <span>· {compact(t.replyCount)}{' '}{tr('replies')}</span>
                          </div>
                        </div>
                        {t.image && <SpoilerImage src={`/media/${t.image}`} spoiler={t.spoiler} sizes="132px" className="h-16 w-[88px] shrink-0 lg:h-[74px] lg:w-[132px]" />}
                      </article>
                    </div>
                  ))}
                </div>
              </MyVotes>
        </SpoilerScope>
      </section>
      <aside className="hidden flex-col gap-7 lg:flex">
        <DiscordInvite stacked />
        <section aria-label={tr('Forum rules')} className="flex flex-col gap-2.5">
          <h2 className="font-ui text-[17px] font-semibold">{tr('Forum rules')}</h2>
          <ol className="flex flex-col gap-2.5">{RULES.map((r, i) => <li key={r} className="flex gap-2.5 font-read text-sm/normal text-body"><span className="font-data text-[13px] text-muted">{i + 1}</span>{tr(r)}</li>)}</ol>
        </section>
        <AdSlot size="300x250" />
      </aside>
    </Container>
  );
}
