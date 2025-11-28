/**
 * Jest global teardown
 * Runs once after all test suites
 */

export default async function globalTeardown() {
  console.log('\n🧹 Cleaning up test environment...\n');

  // Any global cleanup can go here
  // For example, closing persistent connections, cleaning up temp files, etc.

  console.log('✅ Test environment cleaned up\n');
}
