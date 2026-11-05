import { eq, sql } from 'drizzle-orm';
import { schema, type Db } from '@/server/db';

type Tx = Parameters<Parameters<Db['transaction']>[0]>[0] | Db;

// The unique key on kind and ref means a rule can never pay out twice.
export async function awardRep(tx: Tx, userId: string, kind: string, amount: number, ref: string) {
  const inserted = await tx.insert(schema.reputationEvents).values({ userId, kind, amount, ref }).onConflictDoNothing().returning({ id: schema.reputationEvents.id });
  if (inserted.length === 0) return false;
  await tx
    .update(schema.profiles)
    .set({ rep: sql`${schema.profiles.rep} + ${amount}` })
    .where(eq(schema.profiles.userId, userId));
  return true;
}
