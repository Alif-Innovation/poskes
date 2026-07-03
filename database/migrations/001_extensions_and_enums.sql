-- Smart Health Hub — Extensions & shared enums
-- PRD §6: UUID primary keys and fixed enum vocabularies used across tables.

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- provides gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- trigram search for fast patient name lookup

CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'REGISTRASI', 'TENAGA_MEDIS', 'FARMASI');

CREATE TYPE jenis_kelamin_type AS ENUM ('L', 'P');

CREATE TYPE status_alur_type AS ENUM ('ANTREAN_MEDIS', 'PEMERIKSAAN', 'ANTREAN_FARMASI', 'SELESAI');
