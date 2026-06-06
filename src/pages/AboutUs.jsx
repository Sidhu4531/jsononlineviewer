import { Link } from 'react-router-dom'
import PageLayout from '../components/PageLayout.jsx'
import Seo from '../components/Seo.jsx'

export default function AboutUs() {
  return (
    <>
      <Seo
        title="About Us — JSON Online Viewer | Free Browser-Based JSON Tool"
        description="Learn about JSON Online Viewer, a free, privacy-first JSON formatter, validator and tree explorer built for developers. Meet the team, our mission, and the values behind the tool."
        keywords="about json online viewer, json viewer team, json formatter company, free json tool, json viewer mission, about us"
        canonical="https://jsononlineviewer.com/about-us"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Us — JSON Online Viewer',
          url: 'https://jsononlineviewer.com/about-us',
          description:
            'Learn about JSON Online Viewer, a free privacy-first JSON formatter, validator and tree explorer built for developers.',
        }}
      />
      <PageLayout
        title="About Us"
        subtitle="Building the fastest, most private JSON tool on the web — for free."
      >
        <p>
          <strong>JSON Online Viewer</strong> was started by a small team of developers who
          were tired of slow, ad-laden, and privacy-hostile JSON tools. Every existing viewer
          seemed to either require a sign-up, send your data to a remote server, or limit the
          features you actually need. We built this site to fix that.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is simple: make working with JSON faster, safer, and more delightful for
          every developer, analyst, and learner on the web. We believe essential developer
          tools should be <strong>free, private, and accessible to everyone</strong> — no
          paywalls, no email gates, no tracking pixels.
        </p>

        <h2>What We Believe</h2>
        <ul>
          <li>
            <strong>Privacy is non-negotiable.</strong> Your JSON never leaves your browser.
            Every byte of parsing, formatting, and validation happens locally on your device.
            We literally cannot see your data, and we do not want to.
          </li>
          <li>
            <strong>Speed matters.</strong> A developer tool should feel instant. The site
            loads in under a second, the editor responds as you type, and large documents stay
            responsive because we only render the nodes you expand.
          </li>
          <li>
            <strong>No dark patterns.</strong> No ads. No upsells. No "upgrade to Pro" banners
            popping up over your JSON. Just the tool.
          </li>
          <li>
            <strong>Standards-compliant validation.</strong> Strict JSON parsing, accurate
            line-and-column error reporting, and full support for Unicode and large numbers.
          </li>
        </ul>

        <h2>Who Uses JSON Online Viewer</h2>
        <p>
          Tens of thousands of developers, QA engineers, API integrators, data analysts,
          technical writers, and students use our tool every month. It is used to debug REST
          and GraphQL responses, format config files, validate payloads before shipping,
          teach JSON syntax in classrooms, and quickly inspect data exports from third-party
          services.
        </p>

        <h2>How It Is Built</h2>
        <p>
          The tool is built with React, Vite, and modern web standards. It is a fully client-side
          progressive web app hosted on Cloudflare Pages, which lets us serve the static bundle
          from a global edge network for near-instant loads anywhere in the world. There is no
          backend that touches your data — the parser, the formatter, the tree view, and the
          search engine all run in your browser tab.
        </p>
      </PageLayout>
    </>
  )
}
