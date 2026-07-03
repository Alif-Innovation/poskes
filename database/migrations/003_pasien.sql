-- PRD §6.B — Tabel pasien

CREATE TABLE pasien (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nomor_rm VARCHAR(20) NOT NULL, -- Format: RM-YYYYMMDD-XXXX
    nama_lengkap VARCHAR(150) NOT NULL,
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin jenis_kelamin_type NOT NULL,
    kontak VARCHAR(15),
    alamat TEXT,
    riwayat_alergi TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT pasien_nomor_rm_format_chk CHECK (nomor_rm ~ '^RM-\d{8}-\d{4}$'),
    CONSTRAINT pasien_tanggal_lahir_chk CHECK (tanggal_lahir <= CURRENT_DATE),
    CONSTRAINT pasien_kontak_chk CHECK (kontak IS NULL OR kontak ~ '^\d{9,15}$')
);

CREATE UNIQUE INDEX pasien_nomor_rm_key ON pasien (nomor_rm) WHERE deleted_at IS NULL;
CREATE INDEX pasien_nama_lengkap_idx ON pasien USING gin (nama_lengkap gin_trgm_ops);
