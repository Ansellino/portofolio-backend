# Portfolio Backend (NestJS + Prisma)

Backend API untuk portfolio pribadi menggunakan NestJS, Prisma, PostgreSQL, Supabase Storage, dan JWT auth.

## Tech Stack
- NestJS 11
- Prisma 7
- PostgreSQL
- Supabase Storage
- Swagger

## Menjalankan Local Development

1. Install dependency

npm install

2. Buat file environment

Copy isi dari .env.example ke .env, lalu isi value yang dibutuhkan.

3. Generate Prisma client

npm run prisma:generate

4. Jalankan migration (dev)

npm run prisma:migrate

5. Jalankan server

npm run start:dev

Aplikasi akan berjalan di:
- API base: http://localhost:3000/api/v1
- Swagger: http://localhost:3000/api/docs

## Script Penting
- Build: npm run build
- Production start: npm run start:prod
- Prisma generate: npm run prisma:generate
- Prisma migrate dev: npm run prisma:migrate
- Prisma migrate deploy: npm run prisma:migrate:deploy
- Seed database: npm run prisma:seed

## Deploy ke Render

Project ini sudah punya Blueprint Render di file [render.yaml](render.yaml).

Langkah cepat:
1. Push project ke GitHub.
2. Di Render, pilih New + lalu Blueprint.
3. Pilih repository ini.
4. Isi environment variables yang mandatory.

Panduan detail ada di [DEPLOY_RENDER.md](DEPLOY_RENDER.md).

## Catatan Environment Variables

Minimal env yang harus ada di production:
- DATABASE_URL
- JWT_ACCESS_SECRET
- JWT_REFRESH_SECRET
- CORS_ORIGIN
- SUPABASE_URL
- SUPABASE_SERVICE_KEY
- SMTP_USER
- SMTP_PASS
- SMTP_FROM
- ADMIN_NOTIFY_EMAIL
- ADMIN_EMAIL
- ADMIN_PASSWORD

## License

UNLICENSED
