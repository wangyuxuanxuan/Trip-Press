# Share-ready journey preview

Goal: Users evaluate finished photo-and-sticker pages, then prepare a share package; no redundant simulated generation after a completed cover.

Architecture: Keep scenes and legacy print reducer for compatibility, but connect the primary detail action to PREPARE_SHARE. Reuse a single PublishPhoto composition in detail and gallery. Previewing or returning never posts externally. Photo adjustment, source zoom, and undo remain optional.

- [x] Add failing tests for one recommended set per visible album, >=4 unique photos per group, reuse of all former source sets, direct detail-to-package and duplicate prevention.
- [x] Consolidate source ownership into three composite demo journeys, preserving source IDs/locations and migration aliases. Add four existing landscape files to data. Merge fine groups by meaningful common themes, leave unsupported people modes empty.
- [x] Add PublishPhoto, showing an intact main photo with source-linked illustration pieces at the edge, plus a compact paper caption. Preserve real people. Reuse it in the detail carousel and published carousel; zoom shows the original.
- [x] Add PREPARE_SHARE and an explicit share/save sheet in gallery. Preserve edited packages when reopened unchanged and create a new version only after changes. Remove print waiting from the primary route.
- [x] Increase workspace cover density to up to ten unique elements with a focal illustration; no duplicate filler. Update source attribution and current tests.
- [x] Verify reducer tests, build and mobile browser flow at 375,390,393,430 plus Reduce Motion. Inspect source/photo correspondence and safe-area actions.

No real posting, upload or AI generation is added. Existing print code remains available for previous state paths; new UI does not expose a misleading generation step. Composite dates and routes are demo metadata; source geography is preserved.

Verification: 41 unit tests passed; 10 targeted Playwright cases passed across 375×812, 390×844, 393×852, 430×932 and Reduce Motion. TypeScript and Vite production build passed. Screenshots reviewed for dense cover, composed photo detail and share controls. Existing pre-redesign end-to-end suites that assert the retired printing UI are not part of this validation. Vite retains a 511.86 kB main chunk size warning.
