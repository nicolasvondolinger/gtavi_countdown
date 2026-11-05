// Bootstraps the first moderator: npm run admin:role -- <username> <member|reviewer|moderator>
import 'dotenv/config';
import { setRole } from '@/server/moderation/service';
import { sql } from './index';

const [username, role] = process.argv.slice(2);
if (!username || (role !== 'member' && role !== 'reviewer' && role !== 'moderator')) {
  console.error('Usage: npm run admin:role -- <username> <member|reviewer|moderator>');
  process.exit(1);
}
const done = await setRole(username, role, null);
console.log(done ? `${username} is now ${role}` : `No member named ${username}`);
await sql.end();
if (!done) process.exit(1);
