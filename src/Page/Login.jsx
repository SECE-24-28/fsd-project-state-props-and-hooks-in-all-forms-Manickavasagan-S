import React, { useState, useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import { getSessionUser, setSessionUser, validateLogin, ADMIN_CREDENTIALS } from '../auth'
import './auth.css'

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const navigate = useNavigate()

	useEffect(() => {
		if (getSessionUser()) {
			navigate('/dashboard', { replace: true })
		}
	}, [navigate])

	useEffect(() => {
		if (error) {
			setError('')
		}
	}, [email, password])

	function handleSubmit(e) {
		e.preventDefault()
		const user = validateLogin(email.trim(), password)

		if (!user) {
			setError('Invalid email or password')
			return
		}

		setSessionUser(user)
		navigate('/dashboard')
	}

	function autoFillAdmin() {
		setEmail(ADMIN_CREDENTIALS.email)
		setPassword(ADMIN_CREDENTIALS.password)
	}

	return (
		<div className="auth-page">
			<div className="auth-card">
				<h1>Sign in</h1>
				<form className="auth-form" onSubmit={handleSubmit}>
					<TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" />
					<TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" />
					{error && <div className="auth-error">{error}</div>}
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
						<NavLink to="/forgot" className="auth-small-link">Forgot?</NavLink>
						<Button type="submit" variant="contained">Sign in</Button>
					</div>
					<div style={{ marginTop: 12 }}>
						Don't have an account? <NavLink to="/signin">Create one</NavLink>
					</div>
				</form>
				
				<div className="demo-credentials">
					<p className="demo-title">Demo Admin Account</p>
					<div className="credential-item">
						<strong>Email:</strong> <span>{ADMIN_CREDENTIALS.email}</span>
					</div>
					<div className="credential-item">
						<strong>Password:</strong> <span>{ADMIN_CREDENTIALS.password}</span>
					</div>
					<button type="button" className="demo-button" onClick={autoFillAdmin}>
						Use Admin Account
					</button>
				</div>
			</div>
		</div>
	)
}
