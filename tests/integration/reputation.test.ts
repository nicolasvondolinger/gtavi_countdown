import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { db, schema } from '@/server/db';
import { awardRep } from '@/server/reputation';

describe('awardRep', () => {
  it('pays a rule once, even if it runs twice', async () => {
    await db.insert(schema.user).values({ id: 'rep-user', name: 'rep', email: 'rep@example.invalid' });
    await db.insert(schema.profiles).values({ userId: 'rep-user', username: 'repuser' });
    expect(await awardRep(db, 'rep-user', 'edit', 10, 'revision:1')).toBe(true);
    expect(await awardRep(db, 'rep-user', 'edit', 10, 'revision:1')).toBe(false);
    const [p] = await db.select().from(schema.profiles).where(eq(schema.profiles.userId, 'rep-user'));
    expect(p!.rep).toBe(10);
  });
});
