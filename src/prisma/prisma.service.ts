import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Prisma v7 no longer supports datasource override in PrismaClient options.
    // Normalize to DATABASE_URL so runtime always has the intended connection string.
    process.env.DATABASE_URL =
      process.env.SESSION_URL ??
      process.env.TRANSACTION_URL ??
      process.env.DIRECT_URL ??
      process.env.DATABASE_URL;

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    const adapter = new PrismaPg(pool);

    super({
      adapter,
      log:
        process.env.NODE_ENV === 'development'
          ? ['query', 'info', 'warn', 'error']
          : ['warn', 'error'],
      errorFormat:
        process.env.NODE_ENV === 'development' ? 'pretty' : 'minimal',
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
