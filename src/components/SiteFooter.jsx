import { Link } from "react-router-dom";
import { useTheme } from "../lib/ThemeContext.jsx";

const LINKS = [
  { to: "/faq", label: "FAQ" },
  { to: "/about-us", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/privacy-policy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const { theme, toggle } = useTheme();
  return (
    <footer className="site-footer site-footer-simple">
      <div className="site-footer-simple-inner">
        <nav className="site-footer-links" aria-label="Footer">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="site-footer-link">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="theme-toggle-wrap">
          <span>© {year} JSON Viewer. Free, in-browser JSON tools.</span>
          <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode" title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? '\u2600' : '\u263E'}
          </button>
        </div>
      </div>
    </footer>
  );
}
