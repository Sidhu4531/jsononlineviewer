import { Helmet } from 'react-helmet-async'

export default function Seo({
  title,
  description,
  keywords,
  canonical,
  noindex = false,
}) {
  const fullTitle = title ? `${title} | JSON Viewer` : 'JSON Viewer — Online JSON Formatter, Validator & Tree Explorer'
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {noindex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="JSON Viewer" />

      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:card" content="summary" />
    </Helmet>
  )
}
