import React, { useState } from 'react'
import './contact.css'

export default function ContactUs() {
	const [status, setStatus] = useState('')

	function handleSubmit(e) {
		e.preventDefault()
		setStatus('Message sent — we will get back to you soon.')
		e.currentTarget.reset()
		setTimeout(() => setStatus(''), 5000)
	}

	return (
		<header className="hero contact-page">
			<div className="contact-grid">
				<aside className="contact-info">
					<h2>Get in touch</h2>
					<p>
						For enquiries, email{' '}
						<a href="mailto:info@collegehub.com">info@collegehub.com</a> or call
						<br />+91 0000 0000
					</p>

					<div className="social-row" aria-hidden={false}>
						<a className="social-link" href="#" aria-label="Facebook">
							<i className="fab fa-facebook-f" />
						</a>
						<a className="social-link" href="#" aria-label="Twitter">
							<i className="fab fa-twitter" />
						</a>
						<a className="social-link" href="#" aria-label="Instagram">
							<i className="fab fa-instagram" />
						</a>
						<a className="social-link" href="#" aria-label="LinkedIn">
							<i className="fab fa-linkedin-in" />
						</a>
					</div>
				</aside>

				<section className="contact-form-card">
					<form className="contact-form" onSubmit={handleSubmit}>
						<h3>Send us a message</h3>
						{status && <div className="form-status text-success">{status}</div>}

						<label className="sr-only">Name</label>
						<input name="name" placeholder="Your name" required />

						<label className="sr-only">Email</label>
						<input name="email" type="email" placeholder="Your email" required />

						<label className="sr-only">Subject</label>
						<input name="subject" placeholder="Subject (optional)" />

						<label className="sr-only">Message</label>
						<textarea name="message" placeholder="Message" rows={6} required />

						<div className="form-actions">
							<button type="submit" className="btn primary">Send Message</button>
						</div>
					</form>
				</section>
			</div>
		</header>
	)
}
