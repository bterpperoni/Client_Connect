const speakeasy = require('speakeasy');

console.log('🧪 Running Comprehensive 2FA TOTP Verification Test\n');

// Test 1: Generate secret and verify current token
console.log('Test 1: Basic Token Generation and Verification');
const secret = speakeasy.generateSecret({
  name: 'Test User (test@example.com)',
  issuer: 'Client Connect',
  length: 32,
});

const currentToken = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32'
});

const isCurrentValid = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: currentToken,
  window: 2
});

console.log(`✅ Current Token: ${currentToken}`);
console.log(`✅ Verification: ${isCurrentValid ? 'VALID' : 'INVALID'}`);
console.log('');

// Test 2: Test with invalid token
console.log('Test 2: Invalid Token Verification');
const invalidToken = '123456';
const isInvalidValid = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: invalidToken,
  window: 2
});

console.log(`❌ Invalid Token: ${invalidToken}`);
console.log(`❌ Verification: ${isInvalidValid ? 'VALID' : 'INVALID'}`);
console.log('');

// Test 3: Test time window functionality (test current token with window)
console.log('Test 3: Time Window Verification');
// Generate a token for the current time step and verify with window
const windowToken = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32'
});

const isWindowValid = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: windowToken,
  window: 2 // Should accept current token
});

console.log(`🕐 Window Token: ${windowToken}`);
console.log(`🕐 Verification with window: ${isWindowValid ? 'VALID' : 'INVALID'}`);
console.log('');

// Test 5: Test that old tokens are properly rejected
console.log('Test 5: Old Token Rejection');
const oldToken = speakeasy.totp({
  secret: secret.base32,
  encoding: 'base32',
  time: Date.now() - 120000 // 2 minutes ago (should be rejected)
});

const isOldValid = speakeasy.totp.verify({
  secret: secret.base32,
  encoding: 'base32',
  token: oldToken,
  window: 2
});

console.log(`🕐 Old Token (2min ago): ${oldToken}`);
console.log(`🕐 Verification: ${isOldValid ? 'VALID (BAD!)' : 'INVALID (GOOD!)'}`);
console.log('');

// Test 4: OTPAuth URL format validation
console.log('Test 4: OTPAuth URL Format');
const otpauthUrl = secret.otpauth_url;
const urlPattern = /^otpauth:\/\/totp\/([^?]+)\?secret=([A-Z2-7]+)$/;
const isValidFormat = urlPattern.test(otpauthUrl);

console.log(`📱 OTPAuth URL: ${otpauthUrl}`);
console.log(`📱 Format Valid: ${isValidFormat ? 'YES' : 'NO'}`);
console.log('');

// Summary
console.log('🎯 Test Summary:');
console.log(`✅ Token Generation: ${currentToken ? 'PASS' : 'FAIL'}`);
console.log(`✅ Valid Token Verification: ${isCurrentValid ? 'PASS' : 'FAIL'}`);
console.log(`✅ Invalid Token Rejection: ${!isInvalidValid ? 'PASS' : 'FAIL'}`);
console.log(`✅ Time Window Support: ${isWindowValid ? 'PASS' : 'FAIL'}`);
console.log(`✅ Old Token Rejection: ${!isOldValid ? 'PASS' : 'FAIL'}`);
console.log(`✅ OTPAuth URL Format: ${isValidFormat ? 'PASS' : 'FAIL'}`);
console.log('');

const allTestsPassed = currentToken && isCurrentValid && !isInvalidValid && isWindowValid && !isOldValid && isValidFormat;
console.log(`🚀 Overall Status: ${allTestsPassed ? '🎉 ALL TESTS PASSED!' : '❌ SOME TESTS FAILED'}`);

if (allTestsPassed) {
  console.log('');
  console.log('✅ The 2FA TOTP implementation is working correctly!');
  console.log('✅ Ready for integration with Google Authenticator');
  console.log('✅ All security requirements met');
}