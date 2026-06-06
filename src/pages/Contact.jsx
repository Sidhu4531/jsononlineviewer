import { useState } from 'react'
import PageLayout from '../components/PageLayout.jsx'
import Seo from '../components/Seo.jsx'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: 'General', message: '' })
  const [status, setStatus] = useState('idle') // idle | sent

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return
    setStatus('sent')
    setForm({ name: '', email: '', subject: 'General', message: '' })
    setTimeout(() => setStatus('idle'), 4000)
  }

  return (
    <PageLayout
      title="Contact Us"
      subtitle="Questions, bug reports, or feature ideas — we'd love to hear from you."
    >
      <Seo
        title="Contact Us"
        description="Get in touch with the JSON Viewer team. Send a message, ask a question, or report a bug."
        canonical="https://jsononlineviewer.com/contact"
      />

      <div className="contact-grid">
        <div className="contact-info">
          <h2>Get in touch</h2>
          <p>
            JSON Viewer is a small, independent tool. We read every message and do our
            best to reply within a few days.
          </p>

          <h2>For most things, email works best</h2>
          <ul className="contact-list">
            <li>
              <span className="contact-label">General</span>
              <a href="mailto:hello@jsononlineviewer.com">hello@jsononlineviewer.com</a>
            </li>
            <li>
              <span className="contact-label">Bug reports</span>
              <a href="mailto:bugs@jsononlineviewer.com">bugs@jsononlineviewer.com</a>
            </li>
            <li>
              <span className="contact-label">Feature requests</span>
              <a href="mailto:ideas@jsononlineviewer.com">ideas@jsononlineviewer.com</a>
            </li>
          </ul>

          <h2>Response time</h2>
          <p>
            We usually respond within <strong>2&ndash;3 business days</strong>. For urgent
            issues (e.g. the site is down), please mention &quot;URGENT&quot; in the subject line.
          </p>

          <h2>Before you write</h2>
          <p>
            For common questions, the <a href="/faq">FAQ page</a> has quick answers about
            what JSON Viewer is, how to use it, and how to use it in Chrome.
          </p>
        </div>

        <form className="contact-form" onSubmit={onSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="contact-name"><span>Name</span></label>
            <input
              id="contact-name"
              name="name"
              type="text"
              value={form.name}
              onChange={onChange}
              placeholder="Your name"
              required
              autoComplete="name"
            />
          </div>
          <div className="form-field">
            <label htmlFor="contact-email"><span>Email</span></label>
            <input
              id="contact-email"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-field">
            <label htmlFor="contact-subject"><span>Subject</span></label>
            <select id="contact-subject" name="subject" value={form.subject} onChange={onChange}>
              <option>General</option>
              <option>Bug report</option>
              <option>Feature request</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="contact-message"><span>Message</span></label>
            <textarea
              id="contact-message"
              name="message"
              rows="6"
              value={form.message}
              onChange={onChange}
              placeholder="What's on your mind?"
              required
            />
          </div>
          <button type="submit" className="form-submit" disabled={status === 'sent'}>
            {status === 'sent' ? '✓ Message sent' : 'Send message'}
          </button>
          {status === 'sent' && (
            <p className="form-note" role="status">
              Thanks &mdash; we&apos;ll get back to you soon. (This demo form doesn&apos;t actually
              transmit; in production it would post to our inbox.)
            </p>
          )}
        </form>
      </div>
    </PageLayout>
  )
}
