# Changelog

All notable changes to SamadhanSetu are documented here.
Format: [PhaseN] — YYYY-MM-DD

---

## [Phase 1] — 2026-09-07

### Added
- Project scaffold: Vite 5 + React 18 + Tailwind CSS 3
- Supabase integration: full 6-table data model with RLS policies
- Auth trigger: auto-creates `public.users` row on Supabase Auth sign-up
- Magic-link email authentication (no passwords)
- Citizen submission form: title, description, category dropdown, photo upload, Leaflet map picker with geolocation
- Supabase Storage upload for problem photos (`problem-media` bucket)
- Official website logo integration across all pages, Navbar, and browser favicon
- Preservation and prioritization of the Hindi name (समाधान सेतु) alongside English branding
- Status tracking page (`/track/:id`) with 5-step status rail and photo evidence gallery
- Automatic URL sanitization in `supabaseClient.js` ensuring robust connection even if path suffixes (e.g. `/rest/v1`) are included in `VITE_SUPABASE_URL`
- Interactive photo evidence viewer with high-resolution links and explicit empty fallback state
- React Router shell for all planned portals (Reviewer, University, Industry, Admin as placeholders)
- Brand colour palette: saffron (#FF9933) and India green (#138808)
- End-to-end live testing completed: passwordless authentication, image storage, and database persistence verified
- CHANGELOG.md, README.md, .env.example

### Environment Variables Introduced
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase public anon key
