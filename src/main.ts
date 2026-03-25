import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const normalizeOrigin = (value: string) => value.trim().replace(/\/$/, '');
  const corsOriginRaw = process.env.CORS_ORIGIN || 'http://localhost:5173';
  const corsOrigins = corsOriginRaw
    .split(',')
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);

  app.use(helmet());
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow non-browser clients (no Origin header), and configured web origins.
      if (!origin) {
        callback(null, true);
        return;
      }

      const incoming = normalizeOrigin(origin);
      callback(null, corsOrigins.includes(incoming));
    },
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Portfolio API')
    .setDescription('Jeremy Ansellino Gunawan Portfolio API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, config),
  );

  const port = Number(process.env.PORT) || 10000;
  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
