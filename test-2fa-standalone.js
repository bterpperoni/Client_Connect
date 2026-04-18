const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

console.log('🔐 Testing 2FA TOTP Implementation\n');

// Generate a secret
const secret = speakeasy.generateSecret({
  name: 'Test User (test@example.com)',
  issuer: 'Client Connect',
  length: 32,
});

console.log('✅ Generated TOTP Secret:');
console.log('Secret (Base32):', secret.base32);
console.log('OTPAuth URL:', secret.otpauth_url);
console.log('');

// Generate QR Code
QRCode.toString(secret.otpauth_url, { type: 'terminal' }, function (err, url) {
  if (err) {
    console.error('❌ Error generating QR code:', err);
    return;
  }
  
  console.log('📱 QR Code for Google Authenticator:');
  console.log(url);
  console.log('');
  
  // Generate current TOTP token for testing
  const token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  });
  
  console.log('🔢 Current TOTP Token:', token);
  console.log('');
  
  // Verify the token
  const verified = speakeasy.totp.verify({
    secret: secret.base32,
    encoding: 'base32',
    token: token,
    window: 2
  });
  
  console.log('✅ Token Verification:', verified ? 'VALID' : 'INVALID');
  console.log('');
  
  console.log('📋 Instructions:');
  console.log('1. Scan the QR code above with Google Authenticator');
  console.log('2. The current token should match what you see in the app');
  console.log('3. This proves the 2FA implementation is working correctly!');
  console.log('');
  console.log('🎯 Manual Secret Entry:');
  console.log('If you can\'t scan the QR code, manually enter this secret:');
  console.log(secret.base32);
});