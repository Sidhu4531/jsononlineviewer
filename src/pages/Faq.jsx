import PageLayout from '../components/PageLayout.jsx'
import Seo from '../components/Seo.jsx'

const FAQS = [
  {
    q: 'What is a JSON viewer?',
    a: (
      <>
        <p>
          A <strong>JSON viewer</strong> is a tool that parses, formats, and displays JSON
          (JavaScript Object Notation) data in a human-readable, structured way. Instead of
          staring at a single line of minified text, you can see the entire document as a tree
          of nested keys and values, with collapsible sections, syntax highlighting, and
          validation.
        </p>
        <p>
          JSON viewers are used by developers, QA engineers, data analysts, and students who
          need to understand the shape of an API response, a configuration file, or any JSON
          payload. A good <strong>online JSON viewer</strong> runs entirely in your browser,
          validates your input, and lets you search and navigate deeply nested data.
        </p>
      </>
    ),
  },
  {
    q: 'What is a good JSON viewer?',
    a: (
      <>
        <p>
          A <strong>good JSON viewer</strong> is fast, accurate, private, and free of clutter.
          It should validate JSON against the official spec and tell you exactly where a syntax
          error is, down to the line and column. It should render large documents without
          freezing, ideally by only rendering the nodes you have expanded.
        </p>
        <p>
          It should support search across keys and values, allow you to copy any path or value
          to the clipboard, and offer a choice between a code editor view and a tree view. It
          should also respect your privacy: a good JSON viewer parses everything locally in
          your browser and never uploads your data. Our <strong>free online JSON viewer</strong>
          {' '}meets all of these criteria, with light and dark themes, type filters, and zero
          sign-up.
        </p>
      </>
    ),
  },
  {
    q: 'What is the best online JSON viewer?',
    a: (
      <>
        <p>
          The <strong>best online JSON viewer</strong> is the one that combines speed,
          accuracy, privacy, and a clean interface without locking features behind a paywall.
          Our tool checks every box: it loads in under a second, validates JSON in real time,
          and displays errors with line and column numbers.
        </p>
        <p>
          It renders large documents in a fast virtualized tree, supports in-document search
          and type filtering, and works on Chrome, Edge, Firefox, Safari, and mobile browsers.
          It is also completely free, with no ads, no sign-up, and no limits on document size.
          Because all parsing happens locally, your JSON never leaves your device — making it
          the <strong>best online JSON viewer</strong> for sensitive payloads, API responses,
          and proprietary data.
        </p>
      </>
    ),
  },
  {
    q: 'How to use the JSON viewer',
    a: (
      <>
        <p>Using our <strong>JSON viewer</strong> is simple.</p>
        <ol className="faq-steps">
          <li>
            <strong>Paste or load</strong> — paste your JSON into the editor, or load a sample
            to see how the tool works.
          </li>
          <li>
            <strong>Validate</strong> — the tool instantly validates your input. If valid, it
            is rendered as an interactive tree. If invalid, the viewer shows the exact line and
            column of the syntax error.
          </li>
          <li>
            <strong>Inspect</strong> — click any node in the tree to see its path, type, and
            value in the detail panel.
          </li>
          <li>
            <strong>Search & filter</strong> — use the search bar to find a key or value
            anywhere in the document, and use the type filter to show only strings, numbers,
            objects, arrays, booleans, or nulls.
          </li>
          <li>
            <strong>Export</strong> — use the toolbar to format (pretty-print) the JSON,
            minify it, copy it to your clipboard, clear it, or upload a <code>.json</code>{' '}
            file from your computer.
          </li>
        </ol>
      </>
    ),
  },
  {
    q: 'JSON viewer Chrome — how to use',
    a: (
      <>
        <p>
          To use this <strong>JSON viewer in Chrome</strong>, you do not need to install a
          Chrome extension at all. Just open the site in any tab in Google Chrome (or any
          Chromium-based browser such as Edge, Brave, or Arc) and start using the tool
          immediately.
        </p>
        <p>
          It works on Chrome 90 and above, including ChromeOS and Chrome on Android. This is
          faster, safer, and more flexible than a typical JSON viewer Chrome extension: there
          is nothing to install, no permissions to grant, no updates to manage, and your data
          stays in your browser tab instead of being processed by an extension. For the best
          experience, bookmark the page or install it as a Chrome app from the address bar's
          install button.
        </p>
      </>
    ),
  },
]

export default function Faq() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.q.includes('How to use')
          ? 'Using our JSON viewer is simple. 1) Paste or load your JSON. 2) Validate — the tool shows errors with line and column. 3) Inspect — click any node to see its path, type, and value. 4) Search and filter. 5) Export — format, minify, copy, or upload.'
          : 'See the full answer on the FAQ page at https://jsononlineviewer.com/faq',
      },
    })),
  }

  return (
    <>
      <Seo
        title="FAQ — JSON Online Viewer | Common Questions Answered"
        description="Frequently asked questions about the JSON Online Viewer: what it is, how to use it, how it works in Chrome, privacy, and more."
        keywords="json viewer faq, json viewer questions, json viewer help, json viewer chrome faq, how to use json viewer"
        canonical="https://jsononlineviewer.com/faq"
        jsonLd={jsonLd}
      />
      <PageLayout
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about the JSON Online Viewer."
      >
        <div className="faq-list">
          {FAQS.map((item, i) => (
            <details key={i} className="faq-item" name="faq">
              <summary className="faq-q">
                <span>{item.q}</span>
                <span className="faq-icon" aria-hidden="true" />
              </summary>
              <div className="faq-a">{item.a}</div>
            </details>
          ))}
        </div>
      </PageLayout>
    </>
  )
}
