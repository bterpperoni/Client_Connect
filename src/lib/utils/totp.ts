import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

/**
 * Generate a TOTP secret for a user
 * @param userEmail - The user's email address
 * @param serviceName - The name of the service (default: "Client Connect")
 * @returns Object containing secret, qr code URL, and backup codes
 */
export function generateTOTPSecret(userEmail: string, serviceName: string = "Client Connect") {
  const secret = speakeasy.generateSecret({
    name: `${serviceName} (${userEmail})`,
    issuer: serviceName,
    length: 32,
  });

  return {
    secret: secret.base32,
    otpauth_url: secret.otpauth_url,
    qr_code_ascii: secret.qr_code_ascii,
  };
}

/**
 * Generate QR code as data URL for display in the browser
 * @param otpauth_url - The otpauth URL from generateTOTPSecret
 * @returns Promise that resolves to a data URL string for the QR code
 */
export async function generateQRCodeDataURL(otpauth_url: string): Promise<string> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(otpauth_url);
    return qrCodeDataURL;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`);
  }
}

/**
 * Verify a TOTP token against a secret
 * @param token - The 6-digit TOTP token from the user's authenticator app
 * @param secret - The base32 secret stored in the database
 * @param window - The time window for verification (default: 2, allows ±1 time step)
 * @returns Boolean indicating if the token is valid
 */
export function verifyTOTPToken(token: string, secret: string, window: number = 2): boolean {
  try {
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: window,
    });
    return verified;
  } catch (error) {
    console.error('Error verifying TOTP token:', error);
    return false;
  }
}

/**
 * Generate backup codes for 2FA recovery
 * @param count - Number of backup codes to generate (default: 8)
 * @returns Array of backup codes
 */
export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate a 8-character alphanumeric code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
}