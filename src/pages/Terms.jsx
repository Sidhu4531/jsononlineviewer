import PageLayout from '../components/PageLayout.jsx'
import Seo from '../components/Seo.jsx'

export default function Terms() {
  return (
    <>
      <Seo
        title="Terms & Conditions — JSON Online Viewer | Usage Agreement"
        description="Read the Terms and Conditions for using JSON Online Viewer. Free for personal and commercial use, no warranty, fair-use guidelines, and contact information."
        keywords="json viewer terms, json viewer conditions, terms of service, usage agreement, free json tool terms"
        canonical="https://jsononlineviewer.com/terms"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Terms & Conditions — JSON Online Viewer',
          url: 'https://jsononlineviewer.com/terms',
        }}
      />
      <PageLayout
        title="Terms & Conditions"
        subtitle="Last updated: June 5, 2026"
      >
        <p>
          By accessing and using <strong>JSON Online Viewer</strong> (the "Service"), you
          agree to be bound by these Terms & Conditions. If you do not agree, please do not
          use the Service.
        </p>

        <h2>1. The Service</h2>
        <p>
          JSON Online Viewer is a free, browser-based tool for formatting, validating, and
          exploring JSON data. The Service is provided "as is" and "as available", without
          warranty of any kind.
        </p>

        <h2>2. License to Use</h2>
        <p>
          You may use the Service for personal, educational, and commercial purposes, free of
          charge, without creating an account. You may bookmark the site, share links to it,
          and integrate it into your documentation or workflow.
        </p>
        <p>
          You may <strong>not</strong>:
        </p>
        <ul>
          <li>
            Use the Service to violate any applicable law, regulation, or third-party right.
          </li>
          <li>
            Attempt to disrupt, overload, or compromise the integrity or performance of the
            Service.
          </li>
          <li>
            Scrape, mirror, or republish the Service in a way that suggests endorsement by us
            without permission.
          </li>
          <li>
            Use the Service to process data that you do not have the legal right to access.
          </li>
        </ul>

        <h2>3. Your Data</h2>
        <p>
          As described in our <a href="/privacy-policy">Privacy Policy</a>, your JSON input
          is processed entirely in your browser and is not transmitted to us. You retain full
          ownership and responsibility for any data you choose to view, format, or copy using
          the Service.
        </p>

        <h2>4. Intellectual Property</h2>
        <p>
          The Service, including its design, code, branding, and documentation, is owned by
          the JSON Online Viewer team and is protected by copyright and other applicable laws.
          You may not copy, redistribute, or create derivative works of the Service's source
          code or branding without prior written permission.
        </p>

        <h2>5. Third-Party Content</h2>
        <p>
          The Service may display links to third-party websites or resources. We are not
          responsible for the content, accuracy, or practices of those third parties, and
          inclusion of a link does not imply endorsement.
        </p>

        <h2>6. Disclaimer of Warranties</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT. WE DO NOT WARRANT THAT THE
          SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR THAT IT WILL MEET YOUR REQUIREMENTS.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE JSON ONLINE VIEWER
          TEAM BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE
          DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, PROFITS, OR GOODWILL, ARISING
          OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
        </p>

        <h2>8. Changes to the Service</h2>
        <p>
          We reserve the right to modify, suspend, or discontinue the Service, in whole or in
          part, at any time and without notice. We will, where reasonable, post a notice on
          the home page before any major change.
        </p>

        <h2>9. Changes to These Terms</h2>
        <p>
          We may update these Terms from time to time. The "Last updated" date at the top
          reflects the most recent change. Continued use of the Service after a change
          constitutes acceptance of the updated Terms.
        </p>

        <h2>10. Governing Law</h2>
        <p>
          These Terms are governed by the laws of the jurisdiction in which the operator of
          the Service is established, without regard to conflict-of-laws principles.
        </p>

        <h2>11. Contact</h2>
        <p>
          For questions about these Terms, please visit our <a href="/contact">contact page</a>.
        </p>
      </PageLayout>
    </>
  )
}
