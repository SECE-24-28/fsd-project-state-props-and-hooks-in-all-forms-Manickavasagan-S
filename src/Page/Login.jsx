import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getSessionUser, setSessionUser } from '../auth'
import Logo from '../assets/Logo.png'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (getSessionUser()) navigate('/dashboard', { replace: true })
  }, [navigate])

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 5000)
      return () => clearTimeout(t)
    }
  }, [error])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields'); return }
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE_URL}/api/user/login`, {
        params: { email: email.trim(), password },
      })
      if (res.status === 200) {
        setSessionUser(res.data.data)
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      if (err.response?.status === 404) setError('User not found. Please check your email.')
      else if (err.response?.status === 401) setError('Invalid password. Please try again.')
      else if (err.response?.status === 400) setError(err.response.data?.message || 'Email and password are required.')
      else if (err.message === 'Network Error') setError('Cannot connect to server. Make sure backend is running.')
      else setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-row">
          <img src={Logo} alt="IET College" />
          <span>IET College</span>
        </div>
        <h1>Student Sign In</h1>
        <p className="auth-subtitle">Access your academic portal</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
            />
          </div>
          <div className="auth-field">
            <label htmlFor="login-pass">Password</label>
            <input
              id="login-pass"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <div className="auth-row">
            <NavLink to="/forgot" className="auth-small-link">Forgot password?</NavLink>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 8 }} />Signing in…</>
              : <><i className="fa-solid fa-right-to-bracket" style={{ marginRight: 8 }} />Sign In</>
            }
          </button>

          <div className="auth-divider">
            Don't have an account?{' '}
            <NavLink to="/signin" className="auth-small-link">Create one</NavLink>
          </div>
        </form>
      </div>
    </div>
  )
}
