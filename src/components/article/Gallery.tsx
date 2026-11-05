import Image from 'next/image';

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [first, ...rest] = images;
  if (!first) return null;
  return (
    <section id="gallery" aria-label="Gallery" className="flex scroll-mt-6 flex-col gap-3">
      <h2 className="text-[26px]">Gallery</h2>
      <div className="grid grid-cols-3 gap-2">
        <div className={`relative overflow-hidden rounded-image ${rest.length ? 'col-span-2 row-span-2 aspect-[4/3]' : 'col-span-3 aspect-video'}`}>
          <Image src={`/media/${first}`} alt={title} fill sizes="(min-width: 1024px) 440px, 66vw" className="object-cover" />
        </div>
        {rest.slice(0, 2).map(src => (
          <div key={src} className="relative overflow-hidden rounded-image">
            <Image src={`/media/${src}`} alt={title} fill sizes="(min-width: 1024px) 220px, 33vw" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
