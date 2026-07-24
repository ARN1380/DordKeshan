# DESIGN.md — دُردکشان

## Visual world: Illuminated Manuscript meets Modern Editorial

The site draws from the tradition of Islamic illuminated manuscripts — geometric precision, deep jewel tones, gilded accents — translated into a clean modern editorial layout. The visitor should feel they're entering a library of rare knowledge, not browsing a generic content site.

## Color strategy: Restrained with committed accent

- **Background**: warm cream `#faf8f5` (light) / deep charcoal `#0f0e0d` (dark)
- **Text**: deep ink `#1a1714` (light) / warm stone `#e8e4de` (dark)
- **Primary accent**: deep teal `#1a6b5a` — used sparingly for interactive elements, links, and focus states. Evokes mosque tilework without being literal.
- **Secondary accent**: warm amber `#b8860b` — used even more sparingly for highlights and decorative touches. Evokes gilded manuscript edges.
- **Muted surface**: `#f0ece6` (light) / `#1c1a17` (dark) — for cards, sidebars, subtle background variations
- **Border**: `#e0dbd3` (light) / `#2e2b27` (dark)

## Typography

- **Display/headings**: Vazirmatn (already installed) — bold, tracking-tight, leading-tight
- **Body**: Vazirmatn — regular weight, leading-relaxed
- **Monospace accents**: system mono for episode numbers and durations
- **Scale**: `text-4xl md:text-5xl lg:text-6xl` for hero, `text-2xl` for section heads, `text-base` for body, `text-sm` for metadata

## Spatial composition

- Hero sections: generous top padding (pt-32 md:pt-40), asymmetric left-aligned
- Section separation: border-t with generous pt-16/pt-20
- Content max-width: `max-w-6xl` (1152px)
- Card padding: p-6 to p-8
- More space above headings than below

## Depth and texture

- Subtle radial gradient on hero backgrounds (muted tones fading to transparent)
- Card shadows: `shadow-sm` default, `shadow-md` on hover
- Decorative horizontal line: 48px gradient bar under hero headings
- No grain overlays, no noise textures — keep it clean

## Motion

- One authored moment: page load with staggered reveal on scholar cards
- Hover states: subtle scale (1.02-1.03) on images, underline on links
- Transitions: 500-700ms ease-out for transforms
- No scroll animations, no parallax, no micro-interactions

## Component patterns

- **Scholar cards**: 3:4 aspect ratio image, shadow-sm, gradient overlay on hover, name + bio below
- **Series blocks**: border-t divider, bold title with episode count, description, speeches listed below
- **Speech items**: numbered index (monospace), title, metadata (duration, date), audio player
- **Audio players**: desaturated, tabular-nums for time display, 36px height
- **Breadcrumbs**: text-muted-foreground with / separators

## Anti-patterns (banned)

- Purple gradients, neon accents, AI-slop colors
- Centered hero sections (use left-aligned in RTL = text-start)
- Same-size card grids as primary layout structure
- Generic card + icon + heading + text patterns
- Gradient text effects
- Overuse of eyebrows (max 1 per 3 sections)
- Pure black `#000` or pure white `#fff`
