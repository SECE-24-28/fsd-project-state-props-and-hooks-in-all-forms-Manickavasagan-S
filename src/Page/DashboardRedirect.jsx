import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSessionUser } from '../auth'

export default function DashboardRedirect() {
  const navigate = useNavigate()

  useEffect(() => {
    const user = getSessionUser()

    if (!user) {
      navigate('/login', { replace: true })
      return
    }

    const target = user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'
    navigate(target, { replace: true })
  }, [navigate])

  return null
}
