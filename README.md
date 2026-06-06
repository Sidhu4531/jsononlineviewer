# JSON Viewer

A free, fast, in-browser JSON viewer, formatter and validator inspired by
[jsonviewer.stack.hu](https://jsonviewer.stack.hu/). Built with React + Vite.

## Features

- **Live JSON validation** with line / column error reporting
- **Format (pretty-print)** and **Minify** with configurable indent (2, 4 or tab)
- **Two output modes**:
  - **Formated** &mdash; color-coded pretty-printed text (brackets in green, strings in
    blue, numbers / booleans / null in distinct colors). Click any object or array to
    collapse it.
  - **Tree** &mdash; expandable / collapsible tree. Click a value to see its path, type
    and contents in the right-hand detail panel.
- **Search** across keys and values &mdash; matches are highlighted and auto-expanded
- **Open `.json` files** from disk
- **Built-in samples**: basic, nested, API response, cricket match, GeoJSON, 500-item array
- **Detail panel**: click any value to see its JSON path (`$.users[0].name`), type, and
  the raw value (with a Copy button)
- **Status bar**: validity, line/col error, byte size, node count, depth, selected path
- **Persisted input** &mdash; your JSON survives a refresh
- **100% client-side** &mdash; no data leaves your browser

## Tabs

The single-page app has four tabs at the top (matching the reference layout):

1. **JSON Viewer** &mdash; the main tool, with editor, format controls, and output
2. **Example** &mdash; pre-loaded sample documents you can copy
3. **About JSON** &mdash; what JSON is, the data types, and an example
4. **About** &mdash; what this site is and a privacy note

## Quick start

```bash
npm install
npm run dev
```

Opens on <http://localhost:5175>.

## Build

```bash
npm run build
npm run preview
```

Output goes to `dist/`.

## Deploy to Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy dist --project-name=json-viewer
```

First deploy creates the project; subsequent deploys push to the same project.

## Project structure

```
src/
├── main.jsx                       # React entry
├── App.jsx                        # Top-level shell + tab nav
├── styles.css                     # Light theme
├── components/
│   ├── ViewerTab.jsx              # Main viewer (editor + output + status)
│   ├── JsonText.jsx               # Color-coded pretty-printed text view
│   ├── JsonTree.jsx               # Expandable tree view
│   ├── Editor.jsx                 # Textarea with line-number gutter
│   ├── ExampleTab.jsx             # Sample documents
│   ├── AboutJsonTab.jsx           # About JSON content
│   └── AboutTab.jsx               # About this site content
└── lib/
    ├── utils.js                   # parse, format, minify, path, search
    └── samples.js                 # Built-in sample data
```

## License

MIT.
