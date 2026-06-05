import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { clearSessionUser, getSessionUser } from '../auth'
import './dashboard.css'

const API_BASE_URL = 'http://localhost:5000'
const SUBJECTS = ['Mathematics', 'Science', 'English', 'History']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const user = getSessionUser()
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('users')

  // Marks state
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [subjectScores, setSubjectScores] = useState({ Mathematics: '', Science: '', English: '', History: '' })
  const [marksError, setMarksError] = useState('')
  const [marksSuccess, setMarksSuccess] = useState('')
  const [marksSaving, setMarksSaving] = useState(false)
  const [marksRecords, setMarksRecords] = useState([])
  const [loadingRecords, setLoadingRecords] = useState(false)

  // Fee state
  const [feeStudent, setFeeStudent] = useState(null)
  const [feeBalance, setFeeBalance] = useState('')
  const [feeStatus, setFeeStatus] = useState('pending')
  const [feeSaving, setFeeSaving] = useState(false)
  const [feeError, setFeeError] = useState('')
  const [feeSuccess, setFeeSuccess] = useState('')
  const [allFeeRecords, setAllFeeRecords] = useState([])

  // Load users from DB
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/user/all`)
      .then(res => setUsers(res.data.data || []))
      .catch(() => setUsers([]))
  }, [])

  // Load all fee records when fee tab is opened
  useEffect(() => {
    if (activeTab === 'fees') {
      axios.get(`${API_BASE_URL}/api/fee/all`)
        .then(res => setAllFeeRecords(res.data.data || []))
        .catch(() => setAllFeeRecords([]))
    }
  }, [activeTab])

  const total = SUBJECTS.reduce((sum, s) => {
    const val = Number(subjectScores[s])
    return sum + (subjectScores[s] !== '' && !isNaN(val) ? val : 0)
  }, 0)
  const filledCount = SUBJECTS.filter(s => subjectScores[s] !== '').length

  function handleLogout() {
    clearSessionUser()
    navigate('/login')
  }

  function handleStatusChange(email, status) {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, status } : u))
  }

  function handleDeleteUser(email) {
    if (window.confirm(`Delete user ${email}?`)) {
      setUsers(prev => prev.filter(u => u.email !== email))
    }
  }

  function handleScoreChange(subject, value) {
    if (value === '') {
      setSubjectScores(prev => ({ ...prev, [subject]: '' }))
      setMarksError('')
      return
    }
    const num = Math.min(100, Math.max(0, Number(value)))
    setSubjectScores(prev => ({ ...prev, [subject]: num }))
    setMarksError('')
  }

  async function handleStudentSelect(email) {
    const student = users.find(u => u.email === email)
    setSelectedStudent(student || null)
    setSubjectScores({ Mathematics: '', Science: '', English: '', History: '' })
    setMarksError('')
    setMarksSuccess('')

    if (email) {
      setLoadingRecords(true)
      try {
        const res = await axios.get(`${API_BASE_URL}/api/mark`, { params: { email } })
        setMarksRecords(res.data.data || [])
        const existing = {}
        res.data.data.forEach(m => { existing[m.subject] = m.score })
        setSubjectScores(prev => ({ ...prev, ...existing }))
      } catch {
        setMarksRecords([])
      } finally {
        setLoadingRecords(false)
      }
    } else {
      setMarksRecords([])
    }
  }

  async function handleSaveMarks(e) {
    e.preventDefault()
    setMarksError('')
    setMarksSuccess('')

    if (!selectedStudent) { setMarksError('Please select a student'); return }

    const filled = SUBJECTS.filter(s => subjectScores[s] !== '')
    if (filled.length === 0) { setMarksError('Please enter at least one subject mark'); return }

    const subjects = filled.map(s => ({ subject: s, score: Number(subjectScores[s]) }))

    setMarksSaving(true)
    try {
      const res = await axios.post(`${API_BASE_URL}/api/mark`, {
        email: selectedStudent.email,
        subjects,
      })
      setMarksRecords(res.data.data || [])
      setMarksSuccess('Marks saved successfully')
    } catch (err) {
      setMarksError(err.response?.data?.message || 'Failed to save marks')
    } finally {
      setMarksSaving(false)
    }
  }

  async function handleFeeStudentSelect(email) {
    const student = users.find(u => u.email === email)
    setFeeStudent(student || null)
    setFeeBalance('')
    setFeeStatus('pending')
    setFeeError('')
    setFeeSuccess('')

    if (email) {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/fee`, { params: { email } })
        if (res.data.data) {
          setFeeBalance(res.data.data.balance)
          setFeeStatus(res.data.data.status)
        }
      } catch {
        // no existing record is fine
      }
    }
  }

  async function handleSaveFee(e) {
    e.preventDefault()
    setFeeError('')
    setFeeSuccess('')

    if (!feeStudent) { setFeeError('Please select a student'); return }
    if (feeBalance === '' || feeBalance === undefined) { setFeeError('Please enter a fee balance'); return }

    setFeeSaving(true)
    try {
      await axios.post(`${API_BASE_URL}/api/fee`, {
        email: feeStudent.email,
        balance: feeBalance,
        status: feeStatus,
      })
      setFeeSuccess('Fee updated successfully')
      // Refresh all fee records
      const res = await axios.get(`${API_BASE_URL}/api/fee/all`)
      setAllFeeRecords(res.data.data || [])
    } catch (err) {
      setFeeError(err.response?.data?.message || 'Failed to save fee')
    } finally {
      setFeeSaving(false)
    }
  }

  function getFeeStatusLabel(status) {
    if (status === 'paid') return { label: 'Paid', cls: 'pass' }
    if (status === 'partial') return { label: 'Partial', cls: 'partial' }
    return { label: 'Pending', cls: 'fail' }
  }

  function getUserName(email) {
    const u = users.find(u => u.email.toLowerCase() === email.toLowerCase())
    return u ? u.name : email
  }

  return (
    <div className="page-content">
      <div className="dashboard-header-section">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name ?? (`${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim() || 'Admin')}!</p>
      </div>

      <div className="admin-tabs">
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <i className="fa-solid fa-users"></i> Manage Users
        </button>
        <button className={`tab-btn ${activeTab === 'marks' ? 'active' : ''}`} onClick={() => setActiveTab('marks')}>
          <i className="fa-solid fa-graduation-cap"></i> Student Marks
        </button>
        <button className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`} onClick={() => setActiveTab('fees')}>
          <i className="fa-solid fa-wallet"></i> Fee Management
        </button>
      </div>

      {/* ── Manage Users ── */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>Manage Users</h2>
          {users.length === 0 ? (
            <p className="no-users">No users registered yet.</p>
          ) : (
            <div className="users-table">
              <div className="table-header">
                <div className="col-name">Name</div>
                <div className="col-email">Email</div>
                <div className="col-status">Status</div>
                <div className="col-actions">Actions</div>
              </div>
              {users.map(u => (
                <div key={u.email} className="table-row">
                  <div className="col-name">{u.name}</div>
                  <div className="col-email">{u.email}</div>
                  <div className="col-status">
                    <select value={u.status || 'active'} onChange={(e) => handleStatusChange(u.email, e.target.value)} className="status-select">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="col-actions">
                    <button onClick={() => handleDeleteUser(u.email)} className="delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Student Marks ── */}
      {activeTab === 'marks' && (
        <div className="admin-section">
          <h2>Student Marks Management</h2>
          <div className="marks-container">
            <div className="marks-form">
              <h3>Add / Edit Student Marks</h3>
              <form onSubmit={handleSaveMarks}>
                <div className="form-group">
                  <label>Select Student</label>
                  <select value={selectedStudent?.email || ''} onChange={(e) => handleStudentSelect(e.target.value)} className="form-input">
                    <option value="">-- Choose Student --</option>
                    {users.map(u => (
                      <option key={u.email} value={u.email}>{u.name} — {u.email}</option>
                    ))}
                  </select>
                </div>

                <div className="marks-grid">
                  {SUBJECTS.map(subject => (
                    <div className="form-group" key={subject}>
                      <label>{subject} <span className="mark-range">(0 – 100)</span></label>
                      <input
                        type="number" min="0" max="100" placeholder="0"
                        className="form-input"
                        value={subjectScores[subject]}
                        onChange={(e) => handleScoreChange(subject, e.target.value)}
                      />
                      {subjectScores[subject] !== '' && (
                        <span className={`mark-badge ${Number(subjectScores[subject]) >= 45 ? 'pass' : 'fail'}`}>
                          {Number(subjectScores[subject]) >= 45 ? 'Pass' : 'Fail'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="form-group">
                  <label>Total Marks <span className="mark-range">(auto-calculated)</span></label>
                  <input type="number" className="form-input total-input" value={filledCount > 0 ? total : ''} readOnly placeholder="0" />
                  {filledCount > 0 && <span className="total-out-of">out of {filledCount * 100}</span>}
                </div>

                {marksError && <div className="auth-error" style={{ marginBottom: 12 }}>{marksError}</div>}
                {marksSuccess && <div className="marks-success">{marksSuccess}</div>}

                <button type="submit" className="submit-btn" disabled={marksSaving}>
                  {marksSaving ? 'Saving...' : 'Save Marks'}
                </button>
              </form>
            </div>

            <div className="marks-list">
              <h3>Marks Records {selectedStudent ? `— ${selectedStudent.name}` : ''}</h3>
              {!selectedStudent ? (
                <div className="records-placeholder"><i className="fa-solid fa-file-lines"></i><p>Select a student to view records</p></div>
              ) : loadingRecords ? (
                <div className="records-placeholder"><p>Loading...</p></div>
              ) : marksRecords.length === 0 ? (
                <div className="records-placeholder"><i className="fa-solid fa-file-lines"></i><p>No marks saved yet</p></div>
              ) : (
                <div className="marks-records-table">
                  <div className="marks-record-header">
                    <span>Subject</span><span>Score</span><span>Status</span>
                  </div>
                  {marksRecords.map((m, i) => (
                    <div key={i} className="marks-record-row">
                      <span>{m.subject}</span>
                      <span>{m.score} / 100</span>
                      <span className={`mark-badge ${m.status}`}>{m.status === 'pass' ? 'Pass' : 'Fail'}</span>
                    </div>
                  ))}
                  <div className="marks-record-row marks-record-total">
                    <span><strong>Total</strong></span>
                    <span><strong>{marksRecords.reduce((s, m) => s + m.score, 0)} / {marksRecords.length * 100}</strong></span>
                    <span className={`mark-badge ${marksRecords.every(m => m.status === 'pass') ? 'pass' : 'fail'}`}>
                      {marksRecords.every(m => m.status === 'pass') ? 'Pass' : 'Fail'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Fee Management ── */}
      {activeTab === 'fees' && (
        <div className="admin-section">
          <h2>Fee Management</h2>
          <div className="fees-container">
            <div className="fees-form">
              <h3>Update Student Fee</h3>
              <form onSubmit={handleSaveFee}>
                <div className="form-group">
                  <label>Select Student</label>
                  <select value={feeStudent?.email || ''} onChange={(e) => handleFeeStudentSelect(e.target.value)} className="form-input">
                    <option value="">-- Choose Student --</option>
                    {users.map(u => (
                      <option key={u.email} value={u.email}>{u.name} — {u.email}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Fee Balance ($)</label>
                  <input
                    type="number" min="0" step="0.01" placeholder="0.00"
                    className="form-input"
                    value={feeBalance}
                    onChange={(e) => { setFeeBalance(e.target.value); setFeeError('') }}
                  />
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select value={feeStatus} onChange={(e) => setFeeStatus(e.target.value)} className="form-input">
                    <option value="pending">Pending</option>
                    <option value="partial">Partially Paid</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                {feeError && <div className="auth-error" style={{ marginBottom: 12 }}>{feeError}</div>}
                {feeSuccess && <div className="marks-success">{feeSuccess}</div>}

                <button type="submit" className="submit-btn" disabled={feeSaving}>
                  {feeSaving ? 'Saving...' : 'Update Fee'}
                </button>
              </form>
            </div>

            <div className="fees-list">
              <h3>All Fee Records</h3>
              {allFeeRecords.length === 0 ? (
                <div className="records-placeholder-alt">
                  <i className="fa-solid fa-inbox"></i>
                  <p>No fee records yet</p>
                </div>
              ) : (
                <div className="marks-records-table">
                  <div className="marks-record-header fee-record-header">
                    <span>Student</span><span>Balance ($)</span><span>Status</span>
                  </div>
                  {allFeeRecords.map((f, i) => {
                    const { label, cls } = getFeeStatusLabel(f.status)
                    return (
                      <div key={i} className="marks-record-row">
                        <span>{getUserName(f.userEmail)}</span>
                        <span>${Number(f.balance).toFixed(2)}</span>
                        <span className={`mark-badge ${cls}`}>{label}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
