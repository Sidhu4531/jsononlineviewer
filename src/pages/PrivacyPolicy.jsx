import PageLayout from '../components/PageLayout.jsx'
import Seo from '../components/Seo.jsx'

export default function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Privacy Policy — JSON Online Viewer | Zero Data Collection"
        description="Read the privacy policy of JSON Online Viewer. We collect nothing, we track nothing, and your JSON never leaves your browser. 100% client-side, 100% private."
        keywords="json viewer privacy policy, json viewer data policy, private json formatter, no tracking json tool, client side json viewer"
        canonical="https://jsononlineviewer.com/privacy-policy"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'PrivacyPolicy',
          name: 'Privacy Policy — JSON Online Viewer',
          url: 'https://jsononlineviewer.com/privacy-policy',
        }}
      />
      <PageLayout
        title="Privacy Policy"
        subtitle="Last updated: June 5, 2026"
      >
        <p>
          Your privacy is the foundation of <strong>JSON Online Viewer</strong>. This policy
          explains, in plain language, exactly what data we collect (almost none), what we do
          with it (nothing), and what rights you have.
        </p>

        <h2>1. Summary</h2>
        <p>
          <strong>We do not collect, store, transmit, or analyze your JSON data.</strong>{' '}
          All parsing, formatting, validation, and tree rendering happen locally in your
          browser using JavaScript. Your input never leaves your device.
        </p>

        <h2>2. Data We Do Not Collect</h2>
        <ul>
          <li>The JSON you paste, type, or upload into the editor.</li>
          <li>The output of the formatter, validator, or tree view.</li>
          <li>File names, file contents, or metadata of files you open.</li>
          <li>Keystrokes, mouse movements, or any input events.</li>
          <li>Your IP address in association with your tool usage.</li>
        </ul>

        <h2>3. Data We Do Collect</h2>
        <p>
          When you visit the site, our hosting provider (Cloudflare) may collect standard,
          non-identifying server logs such as your IP address, user agent, request URL, and
          HTTP status code. These logs are used solely for security, abuse prevention, and
          aggregate performance monitoring. They are not sold, shared with third parties for
          marketing, or correlated with any personal identifier.
        </p>
        <p>
          We use a privacy-respecting analytics provider that does not set advertising
          cookies or fingerprint your device. Analytics data is aggregated and anonymous. We
          do not use Google Analytics, Facebook Pixel, or any cross-site tracking technology.
        </p>

        <h2>4. Cookies and Local Storage</h2>
        <p>
          The site stores the following in your browser's <code>localStorage</code> only, and
          never transmits it to any server:
        </p>
        <ul>
          <li>The text of your last JSON input (so a refresh does not lose your work).</li>
          <li>Your chosen theme (light or dark).</li>
        </ul>
        <p>
          You can clear these at any time from your browser settings. No third-party cookies
          are set, and no advertising cookies are used.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>
          We use the following third-party services to operate the site. Each has its own
          privacy practices:
        </p>
        <ul>
          <li>
            <strong>Cloudflare Pages</strong> — hosts the static site on a global CDN.
          </li>
          <li>
            <strong>Privacy-respecting analytics</strong> — measures aggregate traffic with
            no personal identifiers.
          </li>
        </ul>
        <p>
          We do not embed third-party ads, social widgets, fonts loaded from third parties,
          or any other resource that could profile you across sites.
        </p>

        <h2>6. Children's Privacy</h2>
        <p>
          The site is not directed to children under 13, and we do not knowingly collect any
          information from children. Because we collect nothing from anyone, this policy is
          trivially satisfied.
        </p>

        <h2>7. Your Rights</h2>
        <p>
          Because we do not collect personal data, there is nothing to access, correct, or
          delete. If you have any questions, you can contact us via the{' '}
          <a href="/contact">contact page</a>.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          If we ever change this policy in a material way, we will update the "Last updated"
          date at the top of this page. Material changes will be highlighted on the home page
          for at least 30 days.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions about this policy? Visit our <a href="/contact">contact page</a>.
        </p>
      </PageLayout>
    </>
  )
}
