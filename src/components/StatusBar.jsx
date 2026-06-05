import { pathToString } from '../lib/utils.js'

export default function StatusBar({ valid, empty, sizeText, nodes, depth, lines, selectedPath, error }) {
  let validityClass = 'ok'
  let validityText = empty ? 'Empty' : valid ? 'Valid JSON' : 'Invalid JSON'
  if (!empty && !valid) validityClass = 'err'

  return (
    <footer className="statusbar">
      <div className={`status-validity ${validityClass}`}>
        {empty ? '○' : valid ? '●' : '✕'} {validityText}
      </div>
      {error && !empty && (
        <div className="status-error" title={error.message}>
          Line {error.line}, col {error.col}
        </div>
      )}
      <div className="status-spacer" />
      <div className="status-stat">{lines} {lines === 1 ? 'line' : 'lines'}</div>
      <div className="status-stat">{nodes} {nodes === 1 ? 'node' : 'nodes'}</div>
      <div className="status-stat">Depth {depth}</div>
      <div className="status-stat">{sizeText}</div>
      {selectedPath && selectedPath.length > 0 && (
        <div className="status-path" title={pathToString(selectedPath)}>
          {pathToString(selectedPath)}
        </div>
      )}
    </footer>
  )
}
