import PageLayout from "../components/PageLayout.jsx";
import Seo from "../components/Seo.jsx";

export default function PrivacyPolicy() {
  return (
    <PageLayout
      title="Privacy Policy"
      subtitle="What we collect, what we don't, and why."
    >
      <Seo
        title="Privacy Policy"
        description="The privacy policy for JSON Viewer. We are a 100% client-side tool: nothing you paste is uploaded, logged, or shared."
        canonical="https://jsononlineviewer.com/privacy-policy"
      />

      <p>
        <strong>Short version:</strong> we don&apos;t collect, store, or
        transmit any of the JSON you paste into the tool. The site has no
        backend for your data, no analytics on your input, and no third-party
        scripts that read what you type.
      </p>

      <h2>1. Information we do not collect</h2>
      <p>
        The JSON Viewer is a static, single-page web app. Everything you paste
        into the editor is processed by JavaScript running in your own browser.
        The text is <strong>never sent to a server</strong> operated by us. We
        have no database, no upload endpoint, and no logging of input.
      </p>

      <h2>2. Information stored on your device</h2>
      <p>
        For your convenience, we use your browser&apos;s{" "}
        <code>localStorage</code> to save:
      </p>
      <ul>
        <li>The current JSON input &mdash; so it survives a page refresh.</li>
      </ul>
      <p>
        This data stays on your device. You can clear it at any time with your
        browser&apos;s site-data settings.
      </p>

      <h2>3. Analytics and cookies</h2>
      <p>
        The site does not set advertising or marketing cookies, and it does not
        use third-party analytics that fingerprint your input. We may use
        privacy-respecting, aggregate, cookie-less page-view counters in the
        future; if we do, this page will be updated.
      </p>

      <h2>4. Third-party services</h2>
      <p>
        The site is hosted on a static CDN (Cloudflare Pages). Like every web
        request, the hosting provider sees your IP address and the URL of the
        page you request &mdash; but not the JSON you paste. The page itself
        contains no third-party trackers, fonts, or scripts beyond the React
        build.
      </p>

      <h2>5. Children&apos;s privacy</h2>
      <p>
        The site is suitable for all ages and does not knowingly collect any
        information from children.
      </p>

      <h2>6. Changes to this policy</h2>
      <p>
        If we update this policy, we will revise the &quot;Last updated&quot;
        date below. Material changes will be highlighted on the home page.
      </p>

      <h2>7. Contact</h2>
      <p>
        Questions about privacy? Reach out via the{" "}
        <a href="/contact">contact page</a>.
      </p>

      <p>
        <em>Last updated: June 2026.</em>
      </p>
    </PageLayout>
  );
}
