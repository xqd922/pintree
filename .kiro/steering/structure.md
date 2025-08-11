# Project Structure

## Root Level
- `data/pintree.json` - Main bookmark data file (hierarchical structure)
- `public/` - Static assets (logos, icons, default images)
- `scripts/` - Utility scripts for deployment and bookmark import
- `docs/` - Documentation files

## Source Code (`src/`)

### Application Structure
- `src/app/` - Next.js App Router pages and API routes
  - `[collection]/` - Dynamic collection pages
  - `[slug]/` - Dynamic slug-based routing
  - `admin/` - Admin interface
  - `api/` - API endpoints
  - `dashboard/` - User dashboard
  - `login/` - Authentication pages

### Components (`src/components/`)
- `ui/` - Shadcn/ui base components
- `admin/` - Admin-specific components
- `analytics/` - Analytics and tracking components
- `bookmark/` - Bookmark display and management
- `collection/` - Collection management
- `common/` - Shared/reusable components
- `folder/` - Folder structure components
- `search/` - Search functionality
- `website/` - Public website components
- `providers/` - Context providers

### Core Modules
- `src/lib/` - Utility functions and configurations
  - `auth/` - Authentication logic
  - `utils/` - Helper functions
  - `data.ts` - Data access layer
  - `defaultSettings.ts` - Default configuration
- `src/hooks/` - Custom React hooks
- `src/actions/` - Server actions
- `src/middleware.ts` - Next.js middleware

## Configuration Files
- `components.json` - Shadcn/ui configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

## Naming Conventions
- Use kebab-case for file and folder names
- Use PascalCase for React components
- Use camelCase for functions and variables
- Prefix custom hooks with `use`