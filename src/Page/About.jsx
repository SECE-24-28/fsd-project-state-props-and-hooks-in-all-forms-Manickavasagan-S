import React from 'react'

const pillars = [
  { icon: 'fa-eye',        title: 'Our Vision',   desc: 'To be a globally recognised institution nurturing creative engineers and responsible citizens.' },
  { icon: 'fa-bullseye',   title: 'Our Mission',  desc: 'Deliver quality education through innovation, industry collaboration and student-centric learning.' },
  { icon: 'fa-flag',       title: 'Our Goals',    desc: 'Foster research, reduce academic overhead, and help institutions focus on teaching excellence.' },
]

const leadership = [
  { name: 'Dr. R. Venkatesh',  role: 'Principal',              icon: 'fa-user-tie' },
  { name: 'Prof. S. Lakshmi',  role: 'Dean of Academics',      icon: 'fa-user-tie' },
  { name: 'Dr. M. Anand',      role: 'Head — Computer Science', icon: 'fa-user-tie' },
  { name: 'Prof. P. Kavitha',  role: 'Head — Electrical Engg.', icon: 'fa-user-tie' },
]

export default function About() {
  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <h1>About IET College</h1>
          <p>Learn about our history, vision, leadership and what makes IET a premier engineering institution.</p>
        </div>
      </div>

      {/* About Grid */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-block">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop"
                alt="IET College Campus"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: 0, left: 0 }}
              />
            </div>
            <div className="about-text">
              <div className="badge">Est. 1998</div>
              <h2>A Legacy of Engineering Excellence</h2>
              <p>
                IET College — Institute of Engineering &amp; Technology — has been at the
                forefront of technical education for over 25 years. Founded in 1998,
                we have grown from a single department into a full-fledged multi-disciplinary
                engineering institution serving more than 5,000 students.
              </p>
              <p>
                Our NAAC A+ accreditation and NBA-accredited programmes reflect our
                unwavering commitment to quality. We believe in a holistic approach —
                blending rigorous academics with sports, arts, research and industry exposure.
              </p>
              <p>
                With 200+ experienced faculty members, state-of-the-art laboratories,
                and a vibrant campus life, IET College provides the ideal environment
                for students to discover their potential and build world-class careers.
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className="about-pillars">
            {pillars.map(p => (
              <div key={p.title} className="pillar-card">
                <div className="pillar-icon"><i className={`fa-solid ${p.icon}`} /></div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-banner">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: '25+', label: 'Years of Excellence' },
              { value: '200+', label: 'Expert Faculty' },
              { value: '12,000+', label: 'Alumni Worldwide' },
              { value: '95%', label: 'Placement Rate' },
            ].map(s => (
              <div key={s.label}>
                <div className="stat-item-value">{s.value}</div>
                <div className="stat-item-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section" style={{ background: 'var(--off)' }}>
        <div className="container">
          <div className="badge">Leadership</div>
          <h2 className="section-heading">Meet Our Leadership</h2>
          <p className="section-sub">Experienced educators and researchers guiding IET College towards greater heights.</p>

          <div className="programs-grid" style={{ marginTop: 40 }}>
            {leadership.map(l => (
              <div key={l.name} className="program-card">
                <div className="program-icon" style={{ fontSize: '1.8rem' }}>
                  <i className={`fa-solid ${l.icon}`} />
                </div>
                <h3>{l.name}</h3>
                <p style={{ color: 'var(--gold)', fontWeight: 600, marginTop: 4 }}>{l.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
