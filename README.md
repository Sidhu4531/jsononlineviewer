# JSON Viewer

A fast, modern JSON viewer, formatter, validator and tree explorer. Built with React + Vite.

## Features

- **Tree view** — color-coded expandable nodes (string / number / boolean / null / object / array)
- **Text view** — editable editor with line numbers and live error reporting
- **Split view** — editor + tree side by side
- **Format / Minify** — pretty-print or compress with configurable indent
- **Validate** — real-time JSON parsing with line + column error reporting
- **Search** — highlights matching paths, auto-expands containing nodes
- **Type filter** — show only strings, numbers, booleans, etc.
- **Path inspector** — click any node to see its JSON path (`$.users[0].name`), type, and value
- **Open file** — load a `.json` file from disk
- **Sample data** — quick-load examples (basic, nested, API response, GeoJSON, large 500-item)
- **Light / dark theme** — toggle, persisted to localStorage
- **Persistence** — your input survives a refresh
- **100% client-side** — no data leaves your browser

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

### Option A — CLI (fastest, one-off deploy)

```bash
# 1. Build the site
npm run build

# 2. Install wrangler (the Cloudflare CLI)
npm install -g wrangler
# or use npx:
npx wrangler --version

# 3. Login to your Cloudflare account (opens a browser)
npx wrangler login

# 4. Deploy the dist/ folder to Cloudflare Pages
npx wrangler pages deploy dist --project-name=json-viewer
```

First deploy creates the project. Subsequent deploys push to the same project. After the command finishes you'll get a URL like:

```
https://jsononlineviewer.com
```

For branch-based deploys (preview branches), use:
```bash
npx wrangler pages deploy dist --project-name=json-viewer --branch=main
```

### Option B — Git integration (recommended for ongoing work)

1. Push your project to GitHub/GitLab:
   ```bash
   git init && git add . && git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USER/json-viewer.git
   git push -u origin main
   ```

2. Go to <https://dash.cloudflare.com/?to=/:account/pages> and click **Create a project → Connect to Git**.

3. Select the repo and configure the build:
   - **Framework preset**: `Vite` (or `None`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: `20` (set in Environment variables: `NODE_VERSION=20`)

4. Click **Save and Deploy**. Every push to `main` auto-deploys. PRs get preview URLs.

### SPA routing

`public/_redirects` is included so deep links like `/some/path` serve `index.html`. Cloudflare Pages automatically picks this up — no config needed.

### Custom domain

In the Cloudflare dashboard → your Pages project → **Custom domains** → add your domain. Cloudflare will auto-provision the certificate.

## Project structure

```
src/
├── main.jsx          # React entry
├── App.jsx           # Layout + state
├── styles.css        # Light + dark theme
├── components/
│   ├── Toolbar.jsx   # Top bar: tabs, actions, search, filter
│   ├── TreeView.jsx  # Recursive tree renderer
│   ├── Editor.jsx    # Editable textarea with gutter
│   └── StatusBar.jsx # Bottom: validity, size, node count, path
└── lib/
    ├── utils.js      # parse, format, minify, path, search
    └── samples.js    # Built-in sample data
```

## Keyboard / mouse

- **Click a node** to select it; its path appears in the right panel and status bar.
- **Click the caret** (`▸` / `▾`) to expand/collapse a container.
- **Click "Copy"** on a value in the detail panel to copy it.
- **Type in the editor** — the tree updates as you type (live, no save button).

## License

MIT.
