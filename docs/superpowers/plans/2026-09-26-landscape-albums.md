# Landscape albums and themed previews

**Goal:** Add sourced landscape demo photos, a preview for every album and a horizontally scrollable mobile bookshelf.

**Architecture:** ShelfTrip owns cover, preview photos, date, motifs and one theme. TravelBook and TripPreview consume that same theme. MobileSheet accepts an optional local theme class/style while preserving focus and keyboard behavior. Only Osaka opens the existing workspace; other albums remain honest previews. The shelf uses native horizontal scroll with snap and previous/next buttons, preserving its position when a preview closes.

**Stack:** Existing React, TypeScript, Framer Motion, CSS Modules; local JPEG assets.

- [x] Record Pexels sources and obtain eight 960px landscape images covering coast, desert, grassland and mountain meadow. Verify images visually and retain attribution.
- [x] Add a failing browser test for all-album previews, shared colors, shelf movement and Osaka's two-step entry.
- [x] Extend shelf data and render eight albums from stable IDs rather than index-based color choices.
- [x] Implement reusable preview and horizontal shelf, including touch scroll, button alternatives, safe areas and focus return.
- [x] Update existing flow tests for the now-required Osaka preview. Build and verify four phone sizes, reduced motion, keyboard and complete main flow.

