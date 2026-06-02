import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearSessionUser, getSessionUser, getManagedUsers, updateUserStatus, deleteUser } from '../auth'
import './dashboard.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const user = getSessionUser()
  const [users, setUsers] = useState([])
  const [activeTab, setActiveTab] = useState('users')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [marks, setMarks] = useState('')
  const [feeBalance, setFeeBalance] = useState('')
  const [feeStatus, setFeeStatus] = useState('pending')

  useEffect(() => {
    setUsers(getManagedUsers())
  }, [])

  function handleLogout() {
    clearSessionUser()
    navigate('/login')
  }

  function handleStatusChange(email, status) {
    updateUserStatus(email, status)
    setUsers(getManagedUsers())
  }

  function handleDeleteUser(email) {
    if (window.confirm(`Delete user ${email}?`)) {
      deleteUser(email)
      setUsers(getManagedUsers())
    }
  }

  function handleAddMarks(e) {
    e.preventDefault()
    if (!selectedStudent || !marks) return
    setSelectedStudent(null)
    setMarks('')
  }

  function handleUpdateFee(e) {
    e.preventDefault()
    if (!selectedStudent || !feeBalance) return
    setSelectedStudent(null)
    setFeeBalance('')
    setFeeStatus('pending')
  }

  return (
    <div className="page-content">
      <div className="dashboard-header-section">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name ?? 'Admin'}!</p>
        <button onClick={handleLogout} className="logout-btn">Sign out</button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <i className="fa-solid fa-users"></i> Manage Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'marks' ? 'active' : ''}`}
          onClick={() => setActiveTab('marks')}
        >
          <i className="fa-solid fa-graduation-cap"></i> Student Marks
        </button>
        <button 
          className={`tab-btn ${activeTab === 'fees' ? 'active' : ''}`}
          onClick={() => setActiveTab('fees')}
        >
          <i className="fa-solid fa-wallet"></i> Fee Management
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>Manage Users</h2>
          {users.length === 0 ? (
            <p className="no-users">No users created yet.</p>
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
                    <select 
                      value={u.status || 'active'}
                      onChange={(e) => handleStatusChange(u.email, e.target.value)}
                      className="status-select"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="col-actions">
                    <button 
                      onClick={() => handleDeleteUser(u.email)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'marks' && (
        <div className="admin-section">
          <h2>Student Marks Management</h2>
          <div className="marks-container">
            <div className="marks-form">
              <h3>Add/Edit Student Marks</h3>
              <form onSubmit={handleAddMarks}>
                <div className="form-group">
                  <label>Select Student</label>
                  <select 
                    value={selectedStudent?.email || ''}
                    onChange={(e) => {
                      const student = users.find(u => u.email === e.target.value)
                      setSelectedStudent(student)
                    }}
                    className="form-input"
                  >
                    <option value="">-- Choose Student --</option>
                    {users.map(u => (
                      <option key={u.email} value={u.email}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div className="marks-grid">
                  <div className="form-group">
                    <label>Mathematics</label>
                    <input type="number" min="0" max="100" placeholder="0" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Science</label>
                    <input type="number" min="0" max="100" placeholder="0" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>English</label>
                    <input type="number" min="0" max="100" placeholder="0" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>History</label>
                    <input type="number" min="0" max="100" placeholder="0" className="form-input" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Total Marks</label>
                  <input 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    className="form-input" 
                    value={marks} 
                    onChange={(e) => setMarks(e.target.value)} 
                  />
                </div>

                <button type="submit" className="submit-btn">Save Marks</button>
              </form>
            </div>

            <div className="marks-list">
              <h3>Student Marks Records</h3>
              <div className="records-placeholder">
                <i className="fa-solid fa-file-lines"></i>
                <p>Marks records will appear here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="admin-section">
          <h2>Fee Management</h2>
          <div className="fees-container">
            <div className="fees-form">
              <h3>Update Student Fee</h3>
              <form onSubmit={handleUpdateFee}>
                <div className="form-group">
                  <label>Select Student</label>
                  <select 
                    value={selectedStudent?.email || ''}
                    onChange={(e) => {
                      const student = users.find(u => u.email === e.target.value)
                      setSelectedStudent(student)
                    }}
                    className="form-input"
                  >
                    <option value="">-- Choose Student --</option>
                    {users.map(u => (
                      <option key={u.email} value={u.email}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Fee Balance ($)</label>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01"
                    placeholder="0.00" 
                    className="form-input" 
                    value={feeBalance}
                    onChange={(e) => setFeeBalance(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Payment Status</label>
                  <select 
                    value={feeStatus}
                    onChange={(e) => setFeeStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="pending">Pending</option>
                    <option value="partial">Partially Paid</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <button type="submit" className="submit-btn">Update Fee</button>
              </form>
            </div>

            <div className="fees-list">
              <h3>Student Fee Records</h3>
              <div className="fee-records">
                <div className="fee-header">
                  <div className="fee-col-name">Student Name</div>
                  <div className="fee-col-balance">Balance</div>
                  <div className="fee-col-status">Status</div>
                </div>
                <div className="records-placeholder-alt">
                  <i className="fa-solid fa-inbox"></i>
                  <p>Fee records will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
