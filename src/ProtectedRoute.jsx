import { Navigate } from 'react-router-dom'
import { getSessionUser } from './auth'

export default function ProtectedRoute({ children, role }) {
  const user = getSessionUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} replace />
  }

  return children
}
