# Stomach Vacuum Guide

Static, no-build site that teaches the stomach vacuum in five levels (belly breathing, lying, all fours, standing/seated, advanced). Live at https://mattias.github.io/stomach-vacuum/ (GitHub Pages, repo `mattias/stomach-vacuum`, public because Pages on a free account needs it).

The user writes Swedish to me. Reply in Swedish unless asked otherwise. The site itself is English (default), Swedish and Japanese.

## Files

- `index.html`: all page content. The visible text is the **English** version. Inline SVG symbols (`#lying`, `#quad`, `#stand`, `#plank`, `#yt`) are reused by the level cards.
- `styles.css`: tokens (light and dark via `prefers-color-scheme` plus `data-theme`), layout, illustration classes.
- `i18n.js`: `window.I18N` with `sv` and `ja` strings. `en` only holds strings that are not in the markup (title, description, timer messages `ui.*`, YouTube queries `lN.qN`).
- `app.js`: language switch, per-level "done" tracker (localStorage `vacuum-done`), hold timer, new-tab hints.
- `README.md` documents run, translate and publish.

## i18n rules

- Every translatable element has `data-i18n="key"` (innerHTML), `data-i18n-aria="key"` (aria-label) or `data-q="key"` (YouTube search query). `app.js` captures the English text from the markup at start-up, so **edit English in `index.html`, Swedish and Japanese in `i18n.js`**.
- When adding or changing text, change all three languages and keep the same keys in `sv` and `ja`. Missing keys fall back to English.
- Language comes from `?lang=`, then localStorage `sv-lang`, then English. Do not auto-detect the browser language: English is the intended default.
- Timer text (`#ts`, `#go`) has no `data-i18n`. It is rendered from `stateKey` in `app.js` so a language switch mid-hold keeps the right state.
- Video links are **YouTube search URLs built per language**, not specific videos (specific URLs could not be verified). If the user supplies real video URLs, replace the `data-q` links.
- Japanese needs `word-break:auto-phrase` and a smaller h1 (already in `styles.css`) or headings break mid-word.

## Content decisions (keep these)

- Safety wording was reviewed and tightened: breathe out calmly without forcing, never hold breath under load (squats), stop on dizziness/headache, extended contraindication list, Nauli warning. Do not reintroduce "press all air out" phrasing.
- No claim that the exercise slims the waist or burns belly fat.
- Frequency rule: daily at levels 1–2, every other day at 3–4, 2–3 sessions per week at 5.
- The Swedish and Japanese texts were written by me, not by a native reviewer. Suggest a native check before wider sharing.

## Gotchas learned

- Step lists use `position:absolute` number badges with left padding. A grid `<li>` made bold lead-ins (`<b>`) into separate grid items and broke text into one word per line on levels 4 and 5.
- Chips nav needs padding around items or `overflow-x:auto` clips the focus ring.
- `.go` button text must use `var(--bg)`, a hardcoded dark colour fails contrast in the light theme.
- Timer: `fmt()` must handle 60 s (`01:00`). Presets are disabled while the timer runs.

## Local preview

Node and Python may not be on PATH. Use any static file server, for example Python's built-in one (find an interpreter with `Get-Command python3.13` or similar):

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/. `file://` is blocked in the built-in browser, so use the server.

## Git and deploy

- Remote `origin` = `git@github.com:mattias/stomach-vacuum.git`. Pages deploys from `main` at `/`, so a push to `main` republishes in about 30 seconds.
- Work on a branch (the user is asked via `propose_branch`), then merge to `main`. `feat/i18n-site` is the first branch and equals `main` at the first release.
- Commit messages end with `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Commit or push only when the user asks.
- Never put local paths, usernames, machine names, e-mail addresses or tokens in tracked files. The repo is public. Check with `git grep -n -i -E "C:\\\\Users|AppData|@"` before committing.

## History

Started as a single Swedish-only Claude artifact page, reviewed by five Haiku agents (layout, accessibility, timer logic, content/safety, language/SVG). Findings that were real were fixed. Findings that were not: missing doctype/viewport (the artifact skeleton adds them) and "dead light-theme guard" (it works when `data-theme="light"` is set). The artifact at claude.ai is the old Swedish version and is **not** updated from this repo.

## Not done

- No LICENSE file (ask the user which one).
- No real per-video YouTube links.
- Only the Japanese layout was checked visually at a narrow width; Swedish and English were verified via script, not by eye on all breakpoints.
