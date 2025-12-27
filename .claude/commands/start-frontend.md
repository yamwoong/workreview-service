# Start Frontend Feature Implementation

I need to implement a frontend feature.

## Setup
1. Read `docs/PROJECT_CONTEXT.md` if you haven't already
2. Ask me which feature to implement (e.g., "Store", "Review", etc.)
3. After I tell you, read:
   - `docs/API_SPEC.md` (the specific API section)
   - Check if backend is ready by looking at `backend/src/routes/`

## Implementation Pattern

**Files to create**:

1. `frontend/src/types/[feature].types.ts`
   - TypeScript interfaces for data models
   - API request/response types
   - Component prop types

2. `frontend/src/api/[feature].api.ts`
   - API client functions using axios
   - Type-safe request/response
   - Error handling

3. `frontend/src/hooks/use[Feature].ts`
   - React Query hooks (useQuery, useMutation)
   - Custom hooks for data fetching
   - Loading/error states

4. `frontend/src/pages/[Feature]Page.tsx`
   - Main page component
   - Use React Query hooks
   - Handle loading/error states
   - Responsive design with TailwindCSS

5. `frontend/src/components/[feature]/`
   - Reusable components
   - [Feature]Card.tsx
   - [Feature]List.tsx
   - [Feature]Form.tsx (if needed)
   - etc.

## Design Guidelines
- Use TailwindCSS utility classes (no inline styles)
- Follow mobile-first responsive design
- Use existing UI components from `frontend/src/components/ui/`
- Consistent spacing and colors
- Proper loading states (Spinner component)
- Error handling with user-friendly messages

## Reference Files
- Page: `frontend/src/pages/ProfilePage.tsx` (if exists)
- Component: `frontend/src/components/ui/Card.tsx`
- API pattern: Follow axios setup
- Hooks: React Query patterns

## Requirements
- TypeScript strict mode
- Responsive design (mobile, tablet, desktop)
- Accessibility (semantic HTML, ARIA labels)
- Error boundaries
- Loading states
- Empty states

What feature would you like to implement?
