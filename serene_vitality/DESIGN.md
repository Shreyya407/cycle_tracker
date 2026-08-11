---
name: Serene Vitality
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#42484a'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#72787b'
  outline-variant: '#c2c7ca'
  surface-tint: '#4b626b'
  primary: '#152d35'
  on-primary: '#ffffff'
  primary-container: '#2c434c'
  on-primary-container: '#97afba'
  inverse-primary: '#b2cad5'
  secondary: '#4e6357'
  on-secondary: '#ffffff'
  secondary-container: '#d0e8d9'
  on-secondary-container: '#54695d'
  tertiary: '#002f32'
  on-tertiary: '#ffffff'
  tertiary-container: '#164649'
  on-tertiary-container: '#85b3b6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cee6f2'
  primary-fixed-dim: '#b2cad5'
  on-primary-fixed: '#051e27'
  on-primary-fixed-variant: '#334a53'
  secondary-fixed: '#d0e8d9'
  secondary-fixed-dim: '#b5ccbd'
  on-secondary-fixed: '#0b1f16'
  on-secondary-fixed-variant: '#374b40'
  tertiary-fixed: '#bcebee'
  tertiary-fixed-dim: '#a0cfd2'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#1f4d50'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: '1.2'
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1200px
  gutter: 24px
---

## Brand & Style
The design system focuses on a premium wellness experience that prioritizes calm, clarity, and trust. It moves away from clinical or gendered stereotypes in favor of a sophisticated, high-end editorial aesthetic.

The style is **Modern Minimalist with Tactile Refinement**. It utilizes heavy whitespace to reduce cognitive load, paired with high-quality typography to establish authority. Visual interest is generated through subtle depth—using soft blurs and layered surfaces rather than aggressive borders—to create a sense of breathability and peace.

## Colors
The palette is grounded in nature and sophistication.
- **Primary (Deep Slate Blue):** Used for primary actions, text, and structural elements to provide a sense of stability.
- **Secondary (Soft Sage Green):** Used for accents, secondary buttons, and success states to evoke growth and tranquility.
- **Tertiary (Muted Teal):** Provides depth for data visualization and interactive hover states.
- **Neutrals:** A warm off-white (`#F9F8F4`) serves as the base canvas to avoid the harshness of pure white, ensuring a premium, "paper-like" feel.
- **Semantic Colors:** Emerald is used for confidence/wellness milestones, while Warm Amber is reserved for phase shifts or informational alerts.

## Typography
This design system employs a dual-font strategy to balance elegance with utility.
- **Headlines (EB Garamond):** A graceful, high-quality serif used for headings to convey a premium, literary feel. Use a medium weight (`500`) to maintain presence without feeling heavy.
- **UI & Body (Inter):** A clean, highly legible sans-serif for all functional elements, data, and long-form body text.
- **Hierarchy:** High contrast in scale is encouraged between headers and body text to create a clear informational narrative.

## Layout & Spacing
The layout follows a strict **8px grid system** to ensure mathematical harmony.
- **Desktop:** 12-column fluid grid with 24px gutters. Use generous side margins (64px+) to keep content centered and focused.
- **Mobile:** 4-column grid with 16px margins. 
- **Philosophy:** Favor "Generous Spacing." If in doubt, increase padding to allow elements room to breathe. Use the `lg` (40px) unit for section vertical spacing to maintain the minimal, airy aesthetic.

## Elevation & Depth
Depth is expressed through **Ambient Shadows** and **Tonal Layering** rather than hard lines.
- **Surface Tier 0:** The neutral off-white background.
- **Surface Tier 1 (Cards):** Pure white backgrounds with a very soft, diffused shadow (Offset: 0, 4px; Blur: 20px; Color: Primary color at 4% opacity).
- **Surface Tier 2 (Floating/Modals):** Pure white with a deeper shadow (Offset: 0, 12px; Blur: 32px; Color: Primary color at 8% opacity).
- **Interactions:** Subtle backdrop blurs (8px) should be used on navigation bars and overlays to maintain context with the layers beneath.

## Shapes
The shape language is **Rounded**, leaning towards a soft, organic feel that complements the wellness theme.
- **Small elements (Buttons, Inputs):** 8px radius.
- **Large elements (Cards, Modals):** 16px radius.
- **Data Visualization:** Use rounded caps on bar charts and soft-edge curves on line graphs to maintain the approachable aesthetic.

## Components
- **Buttons:** Primary buttons use the Deep Slate Blue with white text. Secondary buttons use a Soft Sage Green background with a darker green text for contrast. Use 16px vertical and 24px horizontal padding for a "large" touch target.
- **High-Fidelity Cards:** Use white backgrounds, 16px corner radius, and the Tier 1 shadow. Headers within cards should use the serif font at `headline-sm`.
- **Input Fields:** Use a subtle 1px border in a lightened slate-blue tint. On focus, transition the border to the Primary color and add a soft secondary-color outer glow.
- **Chips/Badges:** Use low-saturation backgrounds (e.g., 10% opacity of the semantic color) with high-saturation text for status indicators.
- **Data Visualization:** Line charts should use a stroke width of 3px with the Muted Teal or Soft Sage. Use area gradients below the lines for a "filled" feel.
- **Lists:** Use 24px of vertical padding between items with a light 1px divider (`neutral_color_hex` darkened by 5%) to define structure without clutter.