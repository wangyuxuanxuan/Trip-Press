# Journey albums

An album identifies a journey, not a place, grouping mode, or generated edition. The Japanese spring sample holds Osaka and Fuji as internal moments. The Italian sample holds the mountain lake and coastal village together. Separately dated journeys remain separate albums.

All shelf names use `YYYY.MM place phrase`. Dates are demonstration itinerary labels, not inferred photo metadata. Unverified locations are explicitly marked in photo metadata and attribution. Locally imported batches stay in one album and use the import month plus “地点待填写” until genuine date/location information is available.

## Selective grouping

- `editorialPhotos` owns source, journey, selection status, and reason.
- `editorialGroups` owns intentional membership and perspective. A view can contain zero groups; groups can overlap without covering the entire album.
- “这一刻” contains actual visual moments; “一路发现” collects recurring observable subjects; “同一种感觉” contains compatible visual moods. “我们” stays empty where the supplied photos do not establish people or relationships. Strangers are not labeled companions.
- Unused and alternate photographs remain in SourceBank and can be manually substituted. None are deleted by grouping.
- Imported media has only an import-order placeholder grouping. Other perspectives remain empty until an analysis service is connected.

## Visual examples

Eight sample journeys share the same preview, desk, detail, printing, package, and sticker-creation flow. Desert, Xinjiang grassland, Bali coast, and alpine flowers now have source-specific prebuilt paper illustrations rather than generic icon covers. Japan and Italy examples also use the same sticker-led B cover / photographic A content components.

`public/assets/editorial/attribution.html` lists all photographers and links. Generated sticker atlases are local assets; automatic extraction and true trip inference are not connected. Retired rough photo files are retained on disk but no longer used to pad the active catalog.

## Compatibility

Former destination IDs `fuji-notes`, `alpine-notes`, and `coastal-notes` resolve to their parent journeys. Persisted creation drafts follow the journey of their main sticker, retaining the selected artwork and adjustments.

## Verification

Unit tests cover sparse membership, actual counts, source references, journey identity, alias migration, editing/undo, and generated editions. Playwright exercises the current journey catalog, alternate modes and empty state, new landscape packages, actual PNG export, and saved creation recovery.
