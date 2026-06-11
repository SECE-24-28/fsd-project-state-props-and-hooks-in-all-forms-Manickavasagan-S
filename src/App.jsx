import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './Page/Home'
import About from './Page/About'
import ContactUs from './Page/ContactUs'
import Login from './Page/Login'
import SignIn from './Page/SignIn'
import ForgotPassword from './Page/ForgotPassword'
import PrivacyPolicy from './Page/PrivacyPolicy'
import AdminDashboard from './Page/AdminDashboard'
import UserDashboard from './Page/UserDashboard'
import DashboardRedirect from './Page/DashboardRedirect'
import Admission from './Page/Admission'
import ProtectedRoute from './ProtectedRoute'
import './index.css'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/admission" element={<Admission />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user-dashboard" element={<ProtectedRoute role="user"><UserDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}
