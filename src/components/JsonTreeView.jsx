import { useState, useCallback, useMemo, memo, useTransition } from 'react';

const CHUNK_SIZE = 500;
const ABSOLUTE_MAX = 5000;

const TypeBadge = memo(({ type }) => {
  const colors = {
    string: { bg: 'rgba(10,124,58,0.1)', color: 'var(--json-string)' },
    number: { bg: 'rgba(26,86,219,0.1)', color: 'var(--json-number)' },
    boolean: { bg: 'rgba(155,28,155,0.1)', color: 'var(--json-boolean)' },
    null: { bg: 'rgba(155,28,155,0.1)', color: 'var(--json-null)' },
    object: { bg: 'rgba(110,168,254,0.1)', color: 'var(--accent)' },
    array: { bg: 'rgba(110,168,254,0.1)', color: 'var(--accent)' },
  };
  const style = colors[type] || colors.object;
  return (
    <span
      style={{
        fontSize: 11,
        padding: '1px 6px',
        borderRadius: 3,
        background: style.bg,
        color: style.color,
        marginLeft: 6,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {type}
    </span>
  );
});

const PreviewText = memo(({ value }) => {
  if (value === null) return <span style={{ color: 'var(--json-null)' }}>null</span>;
  if (typeof value === 'boolean') return <span style={{ color: 'var(--json-boolean)' }}>{String(value)}</span>;
  if (typeof value === 'number') return <span style={{ color: 'var(--json-number)' }}>{value}</span>;
  if (typeof value === 'string') {
    const s = value.length > 30 ? value.slice(0, 30) + '...' : value;
    return <span style={{ color: 'var(--json-string)' }}>"{s}"</span>;
  }
  return null;
});

const ValueDisplay = memo(({ value, searchTerm }) => {
  const renderHL = (text) => {
    if (!searchTerm) return text;
    const str = String(text);
    const idx = str.toLowerCase().indexOf(searchTerm.toLowerCase());
    if (idx === -1) return str;
    return (
      <>
        {str.slice(0, idx)}
        <mark style={{ background: 'var(--warning)', color: '#000', borderRadius: 2, padding: '0 1px' }}>
          {str.slice(idx, idx + searchTerm.length)}
        </mark>
        {str.slice(idx + searchTerm.length)}
      </>
    );
  };
  if (value === null) return <span style={{ color: 'var(--json-null)' }}>null</span>;
  if (typeof value === 'boolean') return <span style={{ color: 'var(--json-boolean)' }}>{String(value)}</span>;
  if (typeof value === 'number') return <span style={{ color: 'var(--json-number)' }}>{value}</span>;
  if (typeof value === 'string') {
    const maxLen = 200;
    const display = value.length > maxLen ? value.slice(0, maxLen) + '...' : value;
    return <span style={{ color: 'var(--json-string)' }}>"{renderHL(display)}"</span>;
  }
  return <span>{String(value)}</span>;
});

const KeyDisplay = memo(({ nodeKey }) => {
  if (nodeKey === undefined) return null;
  if (typeof nodeKey === 'number') {
    return <span style={{ color: 'var(--json-bracket)' }}>{nodeKey}</span>;
  }
  return (
    <>
      <span style={{ color: 'var(--json-key)' }}>"{nodeKey}"</span>
      <span style={{ color: 'var(--text-secondary)' }}>: </span>
    </>
  );
});

const TreeNode = memo(({ nodeKey, value, depth, defaultExpanded, searchTerm, maxItemsPerLevel }) => {
  const initialLimit = maxItemsPerLevel || 100;
  const [expanded, setExpanded] = useState(
    typeof defaultExpanded === 'number' ? depth < defaultExpanded : depth < 2
  );
  const [visibleLimit, setVisibleLimit] = useState(initialLimit);
  const [isPending, startTransition] = useTransition();

  const toggle = useCallback(() => setExpanded(e => !e), []);

  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const isLeaf = !isObject;

  const itemCount = isArray ? value.length : (isObject ? Object.keys(value).length : 0);

  const visibleEntries = useMemo(() => {
    if (isLeaf) return [];
    if (isArray) return value.slice(0, visibleLimit);
    const keys = Object.keys(value);
    const n = Math.min(visibleLimit, keys.length);
    const result = [];
    for (let i = 0; i < n; i++) result.push([keys[i], value[keys[i]]]);
    return result;
  }, [value, isLeaf, isArray, visibleLimit]);

  const isTruncated = itemCount > visibleLimit;
  const remaining = itemCount - visibleLimit;

  const loadChunk = useCallback(() => {
    startTransition(() => {
      setVisibleLimit(prev => Math.min(prev + CHUNK_SIZE, itemCount));
    });
  }, [itemCount]);

  const loadAllRemaining = useCallback(() => {
    startTransition(() => {
      setVisibleLimit(prev => Math.min(prev + 1000, itemCount));
    });
  }, [itemCount]);

  if (isLeaf) {
    const hide = searchTerm && nodeKey !== undefined &&
      !String(nodeKey).toLowerCase().includes(searchTerm.toLowerCase());
    if (hide) return null;
    return (
      <div style={{ paddingLeft: depth * 20, lineHeight: '26px', display: 'flex', alignItems: 'baseline', flexWrap: 'nowrap' }}>
        <span style={{ color: 'var(--text-secondary)', userSelect: 'none', width: 16, display: 'inline-block', flexShrink: 0 }} />
        <KeyDisplay nodeKey={nodeKey} />
        <ValueDisplay value={value} searchTerm={searchTerm} />
      </div>
    );
  }

  const openBracket = isArray ? '[' : '{';
  const closeBracket = isArray ? ']' : '}';

  const previewVals = useMemo(() => {
    if (isArray) {
      const fv = [];
      if (value.length > 0) fv.push(value[0]);
      if (value.length > 1) fv.push(value[1]);
      return fv;
    }
    const keys = Object.keys(value);
    const fv = [];
    if (keys.length > 0) fv.push([keys[0], value[keys[0]]]);
    if (keys.length > 1) fv.push([keys[1], value[keys[1]]]);
    return fv;
  }, [value, isArray]);

  const matchesSearch = useMemo(() => {
    if (!searchTerm) return false;
    if (nodeKey !== undefined && String(nodeKey).toLowerCase().includes(searchTerm.toLowerCase())) return true;
    const limit = Math.min(itemCount, 50);
    if (isArray) {
      for (let i = 0; i < limit; i++) {
        if (typeof value[i] === 'string' && value[i].toLowerCase().includes(searchTerm.toLowerCase())) return true;
      }
    } else {
      const keys = Object.keys(value);
      for (let i = 0; i < Math.min(limit, keys.length); i++) {
        const v = value[keys[i]];
        if (typeof v === 'string' && v.toLowerCase().includes(searchTerm.toLowerCase())) return true;
      }
    }
    return false;
  }, [searchTerm, nodeKey, isArray, value, itemCount]);

  if (searchTerm && !matchesSearch) {
    if (itemCount <= 50) return null;
    const keys = isArray ? null : Object.keys(value);
    const limit = Math.min(itemCount, 50);
    for (let i = 0; i < limit; i++) {
      const v = isArray ? value[i] : value[keys[i]];
      if (v !== null && typeof v === 'object') {
        return (
          <div style={{ paddingLeft: depth * 20, lineHeight: '26px' }}>
            <KeyDisplay nodeKey={nodeKey} />
            <span style={{ color: 'var(--json-bracket)' }}>{openBracket}...</span>
          </div>
        );
      }
    }
    return null;
  }

  const showMaxNotice = visibleLimit >= ABSOLUTE_MAX && remaining > 0;

  return (
    <div>
      <div
        onClick={toggle}
        style={{
          paddingLeft: depth * 20,
          lineHeight: '26px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'nowrap',
          userSelect: 'none',
          borderRadius: 4,
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{
          color: 'var(--text-secondary)',
          width: 16,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 10,
          transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>▶</span>
        <KeyDisplay nodeKey={nodeKey} />
        <span style={{ color: 'var(--json-bracket)' }}>{openBracket}</span>
        {!expanded && (
          <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 4 }}>
            {itemCount} {isArray ? 'items' : 'keys'}
            {previewVals.length > 0 && (
              <span style={{ marginLeft: 4 }}>
                <PreviewText value={isArray ? previewVals[0] : previewVals[0][1]} />
                {previewVals.length > 1 && (
                  <span>, <PreviewText value={isArray ? previewVals[1] : previewVals[1][1]} /></span>
                )}
                {itemCount > 2 && ' ...'}
              </span>
            )}
          </span>
        )}
        {!expanded && <span style={{ color: 'var(--json-bracket)', marginLeft: 2 }}>{closeBracket}</span>}
        <TypeBadge type={isArray ? 'array' : 'object'} />
        {isPending && <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--text-muted)' }}>loading...</span>}
      </div>
      {expanded && (
        <>
          {visibleEntries.map((entry, i) => {
            const [k, v] = isArray ? [i, entry] : entry;
            return (
              <TreeNode
                key={isArray ? i : k}
                nodeKey={k}
                value={v}
                depth={depth + 1}
                defaultExpanded={defaultExpanded}
                searchTerm={searchTerm}
                maxItemsPerLevel={maxItemsPerLevel}
              />
            );
          })}
          {showMaxNotice && (
            <div style={{ paddingLeft: (depth + 1) * 20, lineHeight: '26px', color: 'var(--text-muted)', fontSize: 12, fontStyle: 'italic' }}>
              ... and {remaining} more items (display limit reached)
            </div>
          )}
          {!showMaxNotice && remaining > 0 && (
            <div
              onClick={remaining <= CHUNK_SIZE ? loadAllRemaining : loadChunk}
              style={{
                paddingLeft: (depth + 1) * 20,
                lineHeight: '26px', cursor: 'pointer',
                color: 'var(--accent)', fontSize: 12, fontWeight: 500,
                opacity: isPending ? 0.5 : 1,
                userSelect: 'none',
              }}
            >
              {remaining <= CHUNK_SIZE
                ? `... Show remaining ${remaining} items`
                : `... Show ${CHUNK_SIZE} more (${remaining} remaining)`
              }
            </div>
          )}
          <div style={{ paddingLeft: depth * 20, lineHeight: '26px', color: 'var(--json-bracket)' }}>
            <span style={{ color: 'var(--text-secondary)', width: 16, display: 'inline-block' }} />
            {closeBracket}
          </div>
        </>
      )}
    </div>
  );
});

const JsonTreeView = ({ data, defaultExpanded, searchTerm, maxItemsPerLevel }) => {
  if (data === null || data === undefined) {
    return <div style={{ padding: 20, color: 'var(--text-secondary)' }}>No data to display</div>;
  }
  return (
    <div style={{ padding: '12px 0', fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.5 }}>
      <TreeNode
        nodeKey={undefined}
        value={data}
        depth={0}
        defaultExpanded={defaultExpanded}
        searchTerm={searchTerm}
        maxItemsPerLevel={maxItemsPerLevel}
      />
    </div>
  );
};

export default JsonTreeView;
