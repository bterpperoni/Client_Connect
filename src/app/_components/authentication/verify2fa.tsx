"use client";

import { useState } from "react";
import { toast } from "sonner";
import Btn from "$/app/_components/ui/btn";
import Loader from "$/app/_components/ui/loader";

interface Verify2FAProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

const Verify2FA = ({ onSuccess, onCancel }: Verify2FAProps) => {
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const verifyCode = async () => {
    if (!code || code.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify code');
      }

      toast.success('Code verified successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error verifying code:', error);
      toast.error(error instanceof Error ? error.message : 'Invalid verification code');
      setCode(''); // Clear the code on error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setCode(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && code.length === 6) {
      verifyCode();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Two-Factor Authentication
      </h2>
      
      <p className="text-gray-600 text-center mb-6">
        Enter the 6-digit code from your authenticator app to complete the login process.
      </p>

      <div className="w-full">
        <label htmlFor="2fa-code" className="block text-sm font-medium text-gray-700 mb-2">
          Verification Code:
        </label>
        <input
          id="2fa-code"
          type="text"
          maxLength={6}
          value={code}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-mono tracking-wider"
          placeholder="000000"
          autoFocus
        />
      </div>

      <div className="flex space-x-3 w-full mt-6">
        {onCancel && (
          <Btn
            classList="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex-1"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Btn>
        )}
        <Btn
          classList="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex-1"
          onClick={verifyCode}
          disabled={loading || code.length !== 6}
        >
          {loading ? <Loader size={20} className="text-white" /> : "Verify"}
        </Btn>
      </div>

      <p className="text-xs text-gray-500 text-center mt-4">
        Having trouble? Make sure your device's time is synchronized.
      </p>
    </div>
  );
};

export default Verify2FA;