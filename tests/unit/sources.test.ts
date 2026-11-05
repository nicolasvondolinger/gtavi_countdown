import { describe, expect, it } from 'vitest';
import { isOfficialSource } from '@/lib/sources';

describe('isOfficialSource', () => {
  it.each(['https://www.rockstargames.com/newswire/article/1', 'https://rockstargames.com/VI', 'https://blog.playstation.com/x'])('accepts %s', s => expect(isOfficialSource(s)).toBe(true));
  it.each(['Rockstar Newswire', 'http://www.rockstargames.com/', 'https://rockstargames.com.evil.example/', 'https://evilrockstargames.com/', 'https://reddit.com/r/GTA6', '', null])('rejects %s', s => expect(isOfficialSource(s)).toBe(false));
});
