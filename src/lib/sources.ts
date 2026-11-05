// Only these hosts count as official. Picking "official" with any other link goes to review.
const OFFICIAL_HOSTS = ['rockstargames.com', 'take2games.com', 'playstation.com', 'xbox.com', 'esrb.org'];

export function isOfficialSource(source: string | null | undefined) {
  if (!source) return false;
  try {
    const url = new URL(source);
    if (url.protocol !== 'https:') return false;
    return OFFICIAL_HOSTS.some(host => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}
