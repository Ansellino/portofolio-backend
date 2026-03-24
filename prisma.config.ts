import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

const prismaUrl =
  process.env.SESSION_URL ??
  process.env.TRANSACTION_URL ??
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL;

if (!prismaUrl) {
  throw new Error(
    'Missing SESSION_URL, TRANSACTION_URL, DIRECT_URL, or DATABASE_URL in environment variables.',
  );
}

export default defineConfig({
  schema: path.join(__dirname, 'prisma', 'schema.prisma'),
  datasource: {
    url: prismaUrl,
  },
});
