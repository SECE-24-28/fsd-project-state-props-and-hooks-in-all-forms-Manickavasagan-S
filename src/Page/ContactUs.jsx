import React, { useState } from 'react'

export default function ContactUs() {
  const [status, setStatus] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('Thank you! Your message has been sent. We will get back to you within 2 business days.')
    e.currentTarget.reset()
    setTimeout(() => setStatus(''), 6000)
  }

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Have a question or need help? Reach out to us — we are always happy to assist.</p>
        </div>
      </div>

      {/* Contact Body */}
      <section className="section">
        <div className="container">
          <div className="contact-layout">

            {/* Info Card */}
            <div className="contact-info-card">
              <h2>Get in Touch</h2>
              <p>
                Whether you have questions about admissions, academics, or campus
                facilities — our team is here to help you every step of the way.
              </p>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <i className="fa-solid fa-envelope" />
                </div>
                <div className="contact-detail-text">
                  <strong>Email</strong>
                  <span>
                    <a href="mailto:info@ietcollge.com" style={{ color: '#fff' }}>
                      info@ietcollge.com
                    </a>
                  </span>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <i className="fa-solid fa-phone" />
                </div>
                <div className="contact-detail-text">
                  <strong>Phone</strong>
                  <span>+91 0000 0000</span>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <i className="fa-solid fa-location-dot" />
                </div>
                <div className="contact-detail-text">
                  <strong>Address</strong>
                  <span>IET Campus, Main Road, City — 000000</span>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <i className="fa-solid fa-clock" />
                </div>
                <div className="contact-detail-text">
                  <strong>Office Hours</strong>
                  <span>Mon – Sat: 9:00 AM – 5:00 PM</span>
                </div>
              </div>

              <div className="contact-social">
                <a className="social-link" href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
                <a className="social-link" href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
                <a className="social-link" href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
                <a className="social-link" href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a>
              </div>
            </div>

            {/* Form Card */}
            <div className="contact-form-card">
              <h2>Send Us a Message</h2>
              <p>Fill in the form below and a member of our team will respond promptly.</p>

              {status && <div className="form-success">{status}</div>}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="ct-name">Full Name</label>
                    <input id="ct-name" name="name" placeholder="Your full name" required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="ct-email">Email Address</label>
                    <input id="ct-email" name="email" type="email" placeholder="you@email.com" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="ct-phone">Phone Number</label>
                    <input id="ct-phone" name="phone" type="tel" placeholder="+91 00000 00000" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="ct-dept">Department / Query</label>
                    <select id="ct-dept" name="department">
                      <option value="">Select a department</option>
                      <option>Admissions</option>
                      <option>Academics</option>
                      <option>Examinations</option>
                      <option>Placement Cell</option>
                      <option>Hostel &amp; Facilities</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="ct-subject">Subject</label>
                  <input id="ct-subject" name="subject" placeholder="Brief subject of your message" />
                </div>

                <div className="form-field">
                  <label htmlFor="ct-message">Message</label>
                  <textarea id="ct-message" name="message" placeholder="Write your message here..." required />
                </div>

                <button type="submit" className="btn-submit">
                  <i className="fa-solid fa-paper-plane" style={{ marginRight: 8 }} />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
