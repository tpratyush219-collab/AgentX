# AgentX — Engineering the Digital Future

A buildless agency website using HTML5, CSS3, and vanilla JavaScript. The existing dark design, Space Grotesk/Inter typography, red/blue/violet palette, orbital hero, concept previews, animations, and responsive layouts are retained.

Production URL: **https://strong-tarsier-1ec529.netlify.app/**

## Run locally

From the project directory:

~~~powershell
python -m http.server 8000 --bind 127.0.0.1
~~~

Open **http://127.0.0.1:8000**. Stop the server with Ctrl+C. No installation or build command is needed. Use HTTP rather than opening the file directly so root-relative favicon and metadata assets resolve correctly.

Python's static server cannot process Netlify Forms: a local submission will show the error state, preserve the message, and offer the business email. A successful real submission requires a deployment on Netlify with form detection enabled.

## What changed

- Replaced the browser-only brief builder with a Netlify Forms integration. The enquiry form submits name, email, project type, optional selected package, and message to the same site over POST.
- Added required-field and email validation, trimmed-name/message checks, field-length limits, a hidden honeypot, duplicate-request prevention, a sending state, HTTP/network/offline/timeout handling, and accessible feedback.
- Success appears only after a successful HTTP response. Errors preserve the visitor's input. A timeout explains that receipt could not be confirmed, because a disconnected request might already have reached the server.
- Added **agentx.digital.official@gmail.com** in the contact section, FAQ, footer, and structured metadata. Removed the obsolete configuration notices and local brief copy/download controls.
- Added a short privacy notice beside the form and a fuller FAQ answer. These explain Netlify processing and storage and give a business email for data enquiries/deletion requests. No retention period, email delivery promise, or marketing consent is invented.
- Introduced **PRATYUSH TIWARI — Founder & Developer**, accurately described as a B.Tech Computer Science and Engineering student with interests in software development, AI, and modern digital experiences. The original brand artwork is retained; no portrait, clients, credentials, or years of experience are fabricated.
- Added landing pages **starting at ₹2,499**, business websites **starting at ₹4,999**, premium websites **starting at ₹9,999**, maintenance **starting at ₹999/month**, and **custom quotations for international projects**. The three-card pricing layout remains, with two complementary cards below. Starting prices do not promise a fixed scope, tax treatment, or third-party fees.
- Added canonical/Open Graph/social-card metadata, an accurate Organization/Person JSON-LD description, an SVG favicon and PNG fallbacks, an Apple touch icon, an actual 1200 × 630 social preview PNG, sitemap.xml, and robots.txt.
- Added a minimal netlify.toml: publish the project root, revalidate unversioned HTML/CSS/JS after deployment, send the correct content-sniffing protection header, and retain a standard referrer policy. No SPA catch-all redirect is added.

Advanced AI services remain **coming soon**, and Orbit/Forme remain clearly labelled **concept projects**.

## Important files and code

| File | Responsibility |
| --- | --- |
| index.html | Semantic content, inline SVG hero, static Netlify form declaration, privacy copy, founder, pricing, SEO/social metadata, and JSON-LD. |
| style.css | Existing visual system and breakpoints, plus matching price add-ons, founder identity, spinner, readable email links, and success/error states. |
| script.js | Existing UI enhancements; pricing context; async Netlify submission lifecycle, validation, duplicate prevention, and timeout/error recovery. |
| netlify.toml | Static publish directory and lightweight response headers. No build tool or API secret is required. |
| favicon.svg | Editable vector X monogram in the existing brand palette. |
| favicon.ico | PNG-backed ICO fallback for browsers that request the root icon automatically. |
| assets/favicon-32.png | 32px PNG browser fallback. |
| assets/apple-touch-icon.png | 180px home-screen icon. |
| assets/agentx-social-card.svg | Editable vector source for the branded social image. |
| assets/agentx-social-card.png | 1200 × 630 PNG used by Open Graph and social previews. |
| sitemap.xml / robots.txt | The canonical homepage sitemap and crawler instructions. Page-section fragments are not separate sitemap URLs. |

### Form markup and behaviour

The static form is named **agentx-enquiry** and includes method=POST, data-netlify=true, netlify-honeypot=bot-field, and an explicit hidden form-name value. Netlify can discover the form in the deployed HTML without executing JavaScript.

The submit handler builds FormData **before** disabling the fieldset, then URL-encodes it with URLSearchParams. The POST includes form-name and the empty bot-field, as required for Netlify detection and honeypot processing. No personal data is put into a URL query string.

While a request is in progress, the form is marked aria-busy, its inputs and button are disabled, repeated submissions are ignored, and pricing links cannot change the pending request's context. A 20-second timeout prevents an indefinitely disabled form. The status region announces feedback and receives focus for a completed attempt. The form resets only after HTTP acceptance; all failure paths retain the message.

Without JavaScript (or without fetch/AbortController), the enabled HTML form retains Netlify's native POST submission and default confirmation-page behaviour. Client-side validation improves usability and can be bypassed; Netlify handles ingestion and server-side spam filtering. This project does not add a separate server-side business-schema validation service.

There is no custom backend, API key, analytics, localStorage, or personal-data console logging. Browser autofill remains controlled by the visitor's browser. Email notifications are configured in Netlify, not by adding an inbox address to the HTML.

### Accessibility and performance

The original landmarks, skip link, focus styles, labelled controls, native FAQ disclosures, mobile menu Escape/focus handling, and animation pause remain. Form feedback is a persistent live region with atomic announcements. The OS reduced-motion preference stops both decorative animation and the submission spinner; text still communicates that a request is in progress.

No runtime dependencies were added. Hero and portfolio visuals remain inline SVG/HTML/CSS. Favicon assets are small, and the social preview image is referenced in metadata rather than rendered in the page. Unused brief-export icons/styles were removed. Google Fonts remains the only external presentation dependency; system fallbacks work when it is unavailable. Netlify caching revalidates unversioned code to avoid stale code after a deploy.

## Manual Netlify configuration

1. Open the **existing** Netlify project for strong-tarsier-1ec529. In **Forms**, enable **form detection**. If it is already enabled, leave it enabled.
2. Deploy this updated project to that same site. For a Git-connected site, use its normal commit/push/deploy workflow. For a manual deploy, upload the updated site folder including the assets folder, favicon, sitemap, and robots file. Build command: **none**. Publish directory: **.** (project root). The supplied netlify.toml declares that directory for configured builds. Enabling detection requires a subsequent deployment to discover the new form.
3. In **Forms**, confirm that **agentx-enquiry** appears, and check that its extra spam prevention/honeypot is recognised. Netlify strips its special detection attributes from served HTML during post-processing; that is expected.
4. In **Forms → Submission notifications**, add an email notification for agentx-enquiry to **agentx.digital.official@gmail.com**. Complete any recipient-confirmation step Netlify requests. Adding the address to the website alone does **not** configure notification delivery.
5. Send a genuine test enquiry from the newly deployed website. Confirm it appears under the form's **Verified submissions**, and then check the business inbox. If missing, check the form's **Spam submissions** and Gmail spam folder. A successful website response confirms HTTP acceptance; it does not guarantee that an email notification arrived or bypassed spam filtering.
6. Review the site's current Forms usage/billing allowance in Netlify and ensure the business inbox can receive notifications. Manage stored submissions and deletion requests through the Forms dashboard and any email copies you retain.
7. If the site gets a custom domain, update the canonical URL, og:url, og:image, twitter:image, JSON-LD IDs/URL, sitemap location, and robots sitemap URL together, then redeploy.

Honeypot filtering complements Netlify's automatic Akismet filtering. A heavier CAPTCHA is not added to the page; if abuse warrants one later, configure Netlify's supported CAPTCHA flow and update the submission integration accordingly.

Official references:

- [Netlify Forms setup and AJAX submissions](https://docs.netlify.com/manage/forms/setup/)
- [Netlify spam filters and honeypots](https://docs.netlify.com/manage/forms/spam-filters/)
- [Netlify submission notifications](https://docs.netlify.com/manage/forms/notifications/)

## Verification and limits

Reviewed on **24 November 2026**. The live page was fetched successfully before editing and matched the existing local site. **59 headless Chrome browser checks passed**, including layouts at **320, 375, 390, 640, 768, 850, 1024, and 1440px**, readable 16px body text/inputs, preserved UI controls, accurate founder/pricing copy, form validation and all submission states, same-origin URL-encoded payloads, package reset, metadata, asset dimensions, reduced motion, named interactive accessibility nodes, no-JavaScript fallback, and blocked-font fallback. No missing local resources, broken fragment links, or uncaught JavaScript exceptions were found. Desktop/mobile screenshots and the exported icons/social card were visually reviewed.

Additional source checks validate JavaScript syntax, HTML nesting/IDs/labels/ARIA references, local asset paths, SVG/sitemap XML, robots.txt, netlify.toml, and Git whitespace errors.

Submission-state tests use intercepted local HTTP responses and dummy test values. They verify the client behaviour for acceptance, server errors, network failures, offline use, spam honeypots, timeouts, and duplicate submissions; they do **not** claim live Netlify storage or inbox delivery. No test enquiry is sent to the live site or business inbox by these checks.

Netlify account settings, form discovery after deployment, notification activation, live submission storage, and actual inbox receipt must be verified using the manual steps above. This workspace update does not deploy the site or change account settings. Visual/accessibility checks are targeted and do not constitute a full cross-browser or accessibility certification.
