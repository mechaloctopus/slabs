# Kauaʻi Slab Yard

Partner field guide for our slab project: milling a 66″ earpod and other hardwoods (rosewood and more) with an 86″ Alaskan mill, drying, the solar kiln, tracking every slab, and selling. One scrolling page; the sawyer's contact and outside rates sit in a side card.

Static site, no build step, no server: open `index.html` or host the folder anywhere.

## Sections

01 The plan · 02 Know the wood (species library, ID key, narra vs. true rosewood, CITES/Lacey Act) · 03 Big-bar mill · 04 Pull assist & crew · 05 Milling day (cut planner) · 06 Moving slabs · 07 Seal the ends · 08 Label & log · 09 Air-drying yard · 10 Measuring moisture · 11 Drying times (estimator) · 12 Solar kiln · 13 Slab journal · 14 Flatten & seal · 15 Grade & price (weight and board-foot calculator) · 16 Container to market (load planner) · 17 The partnership (split calculator) · 18 Gear & build plans · 19 Sources

## Slab journal

Inventory with species, size, location, grade, status and price; weight-based or meter moisture readings; drying curve; photos per slab and per reading; backup (JSON with photos) and CSV export/import.

Editing needs a password: default `abcd`, changeable in the journal's Settings tab. It keeps casual edits out; it isn't encryption. Data lives in each browser (IndexedDB); share between devices with a backup file, which merges on import.

## Files

- `index.html`: layout, styles, content
- `js/species.js`: species library
- `js/app.js`: calculators, species key, slab journal
