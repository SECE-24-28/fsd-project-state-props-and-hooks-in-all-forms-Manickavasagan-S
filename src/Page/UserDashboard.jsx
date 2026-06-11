import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { getSessionUser } from '../auth'
import './dashboard.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export default function UserDashboard() {
  const user = getSessionUser()
  const [activeTab, setActiveTab] = useState('marks')

  const [marks, setMarks] = useState([])
  const [loadingMarks, setLoadingMarks] = useState(true)

  const [feeRecord, setFeeRecord] = useState(null)
  const [loadingFee, setLoadingFee] = useState(true)

  const [payInputs, setPayInputs] = useState({})
  const [payingFee, setPayingFee] = useState(null)
  const [payError, setPayError] = useState({})
  const [paySuccess, setPaySuccess] = useState({})

  const [complaints, setComplaints] = useState([])
  const [loadingComplaints, setLoadingComplaints] = useState(false)
  const [cTitle, setCTitle] = useState('')
  const [cDesc, setCDesc] = useState('')
  const [cCategory, setCCategory] = useState('other')
  const [cError, setCError] = useState('')
  const [cSuccess, setCSuccess] = useState('')
  const [cSubmitting, setCSubmitting] = useState(false)

  useEffect(() => {
    if (!user?.email) { setLoadingMarks(false); setLoadingFee(false); return }
    axios.get(`${API_BASE_URL}/api/mark`, { params: { email: user.email } })
      .then(res => setMarks(res.data.data || []))
      .catch(() => setMarks([]))
      .finally(() => setLoadingMarks(false))
    axios.get(`${API_BASE_URL}/api/fee`, { params: { email: user.email } })
      .then(res => setFeeRecord(res.data.data || null))
      .catch(() => setFeeRecord(null))
      .finally(() => setLoadingFee(false))
  }, [user?.email])

  useEffect(() => {
    if (activeTab === 'complaints' && user?.email) {
      setLoadingComplaints(true)
      axios.get(`${API_BASE_URL}/api/complaint`, { params: { email: user.email } })
        .then(res => setComplaints(res.data.data || []))
        .catch(() => setComplaints([]))
        .finally(() => setLoadingComplaints(false))
    }
  }, [activeTab, user?.email])

  async function handleSubmitComplaint(e) {
    e.preventDefault()
    setCError('')
    setCSuccess('')
    if (!cTitle.trim() || !cDesc.trim()) { setCError('Title and description are required'); return }
    setCSubmitting(true)
    try {
      await axios.post(`${API_BASE_URL}/api/complaint`, {
        userEmail: user.email,
        userName: user.name || `${user.firstname} ${user.lastname}`,
        title: cTitle.trim(),
        description: cDesc.trim(),
        category: cCategory,
      })
      setCSuccess('Complaint submitted successfully!')
      setCTitle('')
      setCDesc('')
      setCCategory('other')
      const res = await axios.get(`${API_BASE_URL}/api/complaint`, { params: { email: user.email } })
      setComplaints(res.data.data || [])
    } catch (err) {
      setCError(err.response?.data?.message || 'Failed to submit complaint')
    } finally {
      setCSubmitting(false)
    }
  }

  function handlePayInput(feeName, value) {
    setPayInputs(prev => ({ ...prev, [feeName]: value }))
    setPayError(prev => ({ ...prev, [feeName]: '' }))
    setPaySuccess(prev => ({ ...prev, [feeName]: '' }))
  }

  async function handlePay(feeName, remaining) {
    const amount = Number(payInputs[feeName])
    if (!amount || amount <= 0) { setPayError(prev => ({ ...prev, [feeName]: 'Enter a valid amount' })); return }
    if (amount > remaining) { setPayError(prev => ({ ...prev, [feeName]: `Cannot exceed remaining $${remaining.toFixed(2)}` })); return }
    setPayingFee(feeName)
    try {
      const res = await axios.post(`${API_BASE_URL}/api/fee/pay`, { email: user.email, feeName, amount })
      setFeeRecord(res.data.data)
      setPayInputs(prev => ({ ...prev, [feeName]: '' }))
      setPaySuccess(prev => ({ ...prev, [feeName]: `$${amount.toFixed(2)} paid successfully` }))
    } catch (err) {
      setPayError(prev => ({ ...prev, [feeName]: err.response?.data?.message || 'Payment failed' }))
    } finally {
      setPayingFee(null)
    }
  }

  const totalScore = marks.reduce((sum, m) => sum + m.score, 0)
  const overallStatus = marks.length > 0 ? (marks.every(m => m.status === 'pass') ? 'pass' : 'fail') : null

  function feeStatusInfo(status) {
    if (status === 'paid') return { label: 'Paid', cls: 'pass' }
    if (status === 'partial') return { label: 'Partially Paid', cls: 'partial' }
    return { label: 'Pending', cls: 'fail' }
  }

  function complaintStatusInfo(status) {
    if (status === 'resolved') return { label: 'Resolved', cls: 'pass' }
    if (status === 'in-progress') return { label: 'In Progress', cls: 'partial' }
    if (status === 'rejected') return { label: 'Rejected', cls: 'fail' }
    return { label: 'Pending', cls: 'pending' }
  }

  return (
    <div className="page-content">
      <div className="dashboard-header-section">
        <h1>User Dashboard</h1>
        <p>Welcome, {user?.name ?? (`${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim() || 'User')}!</p>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'marks' ? 'active' : ''}`} onClick={() => setActiveTab('marks')}>
          <i className="fa-solid fa-graduation-cap"></i> My Marks
        </button>
        <button className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => setActiveTab('fees')}>
          <i className="fa-solid fa-wallet"></i> My Fees
        </button>
        <button className={`tab-btn ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}>
          <i className="fa-solid fa-triangle-exclamation"></i> My Complaints
        </button>
      </div>

      {/* ── Marks Tab ── */}
      {activeTab === 'marks' && (
        <div className="marks-section">
          <h2 className="section-title"><i className="fa-solid fa-graduation-cap"></i> My Academic Marks</h2>
          {loadingMarks ? (
            <p className="marks-loading">Loading marks...</p>
          ) : marks.length === 0 ? (
            <div className="no-marks-card">
              <i className="fa-solid fa-file-lines"></i>
              <p>No marks added yet. Check back after results are published.</p>
            </div>
          ) : (
            <div className="marks-display">
              <div className="marks-cards-grid">
                {marks.map((m, i) => (
                  <div key={i} className={`mark-subject-card ${m.status}`}>
                    <div className="mark-subject-name">{m.subject}</div>
                    <div className="mark-subject-score">{m.score}<span>/100</span></div>
                    <div className={`mark-badge ${m.status}`}>{m.status === 'pass' ? '✓ Pass' : '✗ Fail'}</div>
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
      )}

      {/* ── Fees Tab ── */}
      {activeTab === 'fees' && (
        <div className="marks-section">
          <h2 className="section-title"><i className="fa-solid fa-wallet"></i> My Fee Details</h2>
          {loadingFee ? (
            <p className="marks-loading">Loading fee details...</p>
          ) : !feeRecord || feeRecord.fees?.length === 0 ? (
            <div className="no-marks-card">
              <i className="fa-solid fa-receipt"></i>
              <p>No fee record found. Contact admin for fee details.</p>
            </div>
          ) : (
            <>
              {(() => {
                const totalAssigned = feeRecord.fees.reduce((s, f) => s + f.totalAmount, 0)
                const totalPaid = feeRecord.fees.reduce((s, f) => s + f.amountPaid, 0)
                const pct = totalAssigned > 0 ? Math.round((totalPaid / totalAssigned) * 100) : 0
                return (
                  <div className="fee-overall-summary">
                    <div className="fee-overall-row">
                      <span>Total Fees: <strong>${totalAssigned.toFixed(2)}</strong></span>
                      <span>Paid: <strong>${totalPaid.toFixed(2)}</strong></span>
                      <span>Remaining: <strong>${(totalAssigned - totalPaid).toFixed(2)}</strong></span>
                    </div>
                    <div className="fee-progress-bar fee-progress-bar--large">
                      <div className="fee-progress-fill" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="fee-pct-label">{pct}% paid</span>
                  </div>
                )
              })()}
              <div className="user-fee-cards">
                {feeRecord.fees.map((f, i) => {
                  const remaining = f.totalAmount - f.amountPaid
                  const { label, cls } = feeStatusInfo(f.status)
                  return (
                    <div key={i} className="user-fee-card">
                      <div className="user-fee-card-header">
                        <span className="user-fee-name">{f.feeName}</span>
                        <span className={`mark-badge ${cls}`}>{label}</span>
                      </div>
                      <div className="user-fee-amounts">
                        <div className="user-fee-amt-row"><span>Total</span><strong>${f.totalAmount.toFixed(2)}</strong></div>
                        <div className="user-fee-amt-row"><span>Paid</span><strong className="paid-amt">${f.amountPaid.toFixed(2)}</strong></div>
                        <div className="user-fee-amt-row"><span>Remaining</span><strong className={remaining > 0 ? 'remaining-amt' : ''}>${remaining.toFixed(2)}</strong></div>
                      </div>
                      {f.payments.length > 0 && (
                        <div className="user-fee-history">
                          <span className="user-fee-history-title"><i className="fa-solid fa-clock-rotate-left"></i> Payment History</span>
                          {f.payments.map((p, k) => (
                            <div key={k} className="user-fee-history-entry">
                              <span>${p.amount.toFixed(2)}</span>
                              <span>{new Date(p.paidAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {f.status !== 'paid' && (
                        <div className="user-fee-pay-area">
                          <div className="user-fee-pay-row">
                            <input
                              type="number" min="0.01" step="0.01" max={remaining}
                              placeholder={`Max $${remaining.toFixed(2)}`}
                              className="form-input pay-input"
                              value={payInputs[f.feeName] || ''}
                              onChange={e => handlePayInput(f.feeName, e.target.value)}
                            />
                            <button className="pay-btn" onClick={() => handlePay(f.feeName, remaining)} disabled={payingFee === f.feeName}>
                              {payingFee === f.feeName ? 'Paying...' : 'Pay'}
                            </button>
                          </div>
                          {payError[f.feeName] && <div className="pay-error">{payError[f.feeName]}</div>}
                          {paySuccess[f.feeName] && <div className="pay-success">{paySuccess[f.feeName]}</div>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Complaints Tab ── */}
      {activeTab === 'complaints' && (
        <div className="marks-section">
          <h2 className="section-title"><i className="fa-solid fa-triangle-exclamation"></i> Raise a Complaint</h2>
          <form onSubmit={handleSubmitComplaint} className="complaint-form">
            <div className="form-group">
              <label>Category</label>
              <select className="form-input" value={cCategory} onChange={e => setCCategory(e.target.value)}>
                <option value="academic">Academic</option>
                <option value="fees">Fees</option>
                <option value="facility">Facility</option>
                <option value="staff">Staff</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input className="form-input" placeholder="Brief title of your complaint" value={cTitle} onChange={e => setCTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input complaint-textarea" placeholder="Describe your complaint in detail..." value={cDesc} onChange={e => setCDesc(e.target.value)} rows={4} />
            </div>
            {cError && <div className="auth-error" style={{ marginBottom: 12 }}>{cError}</div>}
            {cSuccess && <div className="marks-success">{cSuccess}</div>}
            <button type="submit" className="submit-btn" disabled={cSubmitting}>
              {cSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </form>

          <h2 className="section-title" style={{ marginTop: 32 }}><i className="fa-solid fa-list-check"></i> My Complaints</h2>
          {loadingComplaints ? (
            <p className="marks-loading">Loading...</p>
          ) : complaints.length === 0 ? (
            <div className="no-marks-card">
              <i className="fa-solid fa-inbox"></i>
              <p>No complaints raised yet.</p>
            </div>
          ) : (
            <div className="complaint-list">
              {complaints.map((c, i) => {
                const { label, cls } = complaintStatusInfo(c.status)
                return (
                  <div key={i} className="complaint-card">
                    <div className="complaint-card-header">
                      <div>
                        <span className="complaint-title">{c.title}</span>
                        <span className="complaint-category">{c.category}</span>
                      </div>
                      <span className={`mark-badge ${cls}`}>{label}</span>
                    </div>
                    <p className="complaint-desc">{c.description}</p>
                    {c.adminNote && (
                      <div className="complaint-admin-note">
                        <i className="fa-solid fa-comment-dots"></i> <strong>Admin:</strong> {c.adminNote}
                      </div>
                    )}
                    <span className="complaint-date">{new Date(c.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
