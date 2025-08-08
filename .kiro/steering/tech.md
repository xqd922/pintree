# Technology Stack

## Framework & Runtime
- **Next.js 14.2.15**: Full-stack React framework with App Router
- **React 18**: UI library with server/client components
- **TypeScript 5.6.3**: Type-safe JavaScript with strict mode enabled
- **Node.js**: ES2017 target with ESM modules

## Database & ORM
- **PostgreSQL**: Primary database
- **Prisma 5.21.1**: Database ORM and schema management
- **Database URL**: Configured via `DATABASE_URL` environment variable

## Styling & UI
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **Radix UI**: Headless component primitives
- **Shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

## Key Libraries
- **NextAuth 4.24.10**: Authentication system
- **@dnd-kit**: Drag and drop functionality
- **@tanstack/react-table**: Data table management
- **Zod**: Schema validation
- **UploadThing**: File upload handling
- **Cheerio**: HTML parsing for bookmark metadata

## Development Tools
- **ESLint**: Code linting with Next.js config
- **PostCSS**: CSS processing
- **Sharp**: Image optimization
- **tsx/ts-node**: TypeScript execution

## Common Commands

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production (includes Prisma generate & push)
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database
```bash
npm run db:push      # Push schema changes to database
npm run postinstall  # Generate Prisma client (runs automatically)
```

### Environment Setup
- Requires `.env.local` file with `DATABASE_URL`
- Uses `dotenv-cli` for environment variable management

## Deployment
- **Platform**: Vercel (optimized configuration)
- **Build Process**: Automated Prisma generation and database push
- **Image Handling**: Configured for external domains and SVG support