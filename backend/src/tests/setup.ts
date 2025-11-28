/**
 * Jest setup file
 * Runs before each test file
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret_key_for_testing';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
process.env.PORT = '5000';
process.env.FRONTEND_URL = 'http://localhost:3000';

// Increase timeout for MongoDB operations
jest.setTimeout(30000);

// Suppress console output during tests (optional)
// Uncomment to reduce noise in test output
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };
