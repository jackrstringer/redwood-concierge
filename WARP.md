# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Build and Development
- `npm run dev` - Start development server with hot reload on http://localhost:8080
- `npm run build` - Build production bundle
- `npm run build:dev` - Build development bundle with development mode flags
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Testing
No test framework is currently configured in this project.

## Architecture Overview

### Application Type
This is a React-based email marketing analytics dashboard for "Redwood Concierge" built with modern web technologies. It displays KPIs, metrics, and insights for email campaigns, subscriptions, and revenue data.

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5.4
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom dashboard theme
- **State Management**: React Query (@tanstack/react-query) for server state
- **API Integration**: Axios for HTTP requests, configured with Klaviyo API proxy

### Key Architecture Patterns

#### Component Structure
- **UI Components**: Generic shadcn/ui components in `src/components/ui/`
- **Dashboard Components**: Business logic components in `src/components/dashboard/`
- **Page Components**: Route-level components in `src/pages/`

#### Data Flow Pattern
The application follows a clear data flow:
1. **Mock Data**: Currently uses extensive mock data in `src/data/mockData.ts`
2. **API Integration**: Real API calls to Klaviyo through proxy configuration (`/klaviyo` → `https://a.klaviyo.com`)
3. **Type Safety**: TypeScript interfaces defined in `src/types/` directory
4. **AI Insights**: Contextual insights and recommendations in `src/data/aiInsights.ts`

#### Dashboard Architecture
The main dashboard (`src/pages/Index.tsx`) is organized into metric sections:
- **Core Revenue Metrics**: Total revenue, email revenue split, campaign/flow revenue, RPR, AOV
- **Performance Metrics**: Placed order rates, campaign counts
- **Email Performance**: Open rates, click rates, deliverability metrics
- **Send Volume & List Growth**: Volume metrics and subscriber growth
- **Subscription Insights**: Recharge subscription analytics with product breakdown

Each section uses the `KPICard` component with:
- Delta comparisons (period-over-period)
- Sparkline visualizations
- Click handlers for detailed modal views
- Responsive design with mobile-first approach

#### State Management Pattern
- React Query for server state and caching
- Local component state for UI interactions (modals, toggles)
- Props drilling for simple state passing between parent/child components

#### Styling Architecture
Custom Tailwind configuration with dashboard-specific design tokens:
- Dashboard color palette (`dashboard-bg`, `dashboard-card`, `dashboard-text`, etc.)
- Responsive breakpoints optimized for dashboard layouts
- Custom font sizes for metrics display (`metric-sm`, `metric-lg`, etc.)

### API Integration Details

#### Klaviyo Integration
- **Proxy Configuration**: Vite proxy routes `/klaviyo` requests to `https://a.klaviyo.com`
- **Authentication**: Uses `KLAVIYO_PRIVATE_API_KEY` environment variable
- **API Helper**: `src/lib/apiHelper.ts` handles campaign data fetching with error handling
- **Type Mapping**: Transforms Klaviyo API responses to internal `Campaign` interface

#### Environment Variables
Required environment variables:
- `KLAVIYO_PRIVATE_API_KEY`: Private API key for Klaviyo integration

### Development Guidelines

#### File Organization
- Use `@/` alias for imports from `src/` directory
- Component files use PascalCase naming
- Type definitions grouped in `src/types/`
- Mock data and AI insights separated in `src/data/`

#### Component Development
- All dashboard components should support responsive design
- Use the established `KPICard` pattern for metric displays
- Implement click handlers for metric drill-down functionality
- Follow the delta comparison pattern for period-over-period metrics

#### TypeScript Configuration
- Relaxed TypeScript settings for rapid development
- `noImplicitAny: false` allows gradual typing
- Path aliases configured for clean imports

#### Development Environment
- Server runs on port 8080 with IPv6 support (`::`.)
- Hot reload enabled for all file changes
- ESLint configured with React-specific rules
- Component tagger enabled in development for debugging

### Key Components

#### KPICard Component
Central component for displaying metrics with:
- Multiple format types (currency, percentage, number)
- Delta comparisons with positive/negative indicators
- Sparkline data visualization
- Click-through functionality for detailed views
- Responsive text sizing and layout

#### Modal System
- `MetricDetailModal` for displaying detailed metric information
- Integrated with AI insights system for contextual recommendations
- Supports historical data visualization

#### Data Layer
- Extensive mock data structure mimicking real analytics
- AI-generated insights with contextual business recommendations
- Type-safe interfaces for all data structures
