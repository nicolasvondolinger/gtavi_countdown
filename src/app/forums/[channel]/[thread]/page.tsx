import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CommentNode } from '@/components/discussion/CommentNode';
import { ReplyForm } from '@/components/forum/ReplyForm';
import { SpoilerImage, SpoilerScope } from '@/components/forum/Spoilers';
import { AdSlot } from '@/components/ui/AdSlot';
import { Avatar } from '@/components/ui/Avatar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Container } from '@/components/ui/Container';
import { Status } from '@/components/ui/Status';
import { Tag } from '@/components/ui/Tag';
import { MyVotes, Votes } from '@/components/ui/Votes';
import { timeAgo } from '@/lib/format';
import { getThread } from '@/server/forum/queries';
import type { Discussion } from '@/server/wiki/community';

export const revalidate = 30;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ channel: string; thread: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { channel, thread } = await params;
  const row = await getThread(channel, thread);
  return row ? { title: row.thread.title, description: row.thread.body.slice(0, 160) } : {};
}

const ids = (list: Discussion[]): number[] => list.flatMap(p => [p.id, ...ids(p.replies)]);

export default async function ThreadPage({ params }: Props) {
  const { channel: channelSlug, thread: slug } = await params;
  const row = await getThread(channelSlug, slug);
  if (!row) notFound();
  const { thread, channel, tags, related, replies } = row;
  const path = `/forums/${channel.slug}/${thread.slug}`;
  const isLeak = tags.includes('map-leak');

  return (
    <SpoilerScope>
        <MyVotes ids={{ thread: [thread.id], post: ids(replies) }}>
          <Container className="mt-5 mb-16 grid gap-8 lg:mt-7 lg:mb-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12">
            <div className="flex min-w-0 flex-col gap-5">
              <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Forums', href: '/forums' }, { label: channel.name, href: `/forums/${channel.slug}` }, { label: thread.title }]} />
              <article className="flex gap-5">
                <span className="hidden lg:block"><Votes kind="thread" id={thread.id} score={thread.score} /></span>
                <div className="flex min-w-0 flex-1 flex-col gap-3.5">
                  <h1 className="text-[33px] lg:text-[41px]">{thread.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
                    <Avatar avatar={row.avatar} size={24} />
                    <span className="text-sm font-semibold text-text">{row.author ?? 'Former member'}</span>
                    <span>{timeAgo(thread.createdAt)}</span>
                    {tags.map(t => <Tag key={t} href={`/forums/${channel.slug}?tag=${t}`}>{t}</Tag>)}
                  </div>
                  {isLeak && <Status kind="leak" source="Nothing in this thread is confirmed by Rockstar" />}
                  <p className="font-read text-base/[1.6] whitespace-pre-wrap text-body lg:text-[17px]">{thread.body}</p>
                  {thread.image && <SpoilerImage src={`/media/${thread.image}`} spoiler={thread.spoiler} sizes="(min-width: 1024px) 50vw, 100vw" label="Spoiler: tagged image" className="aspect-[13/5]" />}
                  <div className="lg:hidden"><Votes kind="thread" id={thread.id} score={thread.score} row /></div>
                </div>
              </article>
              <hr className="border-line" />
              <ReplyForm threadId={thread.id} path={path} />
              <h2 className="font-ui text-[17px] font-semibold">{thread.replyCount.toLocaleString('en')} replies</h2>
              <div className="flex flex-col gap-5">
                {replies.map(p => <CommentNode key={p.id} node={p} kind="post" />)}
              </div>
            </div>
            <aside className="flex flex-col gap-7">
              <section aria-label="About this thread" className="flex flex-col gap-1">
                <h2 className="mb-1 font-ui text-[17px] font-semibold">About this thread</h2>
                <p className="flex justify-between border-t border-line py-1.5 text-sm"><span className="text-muted">Replies</span><span className="font-data text-[13px]">{thread.replyCount.toLocaleString('en')}</span></p>
                <p className="flex justify-between border-t border-line py-1.5 text-sm"><span className="text-muted">Started</span><span className="font-data text-[13px]">{timeAgo(thread.createdAt)}</span></p>
              </section>
              {related.length > 0 && (
                <section aria-label="Wiki pages" className="flex flex-col gap-3">
                  <h2 className="font-ui text-[17px] font-semibold">Wiki pages</h2>
                  {related.map(p => (
                    <Link key={p.slug} href={`/${p.gameSlug}/${p.section}/${p.slug}`} className="group flex items-center gap-2.5">
                      {p.image && <span className="relative h-9 w-14 shrink-0 overflow-hidden rounded-image"><Image src={`/media/${p.image}`} alt="" fill sizes="56px" className="object-cover" /></span>}
                      <span className="text-[15px] font-semibold group-hover:text-accent">{p.title}</span>
                    </Link>
                  ))}
                </section>
              )}
              <div className="hidden lg:block"><AdSlot size="300x600" /></div>
            </aside>
          </Container>
        </MyVotes>
    </SpoilerScope>
  );
}
