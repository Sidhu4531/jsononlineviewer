import App from '../App.jsx'
import About from '../components/About.jsx'
import Faq from '../components/Faq.jsx'
import ScrollHint from '../components/ScrollHint.jsx'

export default function Home() {
  return (
    <>
      <ScrollHint />
      <App />
      <About />
      <Faq />
    </>
  )
}
