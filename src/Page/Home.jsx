import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Home() {
  return (
    <div>
      <header className="hero">
        <h1>College Management System</h1>
        <p>
          Streamline administrative tasks, enhance student engagement, and manage
          your institution efficiently.
        </p>

        <div className="cta-group">
          <NavLink to="/dashboard" className="btn btn-primary">Get Started</NavLink>
          <NavLink to="/about" className="btn btn-outline">Learn More</NavLink>
        </div>

        <section className="feature-grid">
          <div className="feature-card">
            <i className="fa-solid fa-calendar-check fa-2x" style={{ color: 'var(--blue)' }} aria-hidden></i>
            <h3>Manage the College Activities</h3>
            <p>Pay fees, check attendance, and manage student records.</p>
          </div>

          <div className="feature-card">
            <i className="fa-solid fa-chart-line fa-2x" style={{ color: 'var(--blue)' }} aria-hidden></i>
            <h3>Student Performance Tracking</h3>
            <p>View marks, semester results, and academic progress reports.</p>
          </div>

          <div className="feature-card">
            <i className="fa-solid fa-book fa-2x" style={{ color: 'var(--blue)' }} aria-hidden></i>
            <h3>Library & Course Management</h3>
            <p>Access library books, course materials, and class schedules easily.</p>
          </div>
        </section>
      </header>
    </div>
  )
}
