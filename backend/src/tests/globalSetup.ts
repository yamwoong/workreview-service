/**
 * Jest global setup
 * Runs once before all test suites
 */

export default async function globalSetup() {
  console.log('\n🚀 Setting up test environment...\n');

  // Set environment variables
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_key_for_testing';
  process.env.JWT_REFRESH_SECRET = 'test_jwt_refresh_secret_key_for_testing';

  console.log('✅ Test environment ready\n');
}
