

## Premium Redesign: Dark-First, $100M Developer Tool Aesthetic

### Current Problems
- Light theme default feels generic and "template-y"
- Flat cards with no depth or visual drama
- No hero visual element (Reflect has a dramatic glowing black hole)
- Color palette too scattered (blue primary + green accent mixing)
- Generic spacing, no visual rhythm
- Logo is just a letter in a box
- No ambient glow effects, grain textures, or glassmorphism

### Design Direction (Inspired by Reflect.app)
- **Dark-first**: Deep navy/charcoal background (#0A0A0F range), dark theme as default
- **Monochromatic + one accent**: Primary purple/violet glow (like Reflect), no green accent mixing
- **Ambient glow effects**: Radial gradient glows behind hero, cards, and sections
- **Glassmorphism nav**: Semi-transparent header with backdrop blur
- **Subtle grain texture**: CSS noise overlay for depth
- **Premium typography**: Larger hero text, more letter-spacing control, thinner body weight
- **SVG Logo**: A custom stacked/layered "X" mark with glow — not a plain square

### Color System Overhaul
- **Dark (default)**: Background `#09090B`, cards `#111114`, borders `#1a1a22`
- **Primary**: Purple/violet `hsl(265, 80%, 60%)` with glow variants
- **Accent**: Kept minimal — soft cyan or just lighter purple for contrast
- **Light (toggle)**: Clean white `#FAFAFA`, subtle gray cards
- No green. Single accent color family for professionalism.

### Implementation Plan

**1. Theme & Color System (`src/index.css`, `tailwind.config.ts`, `src/App.tsx`)**
- Swap default theme to `"dark"` in ThemeProvider
- Redesign CSS variables: dark palette as `:root`, light as `.light` class
- Add CSS utilities: `.glow`, `.grain-overlay`, `.glass-card`
- Add subtle noise/grain texture as a pseudo-element on body

**2. Logo Component (`src/components/Logo.tsx`)**
- Create an SVG logo: stylized "X" with layered strokes and a subtle glow
- Use in Header and Footer
- Monochrome, works on both dark and light

**3. Header Redesign (`src/components/layout/Header.tsx`)**
- Glassmorphic: `bg-background/60 backdrop-blur-2xl` with very subtle border
- Centered nav pill (like Reflect's rounded nav bar in center)
- Logo left, CTA + theme toggle right
- Mobile: slide-in sheet instead of dropdown

**4. Hero Overhaul (`src/components/home/Hero.tsx`)**
- Large ambient purple glow orb behind the headline (radial gradient)
- Bigger, bolder headline with `font-extrabold text-5xl md:text-7xl`
- Subtle animated gradient on the accent text (shimmer effect)
- Code block below hero gets a glowing border treatment
- Staggered entrance animations

**5. ChooseFix Section (`src/components/home/ChooseFix.tsx`)**
- Cards with subtle border glow on hover (purple tint)
- Glass-card style with `bg-card/50 backdrop-blur` and thin gradient border
- Hover lift animation with shadow bloom

**6. HowItWorks Section (`src/components/home/HowItWorks.tsx`)**
- Vertical timeline with a glowing line connector
- Step numbers with purple glow rings
- Code blocks with refined dark styling

**7. FeaturesGrid (`src/components/home/FeaturesGrid.tsx`)**
- Bento-grid style layout (varying card sizes for visual interest)
- Icons with subtle glow halos
- Cards with gradient borders on hover

**8. TrustSection (`src/components/home/TrustSection.tsx`)**
- Comparison table with refined dark styling
- Check marks in purple instead of green
- Subtle row hover highlights

**9. DonateSection (`src/components/home/DonateSection.tsx`)**
- Full-width gradient banner section
- Ambient glow behind CTA

**10. Footer (`src/components/layout/Footer.tsx`)**
- Minimal dark footer, subtle separators
- Logo mark repeated

**11. Global Polish**
- Add CSS grain texture overlay
- Smooth page transitions
- Refine AnimatedSection easing curves
- All code blocks get consistent premium dark treatment

### Files to Modify
- `src/index.css` — full color system rewrite + new utilities
- `tailwind.config.ts` — update animation keyframes, add shimmer
- `src/App.tsx` — change defaultTheme to "dark"
- `src/components/layout/Header.tsx` — glassmorphic redesign + centered nav
- `src/components/layout/Footer.tsx` — dark premium footer
- `src/components/home/Hero.tsx` — dramatic glow hero
- `src/components/home/ChooseFix.tsx` — glass cards
- `src/components/home/HowItWorks.tsx` — glowing timeline
- `src/components/home/FeaturesGrid.tsx` — bento grid
- `src/components/home/TrustSection.tsx` — refined table
- `src/components/home/DonateSection.tsx` — gradient banner
- `src/components/ThemeToggle.tsx` — minor style update

### Files to Create
- `src/components/Logo.tsx` — SVG logo component

