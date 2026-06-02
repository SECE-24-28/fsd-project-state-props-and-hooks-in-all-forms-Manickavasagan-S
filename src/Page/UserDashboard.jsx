import React from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSessionUser, getSessionUser, FEATURES } from '../auth'
import './dashboard.css'

export default function UserDashboard() {
  const navigate = useNavigate()
  const user = getSessionUser()

  function handleLogout() {
    clearSessionUser()
    navigate('/login')
  }

  return (
    <div className="page-content">
      <div className="dashboard-header-section">
        <h1>User Dashboard</h1>
        <p>Welcome, {user?.name ?? 'User'}!</p>
        <button onClick={handleLogout} className="logout-btn">Sign out</button>
      </div>

      <div className="features-grid">
        {FEATURES.map(feature => (
          <div key={feature.id} className="feature-card">
            <i className={`fa-solid ${feature.icon} fa-3x`}></i>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <button className="feature-btn">Access</button>
          </div>
        ))}
      </div>
    </div>
  )
}
