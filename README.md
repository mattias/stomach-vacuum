# Stomach Vacuum Guide

A small static site that teaches the stomach vacuum in five levels, from belly breathing to advanced holds. It has inline illustrations for each level, a hold timer, a "mark level as done" tracker and links to YouTube searches.

Languages: English (default), Swedish and Japanese. Use the EN / SV / 日本語 switch in the top bar, or open the page with `?lang=sv` or `?lang=ja`. The choice is remembered in the browser.

No build step and no dependencies. The only external request is Google Fonts.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page content. The visible text is the English version. |
| `styles.css` | Design tokens (light and dark theme), layout and the illustration styles. |
| `i18n.js` | Swedish and Japanese strings, plus the page title, timer messages and YouTube search queries for all three languages. |
| `app.js` | Language switch, level progress, hold timer. |

## Run locally

Any static file server works. With Python:

```powershell
python -m http.server 8765
```

Then open <http://127.0.0.1:8765/>.

## Translations

Every translatable element in `index.html` has a `data-i18n="key"` attribute (or `data-i18n-aria="key"` for `aria-label`, or `data-q="key"` for a YouTube search query). `app.js` reads the English text from the markup at start-up, so English is edited in `index.html` and Swedish and Japanese in `i18n.js`. Keys that are missing in a language fall back to English.

To add a language: add its code to `LANGS` in `app.js`, add a button to `.lang` in `index.html`, and add a block to `i18n.js` with the same keys as `sv`.

## Publish with GitHub Pages

Push the repository to GitHub, then open **Settings → Pages** and choose **Deploy from a branch** with `main` and `/ (root)`. The site is served from the repository root.

## Disclaimer

The guide is general training information. It does not replace medical advice.
