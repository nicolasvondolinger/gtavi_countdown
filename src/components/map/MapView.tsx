'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState, type PointerEvent, type WheelEvent } from 'react';
import { LinkButton } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Status } from '@/components/ui/Status';
import type { Marker } from '@/server/map/queries';

// Rough outline drawn for this site. It is not the official map.
const W = 940;
const H = 850;
const LAND = 'M60 120 520 100 600 140 640 200 700 260 760 380 800 480 820 560 800 640 760 690 700 700 660 660 620 600 560 520 520 440 500 360 470 300 420 260 340 230 260 220 160 200 60 200Z';
const KEYS: [number, number, number, number][] = [[717, 726, 17, 6], [665, 747, 13, 5], [619, 763, 15, 5], [567, 774, 11, 4.5], [521, 784, 9, 4]];
const REGIONS: [string, number, number][] = [['PORT GELLHORN', 90, 150], ['MOUNT KALAGA', 300, 135], ['AMBROSIA', 540, 230], ['GRASSRIVERS', 600, 590], ['VICE CITY', 800, 610], ['LEONIDA KEYS', 560, 815]];

const LAYERS = [
  { key: 'trailer', label: 'Trailer locations', color: 'bg-official', group: 'now' },
  { key: 'leak', label: 'Leak overlay', color: 'bg-leak', group: 'now' },
  { key: 'theory', label: 'Community theories', color: 'border-2 border-theory', group: 'now' },
  { key: 'mission', label: 'Story missions', color: 'bg-text', group: 'later' },
  { key: 'collectible', label: 'Collectibles', color: 'bg-text', group: 'later' },
  { key: 'easter_egg', label: 'Easter eggs', color: 'bg-text', group: 'later' },
] as const;
const PIN: Record<string, string> = { trailer: 'fill-official', leak: 'fill-leak', theory: 'fill-bg stroke-theory', mission: 'fill-text', collectible: 'fill-text', easter_egg: 'fill-text' };

export function MapView({ markers, otherMaps, title }: { markers: Marker[]; otherMaps: { href: string; label: string }[]; title: string }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [query, setQuery] = useState('');
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const visible = useMemo(() => markers.filter(m => !hidden.has(m.layer) && m.title.toLowerCase().includes(query.trim().toLowerCase())), [markers, hidden, query]);
  const selected = markers.find(m => m.id === selectedId) ?? null;
  const count = (layer: string) => markers.filter(m => m.layer === layer).length;
  const toggle = (layer: string) =>
    setHidden(prev => {
      const next = new Set(prev);
      if (!next.delete(layer)) next.add(layer);
      return next;
    });
  const zoomBy = (factor: number) => setZoom(z => Math.min(6, Math.max(1, z * factor)));
  const onWheel = (e: WheelEvent) => zoomBy(e.deltaY < 0 ? 1.15 : 0.87);
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
  };
  const onMove = (e: PointerEvent) => {
    if (drag.current) setOffset({ x: drag.current.ox + e.clientX - drag.current.x, y: drag.current.oy + e.clientY - drag.current.y });
  };

  const layerList = (group: 'now' | 'later') =>
    LAYERS.filter(l => l.group === group).map(l => (
      <label key={l.key} className="flex cursor-pointer items-center gap-2.5 py-2">
        <input type="checkbox" checked={!hidden.has(l.key)} onChange={() => toggle(l.key)} className="size-4 accent-accent" />
        <span aria-hidden="true" className={`size-2.5 rounded-image ${l.color}`} />
        <span className="flex-1 text-[15px]">{l.label}</span>
        <span className="font-data text-xs text-muted">{count(l.key)}</span>
      </label>
    ));

  const markerCard = selected && (
    <div className="flex flex-col overflow-hidden lg:w-[280px] lg:rounded-panel lg:border lg:border-edge lg:bg-bg lg:shadow-[0_12px_32px_#00000099]">
      {selected.image && <div className="relative hidden aspect-[28/15] lg:block"><Image src={`/media/${selected.image}`} alt="" fill sizes="280px" className="object-cover" /></div>}
      <div className="flex flex-col gap-2 lg:p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-ui text-[17px] font-semibold">{selected.title}</h2>
          <button type="button" onClick={() => setSelectedId(null)} aria-label="Close"><Icon name="close" className="text-muted" /></button>
        </div>
        {selected.status && <Status kind={selected.status} source={selected.source} />}
        {selected.description && <p className="font-read text-sm/normal text-body">{selected.description}</p>}
        {selected.href && <Link href={selected.href} className="text-sm font-semibold text-accent">Open page</Link>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col-reverse lg:h-[calc(100dvh-69px)] lg:min-h-[640px] lg:flex-row">
      <aside className="flex flex-col gap-1 border-line p-4 lg:w-[320px] lg:shrink-0 lg:overflow-y-auto lg:border-r lg:p-6">
        <h1 className="text-[33px] lg:text-[41px]">{title}</h1>
        <p className="mb-3 text-sm text-muted">Community-plotted. Not the official map.</p>
        <div className="mb-2 hidden lg:block">
          <input value={query} onChange={e => setQuery(e.target.value)} aria-label="Find a place or marker" placeholder="Find a place or marker" className="w-full rounded-control border border-line bg-surface px-2.5 py-2 text-sm placeholder:text-dim" />
        </div>
        {selected && <div className="mb-3 border-b border-line pb-3 lg:hidden">{markerCard}</div>}
        <p className="text-[13px] font-semibold text-muted">Before launch</p>
        {layerList('now')}
        <p className="mt-3 text-[13px] font-semibold text-muted">From 19 November</p>
        {layerList('later')}
        <p className="font-read text-[13px]/normal text-muted">Mission, collectible and easter-egg markers get added after launch. Until then every marker comes from the trailers, the official stills or the leak thread, and says which.</p>
        <div className="mt-4 flex flex-col gap-2 lg:mt-auto lg:pt-4">
          <p className="text-[13px] font-semibold text-muted">Other maps</p>
          {otherMaps.map(m => <Link key={m.href} href={m.href} className="text-sm font-semibold text-accent hover:underline">{m.label}</Link>)}
          <LinkButton href="/forums/lore-and-easter-eggs/new" kind="secondary" className="mt-2">Suggest a marker</LinkButton>
        </div>
      </aside>
      <div onWheel={onWheel} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => (drag.current = null)} data-testid="map-canvas" className="relative h-[62dvh] flex-none cursor-grab touch-none overflow-hidden bg-[#0d1a24] select-none active:cursor-grabbing lg:h-auto lg:flex-1">
        <div className="absolute inset-0 flex items-center justify-center [container-type:size]">
        {/* The box keeps the map's aspect ratio, so marker percentages line up with the drawing. */}
        <div className="relative origin-center" style={{ width: `min(100cqw, calc(100cqh * ${W} / ${H}))`, aspectRatio: `${W} / ${H}`, transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}>
          <svg viewBox={`0 0 ${W} ${H}`} className="size-full" role="img" aria-label="Map of Leonida with markers">
            <path d={LAND} className="fill-[#1a2130] stroke-[#2b3446]" />
            <ellipse cx="595" cy="458" rx="35" ry="28" className="fill-[#0d1a24]" />
            <rect x="590" y="520" width="150" height="110" rx="40" className="fill-[#1c2a26] opacity-80" />
            {KEYS.map(([cx, cy, rx, ry]) => <ellipse key={cx} cx={cx} cy={cy} rx={rx} ry={ry} className="fill-[#1a2130] stroke-[#2b3446]" />)}
            {REGIONS.map(([name, x, y]) => <text key={name} x={x} y={y} className="fill-[#8c96a8] font-ui text-[13px] font-semibold tracking-[0.18em]">{name}</text>)}
          </svg>
          {visible.map(m => (
            <button key={m.id} type="button" onClick={() => setSelectedId(m.id)} aria-label={m.title} aria-pressed={m.id === selectedId} style={{ left: `${m.x * 100}%`, top: `${m.y * 100}%`, transform: `translate(-50%, -50%) scale(${1 / zoom})` }} className="absolute size-5">
              <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="14" height="14" rx="2" strokeWidth={m.id === selectedId ? 3 : 2} className={`${PIN[m.layer]} ${m.id === selectedId ? 'stroke-text' : m.layer === 'theory' ? '' : 'stroke-bg'}`} /></svg>
            </button>
          ))}
        </div>
        </div>
        <div className="absolute top-4 right-4 flex flex-col rounded-control border border-line bg-bg">
          <button type="button" onClick={() => zoomBy(1.4)} aria-label="Zoom in" className="p-2"><Icon name="add" size={20} /></button>
          <hr className="border-line" />
          <button type="button" onClick={() => zoomBy(0.7)} aria-label="Zoom out" className="p-2 text-center font-semibold">–</button>
        </div>
        {selected && <div className="absolute top-4 left-4 hidden lg:block">{markerCard}</div>}
      </div>
    </div>
  );
}
