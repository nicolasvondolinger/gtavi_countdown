import { iconPaths, type IconName } from './icon-paths';

export function Icon({ name, size = 18, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={iconPaths[name]} />
    </svg>
  );
}
