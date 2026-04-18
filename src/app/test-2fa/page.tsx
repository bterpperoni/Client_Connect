"use client";

import { useState } from "react";
import { generateTOTPSecret, generateQRCodeDataURL, verifyTOTPToken } from "$/lib/utils/totp";

export default function Test2FA() {
  const [secret, setSecret] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [testToken, setTestToken] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string>('');

  const generateQR = async () => {
    try {
      const { secret: newSecret, otpauth_url } = generateTOTPSecret('test@example.com');
      setSecret(newSecret);
      
      const qrCodeDataURL = await generateQRCodeDataURL(otpauth_url);
      setQrCode(qrCodeDataURL);
    } catch (error) {
      console.error('Error generating QR:', error);
    }
  };

  const testVerification = () => {
    if (!secret || !testToken) {
      setVerificationResult('Please generate a secret and enter a token');
      return;
    }

    const isValid = verifyTOTPToken(testToken, secret);
    setVerificationResult(isValid ? 'Valid token!' : 'Invalid token');
  };

  return (
    <div className="min-h-screen bg-[#550bb6] py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Test 2FA Implementation
        </h1>

        <div className="bg-white rounded-lg p-6 shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Step 1: Generate QR Code</h2>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            onClick={generateQR}
          >
            Generate QR Code
          </button>

          {qrCode && (
            <div className="mt-4">
              <p className="mb-2">Scan this QR code with Google Authenticator:</p>
              <img src={qrCode} alt="2FA QR Code" className="border border-gray-300 rounded-lg" />
              <p className="mt-2 text-sm text-gray-600">Secret: <code className="bg-gray-100 p-1 rounded text-xs">{secret}</code></p>
            </div>
          )}
        </div>

        {secret && (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Step 2: Test Verification</h2>
            <div className="mb-4">
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit code from your authenticator app:
              </label>
              <input
                id="token"
                type="text"
                maxLength={6}
                value={testToken}
                onChange={(e) => setTestToken(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono"
                placeholder="000000"
              />
            </div>
            
            <button
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
              onClick={testVerification}
              disabled={testToken.length !== 6}
            >
              Test Verification
            </button>

            {verificationResult && (
              <div className={`mt-4 p-3 rounded-md ${
                verificationResult.includes('Valid') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {verificationResult}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}