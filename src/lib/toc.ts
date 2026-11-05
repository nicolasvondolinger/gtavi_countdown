export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export function tableOfContents(markdown: string) {
  return [...markdown.matchAll(/^## (.+)$/gm)].map(m => ({ label: m[1]!.trim(), id: slugify(m[1]!) }));
}
