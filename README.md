# World Cup Daily

Mobile-first FIFA World Cup 2026 fan dashboard. Next.js App Router + TypeScript + Tailwind. Zero runtime dependencies beyond React/Next — no date library, no state library, no paid APIs. All data is mocked behind a single service layer.

## Run it

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Where things live

```
src/
  app/                      # Routes (Server Components by default)
    layout.tsx              # Shell: header, nav, skip link, metadata
    page.tsx                # Dashboard homepage
    fixtures/page.tsx       # All fixtures + client-side status filter
    standings/page.tsx      # Group tables
    bracket/page.tsx        # Knockout bracket
    stats/page.tsx          # Leaderboards
    api/                    # JSON route stubs (matches/standings/stats)
  components/
    ui/                     # Card, Chip/StatusChip, SectionHeader, Skeleton
    sports/                 # MatchCard, FixtureStrip, StandingsTable,
                            # BracketView, leaderboards, DailyDigest,
                            # FilterBar (client), KickoffTime (client),
                            # TournamentHeader
  lib/
    services/tournamentService.ts  # << single integration point for live data
    data/                   # Mock matches, standings, bracket, stats
    format/                 # dates.ts (Intl-based), standings.ts (sorting)
    types/tournament.ts     # Domain types
    utils/                  # timezone.ts, cn.ts
  styles/globals.css
```

## Design decisions

- **Server Components everywhere** except two leaf client components:
  `FilterBar` (filter state) and `KickoffTime` (browser timezone).
- **Timezones**: data stores UTC ISO strings only. `KickoffTime`
  server-renders UTC, then re-renders in the viewer's zone after hydration
  (`suppressHydrationWarning` covers the expected swap). To kill the flash
  entirely later, persist `Intl.DateTimeFormat().resolvedOptions().timeZone`
  in a `tz` cookie from the client and read it with `cookies()` in server
  components.
- **Dates** use the built-in `Intl` API — no date-fns/dayjs needed.
- **Sorting** (group tables, leaderboards) lives in `lib/format`, tested
  independently of UI.
- **Accessibility**: semantic table markup with `caption`/`scope`,
  skip-to-content link, `aria-pressed` filter buttons, visible focus rings,
  `sr-only` match summaries, status conveyed by text not just color,
  `prefers-reduced-motion` respected.

## Plugging in live data (free options)

Everything reads through `lib/services/tournamentService.ts`. To go live:

1. Pick a source. Free-tier options: **football-data.org** (free tier covers
   World Cup), or scrape-free community feeds like **openfootball** JSON on
   GitHub for fixtures/results. No paid API required.
2. Replace each service function body with `fetch(url, { next: { revalidate: N } })`:
   - live scores: `revalidate: 30`
   - fixtures/standings: `revalidate: 3600`
3. Map the provider payload to the types in `lib/types/tournament.ts`
   inside the service file only — components never change.
4. For in-match score ticks without a refresh, add a small client component
   that polls `/api/matches` every 30s and merges into the rendered list.
5. Move any API key to `.env.local` and read it only in the service layer.

## iPad / landscape dashboard mode

- **Layout**: `TournamentSidebar` is a left-rail nav on screens ≥1024px
  (`lg:`), collapsing to a horizontal top bar on phones. The homepage uses a
  3-column grid in landscape (`lg:grid-cols-3`) so today's matches, fixtures,
  results, standings, scorers and clean sheets all fit on one screen without
  scrolling on an iPad.
- **Install as an app**: `public/manifest.webmanifest` sets
  `"display": "standalone"` and `"orientation": "landscape"`, with 192/512px
  icons in `public/icons/`. Deploy (e.g. `vercel`), open the URL in Safari on
  iPad, then **Share → Add to Home Screen**. It launches full-screen with no
  browser chrome, in landscape.
- `appleWebApp` metadata in `layout.tsx` gives the iOS title and a
  translucent status bar to match the dark theme.
