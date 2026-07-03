-- PRD §6.D — Tabel kunjungan_medis (SOAP & Records)

CREATE TABLE kunjungan_medis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tanggal_kunjungan TIMESTAMPTZ NOT NULL DEFAULT now(),
    pasien_id UUID NOT NULL REFERENCES pasien (id),
    dokter_id UUID NOT NULL REFERENCES users (id),

    s_subjective TEXT NOT NULL,
    o_objective JSONB NOT NULL, -- sub-keys: tensi, suhu, nadi, berat_badan
    a_assessment_icd10 VARCHAR(10)[], -- codes referencing icd10_diagnosis.kode
    p_plan_tindakan_icd9 VARCHAR(10)[], -- codes referencing icd9_tindakan.kode
    status_alur status_alur_type NOT NULL DEFAULT 'ANTREAN_MEDIS',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,

    CONSTRAINT kunjungan_medis_s_subjective_chk CHECK (char_length(s_subjective) >= 10),
    CONSTRAINT kunjungan_medis_o_objective_shape_chk CHECK (
        o_objective ? 'tensi' AND o_objective ? 'suhu' AND o_objective ? 'nadi' AND o_objective ? 'berat_badan'
    ),
    CONSTRAINT kunjungan_medis_a_assessment_icd10_chk CHECK (
        array_length(a_assessment_icd10, 1) IS NOT NULL AND array_length(a_assessment_icd10, 1) >= 1
    )
);

CREATE INDEX kunjungan_medis_pasien_id_idx ON kunjungan_medis (pasien_id) WHERE deleted_at IS NULL;
CREATE INDEX kunjungan_medis_dokter_id_idx ON kunjungan_medis (dokter_id) WHERE deleted_at IS NULL;
CREATE INDEX kunjungan_medis_status_alur_idx ON kunjungan_medis (status_alur) WHERE deleted_at IS NULL;
-- EHR timeline (PRD §3 Modul 7) reads visits per patient in chronological order.
CREATE INDEX kunjungan_medis_pasien_tanggal_idx ON kunjungan_medis (pasien_id, tanggal_kunjungan DESC) WHERE deleted_at IS NULL;
