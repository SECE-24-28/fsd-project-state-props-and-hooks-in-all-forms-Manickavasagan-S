import React, { useState, useEffect } from 'react'
import { TextField, Button, CircularProgress } from '@mui/material'
import { useNavigate, NavLink } from 'react-router-dom'
import axios from 'axios'
import './auth.css'

const API_BASE_URL = 'http://localhost:5000'

export default function SignIn() {
	const [firstname, setFirstname] = useState('')
	const [lastname, setLastname] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const navigate = useNavigate()

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => setError(''), 5000)
			return () => clearTimeout(timer)
		}
	}, [error])

	async function handleSubmit(e) {
		e.preventDefault()
		setError('')

		if (!firstname.trim() || !lastname.trim() || !email.trim() || !password.trim()) {
			setError('Please fill in all fields')
			return
		}

		setLoading(true)

		try {
			const response = await axios.post(`${API_BASE_URL}/api/user/signup`, {
				firstname: firstname.trim(),
				lastname: lastname.trim(),
				email: email.trim(),
				password: password
			})

			if (response.status === 201 || response.status === 200) {
				setFirstname('')
				setLastname('')
				setEmail('')
				setPassword('')
				navigate('/dashboard', { replace: true })
			}
		} catch (err) {
			if (err.response?.status === 400) {
				setError(err.response.data?.message || 'Email already exists')
			} else if (err.response?.status === 500) {
				setError('Server error. Please try again later')
			} else if (err.message === 'Network Error') {
				setError('Cannot connect to server. Make sure backend is running')
			} else {
				setError(err.response?.data?.message || 'Sign up failed. Please try again')
			}
			console.error('Sign up error:', err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth-page">
			<div className="auth-card">
				<h1>Create an account</h1>
				<form className="auth-form" onSubmit={handleSubmit}>
					<TextField
						label="First Name"
						value={firstname}
						onChange={e => setFirstname(e.target.value)}
						fullWidth
						margin="normal"
						disabled={loading}
					/>
					<TextField
						label="Last Name"
						value={lastname}
						onChange={e => setLastname(e.target.value)}
						fullWidth
						margin="normal"
						disabled={loading}
					/>
					<TextField
						label="Email"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						fullWidth
						margin="normal"
						disabled={loading}
					/>
					<TextField
						label="Password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						fullWidth
						margin="normal"
						disabled={loading}
					/>
					{error && <div className="auth-error">{error}</div>}
					<div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
						{loading && <CircularProgress size={24} />}
						<Button type="submit" variant="contained" disabled={loading}>
							{loading ? 'Creating account...' : 'Create account'}
						</Button>
					</div>
					<div style={{ marginTop: 12 }}>
						Already have an account? <NavLink to="/login" className="auth-small-link">Sign in</NavLink>
					</div>
				</form>
			</div>
		</div>
	)
}
