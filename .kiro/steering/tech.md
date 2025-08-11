# Technology Stack

## Core Framework
- **Next.js 14.2.15** - Full-stack React framework with App Router
- **React 18** - Frontend library
- **TypeScript** - Type-safe JavaScript

## Styling & UI
- **Tailwind CSS** - Utility-first CSS framework with custom design system
- **Shadcn/ui** - Component library (New York style, with CSS variables)
- **Radix UI** - Headless UI primitives for accessibility
- **Lucide React** - Icon library
- **Tailwind Animate** - Animation utilities

## Key Libraries
- **Next Auth** - Authentication system
- **Zod** - Schema validation
- **@dnd-kit** - Drag and drop functionality
- **@tanstack/react-table** - Table management
- **React Dropzone** - File upload handling
- **UploadThing** - File upload service
- **Cheerio & JSDOM** - HTML parsing and manipulation

## Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Sharp** - Image optimization
- **tsx** - TypeScript execution

## Common Commands

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# JSON Mode Build
./build.sh        # Custom build script for JSON mode
```

## Configuration Notes
- Uses ES modules (`"type": "module"`)
- Path aliases: `@/*` maps to `./src/*`
- Image optimization configured for external domains
- Tailwind configured with custom color system using CSS variables