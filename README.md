# danielsullivanportfolio.com

Daniel Sullivan's marketing portfolio. Plain HTML and CSS with no build step. Vercel deploys every push to `main`.

## Pages

| URL | File | What it is |
|---|---|---|
| `/` | `index.html` | Homepage: hero, My approach, How I lead, What I build, Contact |
| `/trade-shows-conferences` | `trade-shows-conferences.html` | Section: Trade Shows & Conferences (cards with a slide-in drawer for each case study) |
| `/partner-marketing-strategy` | `partner-marketing-strategy.html` | Section index: Partner Marketing Strategy |
| `/cisco-partner-marketing-maturity` | `cisco-partner-marketing-maturity.html` | Case study: Cisco Partner Marketing Maturity Model |
| `/sample-partner-maturity-assessment` | `sample-partner-maturity-assessment.html` | Supporting page: fictional Northstar assessment |
| `/marketing-strategy-innovation` | `marketing-strategy-innovation.html` | Section index: Marketing Strategy & Innovation (now also lists the Cisco audience strategy case study) |
| `/events-experiences` | `events-experiences.html` | Section index: Events & Experiences (Sumo Slam Jam, Global Sales Kickoff, Threat Hunting Workshops; detail pages to come) |
| `/demand-revenue-marketing` | `demand-revenue-marketing.html` | Section index: Demand & Revenue Marketing, with the "My approach: Account-Based Marketing" section (intro, six principles, 1:1 / 1:Few / 1:Many models, closing statement), collapsed behind a full-width "Explore the framework" bar (`.disc-bar`, same `data-disclosure` JS as the homepage) (`/demand-revenue-marketing#abm` opens it). Two content areas: **Perspectives & Approaches** (ABM) and **Case Studies & Initiatives** (gallery generated from `data/case-studies.json`, see "Adding a case study to Demand & Revenue Marketing") |
| `/sumo-logic-pipeline-acceleration` | `sumo-logic-pipeline-acceleration.html` | Case study: Turning Stalled Pipeline Into Revenue Opportunity (Sumo Logic; hero metrics, pipeline progression, Salesforce + intent diagram, four activation plays, results with attribution notes) |
| `/partner-led-revenue-engine` | `partner-led-revenue-engine.html` | Case study: Building a Partner-Led Revenue Engine From the Ground Up (Sumo Logic). One canonical page with two cards: Partner Marketing Strategy (hand-written `.card`, leadership/30-day framing) and Demand & Revenue Marketing (entry `partner-trial-demand` in `data/case-studies.json`, conversion framing). A small inline script points the breadcrumb and back button at whichever section the visitor came from (default: Partner Marketing Strategy). Scroll reveal on the journey only |
| `/competitive-displacement-abm` | `competitive-displacement-abm.html` | Case study: Winning Competitive Accounts Through Precision ABM (Sumo Logic; May 2024 SIEM events, four intelligence inputs → 120 accounts, three ABM tiers 10/25/85, four activation pillars, results journey; no dollar figures). Card is entry `competitive-displacement-abm` in `data/case-studies.json` |
| `/ai-innovation` | `ai-innovation.html` | Section index: AI & Innovation ("Projects & experiments"; cards: the event lead qualification, building recertification and technical barriers case studies; the "coming soon" state returns only if `.cases` is emptied) |
| `/ai-recertification-leadership` | `ai-recertification-leadership.html` | Case study: Navigating a Complex Building Recertification with AI (volunteer condominium leadership; three hero fact cards, challenge, three native `<details>` accordions with AI-applied examples and slide thumbnails that open in a `<dialog>` viewer, takeaway). Slides are real screenshots in `assets/recert-*.webp`: slide 10 has contractor names and bid amounts blurred and slide 16 has dollar amounts blurred (baked into the pixels); slides 4 and 15 are unblurred. The page says only "condominium association", never the association's name. No outcomes beyond the figures in the Nov 2025 presentation |
| `/cisco-unified-audience-strategy` | `cisco-unified-audience-strategy.html` | Case study: Cisco unified audience strategy (before/after, three persona cards, playbook capabilities, strategy-to-activation diagram, qualitative impact, restricted playbook gallery with placeholder covers and a mailto access request; no Cisco files are in the repo) |
| `/ai-event-lead-qualification` | `ai-event-lead-qualification.html` | Case study: Transforming Event Lead Qualification with AI (illustrative Before / After demo with a German → English toggle, six-step workflow, estimated-vs-reported results, Automate → Augment → Elevate). Inline script for the demo animation; everything shows its final state without JS or with reduced motion |
| `/technical-data-barriers` | `technical-data-barriers.html` | Case study: Breaking Down Technical Barriers with AI (before/with-Claude contrast panels, four capability cards, flow from business need to personalized intelligence with a mock Sales view labeled Illustrative Concept and fictional data, Behind the Build technology labels and workflow, three qualitative outcomes). No screenshots, metrics or deployed-system claims; the Illustrative Concept label must stay. Small inline script for the scroll-in animation; final state shows without JS or with reduced motion |
| `/global-planning-framework` | `global-planning-framework.html` | Case study: Global Field & Partner Marketing Planning Framework |
| `/predictable-demand-engine` | `predictable-demand-engine.html` | Leadership framework: Building a Predictable Demand Engine (measurement scorecard, diagnostics, illustrative demand-forecast calculator with an inline script, operating cadence) |

Shared files: `assets/site.js` (footer year, case-study drawers, collapsible sections, mobile menu, Google Analytics click events, outreach alerts) and `assets/` (images).

Outreach alerts: visitors who arrive on one of Daniel's outreach links (`utm_campaign` starting `job-search`, where `utm_source` is the company and `utm_medium` the channel; or `utm_medium=outreach`) send short messages (campaign tags, page path, event name, random visit id, device type) to a Google Apps Script web app that logs them in Daniel's Google Sheet and emails him. Nothing is sent for other visitors. The account and channel are kept in one first-party cookie (`ds_outreach`, 90 days) shared with the demo subdomains, which run the same code in their `public/outreach.js`; keep the copies in step. Preview deployments send messages marked as tests. The endpoint URL is `ENDPOINT` near the outreach block in `site.js`; if the Apps Script is redeployed as a new deployment, update it there.
`vercel.json` turns on clean URLs, so `/partner-marketing-strategy` serves `partner-marketing-strategy.html`.

## Adding a case study to Demand & Revenue Marketing

The gallery on `/demand-revenue-marketing` is rendered from `data/case-studies.json` into static HTML (so it stays crawlable and there is still no build step for deploys).

1. Build the detail page by copying `sumo-logic-pipeline-acceleration.html` (change canonical, `og:*`, title and description) and add it to `sitemap.xml`.
2. Add an entry to `data/case-studies.json`: `id`, `company`, `category`, `title`, `description`, `href`, optional `cta`, and an optional `result`: `{ "value": "40", "label": "…" }` for a metric or `{ "text": "…" }` for a qualitative outcome (leave `result` out if there is none).
3. Run `node scripts/render-case-studies.mjs` and commit the updated page. Only published studies get a card; there are no placeholder cards.

New approaches go in the "Perspectives & Approaches" area (`#perspectives`), after the ABM section, using the same `.abm` heading and rule pattern.

## Design system

Every page uses the same tokens, defined at the top of its `<style>` block:

- Colors: ground `#F4F3EF`, paper `#FFFFFF`, ink `#111111`, body `#2B2B2B`, muted `#565656`, line `#D6D3CB`
- Type: Inter Tight (display, 600–700), Inter (body), IBM Plex Mono (small uppercase labels)
- Components: `.btn` / `.btn--ghost`, `.card`, `.tag`, `.sec-head`, the `.cats` section switcher, and `.crumbs` breadcrumbs

Keep new pages consistent with these. Each page carries its own copy of the CSS, so if you change a token, change it on every page.

## Common edits

- **Add a section to the homepage:** in `index.html`, copy one `<li class="cat">…</li>` in the "What I build" list, update the number, title, description, featured example and link. Then add the section to the `.cats` switcher on each section page.
- **Add a case study to Trade Shows & Conferences:** copy one `<article class="card">…</article>` and its matching `<dialog id="dlg-…">…</dialog>`. Give both the same new id: the button uses `data-dialog="dlg-<id>"`.
- **Add a case study to Partner Marketing Strategy or Marketing Strategy & Innovation:** add a card on the section index page and create a new case-study page by copying an existing one (for example `global-planning-framework.html`).
- **External links** (live demos) use `target="_blank" rel="noopener"` plus a visually hidden "(opens in a new tab)" label.
- **Adding a new page:** in its `<head>`, update the block after the meta description: `rel="canonical"` and `og:url` must be `https://danielsullivanportfolio.com/<page-name>` (no `.html`, no `www`), and `og:title` / `og:description` should match the page's `<title>` and meta description. Then add the URL to `sitemap.xml`.

## Collapsible sections (progressive disclosure)

How I lead on the homepage collapses to its headline, tagline and intro paragraph; a click or tap anywhere on the header opens the whole section. To reuse it on another section (e.g. My approach):

1. Add `data-disclosure` to the `<section>` and `data-disclosure-head` to its `.sec-head`.
2. Copy the `<button class="disc-btn" … data-disclosure-toggle>` ("Expand +" / "Collapse −") from How I lead into the header; change its `aria-controls` and the hidden label text.
3. Wrap whatever should be hidden in `<div class="disc-panel" id="…" data-disclosure-panel><div class="disc-inner">…</div></div>` (class `disc-body` for the content below the header). List every panel id in `aria-controls`.

The content stays in the HTML (readable by search engines), stays open if JavaScript fails, and `assets/site.js` handles the toggle.

## Search and link previews

- `robots.txt` allows all crawlers and points to `sitemap.xml`.
- `danielsullivanportfolio.com` (no www) is the primary domain. `www` redirects to it in Vercel, so canonical URLs always use the bare domain.
- Link previews (LinkedIn, Slack, email) use `assets/daniel-sullivan-portrait.jpg`.

## Content-type labels

Cards have no content-type line: the "Case study NN" / "Planning framework NN" label above the title already says what a card is, so the extra "Case Studies & Execution" and "Frameworks & Systems" lines were removed (Nov 2026). The only remaining `<p class="ctype">…</p>` is the "Perspectives & Approaches" line under the ABM heading on `/demand-revenue-marketing`. The `.ctype` rule still lives in each page's `<style>` block. There is no filtering and no extra navigation.

## Protected playbooks (Cisco case study)

The three playbook PDFs live ONLY in a **private Vercel Blob store**, never in this repo or a public folder. The site is otherwise static; two small Vercel Functions guard access:

| Route | File | What it does |
|---|---|---|
| `GET/POST /api/playbook-login` | `api/playbook-login.js` | `POST {password}` checks the password on the server and sets a signed, HttpOnly, Secure, SameSite=Strict session cookie (2 hours). `GET` reports whether the visitor has a valid session. Failed attempts are delayed ~1s. |
| `GET /api/playbook?name=…` | `api/playbook.js` | With a valid cookie, streams the PDF from the private store. `name` must be `decision-maker`, `recommender` or `practitioner` (allowlist in `api/_lib/session.js`); visitors never supply a file path. |

- **Secrets (Vercel → Settings → Environment Variables, Production + Preview, sensitive):** `PLAYBOOK_PASSWORD`, `PLAYBOOK_SESSION_SECRET` (random, e.g. `openssl rand -hex 32`). Never commit them. If either is missing the viewer reports "not available" and no PDF is served.
- **Blob store:** private, connected to this project. Files: `playbook-decision-maker.pdf`, `playbook-recommender.pdf`, `playbook-practitioner.pdf`.
- **Change the password:** edit `PLAYBOOK_PASSWORD`, redeploy. **Log everyone out:** change `PLAYBOOK_SESSION_SECRET`, redeploy. **Remove a playbook:** delete it from the Blob store.
- **Dependencies:** `package.json` only exists for `@vercel/blob` (used by `api/playbook.js`). There is still no build step for the pages.
- Anyone with the password can save the PDF; the password controls who gets in, not what they do next.
