# Smart Health Hub

Sistem administrasi kesehatan digital modular (Sistem Informasi Klinik & Administrasi Kesehatan), diimplementasikan sesuai PRD Smart Health Hub: struktur folder berbasis fitur, skema database, aturan validasi form, dan sistem token warna (Modern Healthcare Dashboard / Clean Medical UI).

## Stack

React + TypeScript + Vite, Tailwind CSS, React Hook Form + Zod, React Router.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

## Struktur folder (PRD §5)

```
src/
├── assets/             # Global icons, images, logo
├── components/         # Shared UI: Button, Input, Card, Table, Modal, Badge
├── config/             # App constants, ICD-10 / ICD-9-CM reference mapping
├── context/             # AuthContext, NotificationContext
├── hooks/              # useFetch, useDebounce
├── layouts/            # DashboardLayout (sidebar 256px), AuthLayout
└── features/
    ├── authentication/  # LoginPage + validation
    ├── master-data/      # ObatPage, DiagnosisPage
    ├── pasien/           # PasienListPage, PasienDetail, registration form
    ├── farmasi/          # StokObatPage, ResepAntreanPage
    └── rekam-medis/      # SoapFormPage, HistoryTimeline
```

Each feature folder holds its own `components/`, `hooks/`, `pages/`, and `validation/` (Zod schemas) — isolated per domain per PRD §10.1.

## Sistem token warna (PRD §4)

Semua warna didefinisikan sekali di `src/index.css` sebagai CSS variables, lalu di-expose ke Tailwind lewat `tailwind.config.ts`:

| Token | Hex | Kegunaan |
| --- | --- | --- |
| `brand-primary` | `#0284c7` | Aksen medis utama, tombol primer |
| `brand-secondary` | `#0f172a` | Sidebar, judul, navigasi |
| `state-success` | `#16a34a` | Status aktif, stok aman |
| `state-warning` | `#ca8a04` | Stok menipis, peringatan ED |
| `state-danger` | `#dc2626` | Stok habis, error validasi, alergi obat |
| `bg-main` | `#f8fafc` | Latar belakang aplikasi |
| `bg-surface` | `#ffffff` | Card, tabel, modal |

Font: **Inter** (fallback Arial). Card: border `#e2e8f0`, `rounded-lg`, `shadow-sm`. Tabel menggunakan compact padding (`py-2 px-4`).

## Skema database

Lihat `database/README.md` dan `database/migrations/` untuk skema PostgreSQL lengkap (users, pasien, master data ICD-10/ICD-9-CM, obat_master/obat_stock_batch, kunjungan_medis, resep_detail) sesuai PRD §6.

## Aturan validasi form

Setiap form pada PRD §7 memiliki skema Zod tersendiri di folder `validation/` fitur terkait:

- `features/authentication/validation/loginSchema.ts` — Form 1: Login
- `features/pasien/validation/pasienSchema.ts` — Form 2: Registrasi Pasien
- `features/farmasi/validation/stokSchema.ts` — Form 3: Stok Masuk & Opname
- `features/rekam-medis/validation/soapSchema.ts` — Form 4: SOAP & Resep (termasuk pengecekan stok real-time dan alert kontraindikasi alergi)
