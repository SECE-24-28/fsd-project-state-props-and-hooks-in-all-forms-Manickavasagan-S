import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const ADMIN_CREDENTIALS = {
  email: 'admin@test.com',
  password: 'Admin@123',
  name: 'Admin',
  role: 'admin',
}

export const FEATURES = [
  {
    id: 'activities',
    title: 'Manage the College Activities',
    description: 'Pay fees, check attendance, and manage student records.',
    icon: 'fa-calendar-check',
  },
  {
    id: 'performance',
    title: 'Student Performance Tracking',
    description: 'View marks, semester results, and academic progress reports.',
    icon: 'fa-chart-line',
  },
  {
    id: 'library',
    title: 'Library & Course Management',
    description: 'Access library books, course materials, and class schedules easily.',
    icon: 'fa-book',
  },
]

// Session management
export function getSessionUser() {
  const raw = sessionStorage.getItem('activeUser')
  try {
    return raw ? JSON.parse(raw) : null
  } catch (err) {
    return null
  }
}

export function setSessionUser(user) {
  sessionStorage.setItem('activeUser', JSON.stringify(user))
}

export function clearSessionUser() {
  sessionStorage.removeItem('activeUser')
}

// API functions for backend integration
export async function apiLogin(email, password) {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return ADMIN_CREDENTIALS
  }
  
  const response = await axios.get(`${API_BASE_URL}/api/user/login`, {
    params: { email: email.trim(), password }
  })
  return response.data.data
}

export async function apiSignup(userData) {
  const response = await axios.post(`${API_BASE_URL}/api/user/signup`, userData)
  return response.data.data
}

export async function apiGetAllUsers() {
  const response = await axios.get(`${API_BASE_URL}/api/user/all`)
  return response.data.data
}

export async function apiSendOtp(email) {
  const response = await axios.post(`${API_BASE_URL}/api/user/send-otp`, { email })
  return response.data
}

export async function apiResetPassword(email, otp, newPassword) {
  const response = await axios.post(`${API_BASE_URL}/api/user/reset-password`, {
    email, otp, newPassword
  })
  return response.data
}

// Legacy functions for backward compatibility (now use API)
export async function validateLogin(email, password) {
  try {
    return await apiLogin(email, password)
  } catch (error) {
    throw error
  }
}

export async function createUser(userData) {
  try {
    return await apiSignup(userData)
  } catch (error) {
    throw error
  }
}

export async function getManagedUsers() {
  try {
    return await apiGetAllUsers()
  } catch (error) {
    return []
  }
}
