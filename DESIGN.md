---
name: goodmeow-landing
version: 0.1.0
description: Design system and visual language for goodmeow.dev landing page.
colors:
  primary: "#0ea5e9"
  primary-foreground: "#ffffff"
  secondary: "#6ee7b7"
  secondary-foreground: "#0b0f0e"
  background-light: "#ffffff"
  foreground-light: "#0f172a"
  panel-light: "#f8fafc"
  border-light: "#e2e8f0"
  muted-light: "#475569"
  background-dark: "#071330"
  foreground-dark: "#e8dbcb"
  panel-dark: "#1a3352"
  border-dark: "#1f2d4d"
  muted-dark: "#969caa"
  accent-dark: "#5293b7"
typography:
  fontFamily:
    primary: "Plus Jakarta Sans, system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif"
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  headings:
    h1:
      fontSize: "2.75rem"
      fontWeight: "800"
      lineHeight: "1.15"
      letterSpacing: "-0.02em"
    h2:
      fontSize: "1.875rem"
      fontWeight: "700"
      lineHeight: "1.25"
      letterSpacing: "-0.015em"
    h3:
      fontSize: "1.25rem"
      fontWeight: "600"
      lineHeight: "1.4"
      letterSpacing: "-0.01em"
  body:
    fontSize: "1rem"
    fontWeight: "500"
    lineHeight: "1.6"
  small:
    fontSize: "0.875rem"
    fontWeight: "500"
    lineHeight: "1.5"
rounded:
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  pill: "999px"
spacing:
  xs: "0.125rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
  container-max: "1320px"
components:
  button:
    radius: "{rounded.pill}"
    fontWeight: "600"
    transition: "all 0.2s ease-out"
  card:
    radius: "{rounded.lg}"
    border: "1px solid"
    backdropBlur: "18px"
  chip:
    radius: "{rounded.pill}"
    fontSize: "{typography.small.fontSize}"
---

## Overview

goodmeow.dev is a technical landing page and notebook for IT infrastructure operations, networking, reliability, and automation notes.
The visual personality is technical, clean, purposeful, and modern — balancing crisp developer-oriented typography with a restrained palette and subtle glassmorphic surfaces.

## Colors

The system uses a high-contrast dual-theme palette designed for WCAG AA readability:

- **Light Mode**:
  - `background`: Pure white (`#ffffff`) for a crisp documentation feel.
  - `panel`: Slate-50 (`#f8fafc`) for cards and elevated panels.
  - `foreground`: Slate-900 (`#0f172a`) for maximum text contrast.
  - `border`: Slate-200 (`#e2e8f0`) for subtle structural delineation.
  - `muted`: Slate-600 (`#475569`) for metadata, timestamps, and secondary descriptions.
  - `primary`: Sky-500 (`#0ea5e9`) used for links, primary calls-to-action, and active states.

- **Dark Mode**:
  - `background`: Deep Navy (`#071330`) providing a warm, eye-friendly midnight canvas.
  - `panel`: Dark Slate Navy (`#1a3352`) for card and section contrast.
  - `foreground`: Warm Cream (`#e8dbcb`) ensuring low-glare reading comfort.
  - `border`: Dark Navy Border (`#1f2d4d`).
  - `muted`: Cool Slate (`#969caa`) for subtext and tag badges.
  - `primary`: Steel Sky (`#5293b7`) keeping interactive elements prominent yet harmonious.

## Typography

Primary typeface is **Plus Jakarta Sans**, loaded via Google Fonts with geometric legibility and distinct technical character.

- **Hero / H1**: 2.75rem (44px), weight 800, line-height 1.15. Direct, prominent title.
- **Section Headers / H2**: 1.875rem (30px), weight 700, line-height 1.25. Delineates distinct thematic zones.
- **Card Headings / H3**: 1.25rem (20px), weight 600, line-height 1.4. Used for article titles and card items.
- **Body & Paragraphs**: 1rem (16px), weight 500, line-height 1.6 for comfortable editorial scanning.
- **Small & Metadata**: 0.875rem (14px) and 0.6875rem (11px) for timestamps, tag chips, and micro-labels.

## Layout

- **Container Constraint**: Centered max-width of `1320px` (`width: min(1320px, calc(100% - 64px))`) with mobile gutter of `32px` (`calc(100% - 32px)`).
- **Grid Systems**:
  - Article cards: 1 column on mobile, auto-filling 2 to 3 columns on larger viewports.
  - Navbar: Multi-tier sticky layout (`64px` height) with responsive drawer toggle under `768px`.
- **Vertical Spacing**: Consistent rhythm between sections using `4rem` to `5rem` spacing.

## Elevation & Depth

Depth is conveyed through subtle borders and backdrop blur rather than heavy, blurred box shadows:

- **Glassmorphism**: Sticky navbar and floating panels utilize `backdrop-filter: blur(18px) saturate(1.35)`.
- **Card Borders**: Semi-transparent 1px borders using `color-mix()` against the panel background.
- **Shadows**: Restrained to HeroUI `shadow-sm` or `shadow-md` to avoid visual clutter.

## Shapes

- **Interactive Elements (Pill)**: Action buttons (`Button`), tag badges (`Chip`), and quick links use `radius="full"` (`999px`) for accessible tactile affordance.
- **Containers (Soft Rounded)**: Content cards (`Card`), modals, and preview panels use `radius="lg"` (`1.5rem` / `24px`).
- **Input & Toggles**: Segmented controls and small toggles use `radius="md"` (`1rem` / `16px`).

## Components

HeroUI components serve as the foundation, customized via theme tokens:

- **Button**:
  - Primary CTA: Pill radius (`full`), primary accent background, high-contrast foreground.
  - Secondary / Icon buttons: Bordered or light variant, smooth scale transition on tap/hover.
- **Card**:
  - Bordered, subtle panel background, `isPressable` with gentle translateY hover lift on interactive cards.
- **Navbar**:
  - Sticky with `shouldHideOnScroll`, integrated theme switcher (Sun/Moon), brand glyph, and mobile burger menu.
- **Chip**:
  - Flat variant, pill radius, subtle background tint for post tags.

## Do's and Don'ts

### Do's
- **Do** reference theme tokens via HeroUI color names (`primary`, `panel`, `foreground`, `muted`) or CSS custom properties.
- **Do** maintain WCAG AA contrast standards across both light and dark themes.
- **Do** keep buttons and tag badges pill-shaped for uniform tactile language.
- **Do** use Framer Motion for gentle entrance choreography (fade + slide up 16-20px).

### Don'ts
- **Don't** hardcode raw hex color codes or ad-hoc RGB strings directly inside JSX components.
- **Don't** introduce competing font families — maintain Plus Jakarta Sans across all content surfaces.
- **Don't** use heavy drop shadows (`shadow-2xl` or opaque black shadows) on light-themed cards.
- **Don't** override HeroUI base styles unless necessary; configure tokens through `src/hero.js`.
