# Agent Guidelines for Stage Timer

## Build, Lint, and Test Commands

- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production (includes Convex deployment)
- `npm start` - Start production server
- `npm run lint` - Run ESLint on all files
- `npx convex dev` - Start Convex backend server (run in parallel with dev)
- `npx convex deploy --cmd 'npm run build'` - Deploy Convex + Next.js to Vercel

**Testing**: No test framework is currently configured. Add tests using Jest/Vitest before implementing new features.

## Code Style Guidelines

### Imports
- Order: external libraries → internal modules → relative imports
- Use `@/` alias for absolute imports from project root (configured in tsconfig.json)
- Named imports preferred: `import { useState } from 'react'`
- Client components must start with `'use client';` directive

### File Structure
- `app/` - Next.js App Router pages and layouts
- `lib/` - Utility functions and shared helpers
- `hooks/` - Custom React hooks
- `convex/` - Backend schema and functions
- Use index exports for barrel files when appropriate

### TypeScript
- Strict mode enabled - all types must be explicit
- Use interfaces for object shapes, especially component props
- Use union types with `v.union()` in Convex schemas
- Type function parameters explicitly: `(roomId: string, options?: { timeout?: number })`
- Use `v.literal()` for string unions in Convex
- Type definitions in hooks/lib can be exported: `export interface RoomState { ... }`

### Naming Conventions
- Components: PascalCase (`Home`, `OperatorView`, `DisplayView`)
- Functions/variables: camelCase (`updateState`, `formatTime`, `currentTime`)
- Constants: UPPER_SNAKE_CASE (rare, use camelCase in most cases)
- CSS classes: kebab-case via Tailwind utilities
- Convex functions: lowercase with underscores (`get`, `join`, `update`)
- Event handlers: `handle` prefix (`handleJoin`, `handleSetTime`)

### React Patterns
- Always use function components with hooks
- `'use client';` directive at the very top for client components
- Use `useEffect` with cleanup functions for timers/intervals
- Motion library for animations: `<motion.button whileTap={{ scale: 0.95 }}>`
- AnimatePresence for conditional animations
- Use `useParams()` from `next/navigation` for route params, cast with `as string`

### Styling
- Tailwind CSS v4 with `@theme` directive in globals.css
- Use `cn()` utility from `lib/utils.ts` for conditional class merging: `cn('base-class', isActive && 'active-class')`
- Prefer utility classes over inline styles
- Use inline styles only for dynamic values: `style={{ color: state.messageColor }}`
- Font variables: `--font-sans` (Space Grotesk), `--font-mono` (Plus Jakarta Sans)
- Motion/animation: use `motion/` package, not `framer-motion`
- Custom animations in globals.css with `@keyframes`

### Error Handling
- Wrap async operations in try-catch blocks
- Store error state in useState: `const [error, setError] = useState<string | null>(null)`
- Log errors with console.error()
- Provide user-friendly error messages in UI
- Graceful degradation for non-critical features

### Convex Integration
- Schema definitions in `convex/schema.ts` using `defineSchema()`
- Use `v.union()` with `v.literal()` for string enums
- Mutations and queries in `convex/[entity].ts`
- Use hooks: `useQuery(api.rooms.get)`, `useMutation(api.rooms.update)`
- Ignore `convex/_generated/**` in eslint config

### Analytics
- Import from `@/lib/analytics` for all event tracking
- All tracking functions skip events in non-production environments
- Event names use snake_case: `timer_started`, `session_ended`
- Parameters object for event metadata

### State Management
- Local state with useState for component-specific data
- Convex for shared state across clients
- Use refs for values that persist across renders but don't trigger updates: `const errorRef = useRef<string | null>(null)`

### Performance
- Use `requestAnimationFrame` for animations and timers
- Clean up intervals and timeouts in useEffect return
- Debounce/throttle expensive operations when needed
- Lazy load heavy components with dynamic imports

### Best Practices
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use const by default, let only when reassignment is needed
- Prefer early returns to reduce nesting
- Comment complex logic, but keep it minimal
- Use proper semantic HTML elements
- Ensure accessibility with ARIA attributes when needed

### Environment Variables
- Convex: `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_DEPLOYMENT`
- Analytics: `NEXT_PUBLIC_GA_ID`
- Never commit `.env.local` or secrets
- Use `.env.example` as template