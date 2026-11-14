# 01 Design tokens

Source of truth: `apps/web/app/globals.css` (CSS variables, mapped to Tailwind through `@theme inline`). Components use token names, never raw colours. Light is the default; dark follows the OS unless the user chose.

## November 2026 screenshot-driven pass

- Added a semantic dark feature-rail palette (`--rail`, hover, active, foreground, muted) for the new persistent left navigation.
- Added restrained raised/inset shadow tokens. Shared inputs use the inset treatment; dashboard KPIs and compact summary surfaces may use `surface-raised`.
- Added `glass-panel` for selected dashboard/overlay surfaces. It is not used behind tables, forms, or statutory working papers.
- New colors continue to resolve through semantic CSS variables. The screenshots are used for structure and hierarchy, not copied brand assets.

## Measured contrast (WCAG 2.2, computed with the standard relative-luminance formula)

AA needs 4.5:1 for normal text and 3:1 for large text and for the boundary of a control.

| Pair | Foreground | Background | Ratio | AA text |
|---|---|---|---|---|
| Text on surface | #172334 | #FFFFFF | 15.83 | pass |
| Muted text on page | #64748B (old) | #F5F7FA | 4.43 | FAIL |
| Muted text on page (new `--muted` #586579) | #586579 | #F5F7FA | 5.51 | pass |
| Interactive blue on white (old #2878d0) | #2878d0 | #FFFFFF | 4.48 | FAIL |
| Interactive blue on white (new #2068b4) | #2068b4 | #FFFFFF | 5.67 | pass |
| Faint text (old #94a3b8) | #94a3b8 | #FFFFFF | 2.56 | FAIL |
| Faint text (new #66758b) | #66758b | #FFFFFF | 4.69 | pass |
| Teal text (old #0d9488) | #0d9488 | #FFFFFF | 3.74 | FAIL |
| Teal text (new #0f766e) | #0f766e | #FFFFFF | 5.47 | pass |
| Brief warning #B7791F | #B7791F | #FFFFFF | 3.64 | FAIL |
| Brief info #477DB8 | #477DB8 | #FFFFFF | 4.29 | FAIL |
| Brief teal #27877F | #27877F | #FFFFFF | 4.32 | FAIL |
| Brief positive #27835B | #27835B | #FFFFFF | 4.68 | pass |
| Brief danger #C34F4F | #C34F4F | #FFFFFF | 4.61 | pass |
| Field border (old #cbd5e1) | #cbd5e1 | #FFFFFF | 1.48 | FAIL |
| Field border (new #7d8ca1) | #7d8ca1 | #FFFFFF | 3.42 | FAIL |

Dark theme (against the dark surface `#10203a`): text 13.2:1, muted 6.4:1, interactive blue 6.2:1, success 9.3:1, danger 5.9:1; the old faint text was 3.4:1 and is now `#8696ac` (5.4:1).

## What changed in this phase

- `--primary` `#2878d0` to `#2068b4`; `--primary-hover` to `#1a5a9e`; `--ring` follows.
- `--muted` `#64748b` to `#586579`; `--faint` `#94a3b8` to `#66758b` (dark `#64748b` to `#8696ac`).
- `--teal` `#0d9488` to `#0f766e`.
- New `--border-input` (`#7d8ca1` light, `#667d9c` dark) used by `Input` and `Select`; card edges and table rules keep the lighter `--border`.
- New elevation tokens `--shadow-1` (raised) and `--shadow-2` (overlay): surfaces sit on a rule, only overlays take a shadow.
- New `--glass` and `--glass-edge`, used only by overlays (the mega menu). Opacity 0.96: at 0.86 the page behind showed through menu text.
- New `--chart-1` to `--chart-6`: the dataviz reference palette in its fixed order (blue, orange, aqua, yellow, magenta, green; dark steps for the dark surface). My first set of six hues **failed** the validator (two hues below the chroma floor; red and amber only 10 apart in normal vision), so it was replaced. The reference set passes every check on our surfaces (light `#ffffff`, dark `#10203a`): lightness band, chroma floor, worst adjacent colour-blind separation 9.1 (light) and 8.4 (dark), worst adjacent normal-vision separation 19.6 and 19.3. Three light colours (aqua, yellow, magenta) are under 3:1 on white, so every chart carries direct labels or a table view; colour is never the only carrier. Use the first three slots for scatter-type charts; fold past six series.

## Spacing, radius, type

- **Spacing**: the brief's 4, 8, 12, 16, 20, 24, 32, 40, 48 px are Tailwind's `1, 2, 3, 4, 5, 6, 8, 10, 12` steps at a 4px unit; no new tokens are needed. Note the root font is 14px on desktop and 15px on phones, so `rem`-based Tailwind steps scale with it.
- **Radius**: 3px, 4px, 6px, 6px, 8px (`--radius-sm` to `--radius-2xl`), deliberately compact for a dense ERP.
- **Type**: Inter (Latin) with Anek families for Indian scripts. Money and quantities use tabular lining numerals and a slashed zero (`.num`, `td`, `th`, `kbd`). Scale in use: page title 1.75rem on auth, headers 1.125 to 1.5rem, body 0.9286rem, table and label 0.8571rem, key caps 0.72rem.

## Status colours

Success `#15803d` (5.0:1), warning `#b45309` (5.0:1), danger `#b91c1c` (6.5:1), info through `--primary`. Every status in the UI carries an icon or text as well as colour (`08_ACCESSIBILITY`).

## Not changed, by decision

The shell colour (navy `#173b63`) and the surface and canvas values already equal the brief's within a few units, so they stayed. The brief's primary `#245B91` (7.05:1) is darker than needed; the chosen `#2068b4` keeps the established brand blue while passing.
