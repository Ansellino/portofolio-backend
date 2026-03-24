import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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

    super({
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
