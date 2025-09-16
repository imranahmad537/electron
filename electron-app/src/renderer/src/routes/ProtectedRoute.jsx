import React from 'react'
import { Navigate } from 'react-router-dom'
// import useAuth from '../auth/AuthContext'
import useAuth from '../auth/AuthContext'


export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>
  if (!user) return <Navigate to="/" replace />
  const roles = Array.isArray(role) ? role  : [role]
  if (!roles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/userDashboardLayout': '/adminDashboardLayout' }
        replace
      />
    )
  }
  return children
}
