import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { LoginPage } from '@/features/authentication/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { PasienListPage } from '@/features/pasien/pages/PasienListPage'
import { PasienDetail } from '@/features/pasien/pages/PasienDetail'
import { StokObatPage } from '@/features/farmasi/pages/StokObatPage'
import { ResepAntreanPage } from '@/features/farmasi/pages/ResepAntreanPage'
import { SoapFormPage } from '@/features/rekam-medis/pages/SoapFormPage'
import { HistoryTimeline } from '@/features/rekam-medis/pages/HistoryTimeline'
import { ObatPage } from '@/features/master-data/pages/ObatPage'
import { DiagnosisPage } from '@/features/master-data/pages/DiagnosisPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pasien" element={<PasienListPage />} />
        <Route path="/pasien/:id" element={<PasienDetail />} />
        <Route path="/farmasi/stok" element={<StokObatPage />} />
        <Route path="/farmasi/resep" element={<ResepAntreanPage />} />
        <Route path="/rekam-medis/soap" element={<SoapFormPage />} />
        <Route path="/rekam-medis/riwayat" element={<HistoryTimeline />} />
        <Route path="/master-data/obat" element={<ObatPage />} />
        <Route path="/master-data/diagnosis" element={<DiagnosisPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
