# Koyo Docs

Source for the Koyo documentation site, hosted at
https://justphemi.github.io/koyo-docs.

A static site: plain HTML, CSS, and vanilla JavaScript. No build step and
no Node dependency to view it locally. Open `docs/index.html` directly in
a browser or serve the `docs/` folder with any static file server.

## Layout

- `docs/index.html` and the section pages in `docs/`
- `docs/styles.css` shared stylesheet (light and dark theme via CSS custom
  properties, following `prefers-color-scheme` and an explicit override
  stored in local storage)
- `docs/theme.js` applies the theme before first paint
- `docs/nav.js` single source for the sidebar navigation structure
- `docs/app.js` renders the shared header, sidebar, and footer, and runs
  search and the chat assistant
- `docs/search-index.js` generated search index (see `tools/`)
- `docs/config.js` local Groq API key, ignored by git, never committed

## Code blocks

Syntax highlighting uses highlight.js, vendored at
`docs/assets/vendor/highlight.min.js` (offline and `file://` friendly, no CDN
at runtime). Every `<pre><code>` in the documentation and every code block in
the chat assistant is highlighted and gets a copy button on the top right.
Token colors come from the theme variables in `docs/styles.css`, so both the
light and dark themes render code cleanly.

## Chat rendering

Assistant replies are rendered from a small, dependency free markdown subset
(paragraphs, headings, lists, bold, italic, inline code, and fenced code
blocks). Input is HTML-escaped before rendering, and fenced blocks go through
the same highlight.js and copy-button pipeline as the static pages.

## Search index

The client side search uses a small hand rolled scorer against a static
index. Regenerate the index after editing page content:

    python3 tools/build_search_index.py

Run it from the repository root. It scans the HTML pages under `docs/`
and writes `docs/search-index.js`.

## Chat assistant

The assistant calls the Groq chat completions API directly from the
browser. It reads its key and model from `docs/config.js`. That file is
gitignored; the checked in example is `docs/config.example.js`:

    cp docs/config.example.js docs/config.js

Then replace the placeholder key with a real Groq API key from
https://console.groq.com. The key lives in client side JavaScript, so it
is visible to anyone who inspects the network requests. That is a
deliberate tradeoff for a static docs site with no backend.

## Deploy

No push or GitHub Pages configuration is done by the setup script. When
you are ready, push this repository to GitHub as `koyo-docs` and enable
GitHub Pages from the `/docs` folder of the main branch.

## Notes

No emojis and no em dashes anywhere in this project, including in this
file.