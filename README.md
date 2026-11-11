# danielsullivanportfolio.com

Daniel Sullivan's marketing portfolio. Plain HTML and CSS with no build step. Vercel deploys every push to `main`.

## Pages

| URL | File | What it is |
|---|---|---|
| `/` | `index.html` | Homepage: hero, My approach, Explore my work, Contact |
| `/trade-shows-conferences` | `trade-shows-conferences.html` | Section: Trade Shows & Conferences (cards with a slide-in drawer for each case study) |
| `/partner-marketing-strategy` | `partner-marketing-strategy.html` | Section index: Partner Marketing Strategy |
| `/cisco-partner-marketing-maturity` | `cisco-partner-marketing-maturity.html` | Case study: Cisco Partner Marketing Maturity Model |
| `/sample-partner-maturity-assessment` | `sample-partner-maturity-assessment.html` | Supporting page: fictional Northstar assessment |
| `/marketing-strategy-innovation` | `marketing-strategy-innovation.html` | Section index: Marketing Strategy & Innovation |
| `/events-experiences` | `events-experiences.html` | Section index: Events & Experiences (Sumo Slam Jam, Global Sales Kickoff, Threat Hunting Workshops; detail pages to come) |
| `/demand-revenue-marketing` | `demand-revenue-marketing.html` | Section index: Demand & Revenue Marketing (empty "coming soon" state until the first card is added inside `.cases`) |
| `/ai-innovation` | `ai-innovation.html` | Section index: AI & Innovation ("Projects & experiments"; empty "coming soon" state until the first card is added inside `.cases`) |
| `/global-planning-framework` | `global-planning-framework.html` | Case study: Global Field & Partner Marketing Planning Framework |

Shared files: `assets/site.js` (footer year, case-study drawers, mobile menu) and `assets/` (images).
`vercel.json` turns on clean URLs, so `/partner-marketing-strategy` serves `partner-marketing-strategy.html`.

## Design system

Every page uses the same tokens, defined at the top of its `<style>` block:

- Colors: ground `#F4F3EF`, paper `#FFFFFF`, ink `#111111`, body `#2B2B2B`, muted `#565656`, line `#D6D3CB`
- Type: Inter Tight (display, 600–700), Inter (body), IBM Plex Mono (small uppercase labels)
- Components: `.btn` / `.btn--ghost`, `.card`, `.tag`, `.sec-head`, the `.cats` section switcher, and `.crumbs` breadcrumbs

Keep new pages consistent with these. Each page carries its own copy of the CSS, so if you change a token, change it on every page.

## Common edits

- **Add a section to the homepage:** in `index.html`, copy one `<li class="cat">…</li>` in the "Explore my work" list, update the number, title, description, featured example and link. Then add the section to the `.cats` switcher on each section page.
- **Add a case study to Trade Shows & Conferences:** copy one `<article class="card">…</article>` and its matching `<dialog id="dlg-…">…</dialog>`. Give both the same new id: the button uses `data-dialog="dlg-<id>"`.
- **Add a case study to Partner Marketing Strategy or Marketing Strategy & Innovation:** add a card on the section index page and create a new case-study page by copying an existing one (for example `global-planning-framework.html`).
- **External links** (live demos) use `target="_blank" rel="noopener"` plus a visually hidden "(opens in a new tab)" label.
- **Adding a new page:** in its `<head>`, update the block after the meta description: `rel="canonical"` and `og:url` must be `https://danielsullivanportfolio.com/<page-name>` (no `.html`, no `www`), and `og:title` / `og:description` should match the page's `<title>` and meta description. Then add the URL to `sitemap.xml`.

## Search and link previews

- `robots.txt` allows all crawlers and points to `sitemap.xml`.
- `danielsullivanportfolio.com` (no www) is the primary domain. `www` redirects to it in Vercel, so canonical URLs always use the bare domain.
- Link previews (LinkedIn, Slack, email) use `assets/daniel-sullivan-portrait.jpg`.
