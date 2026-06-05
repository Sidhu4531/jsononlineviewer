export default function Toolbar({
  view,
  onView,
  onFormat,
  onMinify,
  onCopy,
  onClear,
  onSample,
  onFile,
  onTheme,
  theme,
  copied,
  samples,
  indent,
  onIndent,
  search,
  onSearch,
  typeFilter,
  onTypeFilter,
}) {
  return (
    <header className="toolbar">
      <div className="toolbar-row">
        <div className="brand">
          <span className="brand-icon">{"{"}</span>
          <span className="brand-name">JSON Viewer</span>
        </div>

        <div className="view-tabs" role="tablist" aria-label="View mode">
          <button
            role="tab"
            className={view === "tree" ? "tab active" : "tab"}
            onClick={() => onView("tree")}
            aria-selected={view === "tree"}
          >
            🌳 Tree
          </button>
          {/* <button
            role="tab"
            className={view === 'editor' ? 'tab active' : 'tab'}
            onClick={() => onView('editor')}
            aria-selected={view === 'editor'}
          >✏️ Text</button> */}
          <button
            role="tab"
            className={view === "split" ? "tab active" : "tab"}
            onClick={() => onView("split")}
            aria-selected={view === "split"}
          >
            ⊟ Split
          </button>
        </div>

        <div className="toolbar-actions">
          <button
            className="action"
            onClick={onFormat}
            title="Format (pretty-print)"
          >
            ↔ Format
          </button>
          <button
            className="action"
            onClick={onMinify}
            title="Minify (remove whitespace)"
          >
            ⇤ Minify
          </button>
          <button className="action" onClick={onCopy} title="Copy to clipboard">
            {copied ? "✓ Copied" : "⧉ Copy"}
          </button>
          <button className="action" onClick={onFile} title="Open .json file">
            📁 Open
          </button>
          <select
            className="action"
            onChange={(e) => e.target.value && onSample(e.target.value)}
            value=""
            title="Load sample JSON"
            aria-label="Load sample JSON"
          >
            <option value="">📋 Sample</option>
            {samples.map((s) => (
              <option key={s.key} value={s.key}>
                {s.name}
              </option>
            ))}
          </select>
          <label className="action" title="Indent size">
            Indent
            <select
              className="inline-select"
              value={indent}
              onChange={(e) => onIndent(Number(e.target.value))}
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="tab">Tab</option>
            </select>
          </label>
          <button className="action" onClick={onClear} title="Clear input">
            ✕ Clear
          </button>
          <button
            className="action theme-btn"
            onClick={onTheme}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>

      <div className="toolbar-row toolbar-row-2">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="search"
            className="search-input"
            placeholder="Search keys or values…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => onSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="filter-pills" role="group" aria-label="Filter by type">
          {[
            "all",
            "string",
            "number",
            "boolean",
            "null",
            "object",
            "array",
          ].map((t) => (
            <button
              key={t}
              className={typeFilter === t ? "pill active" : "pill"}
              onClick={() => onTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
