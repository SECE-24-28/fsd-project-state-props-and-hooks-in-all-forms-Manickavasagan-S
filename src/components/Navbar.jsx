import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearSessionUser, getSessionUser } from '../auth'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setUser(getSessionUser())
  }, [location])

  function handleLogout() {
    clearSessionUser()
    setUser(null)
    navigate('/login')
  }

  return (
    <nav className="main-nav">
      <div className="nav-inner">
        <div className="brand">
          <h1><i className="fa-solid fa-graduation-cap"></i></h1>
          CollegeHub
        </div>

        <section className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </section>

        {user ? (
          <button type="button" className="nav-button" onClick={handleLogout}>
            Sign out ↗
          </button>
        ) : (
          <NavLink to="/login" className="nav-button">
            Sign in ↗
          </NavLink>
        )}
      </div>
    </nav>
  )
}
