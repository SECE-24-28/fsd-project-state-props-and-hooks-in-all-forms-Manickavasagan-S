import React, { useState, useEffect } from 'react'
import { TextField, Button, CircularProgress } from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getSessionUser, setSessionUser } from '../auth'
import './auth.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function Login() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	useEffect(() => {
		if (getSessionUser()) {
			navigate('/dashboard', { replace: true })
		}
	}, [navigate])

	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => setError(''), 5000)
			return () => clearTimeout(timer)
		}
	}, [error])

	async function handleSubmit(e) {
		e.preventDefault()
		setError('')

		if (!email.trim() || !password.trim()) {
			setError('Please fill in all fields')
			return
		}

		setLoading(true)

		try {
			const response = await axios.get(`${API_BASE_URL}/api/user/login`, {
				params: {
					email: email.trim(),
					password: password,
				},
			})

			if (response.status === 200) {
				setSessionUser(response.data.data)
				navigate('/dashboard', { replace: true })
			}
		} catch (err) {
			if (err.response?.status === 404) {
				setError('User not found. Please check your email')
			} else if (err.response?.status === 401) {
				setError('Invalid password. Please try again')
			} else if (err.response?.status === 400) {
				setError(err.response.data?.message || 'Email and password are required')
			} else if (err.response?.status === 500) {
				setError('Server error. Please try again later')
			} else if (err.message === 'Network Error') {
				setError('Cannot connect to server. Make sure backend is running')
			} else {
				setError('Login failed. Please try again')
			}
			console.error('Login error:', err)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="auth-page">
			<div className="auth-card">
				<h1>Sign in</h1>
				<form className="auth-form" onSubmit={handleSubmit}>
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
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
						<NavLink to="/forgot" className="auth-small-link">Forgot?</NavLink>
						<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
							{loading && <CircularProgress size={24} />}
							<Button type="submit" variant="contained" disabled={loading}>
								{loading ? 'Signing in...' : 'Sign in'}
							</Button>
						</div>
					</div>
					<div style={{ marginTop: 12 }}>
						Don't have an account? <NavLink to="/signin">Create one</NavLink>
					</div>
				</form>
			</div>
		</div>
	)
}
