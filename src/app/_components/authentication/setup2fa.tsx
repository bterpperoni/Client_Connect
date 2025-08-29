"use client";

import { useState } from "react";
import { toast } from "sonner";
import Btn from "$/app/_components/ui/btn";
import Loader from "$/app/_components/ui/loader";

interface Setup2FAProps {
  onComplete?: () => void;
}

const Setup2FA = ({ onComplete }: Setup2FAProps) => {
  const [step, setStep] = useState<'setup' | 'verify'>('setup');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const setupTwoFactor = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to setup 2FA');
      }

      setQrCode(data.qrCode);
      setSecret(data.secret);
      setStep('verify');
      toast.success('QR code generated successfully!');
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to setup 2FA');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/enable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      toast.success('2FA enabled successfully!');
      onComplete?.();
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify code');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'setup') {
    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Setup Two-Factor Authentication
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Two-factor authentication adds an extra layer of security to your account.
          You'll need an authenticator app like Google Authenticator or Authy.
        </p>
        
        <Btn
          classList="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md w-full"
          onClick={setupTwoFactor}
          disabled={loading}
        >
          {loading ? <Loader size={20} className="text-white" /> : "Generate QR Code"}
        </Btn>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Scan QR Code
      </h2>
      
      <div className="mb-4">
        <p className="text-gray-600 text-center mb-4">
          Scan this QR code with your authenticator app:
        </p>
        {qrCode && (
          <img 
            src={qrCode} 
            alt="2FA QR Code" 
            className="border border-gray-300 rounded-lg"
          />
        )}
      </div>

      <div className="w-full">
        <p className="text-sm text-gray-600 mb-2">
          Or enter this secret manually:
        </p>
        <code className="bg-gray-100 p-2 rounded text-xs break-all block mb-4">
          {secret}
        </code>
      </div>

      <div className="w-full">
        <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 mb-2">
          Enter the 6-digit code from your app:
        </label>
        <input
          id="verification-code"
          type="text"
          maxLength={6}
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono"
          placeholder="000000"
        />
      </div>

      <div className="flex space-x-3 w-full">
        <Btn
          classList="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex-1"
          onClick={() => setStep('setup')}
          disabled={loading}
        >
          Back
        </Btn>
        <Btn
          classList="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex-1"
          onClick={verifyAndEnable}
          disabled={loading || verificationCode.length !== 6}
        >
          {loading ? <Loader size={20} className="text-white" /> : "Enable 2FA"}
        </Btn>
      </div>
    </div>
  );
};

export default Setup2FA;