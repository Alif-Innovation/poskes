-- PRD §6 — every table must maintain updated_at automatically.

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER pasien_set_updated_at BEFORE UPDATE ON pasien
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER icd10_diagnosis_set_updated_at BEFORE UPDATE ON icd10_diagnosis
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER icd9_tindakan_set_updated_at BEFORE UPDATE ON icd9_tindakan
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER obat_master_set_updated_at BEFORE UPDATE ON obat_master
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER obat_stock_batch_set_updated_at BEFORE UPDATE ON obat_stock_batch
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER kunjungan_medis_set_updated_at BEFORE UPDATE ON kunjungan_medis
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER resep_detail_set_updated_at BEFORE UPDATE ON resep_detail
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
