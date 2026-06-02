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

export function getStoredUsers() {
  const raw = localStorage.getItem('users')
  try {
    return raw ? JSON.parse(raw) : []
  } catch (err) {
    return []
  }
}

export function saveStoredUsers(users) {
  localStorage.setItem('users', JSON.stringify(users))
}

export function findUser(email, password) {
  return getStoredUsers().find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  )
}

export function createUser({ name, email, password }) {
  const users = getStoredUsers()
  const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase())
  if (exists) return null

  const newUser = { 
    name, 
    email, 
    password, 
    role: 'user',
    status: 'active',
    createdAt: new Date().toISOString(),
  }
  users.push(newUser)
  saveStoredUsers(users)
  return newUser
}

export function validateLogin(email, password) {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return {
      name: ADMIN_CREDENTIALS.name,
      email: ADMIN_CREDENTIALS.email,
      role: ADMIN_CREDENTIALS.role,
    }
  }
  return findUser(email, password)
}

export function updateUserStatus(email, status) {
  const users = getStoredUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (user) {
    user.status = status
    saveStoredUsers(users)
  }
}

export function deleteUser(email) {
  const users = getStoredUsers()
  const filtered = users.filter(u => u.email.toLowerCase() !== email.toLowerCase())
  saveStoredUsers(filtered)
}

export function getManagedUsers() {
  return getStoredUsers()
}
