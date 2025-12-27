# Start Backend Feature Implementation

I need to implement a backend feature.

## Setup
1. Read `docs/PROJECT_CONTEXT.md` if you haven't already
2. Ask me which feature to implement (e.g., "Review", "Comment", etc.)
3. After I tell you, read the relevant sections from:
   - `docs/DATABASE_SCHEMA.md` (the specific collection)
   - `docs/API_SPEC.md` (the specific API section)

## Implementation Pattern
Follow the Store backend pattern:

**Files to create**:
1. `backend/src/models/[Feature].model.ts`
   - Mongoose schema with TypeScript interface
   - Indexes and virtuals
   - Pre/post hooks if needed

2. `backend/src/validators/[feature].validator.ts`
   - Zod validation schemas
   - Export TypeScript types

3. `backend/src/services/[feature].service.ts`
   - Business logic as static class methods
   - Error handling with custom error classes
   - Database operations

4. `backend/src/controllers/[feature].controller.ts`
   - Express request handlers
   - Use asyncHandler wrapper
   - Validate with middleware

5. `backend/src/routes/[feature].routes.ts`
   - Express router
   - Apply authentication middleware
   - Apply validation middleware

## Reference Files
- Model: `backend/src/models/Store.model.ts`
- Service: `backend/src/services/store.service.ts`
- Controller: `backend/src/controllers/store.controller.ts`
- Routes: `backend/src/routes/store.routes.ts`
- Validator: `backend/src/validators/store.validator.ts`

## Requirements
- Use TypeScript strict mode
- Include proper error handling
- Add JSDoc comments
- Follow existing naming conventions
- Include validation for all inputs

What feature would you like to implement?
