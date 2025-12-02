import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// .env.local を読み込み（Next.js の規約に合わせる）
config({ path: '.env.local' });

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
