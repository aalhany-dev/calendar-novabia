# Novabia Chronicle — calendar.novabia.dev

A complete static website compatible with GitHub Pages. The HTML (`index.html`) is the single entry point; `styles.css`, `script.js` and `schedule-data.js` keep styling, behavior and announcements easy to edit. No backend is required.

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

## Deploying to GitHub Pages

1. Create a new GitHub repository (for example `novabia-calendar`).
2. Upload every file in this folder into the **repository root**.
3. Open **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, `main`, `/(root)`.
4. Under **Settings → Pages → Custom domain**, add `calendar.novabia.dev`. The included `CNAME` file matches it.
5. In your DNS provider, create a CNAME record: **Host/Name:** `calendar` → **Target:** `YOUR-GITHUB-USERNAME.github.io` (replace with your actual GitHub username, without any `https://` or path).
6. Wait for DNS verification and enable **Enforce HTTPS** when available.
7. Verify `https://calendar.novabia.dev/#calendar`, `/#rewards`, `/#development`, `/#system`, and `/#archive`.

Do not point the `calendar` DNS CNAME to `novabia.dev` unless your hosting/DNS configuration explicitly requires a different architecture. A custom domain is configured per GitHub Pages repository.

## Editing the look

- Replace `favicon.png` only if you wish to change the approved orange Novabia seal.
- Shared colors and layout are in `styles.css`, using the same navy/gold/Cinzel/Inter direction as the EIP site.
- Navigation uses URL fragments, so each tab can be linked directly without special GitHub routing or rewrite rules.
- The current month is computed in the visitor's local civil date; each 5YLW day is computed using a date-only UTC algorithm to avoid DST errors.

## Publish carefully

The initial site deliberately does **not** assert prize values, free offers, shipping dates, release dates, or development completion. Fill verified details into `schedule-data.js` once you decide and announce them. A planned feature is not a guaranteed delivery date.
