# Novabia Chronicle — calendar.novabia.dev

The source for **https://calendar.novabia.dev/**, Novabia's public development chronicle and 5 Years Leap Week (5YLW) calendar. It is a static GitHub Pages site with clean, directly loadable page URLs—no `#` fragments and no server-side backend.

## Public pages and routes

| Page | Public URL | GitHub Pages entry point |
| --- | --- | --- |
| This Month | [`/`](https://calendar.novabia.dev/) | `index.html` |
| Rewards | [`/rewards/`](https://calendar.novabia.dev/rewards/) | `rewards/index.html` |
| Development | [`/development/`](https://calendar.novabia.dev/development/) | `development/index.html` |
| The 5YLW System | [`/system/`](https://calendar.novabia.dev/system/) | `system/index.html` |
| Archive | [`/archive/`](https://calendar.novabia.dev/archive/) | `archive/index.html` |

All five HTML pages use shared `/styles.css`, `/script.js`, and `/schedule-data.js`. The navigation uses browser History API for smooth transitions; GitHub Pages can also load or refresh each route directly because every subpath contains its own `index.html`.

Legacy bookmarks such as `https://calendar.novabia.dev/#rewards` are recognized and upgraded to the corresponding clean URL. The `#main` skip link remains an intentional accessibility anchor, not a page route.

**Maintenance note:** The five HTML entry points share page markup. If changing navigation, section content, assets, or layout, keep them synchronized; the only intended differences are the initial visible section and route-specific canonical URL, Open Graph URL, and page title.

## What is included

- **This Month:** Live 5YLW month with 28 calendar days (7 for an intercalary 14th month), Gregorian equivalents, day detail panel, 13/14 month selector, year jump, arrows, and **Today** control.
- **Rewards:** Design-format presentation of the agreed seven-day reward layout: days 1–4 = one reward slot each, days 5–6 = two, and day 7 = three. This is **not** an active reward offering.
- **Development:** Existing Novabia workstreams (world, companion development, battle, caravan, playtest, feedback) without made-up dates or completion claims.
- **The 5YLW System:** Calendar explanation and a Gregorian → 5YLW date converter.
- **Archive:** Past published data entries are automatically collected here.
- Links to main Novabia site, Play PWA, EIP portal, and the existing tester Google Form.

## The 5YLW rules used here

These are drawn from the project resource *The 5 Years Leap Week Calendar_ano.pdf*:

- Epoch: Gregorian **2025-12-21** = **5YLW Year 2026 / Month 01 / Day 01**. Year labels follow the corresponding civil year (not years elapsed since the epoch).
- 13 standard months, 28 days each.
- Every fifth year, add a 7-day 14th month, subject to two corrections:
  - no leap week if `year % 50 === 0`;
  - no leap week if `(year - 25) % 400 === 0`.
- The 14th month is labeled **Hany's Week**; standard months remain numbered since the source reserves their naming rights.
- The 5YLW grid is independent of Gregorian 12-month boundaries. The month range shown above the calendar provides the conversion.
- The JS implementation supports Year 2026 through Year 3024 (999 year labels). The far-future deep-time recalibration mentioned in the paper is outside the website's supported range.

## Publishing monthly rewards and development steps

Only edit **`schedule-data.js`**. It intentionally contains **no entries** until real announcements have been approved. Do **not** enter hypothetical content as if it were a real reward or delivery commitment.

Example entry to copy into the `events` array (sample values below are **not official**):

```js
window.NOVABIA_SCHEDULE = {
  lastUpdated: '2026-11-01',
  events: [
    {
      id: 'example-reward',
      year: 2026, month: 12, day: 7,
      kind: 'reward',
      title: 'EXAMPLE: Reward announcement',
      description: 'Replace with the real reward, eligibility and claim details.',
      status: 'announced',
      url: 'https://novabia.dev/'
    },
    {
      id: 'example-milestone',
      year: 2026, month: 12, day: 21,
      kind: 'development',
      title: 'EXAMPLE: Development checkpoint',
      description: 'Replace with a confirmed game design step.',
      status: 'planned',
      url: ''
    }
  ]
};
```

Allowed `kind` values: `reward`, `development`, `update`.

Possible status strings: `announced`, `planned`, `in_progress`, `complete`, `delayed`. These are labels only; site does not automatically infer progress.

If you prefer planning in Excel, keep a private workbook with the columns `id, year, month, day, kind, title, description, status, url`, then export verified entries into `schedule-data.js`. Static GitHub Pages cannot securely accept private submissions from visitors without an external service.

## Deployment and verification

This repository is deployed from [`aalhany-dev/calendar-novabia`](https://github.com/aalhany-dev/calendar-novabia) with the `calendar.novabia.dev` custom domain declared in `CNAME`.

1. Publish the `main` branch through **GitHub → Settings → Pages** (using the configured source).
2. Preserve the domain mapping `calendar.novabia.dev`, HTTPS, the root `index.html`, and the four subdirectory `index.html` files.
3. Test all five URLs in the table above by **opening them directly** in a fresh tab, then refreshing each. Confirm the intended section appears, images/styles/scripts load, and browser Back/Forward works.
4. Confirm the old `/#rewards` (and other section-hash) URLs transition to their new paths.
5. Verify that `https://calendar.novabia.dev/sitemap.xml` lists all five public pages and that `https://calendar.novabia.dev/robots.txt` points to that sitemap.

### Search indexing and sitemap

- The root [`sitemap.xml`](https://calendar.novabia.dev/sitemap.xml) includes exactly the five canonical public page URLs. They use trailing slashes for GitHub Pages directory routes.
- The root [`robots.txt`](https://calendar.novabia.dev/robots.txt) allows crawling and references the sitemap.
- Each page has a corresponding canonical link and `og:url`. When adding, renaming, or removing a route, update **the navigation, direct-load HTML, route map in `script.js`, canonical metadata, README, and sitemap together**.
- Sitemap entries describe available pages—not announced rewards, forthcoming development releases, or individual calendar days. No speculative URLs or unverified `lastmod` dates are included.

The canonical public path for the calendar itself is `/`; the old `/#calendar` format is maintained only for backward compatibility.

## Editing the look

- Replace `favicon.png` only if you wish to change the approved orange Novabia seal.
- Shared colors and layout are in `styles.css`, using the same navy/gold/Cinzel/Inter direction as the EIP site.
- Navigation uses direct, shareable clean paths (`/`, `/rewards/`, `/development/`, `/system/`, `/archive/`). Each subdirectory has an `index.html` so reloading a direct link works on GitHub Pages; historic `/#rewards`-style links are upgraded automatically.
- The current month is computed in the visitor's local civil date; each 5YLW day is computed using a date-only UTC algorithm to avoid DST errors.

## Publish carefully

The initial site deliberately does **not** assert prize values, free offers, shipping dates, release dates, or development completion. Fill verified details into `schedule-data.js` once you decide and announce them. A planned feature is not a guaranteed delivery date.
