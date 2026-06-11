import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Logo from '../assets/Logo.png'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

function OtpInput({ value, onChange }) {
  const inputs = useRef([])

  function handleChange(e, idx) {
    const val = e.target.value.replace(/\D/g, '')
    if (!val) {
      const arr = value.split('')
      arr[idx] = ''
      onChange(arr.join(''))
      return
    }
    const digit = val[val.length - 1]
    const arr = value.padEnd(6, ' ').split('')
    arr[idx] = digit
    onChange(arr.join('').trimEnd())
    if (idx < 5) inputs.current[idx + 1]?.focus()
  }

  function handleKeyDown(e, idx) {
    if (e.key === 'Backspace' && !value[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus()
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    onChange(pasted)
    inputs.current[Math.min(pasted.length, 5)]?.focus()
    e.preventDefault()
  }

  return (
    <div className="otp-row">
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={el => (inputs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="otp-input"
          value={value[idx] || ''}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  )
}

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  const setErr = text => setMessage({ text, type: 'error' })
  const setOk  = text => setMessage({ text, type: 'success' })

  async function handleSendOtp(e) {
    e?.preventDefault()
    setMessage({ text: '', type: '' })
    if (!email.trim()) return setErr('Please enter your email.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setErr('Enter a valid email address.')
    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/api/user/send-otp`, { email: email.trim() })
      setOk(res.data.message || 'OTP sent!')
      setStep(2)
      setCountdown(60)
    } catch (err) {
      setErr(err.response?.data?.message || 'Failed to send OTP. Try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleVerifyOtp(e) {
    e.preventDefault()
    setMessage({ text: '', type: '' })
    if (otp.length < 6) return setErr('Enter the full 6-digit OTP.')
    setStep(3)
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    setMessage({ text: '', type: '' })
    if (!newPassword) return setErr('Please enter a new password.')
    if (newPassword.length < 6) return setErr('Password must be at least 6 characters.')
    if (newPassword !== confirmPassword) return setErr('Passwords do not match.')
    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/api/user/reset-password`, {
        email: email.trim(), otp: otp.trim(), newPassword,
      })
      setOk(res.data.message || 'Password updated!')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.'
      setErr(msg)
      if (err.response?.status === 400) setStep(2)
    } finally {
      setLoading(false)
    }
  }

  const stepLabels = ['Enter Email', 'Verify OTP', 'New Password']

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo-row">
          <img src={Logo} alt="IET College" />
          <span>IET College</span>
        </div>
        <h1>Reset Password</h1>
        <p className="auth-subtitle">We'll help you get back in</p>

        {/* Step indicator */}
        <div className="step-indicator">
          {stepLabels.map((label, i) => (
            <div key={i} className="step-dot">
              <div className="step-circle" style={{
                background: step > i + 1 ? '#16a34a' : step === i + 1 ? 'var(--navy)' : '#e5e7eb',
                color: step >= i + 1 ? '#fff' : '#9ca3af',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '.75rem', color: step === i + 1 ? 'var(--navy)' : '#9ca3af', fontWeight: step === i + 1 ? 700 : 400 }}>
                {label}
              </span>
              {i < stepLabels.length - 1 && (
                <div className="step-line" style={{ background: step > i + 1 ? '#16a34a' : '#e5e7eb' }} />
              )}
            </div>
          ))}
        </div>

        {message.text && (
          <div className={`message-bar ${message.type === 'error' ? 'text-danger' : 'text-success'}`}>
            {message.text}
          </div>
        )}

        {step === 1 && (
          <form className="auth-form" onSubmit={handleSendOtp}>
            <div className="auth-field">
              <label htmlFor="fp-email">Email Address</label>
              <input
                id="fp-email"
                type="email"
                placeholder="Registered email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </button>
            <div className="auth-divider">
              <button type="button" className="auth-small-link" onClick={() => navigate('/login')}>
                ← Back to Login
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '.93rem' }}>
              A 6-digit OTP was sent to <strong style={{ color: 'var(--navy)' }}>{email}</strong>
            </p>
            <OtpInput value={otp} onChange={setOtp} />
            <button type="submit" className="auth-btn">Verify OTP</button>
            <div className="auth-divider">
              {countdown > 0
                ? <span>Resend OTP in {countdown}s</span>
                : <button type="button" className="auth-small-link" onClick={() => { setOtp(''); handleSendOtp() }}>Resend OTP</button>
              }
            </div>
            <div className="auth-divider">
              <button type="button" className="auth-small-link" onClick={() => { setStep(1); setMessage({ text: '', type: '' }); setOtp('') }}>
                ← Change Email
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="auth-field">
              <label htmlFor="fp-newpass">New Password</label>
              <input
                id="fp-newpass"
                type="password"
                placeholder="New password (min 6 chars)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoFocus
              />
            </div>
            <div className="auth-field">
              <label htmlFor="fp-confirm">Confirm Password</label>
              <input
                id="fp-confirm"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Updating…' : 'Update Password'}
            </button>
            <div className="auth-divider">
              <button type="button" className="auth-small-link" onClick={() => { setStep(2); setMessage({ text: '', type: '' }) }}>
                ← Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
