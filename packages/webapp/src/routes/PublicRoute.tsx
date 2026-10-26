import Homepage from '@/common/pages/Homepage'
import AccountDeletedPage from '@/user/pages/AccountDeletedPage'
import AuthPage from '@/user/pages/AuthPage'
import ResetPasswordPage from '@/user/pages/ResetPasswordPage'
import React from 'react'
import { Navigate, Route, Routes } from 'react-router'

export default function PublicRoute() {
  return (
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="login" element={<AuthPage />} />
      <Route path="signup" element={<Navigate to="/login" replace />} />
      <Route path="reset-password" element={<ResetPasswordPage />} />
      <Route path="account-deleted" element={<AccountDeletedPage />} />
      <Route path="*" element={<AuthPage />} />
    </Routes>
  )
}
