# Project Structure

## Root Directory
```
├── .git/                    # Git repository
├── .kiro/                   # Kiro AI assistant configuration
├── prisma/                  # Database schema and migrations
├── public/                  # Static assets
├── src/                     # Source code
├── package.json             # Dependencies and scripts
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── vercel.json              # Vercel deployment config
```

## Source Code Organization (`src/`)

### App Router Structure (`src/app/`)
- **Next.js 14 App Router** with file-based routing
- **Layout files**: `layout.tsx` for shared UI components
- **Page files**: `page.tsx` for route components
- **API routes**: `src/app/api/` for backend endpoints

```
src/app/
├── admin/                   # Admin dashboard routes
│   ├── bookmarks/          # Bookmark management
│   ├── collections/        # Collection management
│   └── settings/           # Site settings
├── api/                    # API endpoints
│   ├── auth/              # Authentication
│   ├── bookmarks/         # Bookmark CRUD
│   ├── collections/       # Collection CRUD
│   └── settings/          # Settings management
├── dashboard/             # User dashboard
├── login/                 # Authentication pages
└── globals.css            # Global styles
```

### Components (`src/components/`)
- **Feature-based organization** by domain
- **Shared UI components** in `ui/` directory
- **Reusable components** follow atomic design principles

```
src/components/
├── admin/                 # Admin-specific components
├── bookmark/              # Bookmark-related components
├── collection/            # Collection-related components
├── folder/                # Folder management components
├── search/                # Search functionality
├── ui/                    # Shared UI components (shadcn/ui)
├── website/               # Public website components
└── providers/             # React context providers
```

### Utilities & Configuration (`src/lib/`)
```
src/lib/
├── auth/                  # Authentication utilities
├── utils/                 # Helper functions
├── prisma.ts              # Database client
├── utils.ts               # General utilities
└── defaultSettings.ts     # Default configuration
```

### Server Actions (`src/actions/`)
- **Next.js Server Actions** for server-side operations
- **Database operations** and **data revalidation**

## Database Schema (Prisma)
- **Collections**: Main bookmark containers
- **Folders**: Hierarchical organization within collections
- **Bookmarks**: Individual bookmark entries
- **Tags**: Bookmark categorization
- **SiteSettings**: Application configuration
- **Images**: File storage for assets
- **AccessLog**: Analytics and tracking

## File Naming Conventions
- **Components**: PascalCase (e.g., `BookmarkCard.tsx`)
- **Pages**: lowercase (e.g., `page.tsx`)
- **API routes**: lowercase (e.g., `route.ts`)
- **Utilities**: camelCase (e.g., `utils.ts`)
- **Types**: PascalCase with `.types.ts` suffix

## Import Path Aliases
- `@/*` maps to `./src/*` for clean imports
- Use absolute imports from `src/` directory

## Asset Organization
```
public/
├── assets/                # General assets
├── default-images/        # Default bookmark icons
├── favicon/               # Site favicon variants
└── *.svg                  # Brand assets and icons
```