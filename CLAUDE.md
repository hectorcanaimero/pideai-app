# CLAUDE.md

## Project Overview

PideAI Admin is a React Native mobile app (iOS + Android) for restaurant/store owners to manage their business on the go. It's the mobile companion to the PideAI web admin panel.

## Tech Stack

- **Framework:** React Native + Expo SDK 54
- **Language:** TypeScript
- **Routing:** Expo Router (file-based)
- **Styling:** NativeWind v4 (Tailwind CSS)
- **Server State:** TanStack Query v5
- **Backend:** Supabase JS (direct client, shared with web app)
- **Auth Storage:** expo-secure-store
- **Push:** expo-notifications
- **Icons:** lucide-react-native
- **Forms:** React Hook Form + Zod
- **Error Tracking:** Sentry

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server
npx expo start

# Start with cache clear
npx expo start --clear

# TypeScript check
npx tsc --noEmit

# Build preview (requires EAS CLI + EXPO_TOKEN)
eas build --platform all --profile preview

# Build production
eas build --platform all --profile production

# OTA update
eas update --channel production --message "description"
```

## Architecture

### Routing (app/ directory)

File-based routing via Expo Router:

- `app/_layout.tsx` — Root layout (providers: QueryClient, Auth, Store, Notifications, ErrorBoundary)
- `app/index.tsx` — Auth redirect (checks session → admin or login)
- `app/(auth)/` — Login screen
- `app/(admin)/` — Tab navigator (5 tabs: Home, Orders, Menu, Customers, More)
  - `orders/` — Orders list, detail, kitchen display
  - `menu/` — Categories, products, extras
  - `customers/` — Customer list and detail
  - `more/` — Settings (8 screens), analytics, promotions, coupons, subscription, whatsapp, delivery, AI studio

### Data Layer (src/)

- `src/services/supabase.ts` — Supabase client with SecureStore
- `src/contexts/` — AuthContext, StoreContext
- `src/hooks/` — TanStack Query hooks (useOrders, useCategories, useProducts, useCustomers, useExtras, useAnalytics, etc.)
- `src/lib/` — Utilities (orderConstants, imageUpload, queryClient, sentry)
- `src/components/` — UI components organized by feature (orders/, kitchen/, menu/, customers/, dashboard/, shared/)

### Backend

Uses the same Supabase project as the web app. Types copied from web app's auto-generated types.ts.

Key tables: stores, orders, order_items, categories, menu_items, product_extras, extra_groups, customers, drivers, subscriptions, device_tokens

### Auth Flow

1. App opens → checks SecureStore for session
2. Valid session → navigate to (admin) tabs
3. No session → navigate to (auth)/login
4. Login via supabase.auth.signInWithPassword
5. Store ownership verified via stores table query
6. Ownership revalidated every 5 minutes

## Path Aliases

`@/*` maps to `./src/*`

## Environment Variables

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_SENTRY_DSN=
```

## Conventions

### Brand Colors (defined in tailwind.config.ts)

- **Primary (brand):** `#EB1C8D` (pink/magenta) — `primary` / `gold-500` (legacy alias)
- **Primary hover:** `#C9157A` — `primary-hover` / `gold-700`
- **Primary light:** `#F7EBF4` — `primary-light` / `cream-100`
- **Primary badge:** `#FADADF` — `primary-badge`

### Background

- **Main bg:** `#F0EFEF` — `bg-background-main` / `bg-elegant-dark` (legacy alias)
- **Surface:** `#FFFFFF` — `bg-background-surface` / `bg-elegant-gray` (legacy alias)
- **Soft:** `#F7EBF4` — `bg-background-soft`

### Text

- **Primary text:** `#1A1A1A` — `text-text-primary`
- **Secondary text:** `#6B6B6B` — `text-text-secondary` / `text-cream-400` (legacy)
- **Inverted text:** `#FFFFFF` — `text-text-inverted`

### Other

- **Theme:** Light theme with pink/magenta accent (NOT dark theme)
- **Font:** Poppins (Regular, Medium, SemiBold, Bold)
- **Cards:** `bg-background-surface rounded-2xl p-4`
- **All text in Spanish (Rioplatense)**
- **Icons from lucide-react-native**
- **Status colors defined in [src/lib/orderConstants.ts](src/lib/orderConstants.ts)**

> **Note:** The `gold-*`, `cream-*`, `elegant-dark`, and `elegant-gray` class names are legacy aliases kept for backward compatibility. They map to the new pink/light palette — see [tailwind.config.ts](tailwind.config.ts).
