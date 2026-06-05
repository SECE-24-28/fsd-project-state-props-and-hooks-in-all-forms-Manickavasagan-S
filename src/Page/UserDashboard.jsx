import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getSessionUser } from '../auth'
import './dashboard.css'

const API_BASE_URL = 'http://localhost:5000'

export default function UserDashboard() {
  const user = getSessionUser()

  const [marks, setMarks] = useState([])
  const [loadingMarks, setLoadingMarks] = useState(true)

  const [fee, setFee] = useState(null)
  const [loadingFee, setLoadingFee] = useState(true)

  useEffect(() => {
    if (user?.email) {
      axios.get(`${API_BASE_URL}/api/mark`, { params: { email: user.email } })
        .then(res => setMarks(res.data.data || []))
        .catch(() => setMarks([]))
        .finally(() => setLoadingMarks(false))

      axios.get(`${API_BASE_URL}/api/fee`, { params: { email: user.email } })
        .then(res => setFee(res.data.data || null))
        .catch(() => setFee(null))
        .finally(() => setLoadingFee(false))
    } else {
      setLoadingMarks(false)
      setLoadingFee(false)
    }
  }, [user?.email])

  const totalScore = marks.reduce((sum, m) => sum + m.score, 0)
  const overallStatus = marks.length > 0
    ? (marks.every(m => m.status === 'pass') ? 'pass' : 'fail')
    : null

  function feeStatusInfo(status) {
    if (status === 'paid') return { label: 'Paid', cls: 'pass' }
    if (status === 'partial') return { label: 'Partially Paid', cls: 'partial' }
    return { label: 'Pending', cls: 'fail' }
  }

  return (
    <div className="page-content">
      <div className="dashboard-header-section">
        <h1>User Dashboard</h1>
        <p>Welcome, {user?.name ?? (`${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim() || 'User')}!</p>
      </div>

      {/* ── Marks Section ── */}
      <div className="marks-section">
        <h2 className="section-title"><i className="fa-solid fa-graduation-cap"></i> My Academic Marks</h2>
        {loadingMarks ? (
          <p className="marks-loading">Loading marks...</p>
        ) : marks.length === 0 ? (
          <div className="no-marks-card">
            <i className="fa-solid fa-file-lines"></i>
            <p>No marks have been added yet. Check back after your exam results are published.</p>
          </div>
        ) : (
          <div className="marks-display">
            <div className="marks-cards-grid">
              {marks.map((m, i) => (
                <div key={i} className={`mark-subject-card ${m.status}`}>
                  <div className="mark-subject-name">{m.subject}</div>
                  <div className="mark-subject-score">{m.score}<span>/100</span></div>
                  <div className={`mark-badge ${m.status}`}>
                    {m.status === 'pass' ? '✓ Pass' : '✗ Fail'}
                  </div>
                </div>
              ))}
            </div>
            <div className={`marks-overall ${overallStatus}`}>
              <span>Total: <strong>{totalScore} / {marks.length * 100}</strong></span>
              <span className={`mark-badge ${overallStatus}`}>
                Overall: {overallStatus === 'pass' ? '✓ Pass' : '✗ Fail'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ── Fee Section ── */}
      <div className="marks-section">
        <h2 className="section-title"><i className="fa-solid fa-wallet"></i> My Fee Details</h2>
        {loadingFee ? (
          <p className="marks-loading">Loading fee details...</p>
        ) : !fee ? (
          <div className="no-marks-card">
            <i className="fa-solid fa-receipt"></i>
            <p>No fee record found. Contact admin for fee details.</p>
          </div>
        ) : (
          <div className="fee-detail-card">
            <div className="fee-detail-row">
              <span className="fee-detail-label">Fee Balance</span>
              <span className="fee-detail-value">${Number(fee.balance).toFixed(2)}</span>
            </div>
            <div className="fee-detail-row">
              <span className="fee-detail-label">Payment Status</span>
              <span className={`mark-badge ${feeStatusInfo(fee.status).cls}`}>
                {feeStatusInfo(fee.status).label}
              </span>
            </div>
            <div className="fee-detail-row">
              <span className="fee-detail-label">Last Updated</span>
              <span className="fee-detail-value">
                {new Date(fee.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
