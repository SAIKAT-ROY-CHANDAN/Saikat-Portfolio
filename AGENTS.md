# Project: Saikat's Portfolio

## Overview
A Next.js 14 portfolio website showcasing Saikat Roy's skills, projects, blog, and work experience. Built with React, TypeScript, Tailwind CSS, and modern web technologies.

## Tech Stack
- **Framework**: Next.js 14.2.4 (App Router)
- **Language**: TypeScript 5.9.3, React 18.3.1
- **Styling**: Tailwind CSS 3.4.19, `cn()` utility from `lib/utils.ts` for class merging
- **Animations**: Framer Motion 11.18.2, GSAP, Three.js / react-three-fiber / three-globe
- **Database**: MongoDB + Mongoose (model in `models/Blog.ts`)
- **Auth**: Manual cookie-based auth (custom login via `NEXT_PUBLIC_API_URL/api/login`)
- **Theming**: `next-themes` (dark mode default)
- **Blog Editor**: react-quill, browser-image-compression, ImgBB API
- **Icons**: Custom SVG icons in `Icons/index.tsx`, lucide-react, react-icons

## Project Structure

### `app/` (Next.js App Router)
- `layout.tsx` — Root layout: Inter font, ThemeProvider (no Auth0)
- `page.tsx` — Home page: composes Header, Hero, Grid, Skills, RecentProjects, BlogCard, Clients, Experience, Education, Approach, Footer
- `provider.tsx` — ThemeProvider wrapper (`use client`)
- `globals.css` — Tailwind directives, CSS variables for light/dark themes, custom quill styles
- `blog/[blogId]/page.tsx` — Blog detail page (server component, fetches from API)
- `dashboard/page.tsx` — Dashboard with BlogEditor, logout handler (clears cookies + localStorage)
- `login/page.tsx` — Login form (sets userEmail/userRole cookies and localStorage)

### `components/`
- `Header.tsx` — Fixed nav with mobile menu, highlights active nav item via hash, shows Dashboard link if userRole exists
- `Hero.tsx` — Hero section with spotlight effects, TextGenerateEffect, download CV button
- `Grid.tsx` — BentoGrid from data/gridItems
- `Skills.tsx` — Skills section with animated SVG beams connecting icon circles
- `RecentProjects.tsx` — Fetches projects from `NEXT_PUBLIC_API_URL/api/projects`, renders PinContainer cards
- `BlogCard.tsx` — Fetches blogs from `NEXT_PUBLIC_API_URL/api/blogs`, renders FollowerPointerCard grid
- `Clients.tsx` — Testimonials via InfiniteMovingCards
- `Experience.tsx` — Fetches from `NEXT_PUBLIC_API_URL/api/experience`, renders MovingBorders cards
- `Education.tsx` — Static education items
- `Approach.tsx` — 3-phase approach cards with CanvasRevealEffect animation
- `Footer.tsx` — Contact section with MagicButton, social media links
- `BlogEditor.tsx` — Blog creation form (title, tags, content via react-quill, cover image upload to ImgBB)
- `ui/` — Shadcn UI components: BentoGrid, MagicButton, MovingBorders, Spotlight, TextGenerateEffect, AnimatedBeam, CanvasRevealEffect, 3d-pin, InfiniteMovingCard, FollowingPointerCard, Globe, GridGlobe, etc.

### `data/`
- `index.ts` — All static data: `navItems`, `navigation`, `gridItems`, `projects`, `testimonials`, `companies`, `workExperience`, `socialMedia`
- `globe.json` — GeoJSON for world map
- `confetti.json` — Lottie animation data

### `lib/`
- `utils.ts` — `cn()` function combining clsx + tailwind-merge
- `dbConnect.ts` — MongoDB connection (currently commented out)
- `api.ts` — API functions (currently commented out)

### `models/`
- `Blog.ts` — Mongoose Blog schema (title, tags, content, coverImage, createdAt)

### `types/`
- `index.ts` — `IBlog`, `IProject`, `WorkExperience` interfaces

### `utils/`
- `uploadImage.ts` — `compressImage()` (browser-image-compression) and `uploadImageToImgbb()` (ImgBB API)

### `Icons/`
- `index.tsx` — SVG icon components: github, html, nodejs, nextjs, mongodb, typescript, javascript, redux, react, framermotion, firebase, express, yarn, npm, css, prisma

### `public/`
- Static assets: SVGs, images, background images

## Key Patterns & Conventions

### Import Aliases
- `@/components` — Components directory
- `@/data` — Data files
- `@/lib/utils` — Utility functions
- `@/Icons` — Icon components
- `@/types` — TypeScript interfaces
- `@/utils` — Utility functions (e.g., uploadImage)

### Component Types
- **Server Components** (default): Data fetching with `fetch()` to `NEXT_PUBLIC_API_URL`
- **Client Components** (`"use client"`): Interactivity, state, effects
- Pages use `cache: 'no-store'` for real-time data

### Auth Flow
- Cookies: `userEmail`, `userRole`
- localStorage: `userEmail`, `userRole`
- Middleware (`middleware.ts`) protects `/dashboard` — requires `userRole === 'admin'`
- Login page POSTs to local `/api/login` (route in `app/api/login/route.ts`)
- Local login validates against `ADMIN_EMAIL` / `ADMIN_PASSWORD` env vars (set in `.env.local`; password must be non-empty or login always 401)
- On success, the route sets `userEmail` + `userRole` HttpOnly cookies; client also writes localStorage for the Header's Dashboard link
- Logout clears cookies and localStorage, redirects to `/`
- No external auth provider (Auth0 removed); entirely custom cookie-based auth

### Blog CRUD
- Backend API: `https://portfolio-backend-tawny-gamma.vercel.app/api/blogs`
- BlogEditor uses ImgBB for image hosting (API key: `272427d716bd5d87f04740819c42e62b`)
- Image compression: maxSizeMB: 1, maxWidthOrHeight: 1920

### API URL
- Environment variable: `NEXT_PUBLIC_API_URL`
- Used by: RecentProjects, BlogCard, Experience, BlogEditor, Blog detail page, Login

### Styling
- CSS variables in `globals.css` define color themes for light/dark
- `cn()` function for conditional Tailwind class merging
- `heading` class: `font-bold text-4xl md:text-5xl text-center`
- `black-gradient` class: gradient background
- Default theme: dark (`defaultTheme="dark"` in layout)

### Removed Components
- **Sentry**: Fully removed (@sentry/nextjs, sentry configs, sentry-example-page)
- **@auth0/nextjs-auth0**: Fully removed (UserProvider no longer used; custom cookie auth)

## Configuration Files
- `tsconfig.json`: Strict mode, `@/*` paths, Next.js plugin
- `tailwind.config.ts`: Tailwind CSS config with custom plugins (tailwindcss-animate, mini-svg-data-uri)
- `postcss.config.mjs`: PostCSS with Tailwind
- `components.json`: shadcn/ui config (new-york style, neutral base)
- `eslint.config.js`: ESLint 9 flat config with Next.js
- `next.config.mjs`: Next.js config (no Sentry wrapper)

## Important Notes
- MongoDB connection in `lib/dbConnect.ts` is commented out (likely using external backend API instead)
- `lib/api.ts` functions are commented out
- `EXPRESS` icon exists in Icons but express backend is external
- The portfolio backend is hosted separately at `portfolio-backend-tawny-gamma.vercel.app`
- Image imports use `next/image` with `width`/`height` props
- All component files use PascalCase naming
- `data/index.ts` has duplicate IDs in `navigation` array (all "1" or "2")
- ESLint migrated to flat config (`eslint.config.js`)
- Sentry and Auth0 removed entirely from the project
