export const USERNAME = /^[A-Za-z0-9_]{3,20}$/;

// Only same-site paths, so a crafted link cannot bounce people to another site after sign in.
export function safeNext(next: string | null | undefined, fallback = '/') {
  return next && next.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\') ? next : fallback;
}

export const levelFor = (rep: number) => Math.max(1, Math.floor(Math.sqrt(Math.max(rep, 0) / 6.8)));
export const repForLevel = (level: number) => Math.ceil(level * level * 6.8);

export const REP = { editAccepted: 10, editReverted: -15, reviewerThreshold: 500 } as const;

export const REP_RULES: [string, number][] = [
  ['Edit kept after review', REP.editAccepted],
  ['Map marker verified', 25],
  ['Theory upvote', 2],
  ['Edit reverted', REP.editReverted],
];
