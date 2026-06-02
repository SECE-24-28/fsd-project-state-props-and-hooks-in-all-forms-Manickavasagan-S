import React, { useState, useEffect } from 'react'
import { TextField, Button } from '@mui/material'
import { useNavigate, NavLink } from 'react-router-dom'
import { createUser, getSessionUser, setSessionUser } from '../auth'
import './auth.css'

export default function SignIn() {
	const [name, setName] = useState('')
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
	}, [name, email, password])

	function handleSubmit(e) {
		e.preventDefault()

		if (!name.trim() || !email.trim() || !password) {
			setError('Please fill in all fields')
			return
		}

		const newUser = createUser({ name: name.trim(), email: email.trim(), password })
		if (!newUser) {
			setError('An account with this email already exists')
			return
		}

		setSessionUser(newUser)
		navigate('/dashboard')
	}

	return (
		<div className="auth-page">
			<div className="auth-card">
				<h1>Create an account</h1>
				<form className="auth-form" onSubmit={handleSubmit}>
					<TextField label="Full name" value={name} onChange={e => setName(e.target.value)} fullWidth margin="normal" />
					<TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth margin="normal" />
					<TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth margin="normal" />
					{error && <div className="auth-error">{error}</div>}
					<div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
						<Button type="submit" variant="contained">Create account</Button>
					</div>
					<div style={{ marginTop: 12 }}>
						Already have an account? <NavLink to="/login" className="auth-small-link">Sign in</NavLink>
					</div>
				</form>
			</div>
		</div>
	)
}
