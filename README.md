# AgentX

A lightweight agency landing page for **AgentX — Engineering the Digital Future**, built with HTML5, CSS3, and vanilla JavaScript. No framework, package manager, build step, or runtime library is required.

## Run locally

Open `index.html` directly in a modern browser, or serve the project folder for a more representative preview:

```powershell
cd D:\AgentX\AgentX
python -m http.server 8000 --bind 127.0.0.1
```

Then visit **http://127.0.0.1:8000**. Stop the server with `Ctrl+C`. VS Code Live Server is also suitable if already installed.

The page works from `file://`; clipboard access can be unavailable there. The enquiry download and selectable-text fallback do not require a connected delivery service. For deployment, upload `index.html`, `style.css`, and `script.js` together to any static host. No deployment has been configured by this project.

## Files and important code

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic sections, navigation, inline SVG artwork and icons, HTML/CSS concept previews, native FAQ disclosures, accessible form fields, integration notices, and search/social metadata. |
| `style.css` | Brand variables, typography, responsive grids, glass-like surfaces, gradients, orbital animation, focus indicators, mobile navigation, reduced-motion and forced-colour support. |
| `script.js` | Mobile menu, active navigation, progressive scroll reveals, animation pause control, project details, single-open FAQ behaviour, pricing context, and the local enquiry builder. |
| `README.md` | Setup, architecture, customisation, integration requirements, and verification notes. |

### Page structure

- Sticky, responsive navigation with a keyboard-accessible mobile disclosure.
- Animated hero with an original inline SVG glass X and blue, violet, and red orbital rings.
- Six service cards; advanced AI solutions are explicitly **coming soon**.
- Two self-initiated concept projects: **Orbit**, a productivity dashboard, and **Forme**, an imagined architecture studio website. These are illustrative previews, not live apps or client work. Their details buttons explain the scope.
- A semantic four-stage development process: Discover, Design, Develop, Deliver.
- Three quote-based starting points: Launch, Build, Evolve. No fees or delivery schedules have been invented. Package links preselect enquiry context without overwriting the visitor's message.
- A founder introduction area with original brand artwork and a clear notice that verified personal details are pending.
- Native `<details>` / `<summary>` FAQs, enhanced to keep one answer open at a time.
- Contact enquiry builder with browser validation, a selectable brief, clipboard copying, and a text-file download.
- Footer navigation and a year updated with JavaScript.

### Brand and typography

The original five hex values were not supplied. The palette reflects the follow-up request for a professional blend of red, blue, and neon colours. Change these five foundations at the top of `style.css`:

| Variable | Colour | Purpose |
| --- | --- | --- |
| `--ink` | `#09090F` | Near-black canvas |
| `--white` | `#F6F5FF` | Primary reading text |
| `--violet` | `#9568FF` | Brand identity and violet lighting |
| `--blue` | `#4D7CFF` | Electric blue accents |
| `--red` | `#FF4D6D` | Neon red highlights |

Tonal derivatives create borders, surfaces, and gradients. Hero SVG gradients use explicit colour values in `index.html`; update those too if you replace the palette. Chart, miniature concept previews, favicon, and some decorative CSS also have local colour values.

Headings use **Space Grotesk** and body text uses **Inter**, requested from Google Fonts with `display=swap`. System sans-serif fallbacks remain usable if the fonts cannot load. Body copy and form controls use 16px text; labels and metadata have a deliberate smaller hierarchy. Miniature text inside portfolio artwork is decorative and hidden from screen readers.

Google Fonts is the only external asset dependency. To make the site fully self-contained, download the appropriate licensed WOFF2 files, add `@font-face` rules, and remove the three Google Fonts links in the HTML head. The current `assets/` folder is unused. There are no image downloads, icon libraries, analytics, cookies, or application dependencies.

### Interaction and accessibility

The page includes landmarks, a skip link, one `<h1>`, sequential section headings, persistent form labels, native required-field validation, visible focus outlines, and accessible disclosure buttons. The mobile menu closes on Escape, link selection, outside clicks, focus leaving the header, or a breakpoint change. Escape returns focus to its toggle. It is a navigation disclosure, so keyboard focus is not trapped.

CSS respects `prefers-reduced-motion` by disabling animations, transitions, and smooth scrolling. A visible hero control can pause animation independently. Scroll reveals are enabled only when `IntersectionObserver` exists; content stays available without that API. In forced-colour mode, gradient text uses a readable solid colour.

Without JavaScript, navigation links and FAQ answers still work, and content stays visible. The enquiry fields remain disabled with a `<noscript>` explanation. The submit listener is registered before enabling the form, preventing an accidental native GET submission if the script fails early.

### How enquiries work

This is a **local brief builder**, not a connected contact form:

1. The visitor enters a name, valid email, project type, and a project description of 20–4,000 characters.
2. **Prepare my enquiry** validates the inputs and creates a text preview in memory. The result explicitly says it has not been sent.
3. **Copy brief** uses the Clipboard API on supported secure origins, such as HTTPS or localhost. If clipboard permission is unavailable, the text is selected and a download fallback is explained.
4. **Download .txt** creates a temporary browser Blob and requests a local download. Its object URL is revoked after use.
5. Editing the form clears the prepared preview, preventing an old brief from looking current. Reloading the page discards the in-memory brief.

There are no `fetch` calls, email actions, server uploads, local storage, fabricated success messages, or personal-data console logs in `script.js`. Entered text is rendered through `textContent` rather than `innerHTML`.

## What needs configuration before a business launch

| Item | Current state | Required work |
| --- | --- | --- |
| Enquiry delivery | **Not connected**, labelled beside the form and in the FAQ | Choose a backend or form service; implement server-side validation, spam protection, an appropriate privacy notice, and verified delivery. Update the UI to report success only after confirmed receipt. Keep API secrets on the server. |
| Contact details | **Not configured** | Supply verified business email, phone, and/or social links before adding them. There are deliberately no invented addresses or empty social links. |
| Booking | **Not connected** | Supply a real scheduling URL or integration if desired. |
| Founder | Personal introduction pending | Provide the real name, approved biography, and an authorised portrait if wanted. Replace the notice and brand artwork as appropriate. |
| Pricing and terms | Quote-based starting points | Confirm actual offerings, fees, deliverables, billing terms, third-party costs, and support commitments before publishing them. No payment integration exists. |
| Portfolio | Labelled concept projects | Replace or supplement with authorised real work and accurate descriptions when available. Do not remove concept labels from fictional work. |
| Advanced AI services | **Coming soon** | Validate real capabilities and readiness before offering these services or adding a booking/purchase path. |
| Production hosting and SEO | Local source only | Configure a real domain and HTTPS; add the actual canonical URL, `og:url`, a real social image, sitemap, and robots configuration. Metadata intentionally contains no fabricated domain. |
| Legal/business details | Not supplied | Add appropriate, accurate privacy and business information for the eventual services and hosting setup. |

## Verification

Reviewed on **24 November 2026** using the installed Chrome browser in headless mode and a local HTTP server. **45 browser checks passed**, covering:

- Layout widths of **320, 375, 390, 640, 768, 1024, and 1440px**, with no horizontal page overflow and 16px reading text and input controls.
- Loaded fonts and CSS, mobile menu opening/closing, Escape focus restoration, animation pause, concept disclosures, and the FAQ accordion.
- Pricing context, required fields, invalid email rejection, whitespace-only description rejection, safe rendering of HTML-like input, result focus, and stale-preview clearing.
- Clipboard success and denial branches using a test clipboard stub; an actual downloaded text file matching the prepared brief; and **no network requests during enquiry preparation, copying, or download**.
- Reduced motion, named interactive nodes in Chrome’s accessibility tree, no-JavaScript fallback, and narrow layout with Google Fonts blocked.
- **No uncaught JavaScript errors.** Duplicate ID and internal anchor checks also passed.

Representative desktop and mobile screenshots were visually reviewed. Primary, secondary, muted, placeholder, and primary-button colour pairs were checked and each met a 4.5:1 text contrast ratio. This is targeted verification, not a complete accessibility certification or cross-browser/device lab audit. The in-app browser bridge was unavailable; the installed headless browser provided the rendering and interaction checks instead.

Follow-up checks also verify that switching package suggestions refreshes an automatically selected project type while preserving a manual selection and the visitor’s message.

For future edits, check desktop, tablet, and narrow mobile layouts; keyboard navigation and Escape; concept disclosure buttons; FAQ expansion; OS reduced-motion settings; empty/invalid form fields; brief preparation and stale-preview clearing; clipboard denial; and the downloaded text file. Check for console errors and unexpected network requests after each interaction.

Keep in mind that a static front end does not provide a CMS, server-side processing, e-commerce checkout, payments, booking, AI agent execution, or analytics. Those capabilities require a separately agreed implementation.
