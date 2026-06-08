import React, { useState, useRef, useEffect } from 'react'
import { TextField, Button, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './auth.css'

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ── OTP box component (6 individual digit inputs) ────────────────────────────
function OtpInput({ value, onChange }) {
  const inputs = useRef([])

  function handleChange(e, idx) {
    const val = e.target.value.replace(/\D/g, '') // digits only
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
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', margin: '12px 0' }}>
      {Array.from({ length: 6 }).map((_, idx) => (
        <input
          key={idx}
          ref={el => (inputs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[idx] || ''}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          style={{
            width: 46,
            height: 54,
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 700,
            border: '2px solid #d1d5db',
            borderRadius: 10,
            outline: 'none',
            color: '#101935',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => (e.target.style.borderColor = '#0f2fd5')}
          onBlur={e => (e.target.style.borderColor = '#d1d5db')}
        />
      ))}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ForgotPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)          // 1=email, 2=otp, 3=new password
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Resend OTP countdown
  const [countdown, setCountdown] = useState(0)
  useEffect(() => {
    if (countdown <= 0) return
    const t = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [countdown])

  function setErr(text) { setMessage({ text, type: 'error' }) }
  function setOk(text)  { setMessage({ text, type: 'success' }) }

  // ── Step 1: send OTP ────────────────────────────────────────────────────────
  async function handleSendOtp(e) {
    e?.preventDefault()
    setMessage({ text: '', type: '' })

    if (!email.trim()) return setErr('Please enter your email.')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) return setErr('Enter a valid email address.')

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

  // ── Step 2: verify OTP ──────────────────────────────────────────────────────
  function handleVerifyOtp(e) {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    if (otp.length < 6) return setErr('Enter the full 6-digit OTP.')
    setStep(3)
  }

  // ── Step 3: reset password ──────────────────────────────────────────────────
  async function handleResetPassword(e) {
    e.preventDefault()
    setMessage({ text: '', type: '' })

    if (!newPassword) return setErr('Please enter a new password.')
    if (newPassword.length < 6) return setErr('Password must be at least 6 characters.')
    if (newPassword !== confirmPassword) return setErr('Passwords do not match.')

    setLoading(true)
    try {
      const res = await axios.post(`${BASE_URL}/api/user/reset-password`, {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
      })
      setOk(res.data.message || 'Password updated!')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong.'
      setErr(msg)
      // If OTP expired/invalid, go back to OTP step
      if (err.response?.status === 400) setStep(2)
    } finally {
      setLoading(false)
    }
  }

  const stepLabels = ['Enter Email', 'Verify OTP', 'New Password']

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Reset Password</h1>

        {/* Step indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem',
                fontWeight: 700,
                background: step > i + 1 ? '#16a34a' : step === i + 1 ? '#0f2fd5' : '#e5e7eb',
                color: step >= i + 1 ? '#fff' : '#9ca3af',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{ fontSize: '0.78rem', color: step === i + 1 ? '#0f2fd5' : '#9ca3af', fontWeight: step === i + 1 ? 700 : 400 }}>
                {label}
              </span>
              {i < stepLabels.length - 1 && <div style={{ width: 20, height: 2, background: step > i + 1 ? '#16a34a' : '#e5e7eb' }} />}
            </div>
          ))}
        </div>

        {/* Message bar */}
        {message.text && (
          <p className={`message-bar ${message.type === 'error' ? 'text-danger' : 'text-success'}`}>
            {message.text}
          </p>
        )}

        {/* ── STEP 1: Email ── */}
        {step === 1 && (
          <form className="auth-form" onSubmit={handleSendOtp}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              autoFocus
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="auth-button"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </Button>
            <div style={{ textAlign: 'center' }}>
              <button type="button" className="auth-small-link" onClick={() => navigate('/login')}>
                Back to Login
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 2: OTP ── */}
        {step === 2 && (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <p style={{ textAlign: 'center', color: '#4b5563', margin: '0 0 4px' }}>
              A 6-digit OTP was sent to<br />
              <strong style={{ color: '#101935' }}>{email}</strong>
            </p>
            <OtpInput value={otp} onChange={setOtp} />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="auth-button"
            >
              Verify OTP
            </Button>
            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#6b7280' }}>
              {countdown > 0 ? (
                <span>Resend OTP in {countdown}s</span>
              ) : (
                <button
                  type="button"
                  className="auth-small-link"
                  onClick={() => { setOtp(''); handleSendOtp(); }}
                >
                  Resend OTP
                </button>
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <button type="button" className="auth-small-link" onClick={() => { setStep(1); setMessage({ text: '', type: '' }); setOtp('') }}>
                ← Change Email
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: New Password ── */}
        {step === 3 && (
          <form className="auth-form" onSubmit={handleResetPassword}>
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              className="auth-button"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {loading ? 'Updating…' : 'Update Password'}
            </Button>
            <div style={{ textAlign: 'center' }}>
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
