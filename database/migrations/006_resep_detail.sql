-- PRD §6.E — Tabel resep_detail

CREATE TABLE resep_detail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kunjungan_id UUID NOT NULL REFERENCES kunjungan_medis (id),
    obat_id UUID NOT NULL REFERENCES obat_master (id),
    jumlah_minta INT NOT NULL,
    aturan_pakai VARCHAR(100) NOT NULL, -- e.g., "3x1 sesudah makan"

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT resep_detail_jumlah_minta_chk CHECK (jumlah_minta > 0)
);

CREATE INDEX resep_detail_kunjungan_id_idx ON resep_detail (kunjungan_id) WHERE deleted_at IS NULL;
CREATE INDEX resep_detail_obat_id_idx ON resep_detail (obat_id) WHERE deleted_at IS NULL;
