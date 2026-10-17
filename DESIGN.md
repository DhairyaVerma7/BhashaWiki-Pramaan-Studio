---
name: Pramaan Studio
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#414752'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#727784'
  outline-variant: '#c1c6d4'
  surface-tint: '#005db6'
  primary: '#004e9a'
  on-primary: '#ffffff'
  primary-container: '#0b66c3'
  on-primary-container: '#dce6ff'
  inverse-primary: '#a9c7ff'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#005b3d'
  on-tertiary: '#ffffff'
  tertiary-container: '#007650'
  on-tertiary-container: '#76ffc2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#a9c7ff'
  on-primary-fixed: '#001b3d'
  on-primary-fixed-variant: '#00468b'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  canvas-slate: '#F8FAFC'
  surface-panel: '#FFFFFF'
  border-structural: '#E2E8F0'
  border-subtle: '#F1F5F9'
  text-muted: '#64748B'
  wiki-blue-hover: '#084C93'
  saffron-subtle: '#FEF3C7'
  emerald-subtle: '#D1FAE5'
typography:
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  body-encyclopedic:
    fontFamily: Noto Serif
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 28px
  body-encyclopedic-bold:
    fontFamily: Noto Serif
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 28px
  body-ui:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-ui-medium:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-regular:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  telemetry-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
  markup-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 22px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-dense: 0.5rem
  margin: 1.5rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system blends academic rigor and archival preservation with telemetry-grade mission-control utility. It sits at the intersection of classical encyclopedic stewardship (Wikimedia) and high-density geospatial analysis workstations (Linear, Palantir). The interface prioritizes deep intellectual focus, clarity of evidence, verifiable metadata provenance, and rapid micro-actions for Indic language corpus curation.

The visual style is characterized by:
- **Academic Functionalism & Dense Telemetry:** Crisp, structural 1px grid borders with disciplined surface nesting rather than diffused blur effects. 
- **Information Density:** High spatial economy, calibrated line-heights, tabular data figures, and clear visual delineation between UI chrome, raw Wikitext markup, and Indic body typography.
- **Epistemic Clarity:** Visual states signify ontological certainty—citations, geospatial coordinates, and entity verifications are rendered with unambiguous semantic accents.

## Colors

The palette establishes an authoritative, daylight-calibrated research canvas:

- **Canvas & Surfaces:** The default backdrop uses `canvas-slate` (`#F8FAFC`), while primary floating analytical panels, split-screen editor panes, and inspector shelves occupy pure `surface-panel` (`#FFFFFF`).
- **Primary Color (`#0B66C3`):** Wikimedia-inspired deep cobalt blue, reserved for primary commitments, active revision merges, primary hyperlinked citations, and navigation focus.
- **Secondary Color (`#D97706`):** Bharat Saffron/Amber, used exclusively for active AI synthesis, voice inference waveform telemetry, automated translation suggestions, and pending verification queues.
- **Tertiary Color (`#10B981`):** Precision Emerald, designating verified EXIF geospatial coordinates, validated Wikidata Q-IDs, peer consensus locks, and high cryptographic trust signatures.
- **Neutral & Text (`#0F172A`):** Deep ink slate, avoiding pure black for reduced eye strain during long-form reading and editing, paired with `text-muted` (`#64748B`) for technical metadata keys and timestamps.
- **Borders (`#E2E8F0`):** Crisp, uniform 1px structural framing across data grids, split views, and inspector sidebars.

## Typography

The typography architecture uses a four-tier typographic taxonomy engineered for multilingual scholarship:

1. **Interface Structural Chrome (`Plus Jakarta Sans`):** Clean, geometry-optimized headers providing crisp navigational anchoring across studio consoles.
2. **Encyclopedic Core Text (`Noto Serif`):** Applied to Hindi, Devanagari, and English narrative copy. Provides optimal horizontal balance for matras, conjunct ligatures, and sustained editorial reading.
3. **Operational UI & Controls (`Inter`):** Powers form inputs, button states, metadata property tables, and hierarchical menu lists.
4. **Wikitext, Metadata & Telemetry (`JetBrains Mono`):** Applied to parser syntax, raw media templates, GPS coordinates (`lat/long`), EXIF payloads, and Wikidata entity handles (`Q-IDs`).

## Layout & Spacing

The studio operates on a disciplined 4px base rhythm tuned for screen density:

- **Primary Structure:** A fixed-chrome, fluid-pane workspace. Standard desktop displays feature a three-pane layout: Navigator/Hierarchy (260px), Central Editorial Workspace (fluid, max 840px for article prose or 100% in split telemetry mode), and the Evidence/Geospatial Inspector (340px).
- **Telemetry Grids:** Within inspector cards, use `gutter-dense` (0.5rem) and `space-sm` (0.5rem) padding to maintain high information density without visual crowding.
- **Responsive Adaptations:**
  - **Desktop (≥ 1280px):** Simultaneous display of corpus hierarchy, side-by-side Wikitext/visual editor, and verification sidebars.
  - **Tablet (768px – 1279px):** Navigator collapses to a slide-over panel. Editor and verification panel default to an active-toggle split view.
  - **Mobile (< 768px):** Single-column stacked mode. Navigation converts to an app-bar drawer; geospatial and telemetry tools convert to bottom-sheet drawers.

## Elevation & Depth

This system avoids heavy shadows, blur filters, and deep dimensional drop shadows. Visual depth is established through **tonal separation and crisp 1px structural boundaries**:

- **Level 0 (Canvas Base):** Background substrate `#F8FAFC`.
- **Level 1 (Panels & Toolbars):** Pure `#FFFFFF` surfaces with a 1px solid border (`#E2E8F0`). Flat surface elevation.
- **Level 2 (Active Workstations & Modals):** Pure `#FFFFFF` surface accompanied by a subtle ambient structural shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)` with a 1px border (`#CBD5E1`).
- **Level 3 (Popovers, Tooltips & Context Menus):** Pure `#FFFFFF` surface with `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)` with a crisp 1px border (`#E2E8F0`).

## Shapes

The interface embraces a tailored precision aesthetic (`roundedness: 1`):

- **Default Element Radius (`0.25rem` / `4px`):** Buttons, text inputs, filter tags, code snippets, and inspector cells utilize a crisp 4px corner.
- **Container Radius (`0.5rem` / `8px`):** Large surface panels, floating telemetry cards, map overlays, and modal dialogues employ an 8px radius.
- **Status Identifiers & Pills:** Pure circular radius (`9999px`) is reserved exclusively for single-character Indic script badges, author avatars, and binary presence indicators.

## Components

### Buttons
- **Primary:** Background `#0B66C3`, text `#FFFFFF`, 4px border radius. Hover: `#084C93`. Padding: 8px 16px (Dense: 6px 12px). Typography: `body-ui-medium`.
- **Secondary / Outline:** Background `#FFFFFF`, 1px solid `#E2E8F0`, text `#0F172A`. Hover: `#F8FAFC` with border `#CBD5E1`.
- **Ghost Action:** Background transparent, text `#64748B`. Hover: `#F1F5F9`, text `#0F172A`.
- **Telemetry Action (Amber/Emerald):** Low-contrast tinted buttons with 1px border (e.g., `#FEF3C7` background, `#D97706` text, `#FDE68A` border) for specialized voice recording and citation commit tasks.

### Chips & Entity Badges
- **Wikidata Entity Tag:** JetBrains Mono font (`telemetry-mono`). Background `#F1F5F9`, border 1px solid `#CBD5E1`, text `#0F172A`. Prefix `Q-` highlighted in `#0B66C3`.
- **Geospatial EXIF Badge:** Background `#D1FAE5`, border 1px solid `#A7F3D0`, text `#065F46`. Icon: 12px coordinate crosshair.
- **Active AI / Voice Tag:** Background `#FEF3C7`, border 1px solid `#FDE68A`, text `#92400E`. Pulsing amber dot indicator.

### Lists & Key-Value Inspectors
- Two-column data density format: Left column (property key) in `label-caps` styled with `#64748B`; right column (value/Wikitext reference) in `telemetry-mono` or `body-ui-medium`.
- Rows delimited by 1px bottom borders (`#F1F5F9`). Hover row state shifts to `#F8FAFC`.

### Form Controls & Inputs
- **Text Inputs & Search:** Background `#FFFFFF`, 1px solid `#E2E8F0`, text `#0F172A`, 4px corner radius. Focus: border `#0B66C3` with a sharp 1px ring (`#0B66C3` at 20% opacity).
- **Checkboxes & Radios:** 14px compact squares/circles. Unchecked: `#FFFFFF` with 1px `#CBD5E1` border. Checked: `#0B66C3` with pure white vector tick icon.

### Cards & Telemetry Panels
- Background `#FFFFFF`, 1px solid `#E2E8F0`, 8px radius. Header bar height 40px with structural 1px bottom divider, containing uppercase title (`label-caps`) and right-aligned telemetry pill actions.

### Specialized Studio Components
- **Bilingual Parallel Editor:** Split viewport with unified vertical scroll synchronization. Left pane: raw wikitext markup (`markup-mono`) with light blue syntax highlighting. Right pane: formatted Devanagari reader view (`body-encyclopedic`).
- **Geospatial Verification Pane:** Embedded leaf map framed by micro-telemetry HUD bars showing elevation, bounding polygon, and EXIF coordinate trust status in `#10B981`.