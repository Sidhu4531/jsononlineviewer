import PageLayout from '../components/PageLayout.jsx'
import Seo from '../components/Seo.jsx'

export default function Terms() {
  return (
    <PageLayout
      title="Terms & Conditions"
      subtitle="The rules for using JSON Viewer."
    >
      <Seo
        title="Terms & Conditions"
        description="The terms and conditions for using JSON Viewer. The tool is free to use, provided as-is, with no warranty."
        canonical="https://jsononlineviewer.com/terms"
      />

      <p>
        By using JSON Viewer you agree to the following simple terms. The tool is free, the
        source is open, and we ask for nothing in return except that you don&apos;t use it
        to do anything illegal.
      </p>

      <h2>1. The service</h2>
      <p>
        JSON Viewer is a free, browser-based tool for formatting, validating and exploring
        JSON data. It is provided as-is, with no warranty of any kind, and may be modified,
        suspended, or discontinued at any time without notice.
      </p>

      <h2>2. Acceptable use</h2>
      <p>You agree not to use the site to:</p>
      <ul>
        <li>Process data that you do not have the right to handle.</li>
        <li>Attempt to disrupt, reverse-engineer, or overload the service.</li>
        <li>Scrape, mirror, or republish the site in a way that misrepresents its origin.</li>
        <li>Use the site for any unlawful purpose.</li>
      </ul>

      <h2>3. Your data</h2>
      <p>
        You retain full ownership of any JSON you paste into the tool. We do not access,
        store, or transmit it. See our <a href="/privacy-policy">Privacy Policy</a> for
        details.
      </p>

      <h2>4. No warranty</h2>
      <p>
        The site is provided <strong>&quot;as is&quot;</strong> and <strong>&quot;as available&quot;</strong>{' '}
        without any warranties, express or implied. We do not guarantee that the tool will
        be uninterrupted, error-free, or that the results will be accurate for any specific
        purpose. Always validate important data with a second tool.
      </p>

      <h2>5. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, the operators of JSON Viewer are not liable
        for any indirect, incidental, special, consequential, or punitive damages arising
        from your use of the site.
      </p>

      <h2>6. Changes</h2>
      <p>
        We may update these terms occasionally. Continued use of the site after changes
        means you accept the new terms. The &quot;Last updated&quot; date below shows when
        the most recent change was made.
      </p>

      <h2>7. Governing law</h2>
      <p>
        These terms are governed by the laws of the jurisdiction in which the operator is
        based, without regard to its conflict-of-laws principles.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about these terms? Use the <a href="/contact">contact page</a>.
      </p>

      <p><em>Last updated: January 2026.</em></p>
    </PageLayout>
  )
}
