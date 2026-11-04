import { expect, it } from 'vitest';
import { schema } from '@/server/db';

it('exposes the schema', () => {
  expect(schema.games).toBeDefined();
});
