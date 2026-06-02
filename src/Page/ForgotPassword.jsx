import React, { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import './auth.css'

export default function ForgotPassword(){
	const [email,setEmail] = useState('')
	const navigate = useNavigate()

	function handleSubmit(e){
		e.preventDefault()
		// demo: go back to login
		navigate('/login')
	}

	return (
		<div className="auth-page">
			<div className="auth-card">
				<h1>Reset password</h1>
				<form className="auth-form" onSubmit={handleSubmit}>
					<TextField label="Email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth margin="normal" />
					<div style={{marginTop:12,display:'flex',justifyContent:'flex-end'}}>
						<Button type="submit" variant="contained">Send reset link</Button>
					</div>
				</form>
			</div>
		</div>
	)
}
