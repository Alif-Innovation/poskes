# Database — Smart Health Hub

PostgreSQL schema implementing PRD §6 (Comprehensive Database Schema Rules).

## Conventions

- Every table has a UUID primary key (`gen_random_uuid()`, via the `pgcrypto` extension).
- Every table carries `created_at`, `updated_at`, `deleted_at` for soft deletes; `updated_at` is kept current by the `set_updated_at()` trigger (see `007_triggers.sql`).
- Unique constraints are scoped to `WHERE deleted_at IS NULL` so a soft-deleted row doesn't block reuse of its unique value (e.g. `username`, `nomor_rm`, `kode_obat`).
- `obat_stock_batch` is indexed on `(obat_id, expired_date)` to support the FEFO (First Expired, First Out) automated stock reduction described in PRD §8.

## Migration order

Run the files in `migrations/` in numeric order:

1. `001_extensions_and_enums.sql` — extensions + shared enum types
2. `002_users.sql`
3. `003_pasien.sql`
4. `004_master_data.sql` — ICD-10, ICD-9-CM, obat_master, obat_stock_batch
5. `005_kunjungan_medis.sql`
6. `006_resep_detail.sql`
7. `007_triggers.sql`

```bash
for f in database/migrations/*.sql; do psql "$DATABASE_URL" -f "$f"; done
psql "$DATABASE_URL" -f database/seed.sql   # optional demo reference data
```

## Entity overview

| Table | Purpose |
| --- | --- |
| `users` | RBAC accounts (`SUPER_ADMIN`, `REGISTRASI`, `TENAGA_MEDIS`, `FARMASI`) |
| `pasien` | Patient master data, `nomor_rm` formatted `RM-YYYYMMDD-XXXX` |
| `icd10_diagnosis` / `icd9_tindakan` | Diagnosis / procedure code references |
| `obat_master` / `obat_stock_batch` | Drug catalog and per-batch stock with expiry tracking |
| `kunjungan_medis` | SOAP visit records, `o_objective` stored as JSONB (`tensi`, `suhu`, `nadi`, `berat_badan`) |
| `resep_detail` | Prescription line items tied to a visit |
