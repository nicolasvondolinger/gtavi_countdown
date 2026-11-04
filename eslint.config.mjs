import next from 'eslint-config-next';

const config = [{ ignores: ['.next/**', '.claude/**', 'design/**', 'drizzle/**', 'next-env.d.ts'] }, ...next];

export default config;
