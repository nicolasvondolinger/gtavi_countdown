import Image from 'next/image';
import Link from 'next/link';
import { Meta } from '@/components/ui/Meta';
import { Status } from '@/components/ui/Status';
import { Tag } from '@/components/ui/Tag';
import { timeAgo } from '@/lib/format';
import type { FeedItem } from '@/server/wiki/queries';

export function NewsRow({ item }: { item: FeedItem }) {
  if (item.sponsored) {
    return (
      <div className="flex gap-4 border-t border-line py-3.5">
        <div className="hidden h-[72px] w-32 shrink-0 border border-dashed border-line sm:block" />
        <div className="flex flex-col gap-1.5">
          <p className="text-[17px] font-semibold">{item.title}</p>
          <Meta><span>Sponsored</span><span>{item.source}</span></Meta>
        </div>
      </div>
    );
  }
  return (
    <article className="flex gap-3 border-t border-line py-3.5 lg:gap-4">
      {item.image && (
        <div className="relative h-[54px] w-24 shrink-0 overflow-hidden rounded-image lg:h-[72px] lg:w-32">
          <Image src={`/media/${item.image}`} alt="" fill sizes="128px" className="object-cover" />
        </div>
      )}
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3 className="font-ui text-base leading-snug font-semibold lg:text-[17px]">
          <Link href={`/news/${item.slug}`} className="hover:text-accent">{item.title}</Link>
        </h3>
        <Meta>
          {item.game && <Tag>{item.game}</Tag>}
          {item.status && <Status kind={item.status} />}
          <span>{item.source}</span>
          <span>{timeAgo(item.publishedAt)}</span>
        </Meta>
      </div>
    </article>
  );
}
