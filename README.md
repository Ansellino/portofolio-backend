# Portfolio Backend (NestJS + Prisma)

Backend API untuk portfolio pribadi menggunakan NestJS, Prisma, PostgreSQL, Supabase Storage, dan JWT auth.

## Base URL dan Dokumentasi

- API base: `http://localhost:3000/api/v1`
- Swagger: `http://localhost:3000/api/docs`

Global prefix API di-set ke `api/v1`, jadi semua endpoint di bawah otomatis memakai prefix tersebut.

## Tech Stack

- NestJS 11
- Prisma 7
- PostgreSQL
- Supabase Storage
- Swagger

## Menjalankan Local Development

1. Install dependency

```bash
npm install
```

2. Buat file environment

Copy isi dari `.env.example` ke `.env`, lalu isi value yang dibutuhkan.

3. Generate Prisma client

```bash
npm run prisma:generate
```

4. Jalankan migration (dev)

```bash
npm run prisma:migrate
```

5. Jalankan server

```bash
npm run start:dev
```

## Script Penting

- Build: `npm run build`
- Production start: `npm run start:prod`
- Prisma generate: `npm run prisma:generate`
- Prisma migrate dev: `npm run prisma:migrate`
- Prisma migrate deploy: `npm run prisma:migrate:deploy`
- Seed database: `npm run prisma:seed`

## Kontrak API

### Header dan auth

- Endpoint admin/auth tertentu butuh header: `Authorization: Bearer <access_token>`.
- Session refresh menggunakan cookie httpOnly (`withCredentials` dari frontend).

### Response pattern

Sebagian endpoint mengembalikan object langsung, sebagian mengembalikan wrapper pagination (`data`, `pagination`, dll). Frontend sudah menangani keduanya.

### Auth endpoints

| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/auth/login` | No | Login admin |
| POST | `/auth/refresh` | Yes | Refresh access token |
| POST | `/auth/logout` | Yes | Logout |
| GET | `/auth/me` | Yes | Info user aktif |

### Public endpoints

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/` | Health/basic hello |
| GET | `/blog` | List blog published (supports query) |
| GET | `/blog/:slug` | Detail blog published |
| POST | `/contact` | Kirim pesan contact form |
| GET | `/projects` | List projects |
| GET | `/projects/:id` | Detail project by UUID |
| GET | `/projects/slug/:slug` | Detail project by slug |
| POST | `/projects` | Create project |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| GET | `/experiences` | List experiences |
| GET | `/experiences/:id` | Detail experience |
| POST | `/experiences` | Create experience |
| PATCH | `/experiences/:id` | Update experience |
| DELETE | `/experiences/:id` | Delete experience |
| GET | `/education` | List education |
| GET | `/education/:id` | Detail education |
| POST | `/education` | Create education |
| PATCH | `/education/:id` | Update education |
| DELETE | `/education/:id` | Delete education |
| GET | `/skills` | List skills |
| GET | `/skills/:id` | Detail skill |
| POST | `/skills` | Create skill |
| PATCH | `/skills/:id` | Update skill |
| DELETE | `/skills/:id` | Delete skill |
| GET | `/certifications` | List certifications |
| GET | `/certifications/:id` | Detail certification |
| POST | `/certifications` | Create certification |
| PATCH | `/certifications/:id` | Update certification |
| DELETE | `/certifications/:id` | Delete certification |
| GET | `/profile` | Get profile publik |
| POST | `/profile` | Create profile |
| PATCH | `/profile` | Update profile |
| DELETE | `/profile` | Delete profile |
| GET | `/resume/download` | Download resume |
| POST | `/uploads/:bucket` | Upload file ke Supabase bucket |
| DELETE | `/uploads/:bucket` | Delete file dari bucket |

### Admin endpoints (JWT required)

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/admin/blog` | List blog untuk admin |
| GET | `/admin/blog/:id` | Detail blog by UUID |
| POST | `/admin/blog` | Create blog |
| PATCH | `/admin/blog/:id` | Update blog |
| DELETE | `/admin/blog/:id` | Delete blog |
| GET | `/admin/messages` | List pesan contact |
| PATCH | `/admin/messages/:id/read` | Mark pesan as read |
| DELETE | `/admin/messages/:id` | Delete pesan |
| GET | `/admin/profile` | Get profile admin view |
| PATCH | `/admin/profile` | Update profile admin |
| GET | `/admin/projects` | List projects untuk admin |
| GET | `/admin/projects/:id` | Detail project by UUID |
| POST | `/admin/projects` | Create project |
| PATCH | `/admin/projects/:id` | Update project |
| DELETE | `/admin/projects/:id` | Delete project |
| GET | `/admin/experiences` | List experiences untuk admin |
| GET | `/admin/experiences/:id` | Detail experience by UUID |
| POST | `/admin/experiences` | Create experience |
| PATCH | `/admin/experiences/:id` | Update experience |
| DELETE | `/admin/experiences/:id` | Delete experience |
| GET | `/admin/education` | List education untuk admin |
| GET | `/admin/education/:id` | Detail education by UUID |
| POST | `/admin/education` | Create education |
| PATCH | `/admin/education/:id` | Update education |
| DELETE | `/admin/education/:id` | Delete education |
| GET | `/admin/skills` | List skills untuk admin |
| GET | `/admin/skills/:id` | Detail skill by UUID |
| POST | `/admin/skills` | Create skill |
| PATCH | `/admin/skills/:id` | Update skill |
| DELETE | `/admin/skills/:id` | Delete skill |
| GET | `/admin/certifications` | List certifications untuk admin |
| GET | `/admin/certifications/:id` | Detail certification by UUID |
| POST | `/admin/certifications` | Create certification |
| PATCH | `/admin/certifications/:id` | Update certification |
| DELETE | `/admin/certifications/:id` | Delete certification |
| GET | `/admin/resume/preview` | Resume preview data |

## Mapping Endpoint ke Consumer Frontend

Gunakan tabel ini saat mengubah route backend agar bisa cepat menemukan area frontend yang ikut terdampak.

| Endpoint backend | Consumer frontend utama |
|---|---|
| `/auth/login`, `/auth/refresh`, `/auth/logout` | [portfolio-frontend/src/stores/auth.store.ts](../portfolio-frontend/src/stores/auth.store.ts), [portfolio-frontend/src/api/axios.ts](../portfolio-frontend/src/api/axios.ts) |
| `/profile`, `/admin/profile` | [portfolio-frontend/src/api/profile.api.ts](../portfolio-frontend/src/api/profile.api.ts), [portfolio-frontend/src/pages/admin/Profile.vue](../portfolio-frontend/src/pages/admin/Profile.vue), [portfolio-frontend/src/pages/admin/ResumePreview.vue](../portfolio-frontend/src/pages/admin/ResumePreview.vue) |
| `/projects`, `/projects/slug/:slug`, `/admin/projects`, `/admin/projects/:id` | [portfolio-frontend/src/api/projects.api.ts](../portfolio-frontend/src/api/projects.api.ts), [portfolio-frontend/src/pages/public/ProjectDetail.vue](../portfolio-frontend/src/pages/public/ProjectDetail.vue), [portfolio-frontend/src/pages/admin/projects](../portfolio-frontend/src/pages/admin/projects) |
| `/blog`, `/blog/:slug`, `/admin/blog`, `/admin/blog/:id` | [portfolio-frontend/src/api/blog.api.ts](../portfolio-frontend/src/api/blog.api.ts), [portfolio-frontend/src/pages/public/Blog.vue](../portfolio-frontend/src/pages/public/Blog.vue), [portfolio-frontend/src/pages/public/BlogPost.vue](../portfolio-frontend/src/pages/public/BlogPost.vue), [portfolio-frontend/src/pages/admin/blog](../portfolio-frontend/src/pages/admin/blog) |
| `/experiences`, `/admin/experiences`, `/admin/experiences/:id` | [portfolio-frontend/src/api/experience.api.ts](../portfolio-frontend/src/api/experience.api.ts), [portfolio-frontend/src/pages/public/Experience.vue](../portfolio-frontend/src/pages/public/Experience.vue), [portfolio-frontend/src/pages/admin/experiences](../portfolio-frontend/src/pages/admin/experiences) |
| `/education`, `/admin/education`, `/admin/education/:id` | [portfolio-frontend/src/api/education.api.ts](../portfolio-frontend/src/api/education.api.ts), [portfolio-frontend/src/pages/public/About.vue](../portfolio-frontend/src/pages/public/About.vue), [portfolio-frontend/src/pages/admin/education](../portfolio-frontend/src/pages/admin/education) |
| `/skills`, `/admin/skills`, `/admin/skills/:id` | [portfolio-frontend/src/api/skills.api.ts](../portfolio-frontend/src/api/skills.api.ts), [portfolio-frontend/src/pages/public/About.vue](../portfolio-frontend/src/pages/public/About.vue), [portfolio-frontend/src/pages/admin/skills](../portfolio-frontend/src/pages/admin/skills) |
| `/certifications`, `/admin/certifications`, `/admin/certifications/:id` | [portfolio-frontend/src/api/certification.api.ts](../portfolio-frontend/src/api/certification.api.ts), [portfolio-frontend/src/pages/public/Certifications.vue](../portfolio-frontend/src/pages/public/Certifications.vue), [portfolio-frontend/src/pages/admin/certifications](../portfolio-frontend/src/pages/admin/certifications) |
| `/contact` | [portfolio-frontend/src/api/contact.api.ts](../portfolio-frontend/src/api/contact.api.ts) |
| `/admin/messages` | [portfolio-frontend/src/pages/admin/Messages.vue](../portfolio-frontend/src/pages/admin/Messages.vue), [portfolio-frontend/src/layouts/AdminLayout.vue](../portfolio-frontend/src/layouts/AdminLayout.vue), [portfolio-frontend/src/pages/admin/Dashboard.vue](../portfolio-frontend/src/pages/admin/Dashboard.vue) |

### Checklist Saat Ubah Route Backend

1. Update controller dan service backend.
2. Update API client frontend pada folder [portfolio-frontend/src/api](../portfolio-frontend/src/api).
3. Update direct axios calls di halaman admin/public jika ada.
4. Update fallback mock di [portfolio-frontend/src/mocks/mockBackend.ts](../portfolio-frontend/src/mocks/mockBackend.ts).
5. Jalankan test manual login, list, detail, create, update, delete untuk resource yang diubah.

## Deploy ke Render

Project ini sudah punya Blueprint Render di file [render.yaml](render.yaml).

Langkah cepat:

1. Push project ke GitHub.
2. Di Render, pilih New + lalu Blueprint.
3. Pilih repository ini.
4. Isi environment variables yang mandatory.

Panduan detail ada di [DEPLOY_RENDER.md](DEPLOY_RENDER.md).

## Environment Variables

Minimal env yang harus ada di production:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `CORS_ORIGIN`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_FROM`
- `ADMIN_NOTIFY_EMAIL`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Lihat contoh lengkap di `.env.example`.

## License

UNLICENSED
