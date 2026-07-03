-- PRD §3 Modul 2 & §6.C — Master data: ICD-10, ICD-9-CM, obat_master, obat_stock_batch

CREATE TABLE icd10_diagnosis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode VARCHAR(10) NOT NULL,
    deskripsi VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX icd10_diagnosis_kode_key ON icd10_diagnosis (kode) WHERE deleted_at IS NULL;

CREATE TABLE icd9_tindakan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode VARCHAR(10) NOT NULL,
    deskripsi VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX icd9_tindakan_kode_key ON icd9_tindakan (kode) WHERE deleted_at IS NULL;

-- PRD §6.C — Tabel obat_master
CREATE TABLE obat_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kode_obat VARCHAR(50) NOT NULL,
    nama_obat VARCHAR(150) NOT NULL,
    satuan VARCHAR(30), -- e.g., Tablet, Strip, Botol, Kapsul

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX obat_master_kode_obat_key ON obat_master (kode_obat) WHERE deleted_at IS NULL;

-- PRD §6.C — Tabel obat_stock_batch (Many-to-One ke obat_master)
CREATE TABLE obat_stock_batch (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obat_id UUID NOT NULL REFERENCES obat_master (id),
    batch_number VARCHAR(50) NOT NULL,
    stock_qty INT NOT NULL DEFAULT 0,
    expired_date DATE NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT obat_stock_batch_stock_qty_chk CHECK (stock_qty >= 0),
    CONSTRAINT obat_stock_batch_batch_number_chk CHECK (batch_number ~ '^[A-Z0-9]{4,20}$')
);

CREATE INDEX obat_stock_batch_obat_id_idx ON obat_stock_batch (obat_id) WHERE deleted_at IS NULL;
-- FEFO reduction (PRD §8) always orders remaining batches by nearest expired_date first.
CREATE INDEX obat_stock_batch_fefo_idx ON obat_stock_batch (obat_id, expired_date) WHERE deleted_at IS NULL;
