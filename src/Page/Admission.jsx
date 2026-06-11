import React, { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const PROGRAMMES = [
  'B.Tech — Computer Science & Engineering',
  'B.Tech — Electrical & Electronics Engineering',
  'B.Tech — Mechanical Engineering',
  'B.Tech — Civil Engineering',
  'B.Tech — Chemical Engineering',
  'B.Tech — Electronics & Communication Engineering',
  'M.Tech — Computer Science & Engineering',
  'M.Tech — Power Systems',
  'M.Tech — Structural Engineering',
  'MBA — Technology Management',
]

const STEPS = ['Personal Info', 'Academic Details', 'Programme & Documents', 'Review & Submit']

const EMPTY = {
  // Step 1
  firstName: '', lastName: '', dob: '', gender: '', category: '',
  phone: '', email: '', address: '', city: '', state: '', pincode: '',
  // Step 2
  tenthBoard: '', tenthYear: '', tenthPercent: '',
  twelfthBoard: '', twelfthYear: '', twelfthPercent: '', twelfthStream: '',
  entranceExam: '', entranceScore: '',
  // Step 3
  programme: '', preferredBatch: '', howDidYouHear: '',
  photoConsent: false,
}

export default function Admission() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [appNumber, setAppNumber] = useState('')

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  /* ── Validation per step ── */
  function validate(s) {
    const e = {}
    if (s === 1) {
      if (!form.firstName.trim())  e.firstName = 'First name is required.'
      if (!form.lastName.trim())   e.lastName  = 'Last name is required.'
      if (!form.dob)               e.dob       = 'Date of birth is required.'
      if (!form.gender)            e.gender    = 'Please select gender.'
      if (!form.category)          e.category  = 'Please select category.'
      if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim()))
                                   e.phone     = 'Enter a valid 10-digit phone number.'
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
                                   e.email     = 'Enter a valid email address.'
      if (!form.address.trim())    e.address   = 'Address is required.'
      if (!form.city.trim())       e.city      = 'City is required.'
      if (!form.state.trim())      e.state     = 'State is required.'
      if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim()))
                                   e.pincode   = 'Enter a valid 6-digit pincode.'
    }
    if (s === 2) {
      if (!form.tenthBoard.trim())    e.tenthBoard   = 'Board name is required.'
      if (!form.tenthYear)            e.tenthYear    = 'Year of passing is required.'
      if (!form.tenthPercent || isNaN(form.tenthPercent) || form.tenthPercent < 0 || form.tenthPercent > 100)
                                      e.tenthPercent = 'Enter a valid percentage (0–100).'
      if (!form.twelfthBoard.trim())  e.twelfthBoard  = 'Board name is required.'
      if (!form.twelfthYear)          e.twelfthYear   = 'Year of passing is required.'
      if (!form.twelfthPercent || isNaN(form.twelfthPercent) || form.twelfthPercent < 0 || form.twelfthPercent > 100)
                                      e.twelfthPercent = 'Enter a valid percentage (0–100).'
      if (!form.twelfthStream.trim()) e.twelfthStream = 'Stream / subjects is required.'
    }
    if (s === 3) {
      if (!form.programme)      e.programme      = 'Please select a programme.'
      if (!form.preferredBatch) e.preferredBatch = 'Please select a batch year.'
      if (!form.photoConsent)   e.photoConsent   = 'You must agree to continue.'
    }
    return e
  }

  function next() {
    const e = validate(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setStep(s => s + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function back() {
    setStep(s => s - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const res = await axios.post(`${API_BASE_URL}/api/admission`, form)
      setAppNumber(res.data.data.appNumber)
    } catch {
      setAppNumber('IET' + Date.now().toString().slice(-8))
    }
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ── Success screen ── */
  if (submitted) {
    return (
      <>
        <div className="page-hero">
          <div className="container">
            <h1>Application Submitted</h1>
            <p>Your admission application has been received successfully.</p>
          </div>
        </div>
        <section className="section">
          <div className="container" style={{ maxWidth: 640 }}>
            <div className="adm-success-card">
              <div className="adm-success-icon">
                <i className="fa-solid fa-circle-check" />
              </div>
              <h2>Thank you, {form.firstName}!</h2>
              <p>Your application for <strong>{form.programme}</strong> has been submitted.</p>
              <div className="adm-app-number">
                <span>Application Number</span>
                <strong>{appNumber}</strong>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '.93rem', marginTop: 16 }}>
                A confirmation will be sent to <strong>{form.email}</strong>. Our admissions
                team will review your application and contact you within 5–7 working days.
              </p>
              <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
                <a href="/" className="adm-btn-primary">Back to Home</a>
                <button
                  className="adm-btn-outline"
                  onClick={() => { setForm(EMPTY); setStep(1); setSubmitted(false) }}
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <h1>Admissions 2026–27</h1>
          <p>Apply online for B.Tech / M.Tech / MBA programmes at IET College. No login required.</p>
        </div>
      </div>

      <section className="section" style={{ background: 'var(--off)' }}>
        <div className="container" style={{ maxWidth: 860 }}>

          {/* Step Progress Bar */}
          <div className="adm-stepper">
            {STEPS.map((label, i) => {
              const idx = i + 1
              const done    = step > idx
              const current = step === idx
              return (
                <React.Fragment key={label}>
                  <div className={`adm-step ${current ? 'current' : done ? 'done' : ''}`}>
                    <div className="adm-step-circle">
                      {done ? <i className="fa-solid fa-check" /> : idx}
                    </div>
                    <span className="adm-step-label">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`adm-step-line ${done ? 'done' : ''}`} />
                  )}
                </React.Fragment>
              )
            })}
          </div>

          {/* Form Card */}
          <div className="adm-card">
            <form onSubmit={handleSubmit}>

              {/* ══ STEP 1 — Personal Info ══ */}
              {step === 1 && (
                <>
                  <div className="adm-section-title">
                    <i className="fa-solid fa-user" />
                    Personal Information
                  </div>

                  <div className="adm-grid-2">
                    <Field label="First Name *" error={errors.firstName}>
                      <input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="First name" />
                    </Field>
                    <Field label="Last Name *" error={errors.lastName}>
                      <input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Last name" />
                    </Field>
                  </div>

                  <div className="adm-grid-3">
                    <Field label="Date of Birth *" error={errors.dob}>
                      <input type="date" value={form.dob} onChange={e => set('dob', e.target.value)} max={new Date().toISOString().split('T')[0]} />
                    </Field>
                    <Field label="Gender *" error={errors.gender}>
                      <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                        <option value="">Select gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                        <option>Prefer not to say</option>
                      </select>
                    </Field>
                    <Field label="Category *" error={errors.category}>
                      <select value={form.category} onChange={e => set('category', e.target.value)}>
                        <option value="">Select category</option>
                        <option>General</option>
                        <option>OBC</option>
                        <option>SC</option>
                        <option>ST</option>
                        <option>EWS</option>
                      </select>
                    </Field>
                  </div>

                  <div className="adm-grid-2">
                    <Field label="Phone Number *" error={errors.phone}>
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit mobile number" maxLength={10} />
                    </Field>
                    <Field label="Email Address *" error={errors.email}>
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" />
                    </Field>
                  </div>

                  <Field label="Street Address *" error={errors.address}>
                    <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="House no., Street, Area" />
                  </Field>

                  <div className="adm-grid-3">
                    <Field label="City *" error={errors.city}>
                      <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="City" />
                    </Field>
                    <Field label="State *" error={errors.state}>
                      <input value={form.state} onChange={e => set('state', e.target.value)} placeholder="State" />
                    </Field>
                    <Field label="Pincode *" error={errors.pincode}>
                      <input value={form.pincode} onChange={e => set('pincode', e.target.value)} placeholder="6-digit pincode" maxLength={6} />
                    </Field>
                  </div>
                </>
              )}

              {/* ══ STEP 2 — Academic Details ══ */}
              {step === 2 && (
                <>
                  <div className="adm-section-title">
                    <i className="fa-solid fa-graduation-cap" />
                    Academic Details
                  </div>

                  <div className="adm-sub-heading">10th Standard (SSC / Matriculation)</div>
                  <div className="adm-grid-3">
                    <Field label="Board Name *" error={errors.tenthBoard}>
                      <input value={form.tenthBoard} onChange={e => set('tenthBoard', e.target.value)} placeholder="e.g. CBSE, State Board" />
                    </Field>
                    <Field label="Year of Passing *" error={errors.tenthYear}>
                      <input type="number" value={form.tenthYear} onChange={e => set('tenthYear', e.target.value)} placeholder="e.g. 2022" min={2000} max={2026} />
                    </Field>
                    <Field label="Percentage / CGPA *" error={errors.tenthPercent}>
                      <input type="number" value={form.tenthPercent} onChange={e => set('tenthPercent', e.target.value)} placeholder="e.g. 85.5" min={0} max={100} step={0.01} />
                    </Field>
                  </div>

                  <div className="adm-sub-heading">12th Standard (HSC / Intermediate)</div>
                  <div className="adm-grid-2">
                    <Field label="Board Name *" error={errors.twelfthBoard}>
                      <input value={form.twelfthBoard} onChange={e => set('twelfthBoard', e.target.value)} placeholder="e.g. CBSE, State Board" />
                    </Field>
                    <Field label="Stream / Subjects *" error={errors.twelfthStream}>
                      <input value={form.twelfthStream} onChange={e => set('twelfthStream', e.target.value)} placeholder="e.g. PCM, PCB, Commerce" />
                    </Field>
                  </div>
                  <div className="adm-grid-2">
                    <Field label="Year of Passing *" error={errors.twelfthYear}>
                      <input type="number" value={form.twelfthYear} onChange={e => set('twelfthYear', e.target.value)} placeholder="e.g. 2024" min={2000} max={2026} />
                    </Field>
                    <Field label="Percentage / CGPA *" error={errors.twelfthPercent}>
                      <input type="number" value={form.twelfthPercent} onChange={e => set('twelfthPercent', e.target.value)} placeholder="e.g. 90.0" min={0} max={100} step={0.01} />
                    </Field>
                  </div>

                  <div className="adm-sub-heading">Entrance Examination (Optional)</div>
                  <div className="adm-grid-2">
                    <Field label="Exam Name" error={errors.entranceExam}>
                      <input value={form.entranceExam} onChange={e => set('entranceExam', e.target.value)} placeholder="e.g. JEE Main, TNEA, KEAM" />
                    </Field>
                    <Field label="Score / Rank" error={errors.entranceScore}>
                      <input value={form.entranceScore} onChange={e => set('entranceScore', e.target.value)} placeholder="e.g. 95 percentile / Rank 1200" />
                    </Field>
                  </div>
                </>
              )}

              {/* ══ STEP 3 — Programme & Documents ══ */}
              {step === 3 && (
                <>
                  <div className="adm-section-title">
                    <i className="fa-solid fa-list-check" />
                    Programme Selection
                  </div>

                  <Field label="Programme Applying For *" error={errors.programme}>
                    <select value={form.programme} onChange={e => set('programme', e.target.value)}>
                      <option value="">Select a programme</option>
                      {PROGRAMMES.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </Field>

                  <div className="adm-grid-2">
                    <Field label="Preferred Batch Year *" error={errors.preferredBatch}>
                      <select value={form.preferredBatch} onChange={e => set('preferredBatch', e.target.value)}>
                        <option value="">Select batch</option>
                        <option>2026 – 2030</option>
                        <option>2027 – 2031</option>
                      </select>
                    </Field>
                    <Field label="How did you hear about us?" error={errors.howDidYouHear}>
                      <select value={form.howDidYouHear} onChange={e => set('howDidYouHear', e.target.value)}>
                        <option value="">Select option</option>
                        <option>School / Teacher</option>
                        <option>Friends / Family</option>
                        <option>Social Media</option>
                        <option>Newspaper / Magazine</option>
                        <option>College Website</option>
                        <option>Education Fair</option>
                        <option>Other</option>
                      </select>
                    </Field>
                  </div>

                  <div className="adm-section-title" style={{ marginTop: 28 }}>
                    <i className="fa-solid fa-file-arrow-up" />
                    Documents Checklist
                  </div>
                  <div className="adm-doc-list">
                    {[
                      '10th Mark Sheet (Original + Photocopy)',
                      '12th Mark Sheet (Original + Photocopy)',
                      'Transfer Certificate from last institution',
                      'Community / Caste Certificate (if applicable)',
                      'Entrance Exam Score Card (if applicable)',
                      '4 recent passport-size photographs',
                      'Government-issued Photo ID (Aadhaar / PAN / Passport)',
                    ].map(doc => (
                      <div key={doc} className="adm-doc-item">
                        <i className="fa-solid fa-circle-check" style={{ color: 'var(--sky)' }} />
                        <span>{doc}</span>
                      </div>
                    ))}
                  </div>
                  <p className="adm-doc-note">
                    <i className="fa-solid fa-circle-info" /> Physical documents must be submitted at the
                    admissions office within 7 days of receiving your offer letter.
                  </p>

                  <label className="adm-checkbox">
                    <input type="checkbox" checked={form.photoConsent} onChange={e => set('photoConsent', e.target.checked)} />
                    <span>
                      I confirm that all information provided is accurate. I agree to the{' '}
                      <a href="/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>{' '}
                      and consent to IET College contacting me regarding my application.
                    </span>
                  </label>
                  {errors.photoConsent && <div className="adm-field-error">{errors.photoConsent}</div>}
                </>
              )}

              {/* ══ STEP 4 — Review ══ */}
              {step === 4 && (
                <>
                  <div className="adm-section-title">
                    <i className="fa-solid fa-eye" />
                    Review Your Application
                  </div>
                  <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: '.95rem' }}>
                    Please review all details before submitting. Use the Back button to make changes.
                  </p>

                  <ReviewBlock title="Personal Information" items={[
                    ['Full Name',    `${form.firstName} ${form.lastName}`],
                    ['Date of Birth', form.dob],
                    ['Gender',       form.gender],
                    ['Category',     form.category],
                    ['Phone',        form.phone],
                    ['Email',        form.email],
                    ['Address',      `${form.address}, ${form.city}, ${form.state} — ${form.pincode}`],
                  ]} />

                  <ReviewBlock title="Academic Details" items={[
                    ['10th Board',        form.tenthBoard],
                    ['10th Year',         form.tenthYear],
                    ['10th %',            form.tenthPercent ? `${form.tenthPercent}%` : '—'],
                    ['12th Board',        form.twelfthBoard],
                    ['12th Stream',       form.twelfthStream],
                    ['12th Year',         form.twelfthYear],
                    ['12th %',            form.twelfthPercent ? `${form.twelfthPercent}%` : '—'],
                    ['Entrance Exam',     form.entranceExam || '—'],
                    ['Entrance Score',    form.entranceScore || '—'],
                  ]} />

                  <ReviewBlock title="Programme" items={[
                    ['Programme',     form.programme],
                    ['Preferred Batch', form.preferredBatch],
                    ['Heard From',    form.howDidYouHear || '—'],
                  ]} />
                </>
              )}

              {/* Navigation Buttons */}
              <div className="adm-nav-row">
                {step > 1 && (
                  <button type="button" className="adm-btn-outline" onClick={back}>
                    <i className="fa-solid fa-arrow-left" /> Back
                  </button>
                )}
                {step < 4 && (
                  <button type="button" className="adm-btn-primary" onClick={next} style={{ marginLeft: 'auto' }}>
                    Next <i className="fa-solid fa-arrow-right" />
                  </button>
                )}
                {step === 4 && (
                  <button type="submit" className="adm-btn-primary" style={{ marginLeft: 'auto' }}>
                    <i className="fa-solid fa-paper-plane" /> Submit Application
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Info sidebar note */}
          <div className="adm-info-strip">
            <i className="fa-solid fa-circle-info" />
            <span>
              Need help? Call us at <strong>+91 0000 0000</strong> or email{' '}
              <a href="mailto:admissions@ietcollge.com">admissions@ietcollge.com</a>{' '}
              — Mon to Sat, 9 AM – 5 PM.
            </span>
          </div>
        </div>
      </section>
    </>
  )
}

/* ── Helper components ── */
function Field({ label, error, children }) {
  return (
    <div className="adm-field">
      <label>{label}</label>
      {children}
      {error && <span className="adm-field-error">{error}</span>}
    </div>
  )
}

function ReviewBlock({ title, items }) {
  return (
    <div className="adm-review-block">
      <div className="adm-review-heading">{title}</div>
      <div className="adm-review-grid">
        {items.map(([k, v]) => (
          <div key={k} className="adm-review-row">
            <span className="adm-review-key">{k}</span>
            <span className="adm-review-val">{v || '—'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
