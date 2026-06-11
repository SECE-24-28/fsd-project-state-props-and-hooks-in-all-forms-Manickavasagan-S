import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearSessionUser, getSessionUser } from '../auth'
import Logo from '../assets/Logo.png'

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
        <NavLink to="/" className="brand">
          <img src={Logo} alt="IET College Logo" />
          IET College
        </NavLink>

        <section className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/admission">Admissions</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {user && (
            <NavLink to="/dashboard">
              {user.role === 'admin' ? 'Admin Panel' : 'My Portal'}
            </NavLink>
          )}
        </section>

        {user ? (
          <button type="button" className="nav-button" onClick={handleLogout}>
            Sign Out ↗
          </button>
        ) : (
          <NavLink to="/login" className="nav-button">
            Student Login ↗
          </NavLink>
        )}
      </div>
    </nav>
  )
}
