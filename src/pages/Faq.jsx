import PageLayout from '../components/PageLayout.jsx'
import Seo from '../components/Seo.jsx'
import FaqTab from '../components/FaqTab.jsx'

export default function Faq() {
  return (
    <PageLayout
      title="FAQ"
      subtitle="Frequently asked questions about JSON Viewer."
    >
      <Seo
        title="FAQ"
        description="Answers to common questions about JSON Viewer: what it is, how to use it, and how it works in Chrome and other browsers."
        canonical="https://jsononlineviewer.com/faq"
      />
      <FaqTab />
    </PageLayout>
  )
}
