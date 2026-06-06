const FAQS = [
  {
    q: 'What is a JSON viewer?',
    a: (
      <>
        <p>
          A <strong>JSON viewer</strong> is a tool that formats and displays
          <strong> JSON (JavaScript Object Notation)</strong> data in a human-readable way. JSON
          is a text-based data format widely used in APIs, configuration files, and data
          storage, but raw JSON is often minified and hard to read.
        </p>
        <p>
          A JSON viewer parses the data and presents it with proper indentation, color-coded
          syntax (strings, numbers, booleans, etc.), and an interactive tree structure you can
          expand or collapse to explore nested values.
        </p>
      </>
    )
  },
  {
    q: 'What is a good JSON viewer?',
    a: (
      <>
        <p>A good JSON viewer should:</p>
        <ul>
          <li>Format (pretty-print) and validate JSON with clear error messages including <strong>line and column numbers</strong></li>
          <li>Support both a <strong>pretty-printed text view</strong> and an <strong>expandable tree view</strong></li>
          <li>Highlight matches when <strong>searching</strong> across keys and values</li>
          <li>Let you click any value to see its <strong>JSON path</strong> (<code>$.users[0].name</code>), type, and contents</li>
          <li>Work entirely in your browser so your data is <strong>never uploaded</strong></li>
          <li>Handle <strong>large documents</strong> without freezing</li>
        </ul>
        <p>This tool is built around those principles.</p>
      </>
    )
  },
  {
    q: 'What is the best online JSON viewer?',
    a: (
      <>
        <p>
          The <strong>best online JSON viewer</strong> is one that is fast, free, private and
          feature-complete. This tool checks every box:
        </p>
        <ul>
          <li>Live <strong>validation</strong> with line/column error reporting</li>
          <li><strong>Format</strong> (pretty-print) and <strong>Minify</strong> with configurable indent (2, 4, or tab)</li>
          <li>Two output modes: <strong>color-coded text</strong> and <strong>expandable tree</strong></li>
          <li><strong>Search</strong> across keys and values, with auto-expanding matches</li>
          <li>Click any value to inspect its <strong>path, type and contents</strong></li>
          <li>Open <code>.json</code> files, or load built-in <strong>samples</strong></li>
          <li>Input is saved to <strong>local storage</strong> so it survives a refresh</li>
          <li><strong>100% client-side</strong> &mdash; nothing is sent to a server</li>
        </ul>
      </>
    )
  },
  {
    q: 'How to use the JSON viewer?',
    a: (
      <>
        <ol>
          <li>Paste your JSON into the <strong>Input</strong> panel on the left.</li>
          <li>The <strong>Output</strong> panel on the right updates live with formatted, color-coded JSON.</li>
          <li>Use the toolbar to <strong>Format</strong> (pretty-print), <strong>Minify</strong>, <strong>Copy</strong>, or <strong>Open</strong> a <code>.json</code> file.</li>
          <li>Click any value in the output to see its <strong>JSON path</strong>, <strong>type</strong> and <strong>contents</strong> in the side panel.</li>
          <li>Type in the search box to find keys or values across the whole document &mdash; matches are highlighted and auto-expanded.</li>
          <li>Switch between the <strong>Formated</strong> and <strong>Tree</strong> tabs to choose your preferred view.</li>
        </ol>
      </>
    )
  },
  {
    q: 'JSON viewer Chrome — how to use?',
    a: (
      <>
        <p>
          This JSON viewer works in <strong>Google Chrome</strong> (and every other modern
          browser) with <strong>no install required</strong>:
        </p>
        <ol>
          <li>Open the site in Chrome.</li>
          <li>Paste your JSON into the editor on the left.</li>
          <li>Use the <strong>Formated</strong> tab for syntax-highlighted pretty-printing, or switch to <strong>Tree</strong> for an expandable view.</li>
          <li>Click the &nbsp;<strong>&nbsp;&#x2B07; Install</strong>&nbsp; icon in Chrome's address bar to add it as a desktop / home-screen app &mdash; it then works fully offline.</li>
          <li>For quick reuse, <strong>bookmark the page</strong> or pin the tab.</li>
        </ol>
        <p>
          Unlike a Chrome <em>extension</em>, this viewer requires no permissions, no updates,
          and never reads the pages you visit &mdash; it only runs on jsononlineviewer.com.
        </p>
      </>
    )
  }
]

export default function FaqTab() {
  return (
    <div className="info-tab faq-tab">
      <h2 className="tab-h2">Frequently asked questions</h2>
      <p className="tab-lead">
        Quick answers about JSON viewers and how to use this tool.
      </p>

      <div className="faq-list" role="list">
        {FAQS.map((item, i) => (
          <details key={i} className="faq-item" open={i === 0}>
            <summary className="faq-q" role="button">
              <span>{item.q}</span>
              <span className="faq-icon" aria-hidden="true" />
            </summary>
            <div className="faq-a">{item.a}</div>
          </details>
        ))}
      </div>
    </div>
  )
}
