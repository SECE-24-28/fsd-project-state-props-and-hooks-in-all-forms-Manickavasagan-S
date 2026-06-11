import React from 'react'
import { NavLink } from 'react-router-dom'

const programs = [
  { icon: 'fa-microchip',     title: 'Computer Science',        desc: 'AI, Machine Learning, Data Science & Full-Stack Development.' },
  { icon: 'fa-bolt',          title: 'Electrical Engineering',   desc: 'Power systems, electronics, and control engineering.' },
  { icon: 'fa-gears',         title: 'Mechanical Engineering',   desc: 'Thermodynamics, manufacturing, and design engineering.' },
  { icon: 'fa-building',      title: 'Civil Engineering',        desc: 'Structural analysis, construction technology and urban planning.' },
  { icon: 'fa-flask',         title: 'Chemical Engineering',     desc: 'Process design, polymer science and industrial chemistry.' },
  { icon: 'fa-satellite-dish', title: 'Electronics & Comm.',    desc: 'Signal processing, VLSI design and wireless communication.' },
]

const whyUs = [
  { icon: 'fa-medal',          title: 'NAAC A+ Accredited',        desc: 'Recognised for excellence in teaching, research and infrastructure.' },
  { icon: 'fa-users-gear',     title: 'Expert Faculty',            desc: '200+ PhD-qualified professors with industry and research experience.' },
  { icon: 'fa-briefcase',      title: '95% Placement Rate',        desc: 'Dedicated placement cell with 500+ recruiting partner companies.' },
  { icon: 'fa-flask-vial',     title: 'State-of-the-Art Labs',     desc: 'Modern laboratories with latest equipment supporting hands-on learning.' },
  { icon: 'fa-earth-asia',     title: 'Global Collaborations',     desc: 'Tied up with 30+ international universities for student exchange programmes.' },
  { icon: 'fa-graduation-cap', title: 'Scholarships Available',    desc: 'Merit and need-based scholarships supporting 40% of enrolled students.' },
]

const TICKER_ITEMS = [
  '🏆 IET wins National Hackathon 2026',
  '📅 Admissions Open for 2026-27 Batch — Apply by July 31',
  '🎓 Convocation Ceremony on July 12, 2026',
  '📢 Campus Recruitment Drive — June 20-25',
  '🔬 New Research Centre inaugurated by Vice-Chancellor',
  '🏐 Annual Sports Fest "IGNITE 2026" — Register Now',
]

export default function Home() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-pattern" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <i className="fa-solid fa-star" />
              NAAC A+ Accredited Institution
            </div>
            <h1 className="hero-title">
              Welcome to <span>IET College</span><br />
              Shape Your Future Here
            </h1>
            <p className="hero-desc">
              Institute of Engineering &amp; Technology — a premier engineering college
              committed to academic excellence, innovation, and holistic development
              of every student.
            </p>
            <div className="hero-actions">
              <NavLink to="/admission" className="btn-hero-primary">Apply for Admission</NavLink>
              <NavLink to="/about" className="btn-hero-outline">Explore Campus</NavLink>
            </div>
            <div className="hero-stats">
              {[
                { value: '25+', label: 'Years of Excellence' },
                { value: '12,000+', label: 'Alumni Worldwide' },
                { value: '95%', label: 'Placement Rate' },
                { value: '30+', label: 'Global Partners' },
              ].map(s => (
                <div key={s.label}>
                  <div className="hero-stat-value">{s.value}</div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-bar">
        <div className="ticker-inner container" style={{ overflow: 'hidden' }}>
          <span className="ticker-label">Latest News</span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div className="ticker-track">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span key={i}><i className="fa-solid fa-circle-dot" style={{ fontSize: '.5rem' }} /> {item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── PROGRAMS ── */}
      <section className="section programs-section">
        <div className="container">
          <div className="badge">Our Programmes</div>
          <h2 className="section-heading">Departments &amp; Courses</h2>
          <p className="section-sub">
            Choose from a wide range of undergraduate and postgraduate engineering
            programmes designed for the industry of tomorrow.
          </p>
          <div className="programs-grid">
            {programs.map(p => (
              <div key={p.title} className="program-card">
                <div className="program-icon">
                  <i className={`fa-solid ${p.icon}`} />
                </div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BANNER ── */}
      <section className="stats-banner">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: '6', label: 'Departments' },
              { value: '200+', label: 'Expert Faculty' },
              { value: '5000+', label: 'Students Enrolled' },
              { value: '500+', label: 'Recruiting Partners' },
            ].map(s => (
              <div key={s.label}>
                <div className="stat-item-value">{s.value}</div>
                <div className="stat-item-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section why-section">
        <div className="container">
          <div className="badge">Why IET</div>
          <h2 className="section-heading">Why Choose IET College?</h2>
          <p className="section-sub">
            We combine rigorous academics with real-world exposure to produce
            graduates who lead industries.
          </p>
          <div className="why-grid">
            {whyUs.map(w => (
              <div key={w.title} className="why-card">
                <div className="why-card-icon">
                  <i className={`fa-solid ${w.icon}`} />
                </div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-band">
        <div className="container">
          <h2>Ready to Begin Your Journey?</h2>
          <p>
            Join thousands of students who have built successful careers starting
            right here at IET College.
          </p>
          <NavLink to="/admission" className="btn-cta-dark">Apply Now — It's Free</NavLink>
        </div>
      </section>
    </>
  )
}
