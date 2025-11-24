// Test setup file
// This file runs before all tests

// Set test environment
process.env['NODE_ENV'] = 'test';
process.env['DATABASE_URL'] = 'file:./test.db';

// Add global test utilities here if needed
console.info('Test environment initialized');
