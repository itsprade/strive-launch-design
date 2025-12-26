# Strive Labs - Project Context

## 📋 Project Overview

This is the **Strive Labs** application - a design-focused implementation of an AI-powered marketing intelligence platform. This is NOT a prototype system, but the actual Strive Labs product experience focused purely on design and UI/UX.

## 🎯 Purpose

Building the complete Strive Labs application with:
- Real, cohesive product experience
- Beautiful interactions and animations
- Design polish and delight
- Production-quality UI components
- All screens interconnected as a single app

## ✅ What's Complete

### Foundation Setup
- ✅ Next.js 16 + React 19 + Tailwind CSS 4
- ✅ ShadCN UI components
- ✅ Framer Motion animations
- ✅ Fraunces + Inter fonts (matching Figma)
- ✅ Animation system with variants
- ✅ Layout components (Shell, Container, PageHeader)
- ✅ Mock data structure with TypeScript types
- ✅ Design tokens and constants

### Dashboard Home (/)
- ✅ Sidebar navigation (4 icon buttons)
- ✅ Personalized greeting ("Good Morning, Pradeep")
- ✅ Large AI search input with conversational UI
- ✅ Quick action chips (6 common queries)
- ✅ Recommended action cards (2x2 grid)
- ✅ Smooth page load animations
- ✅ Matching Figma design exactly

## 🎨 Design System

### Colors
- Using OKLCH color space
- CSS variables for theming
- Custom colors from Figma:
  - `#eff1f7` (light purple/gray)
  - `#dff0fb` (light blue)

### Typography
- **Fraunces** for headings with variation settings `'SOFT' 0, 'WONK' 1`
- **Inter** for body text
- Font sizes: 40px (hero), 16px (body), 12px (small)

### Layout
- Sidebar: 64px (16px) width, fixed left
- Max content width: 800px
- Generous spacing and breathing room
- Center-aligned content

### Animation
- Stagger animation on page load
- Fade in up for hero elements
- Smooth transitions on hover

## 📁 Current Structure

```
app/
  └── page.tsx              # Dashboard home ✅

components/
  ├── ui/                   # ShadCN components
  ├── layouts/              # Shell, Container, PageHeader
  └── animations/           # AnimatedDiv, StaggerContainer

lib/
  ├── animations/           # Animation variants
  ├── data/                 # Mock campaigns, metrics, users
  └── constants.ts          # Routes, spacing, durations
```

## 🚀 Next Steps

The foundation is solid. Now we build the rest of Strive Labs:

1. **Additional Pages** (using same layout pattern)
   - `/campaigns` - Campaign list and management
   - `/analytics` - Detailed analytics dashboard
   - `/chat` - AI chat interface
   - `/settings` - User settings

2. **Navigation**
   - Make sidebar buttons functional
   - Add routing between pages
   - Smooth page transitions

3. **More Screens from Figma**
   - Convert designs using Figma MCP
   - Build screen by screen
   - Keep the cohesive feel

4. **Interactions**
   - Hover states
   - Click animations
   - Micro-interactions
   - Loading states

5. **Polish**
   - Dark mode refinement
   - Additional animations
   - Responsive design
   - Accessibility

## 💡 Workflow

When building new screens:

1. **Show Figma design** using MCP
2. **I'll convert to code** matching:
   - Existing components
   - Layout patterns
   - Animation style
   - Visual design exactly
3. **Iterate** until perfect
4. **Move to next screen**

## 🎭 Design Philosophy

- **Single cohesive app** - Strive Labs is one product
- **Design-first** - Focus on UI/UX, not business logic
- **Dummy data** - All marked with 🧪 annotations
- **Production-quality code** - Easy developer handoff
- **Smooth animations** - Delight in every interaction
- **Consistent patterns** - Same components, layouts, styles

## 📝 Code Standards

```tsx
// 🔽 Section Header
// 🧪 Dummy Data: Description
// ✅ Reusable Component: Description
```

## 🌐 Running

**Dev Server**: http://localhost:3001
**Command**: `pnpm dev`

## 🎯 Goal

Build the complete Strive Labs application that:
- Feels like using the real product
- Showcases the design vision
- Has smooth, delightful interactions
- Can be handed off to developers
- Impresses the Strive team

---

**Status**: Foundation complete, Dashboard home built
**Next**: Build additional screens from Figma designs
**Ready**: To continue building!
