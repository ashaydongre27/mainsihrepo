---
name: Standard Utilitarian
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#434655'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.25rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 2.5rem
  gutter-mobile: 1rem
  gutter-tablet: 1.5rem
---

## Brand & Style

This design system delivers a grounded, human-crafted mobile interface prioritizing functional utility, clarity, and structural honesty. Designed for high-frequency productivity, utility, and decision-critical workflows, the interface rejects decorative ephemera—eschewing floating blurs, animated decorative backdrops, and artificial luminescence.

The aesthetic philosophy centers on:
- **Quiet Authority:** Premium clarity achieved through balanced typography, strict visual hierarchy, and disciplined whitespace rather than stylistic embellishments.
- **Physical Humility:** Subtle elevation models, crisp 1px borders, and pure white cards seated atop nuanced slate-tinted canvas backdrops.
- **Human Tactility:** Purposeful micro-interactions, responsive tap targets, and decisive color accents that direct focus exclusively to interactive workflows.

## Colors

The palette operates under a high-contrast, light-mode regime engineered for readability under varying ambient lighting conditions.

- **Primary Accent (`#2563EB`):** Cobalt blue reserved strictly for primary calls-to-action, active indicators, and critical interactive wayfinding.
- **Secondary Anchor (`#0F172A`):** Deep navy-slate used for grounding headers, badges, and high-emphasis structural groupings.
- **Surface Hierarchy:**
  - `Canvas Ground`: Subtle gradient or flat transition between `#FFFFFF`, `#F8F9FA`, and `#F1F3F5` to separate canvas contexts.
  - `Surface Elevated`: Pure white (`#FFFFFF`) to ensure maximum figure-ground separation against the slate-tinted canvas.
- **Typography & Boundaries:**
  - `High-Contrast Text`: `#111827` provides WCAG AAA contrast across all pure white surfaces.
  - `Secondary Text`: `#4B5563` balances legibility and de-emphasis for supportive metadata.
  - `Border / Dividers`: `#E5E7EB` provides crisp structural containment without visual friction.

## Typography

Typography relies entirely on the utilitarian clarity of Inter. Tightened negative tracking on larger display types ensures cohesive typographic shapes, while generous optical line heights and neutral tracking on body copy sustain rapid scanability on mobile viewports.

- Use `display` and `headline-lg` sparingly, targeted to key screen anchors and primary metric summaries.
- Apply `label-sm` in uppercase or strong sentence case for system tags, category tags, and tabular data labels.
- Numerical outputs should leverage tabular lining figures (`font-feature-settings: 'tnum' on`) for strict column alignment across transactional views.

## Layout & Spacing

The layout system is built upon a standard 8-point base grid (with a 4-point micro-scale for compact controls and badge padding). 

- **Screen Edges & Safe Margins:** Default mobile views maintain a 16px (`gutter-mobile`) outer margin. Data-dense layouts can drop to 12px where nested structural groupings require horizontal economy.
- **Card Internals:** Card components employ 16px internal padding uniformly, scaling to 20px on viewports above 600px width.
- **Vertical Flow:** Section separations use 24px (`space-xl`), while related intra-group components sit within 8px or 12px gaps. Maintain generous breathing room between visual blocks to prevent cognitive fatigue.

## Elevation & Depth

The design system achieves structural depth through the combination of flat perimeter borders and minimal, physical surface shadows rather than heavy blurring or artificial glow:

- **Base Layer (Elevation 0):** Background canvas (`#F8F9FA` to `#F1F3F5`). Completely un-shadowed.
- **Surface Layer (Elevation 1):** White cards (`#FFFFFF`) with a structural 1px border (`#E5E7EB`) and a ground-hugging shadow: `0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)`.
- **Floating Controls (Elevation 2):** Modals, bottom sheets, and dropdown menus utilize a dual-stage shadow for soft detachment: `0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)`, reinforced by an internal `#E5E7EB` edge line.
- **Zero-Glow Mandate:** Prohibit any tinted, saturated, or spreading glow around active borders, buttons, or indicators.

## Shapes

The interface embraces a balanced, disciplined shape vocabulary with a default radius token of Level 2 (`roundedness: 2`).

- **Standard Containers & Cards:** Configured with `0.5rem` (8px) corner radius, producing a defined, structural corner that avoids both the harshness of raw rectangles and the playfulness of hyper-rounded surfaces.
- **Inputs & Interactive Controls:** Match the standard `0.5rem` (8px) radius for holistic geometry across form groups.
- **Pills & Status Tags:** Limited exceptions (badges, chips, avatar rings) utilize full pill styling (`9999px`) to create clear shape differentiation between static content boundaries and interactive or contextual labels.

## Components

### Buttons
- **Primary:** Filled `#2563EB` background with `#FFFFFF` text. Solid, no gradient, no drop-shadow glow. 8px border radius, minimum touch target height of 44px. Hover/pressed state shifts to `#1D4ED8`.
- **Secondary:** White surface, 1px border `#E5E7EB`, `#111827` text. Subtle `0 1px 2px rgba(0,0,0,0.04)` shadow. Pressed state: `#F9FAFB`.
- **Destructive:** Subtle red tint background (`#FEF2F2`), `#DC2626` text, 1px border `#FEE2E2`.

### Cards & Groupings
- White `#FFFFFF` core surface, framed by a continuous 1px solid `#E5E7EB` line. 8px radius.
- Shadows are restrained (`0 1px 3px rgba(0,0,0,0.05)`). Card headers feature strong `headline-sm` or `headline-md` typography with direct action icons aligned to the top-right corner.

### Form Inputs
- **Base State:** `#FFFFFF` background, 1px `#E5E7EB` border, 8px radius, height 42px, padding horizontal 12px. Placeholder text `#9CA3AF`.
- **Focus State:** 1px solid `#2563EB` with an external 2px focus ring tinted at low opacity (`rgba(37, 99, 235, 0.15)`). Never display harsh default browser outlines.

### Chips & Badges
- **Contextual Badges:** Pill-shaped (`rounded-full`), 4px vertical padding, 8px horizontal padding. Font: `caption` or `label-sm`.
- **Neutral Badges:** `#F3F4F6` background, `#374151` text, no border.
- **Active Filter Chips:** `#EFF6FF` background, `#1D4ED8` text, 1px border `#BFDBFE`.

### Checkboxes & Radios
- Size: 18px by 18px square (checkbox) or circle (radio).
- Border: 1.5px solid `#D1D5DB`. Checked state: solid `#2563EB` fill with crisp white vector checkmark. Focus indicator matches standard input rings.

### Lists & Row Items
- Divided by 1px solid hairline rules (`#F3F4F6`). Padding 12px vertical, 16px horizontal.
- Leading icons/avatars use fixed containers (36px to 40px) with soft neutral gray grounds (`#F1F5F9`). Trailing elements anchor dates, status tags, or understated chevron indicators (`#9CA3AF`).