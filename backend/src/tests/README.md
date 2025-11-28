# Backend Test Suite

Complete unit test suite for the WorkReview Service backend.

## 📦 Installation

Install test dependencies:

```bash
npm install
```

This will install:
- `jest` - Test framework
- `@types/jest` - TypeScript types for Jest
- `ts-jest` - TypeScript preprocessor for Jest
- `mongodb-memory-server` - In-memory MongoDB for testing

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on file changes)
```bash
npm run test:watch
```

### Run tests with coverage report
```bash
npm run test:coverage
```

### Run only unit tests
```bash
npm run test:unit
```

### Run tests with verbose output
```bash
npm run test:verbose
```

### Run specific test file
```bash
npm test -- auth.service.test.ts
```

### Run specific test suite
```bash
npm test -- --testNamePattern="register"
```

## 📊 Test Coverage

The test suite aims for 100% code coverage. Coverage reports are generated in the `coverage/` directory.

### Coverage Thresholds
- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

View HTML coverage report:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## 📁 Test Structure

```
backend/src/tests/
├── unit/
│   └── auth.service.test.ts      # AuthService unit tests
├── setup.ts                       # Test environment setup
├── globalSetup.ts                 # Global setup (runs once before all tests)
├── globalTeardown.ts              # Global teardown (runs once after all tests)
└── README.md                      # This file
```

## 🧪 Test Files

### `auth.service.test.ts`

Complete unit tests for `AuthService`:

#### Test Suites:
1. **register** (6 tests)
   - ✅ Successfully register a new user
   - ✅ Hash password before saving
   - ✅ Throw ConflictError when email exists
   - ✅ Handle registration without optional fields
   - ✅ Normalize email to lowercase
   - ✅ Validate email format

2. **login** (7 tests)
   - ✅ Successfully login with correct credentials
   - ✅ Update lastLogin timestamp
   - ✅ Accept case-insensitive email
   - ✅ Throw UnauthorizedError when user doesn't exist
   - ✅ Throw UnauthorizedError when password is incorrect
   - ✅ Throw UnauthorizedError when user is inactive
   - ✅ Timing attack defense (always run bcrypt.compare)

3. **refreshAccessToken** (4 tests)
   - ✅ Successfully refresh access token
   - ✅ Throw NotFoundError when user doesn't exist
   - ✅ Throw UnauthorizedError when user is inactive
   - ✅ Throw UnauthorizedError when token is invalid

4. **getMe** (3 tests)
   - ✅ Successfully return user information
   - ✅ Throw NotFoundError when user doesn't exist
   - ✅ Return user with undefined optional fields

5. **updateProfile** (6 tests)
   - ✅ Successfully update allowed profile fields
   - ✅ Only update provided fields (partial update)
   - ✅ Ignore disallowed fields (whitelist protection)
   - ✅ Throw NotFoundError when user doesn't exist
   - ✅ Validate field values (mongoose validators)
   - ✅ Handle empty update data

6. **changePassword** (6 tests)
   - ✅ Successfully change password
   - ✅ Hash the new password
   - ✅ Throw NotFoundError when user doesn't exist
   - ✅ Throw UnauthorizedError when current password is incorrect
   - ✅ Validate new password requirements
   - ✅ Allow changing password to the same password

7. **Edge Cases** (6 tests)
   - ✅ Handle concurrent registrations gracefully
   - ✅ Handle database connection errors
   - ✅ Handle invalid ObjectId format
   - ✅ Handle very long input strings within limits
   - ✅ Trim whitespace from input fields
   - ✅ Validate all required fields

**Total: 38 tests**

## 🎯 Testing Strategy

### Unit Tests
- Use **MongoDB Memory Server** for isolated database testing
- Mock external dependencies (JWT utilities, logger)
- Test all success cases, failure cases, and edge cases
- Verify error messages and logging behavior

### Test Isolation
- Each test has a clean database state (`beforeEach` cleanup)
- Mocks are reset between tests
- No test depends on another test's state

### Coverage Goals
- **100% line coverage** for service layer
- Test all code paths (success, errors, edge cases)
- Verify side effects (database writes, logging)

## 🔧 Configuration

### Jest Config (`jest.config.js`)
- **Preset**: `ts-jest` for TypeScript support
- **Test Environment**: Node.js
- **Coverage**: Configured thresholds and exclusions
- **Timeout**: 30 seconds for MongoDB operations

### Test Environment Variables (`setup.ts`)
```typescript
NODE_ENV=test
JWT_SECRET=test_jwt_secret_key_for_testing
JWT_REFRESH_SECRET=test_jwt_refresh_secret_key_for_testing
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

## 🐛 Debugging Tests

### Run a single test
```bash
npm test -- -t "should successfully register a new user"
```

### Run with Node debugger
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Enable verbose logging
Uncomment console mocking in `setup.ts` to see console output:
```typescript
// Comment out these lines in setup.ts
// global.console = {
//   ...console,
//   log: jest.fn(),
// };
```

## 📝 Writing New Tests

### Template
```typescript
describe('YourService', () => {
  beforeEach(async () => {
    // Setup: Create test data
  });

  afterEach(async () => {
    // Cleanup: Remove test data
  });

  describe('yourMethod', () => {
    it('should handle success case', async () => {
      // Arrange
      const input = { /* test data */ };

      // Act
      const result = await YourService.yourMethod(input);

      // Assert
      expect(result).toMatchObject({ /* expected */ });
    });

    it('should throw error on failure case', async () => {
      // Arrange
      const invalidInput = { /* invalid data */ };

      // Act & Assert
      await expect(
        YourService.yourMethod(invalidInput)
      ).rejects.toThrow(ErrorType);
    });
  });
});
```

## 🔍 Troubleshooting

### MongoDB Memory Server Issues
If you see "MongoMemoryServer" errors:
```bash
# Clear MongoDB Memory Server cache
rm -rf ~/.cache/mongodb-memory-server
```

### Port Already in Use
MongoDB Memory Server uses random ports, but if you see port conflicts:
```bash
# Kill processes using MongoDB ports
npx kill-port 27017
```

### TypeScript Errors
If you see TypeScript compilation errors:
```bash
# Rebuild TypeScript
npm run build
```

### Jest Cache Issues
If tests behave unexpectedly:
```bash
# Clear Jest cache
npx jest --clearCache
```

## 📚 References

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [ts-jest Documentation](https://kulshekhar.github.io/ts-jest/)

## ✅ Pre-commit Checklist

Before committing:
- [ ] All tests pass: `npm test`
- [ ] Code coverage meets threshold: `npm run test:coverage`
- [ ] No failing tests in watch mode
- [ ] New features have corresponding tests
- [ ] Edge cases are covered

---

**Happy Testing! 🎉**
