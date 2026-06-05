import { Helmet } from 'react-helmet-async'

export default function Seo({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  jsonLd,
  noindex = false,
}) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, follow" />}

      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="JSON Online Viewer" />
      <meta property="og:image" content="https://jsononlineviewer.com/og-image.png" />

      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content="https://jsononlineviewer.com/og-image.png" />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
