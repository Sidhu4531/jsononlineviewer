import { useState } from 'react'
import PageLayout from '../components/PageLayout.jsx'
import Seo from '../components/Seo.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sent')
    setForm({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <>
      <Seo
        title="Contact Us — JSON Online Viewer | Get in Touch"
        description="Contact the JSON Online Viewer team. Send feedback, report a bug, request a feature, or ask a question. We read every message."
        keywords="contact json viewer, json viewer support, json viewer feedback, json viewer bug report, json viewer feature request"
        canonical="https://jsononlineviewer.com/contact"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          name: 'Contact Us — JSON Online Viewer',
          url: 'https://jsononlineviewer.com/contact',
        }}
      />
      <PageLayout
        title="Contact Us"
        subtitle="We read every message. Tell us what you think, what broke, or what to build next."
      >
        <div className="contact-grid">
          <div className="contact-info">
            <h2>Get in touch</h2>
            <p>
              Whether you have a feature request, a bug to report, a partnership idea, or
              just want to say hello — we would love to hear from you. Use the form, or reach
              us at the email below.
            </p>

            <ul className="contact-list">
              <li>
                <span className="contact-label">Email</span>
                <a href="mailto:hello@jsononlineviewer.com">hello@jsononlineviewer.com</a>
              </li>
              <li>
                <span className="contact-label">Response time</span>
                <span>Usually within 2 business days</span>
              </li>
              <li>
                <span className="contact-label">Location</span>
                <span>Remote · Global team</span>
              </li>
            </ul>

            <h2>Common reasons to write</h2>
            <ul>
              <li>Bug report — paste a JSON snippet and the error you saw.</li>
              <li>Feature request — describe the workflow you want to enable.</li>
              <li>Browser or device compatibility issue.</li>
              <li>Translation or accessibility feedback.</li>
              <li>Security disclosure (please mark it urgent).</li>
            </ul>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <label className="form-field">
              <span>Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Your name"
              />
            </label>

            <label className="form-field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
                placeholder="you@example.com"
              />
            </label>

            <label className="form-field">
              <span>Subject</span>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={onChange}
                placeholder="What is this about?"
              />
            </label>

            <label className="form-field">
              <span>Message</span>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                required
                rows={6}
                placeholder="Tell us more..."
              />
            </label>

            <button type="submit" className="form-submit" disabled={status === 'sent'}>
              {status === 'sent' ? 'Thanks — message sent!' : 'Send message'}
            </button>

            {status === 'sent' && (
              <p className="form-note">
                This is a demo form. In production, submissions would be sent to the team
                inbox. Until then, please email us directly.
              </p>
            )}
          </form>
        </div>
      </PageLayout>
    </>
  )
}
