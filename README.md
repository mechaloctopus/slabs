# Pith & Pixel

Website for Pith & Pixel (Josh Trembath, Kauaʻi, (808) 647-7410): fat slab milling, custom carpentry, art fabrication, software and research. It also hosts the **Slabyard** toolkit, free software for turning big logs into dry, tracked, sellable live-edge slabs. Static site, no build step, no server: open `index.html` or host the folder anywhere (GitHub Pages, Netlify, Vercel).

## What's in it

- **Manual** (18 chapters): workflow, rigging a 76–84″ Alaskan mill (lengthening a 48″ mill, roller conveyor mod, double-ended bars), winch pull assist and a three-person crew, milling day, moving heavy slabs (gantry, overhead slab rail, forks), end sealing, labeling, air-drying yard, moisture measurement, drying times, solar kiln, species ID and legality (CITES / Lacey Act), flattening and finishing, grading and pricing, container shipping, landowner and partner agreements, gear and build-plan links, sources.
- **Slab log**: inventory with species, dimensions, location, grade, status and price; moisture readings (weight-based MC from green weight + wafer MC, or meter readings); drying curve per slab; photo uploads per slab and per reading; backup/restore (JSON including photos); CSV export/import.
- **Species & ID**: 21 species cards (density, shrinkage, drying class, ID features, safety, regulations, market) with an observation-based ID key, including narra ("Burmese rosewood", *Pterocarpus indicus*) vs. true rosewood (*Dalbergia*).
- **Home**: services overview and contact.
- **Slab milling**: service page for on-site big-log milling on Kauaʻi (86″ Alaskan mill, MS 881): rate sheet ($175 / $225 / $250–300 per hour, 3-hour minimum, chain charges), why hourly pricing, quote checklist, job estimator.
- **Calculators**: cut planner, slab weight and board feet, drying time estimator, container load planner, partner split.

## Slab log password

Editing is locked behind a password. The default is `abcd`; change it under Slab log → Settings. The lock keeps casual edits out on a shared device. It is not encryption.

## Data storage

The log is stored in the browser (IndexedDB) on each device, photos included. To share with a crew or move devices, save a backup file and import it on the other device (imports merge). Photos are resized to 1600 px JPEG before storing.

## Files

- `index.html`: layout, styles, manual content
- `js/species.js`: species library
- `js/app.js`: router, calculators, species view, slab log
