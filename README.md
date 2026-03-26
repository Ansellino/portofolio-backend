# Portfolio Backend

Backend API untuk aplikasi portfolio, dibangun dengan NestJS, Prisma, PostgreSQL, Supabase Storage, dan JWT Authentication.

## Ringkasan

- Framework: NestJS 11
- ORM: Prisma 7
- Database: PostgreSQL
- API docs: Swagger
- File storage: Supabase Storage
- Prefix API: `/api/v1`

## Prasyarat

- Node.js 22+
- npm 10+
- PostgreSQL aktif

## Docker Untuk Apa?

Docker di project ini dipakai untuk mempermudah setup environment backend agar konsisten di semua mesin (local/dev server/CI).

- `docker-compose.yml`: menjalankan PostgreSQL lokal siap pakai tanpa install manual di host.
- `Dockerfile`: membungkus aplikasi NestJS ke image container untuk run/build yang konsisten (mirip environment deploy).

Manfaat utamanya:

- Onboarding lebih cepat (tinggal jalankan container DB).
- Mengurangi error beda environment antar perangkat.
- Memudahkan testing flow deploy karena image app bisa dijalankan seperti production.

### Quick Start Docker (Database)

1. Pastikan Docker Desktop aktif.
2. Jalankan PostgreSQL via Compose:

```bash
docker compose up -d postgres
```

3. Cek container aktif:

```bash
docker compose ps
```

4. Matikan saat selesai:

```bash
docker compose down
```

Catatan: service `postgres` memakai env `POSTGRES_USER`, `POSTGRES_PASSWORD`, dan `POSTGRES_DB` dari file `.env`.

## Menjalankan Secara Lokal

1. Install dependency

```bash
npm install
```

2. Buat file environment

```bash
cp .env.example .env
```

3. Generate Prisma Client

```bash
npm run prisma:generate
```

4. Jalankan migrasi database

```bash
npm run prisma:migrate
```

5. Jalankan server development

```bash
npm run start:dev
```

## Akses Lokal

- Base API: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/docs`

## Environment Variables

Referensi lengkap ada di `.env.example`.

Variabel utama yang wajib:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SMTP_USER`
- `SMTP_PASS`
- `ADMIN_NOTIFY_EMAIL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Variabel penting tambahan:

- `JWT_ACCESS_EXPIRY` (default: `15m`)
- `JWT_REFRESH_EXPIRY` (default: `7d`)
- `MAX_FILE_SIZE` (default: `5242880`)
- `PORT` (local umumnya `3000`)

## Script Penting

- `npm run start:dev` - Jalankan mode development
- `npm run build` - Build production
- `npm run start:prod` - Jalankan hasil build
- `npm run lint` - Lint source
- `npm run test` - Unit test
- `npm run test:e2e` - End-to-end test
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Prisma migrate dev
- `npm run prisma:migrate:deploy` - Prisma migrate deploy
- `npm run prisma:seed` - Seed admin/data awal

## Modul Utama API

- Auth
- Profile
- Projects
- Experiences
- Education
- Skills
- Certifications
- Blog
- Contact Messages
- Uploads
- Resume

Setiap resource memiliki endpoint public dan endpoint admin (`/admin/*`) yang dilindungi JWT guard sesuai kebutuhan.

## Deployment (Render)

Project ini sudah menyertakan blueprint Render:

- Konfigurasi service: `render.yaml`
- Panduan deploy: `DEPLOY_RENDER.md`

Langkah singkat:

1. Push repository ke GitHub.
2. Buat service dari Render Blueprint.
3. Isi semua environment variable wajib.
4. Verifikasi health endpoint dan Swagger setelah deploy.

## Troubleshooting Singkat

- Gagal start: pastikan `DATABASE_URL` valid dan database dapat diakses.
- Error migrasi: jalankan `npm run prisma:migrate` lokal lalu commit migration.
- CORS error: pastikan `CORS_ORIGIN` sama dengan domain frontend.
- Refresh auth gagal: cek `JWT_*` secret dan expiry konsisten.

## License

UNLICENSED
