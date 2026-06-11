import React from 'react'

export default function PrivacyPolicy() {
  return (
    <>
      <div className="page-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>How IET College handles and protects your information.</p>
        </div>
      </div>

      <div className="privacy-content">
        <h2>Privacy Policy</h2>
        <p>
          This Privacy Policy describes how IET College (the "Service") treats information
          for the purposes of this demo application. This is a demo project: no real user
          data is collected or stored by default. Any data entered into forms during local
          testing is kept in the browser and not transmitted to external servers.
        </p>
        <br />
        <p>
          When used in a production deployment, information entered by users would typically
          be used to respond to inquiries, manage accounts, and provide requested services;
          this demo does not perform those actions automatically. The demo may use browser
          cookies for session handling when integrated with a backend; in this shipped example
          cookies are not used for tracking.
        </p>
        <br />
        <p>
          External services (analytics, authentication) are not enabled in the demo. If you
          integrate such services, please review their privacy terms separately. This demo
          does not implement production-grade security controls — treat the code as sample
          material and follow best practices before deploying to production.
        </p>
        <br />
        <p>
          For questions about this demo privacy notice, contact{' '}
          <a href="mailto:info@ietcollge.com" style={{ color: 'var(--sky)', fontWeight: 600 }}>
            info@ietcollge.com
          </a>.
        </p>
      </div>
    </>
  )
}
