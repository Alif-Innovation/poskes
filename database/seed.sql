-- Optional reference data for local development / demos.
-- Mirrors src/config/icd10.ts and src/config/icd9.ts.

INSERT INTO icd10_diagnosis (kode, deskripsi) VALUES
    ('J00', 'Nasofaringitis akut (common cold)'),
    ('J06.9', 'Infeksi akut saluran pernapasan atas'),
    ('A09', 'Diare dan gastroenteritis'),
    ('K30', 'Dispepsia'),
    ('I10', 'Hipertensi esensial'),
    ('E11', 'Diabetes melitus tipe 2'),
    ('R50.9', 'Demam, tidak diketahui sebabnya'),
    ('M79.1', 'Mialgia'),
    ('L23.9', 'Dermatitis kontak alergi'),
    ('R51', 'Nyeri kepala')
ON CONFLICT DO NOTHING;

INSERT INTO icd9_tindakan (kode, deskripsi) VALUES
    ('89.03', 'Pemeriksaan interview dan evaluasi umum'),
    ('93.18', 'Terapi fisik lainnya'),
    ('99.29', 'Injeksi zat terapeutik lainnya'),
    ('96.6', 'Irigasi/pembersihan luka'),
    ('87.44', 'Rontgen dada rutin'),
    ('90.59', 'Pemeriksaan darah lengkap')
ON CONFLICT DO NOTHING;
