import PageLayout from '../components/PageLayout.jsx'
import Seo from '../components/Seo.jsx'

export default function AboutUs() {
  return (
    <PageLayout
      title="About Us"
      subtitle="Who we are and why we built this JSON viewer."
    >
      <Seo
        title="About Us"
        description="Learn about JSON Viewer — a free, fast, privacy-friendly browser tool for formatting, validating, and exploring JSON data."
        canonical="https://jsononlineviewer.com/about-us"
      />

      <p>
        <strong>JSON Viewer</strong> is a free, fast, privacy-friendly tool for anyone who
        works with JSON data. It runs entirely in your browser &mdash; no account, no
        upload, no tracking of your input.
      </p>

      <h2>Why we built it</h2>
      <p>
        Most online JSON tools are bloated, full of ads, or quietly send your data to a
        server. We wanted a single, fast page that does the four things developers actually
        need: <strong>view</strong> JSON nicely, <strong>format</strong> minified data,{' '}
        <strong>validate</strong> with helpful errors, and <strong>explore</strong> large
        documents in a tree. So we built it.
      </p>

      <h2>Who it&apos;s for</h2>
      <ul>
        <li><strong>Backend developers</strong> formatting API responses</li>
        <li><strong>Frontend engineers</strong> validating payloads from a backend</li>
        <li><strong>QA testers</strong> exploring test fixtures</li>
        <li><strong>Data analysts</strong> inspecting exports</li>
        <li><strong>Technical writers</strong> preparing sample documentation</li>
        <li><strong>Students</strong> learning JSON syntax</li>
      </ul>

      <h2>What it offers</h2>
      <ul>
        <li>Live validation with <strong>line and column</strong> error reporting</li>
        <li>One-click <strong>format</strong> (pretty-print) and <strong>minify</strong></li>
        <li>Two output modes: color-coded text and an expandable <strong>tree</strong></li>
        <li><strong>Search</strong> across keys and values, with matches auto-expanded</li>
        <li>Click any value to see its <strong>JSON path</strong>, type, and contents</li>
        <li>Open <code>.json</code> files, or load from built-in samples</li>
        <li>Light and dark friendly styling; input persisted to <code>localStorage</code></li>
        <li><strong>100% client-side</strong> &mdash; nothing leaves your device</li>
      </ul>

      <h2>Our principles</h2>
      <ul>
        <li><strong>Privacy first.</strong> We don&apos;t upload, log, or analyze your JSON.</li>
        <li><strong>No sign-up walls.</strong> The whole tool is on the home page.</li>
        <li><strong>Open and honest.</strong> No dark patterns, no ad tricks.</li>
        <li><strong>Fast and small.</strong> Loads in under a second on a slow connection.</li>
      </ul>

      <h2>Get in touch</h2>
      <p>
        Have a question, found a bug, or want to suggest a feature? Visit the{' '}
        <a href="/contact">contact page</a> or check the <a href="/faq">FAQ</a>.
      </p>
    </PageLayout>
  )
}
