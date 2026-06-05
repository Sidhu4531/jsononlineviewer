export default function ScrollHint() {
  return (
    <a className="scroll-hint" href="#about" aria-label="Scroll to about section">
      <span className="scroll-hint-text">More about this tool</span>
      <svg className="scroll-hint-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  )
}
