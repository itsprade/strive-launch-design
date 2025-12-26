# Strive Labs - Marketing Intelligence Platform

A design-focused implementation of the Strive Labs application - an AI-powered marketing analytics and campaign optimization platform. This repository contains the complete UI/UX implementation with real interactions and animations.

## 🎯 About Strive Labs

Strive Labs helps marketers optimize their campaigns across multiple platforms (Google Ads, Facebook, LinkedIn, etc.) using AI-powered insights and recommendations.

**Key Features:**
- AI-powered campaign analysis
- Multi-platform analytics dashboard
- Automated recommendations
- Real-time performance insights
- Conversational AI interface

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: v19.2
- **Styling**: Tailwind CSS 4 with OKLCH colors
- **Components**: ShadCN UI (Radix Mira style)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (body), Fraunces (headings)

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Dashboard home
├── components/
│   ├── ui/                   # ShadCN base components
│   ├── layouts/              # Reusable layouts
│   └── animations/           # Animation wrappers
├── lib/
│   ├── animations/           # Animation variants
│   ├── data/                 # Mock data and types
│   ├── constants.ts          # Design tokens
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📝 Design Philosophy

This is a **design-focused implementation** where:
- Static UI is prioritized over business logic
- All data is mocked (marked with 🧪 Dummy Data comments)
- Interactions and animations showcase the user experience
- Components follow consistent patterns
- Code is production-quality for easy developer handoff

## 🎨 Design System

### Typography
- **Fraunces**: Headings and emphasis (with font variation settings)
- **Inter**: Body text and UI elements

### Colors
Using OKLCH color space with CSS variables for theming:
- Defined in `app/globals.css`
- Supports light and dark modes
- Semantic color tokens (primary, secondary, muted, etc.)

### Components
Built on ShadCN UI with custom styling:
- Button, Card, Badge
- Input, Textarea, Select
- Dropdown, Combobox
- Alert Dialog
- And more...

## ✨ Animation System

Powered by Framer Motion with pre-configured variants:

```tsx
import { AnimatedDiv } from '@/components/animations';
import { fadeInUp, staggerContainer } from '@/lib/animations';

<AnimatedDiv animation={fadeInUp} delay={0.2}>
  <YourComponent />
</AnimatedDiv>
```

**Available animations:**
- `fadeIn`, `fadeInUp`, `fadeInDown`
- `slideInLeft`, `slideInRight`
- `scaleIn`
- `staggerContainer`, `staggerItem`

## 📊 Mock Data

All mock data is centralized in `lib/data/`:

```tsx
import { mockCampaigns, mockMetrics, mockInsightCards } from '@/lib/data';
```

**Available data types:**
- Users
- Campaigns (Google Ads, Facebook, LinkedIn, etc.)
- Metrics and KPIs
- Insight cards
- Quick actions

## 🎨 Figma Integration

This project uses Figma MCP for design-to-code conversion:
1. Fetch designs from Figma
2. Convert to production-quality code
3. Match existing component patterns
4. Preserve visual design with Tailwind

## 📝 Code Annotations

```tsx
// 🔽 Section Header - Major UI sections
// 🧪 Dummy Data - Mock data to be replaced
// ✅ Reusable Component - Can be extracted
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🎯 Current Implementation

### Dashboard Home (/)
- **Sidebar navigation** with icon buttons
- **Greeting header** with user personalization
- **AI search input** with conversational interface
- **Quick action chips** for common queries
- **Insight cards** showing campaign performance
- **Smooth animations** on page load

## 🚧 Roadmap

- [ ] Campaign details view
- [ ] Analytics dashboard
- [ ] Settings screens
- [ ] Onboarding flow
- [ ] Dark mode refinement
- [ ] Additional page transitions

## 👥 Team

Built for the Strive Labs product launch and redesign.

---

**Note**: This is a design-focused implementation. All data is mocked, no backend integration. Focus is on UI/UX, interactions, and visual polish.
