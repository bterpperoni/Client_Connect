"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Setup2FA from "$/app/_components/authentication/setup2fa";
import Btn from "$/app/_components/ui/btn";
import Loader from "$/app/_components/ui/loader";

export default function TwoFactorSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/authentication");
    }
  }, [status, router]);

  useEffect(() => {
    // Check current 2FA status
    const checkTwoFactorStatus = async () => {
      try {
        const response = await fetch("/api/user/2fa-status");
        if (response.ok) {
          const data = await response.json();
          setTwoFactorEnabled(data.enabled);
        }
      } catch (error) {
        console.error("Error checking 2FA status:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      checkTwoFactorStatus();
    }
  }, [session]);

  const handleSetupComplete = () => {
    setTwoFactorEnabled(true);
  };

  const disableTwoFactor = async () => {
    try {
      const response = await fetch("/api/auth/2fa/disable", {
        method: "POST",
      });

      if (response.ok) {
        setTwoFactorEnabled(false);
      } else {
        throw new Error("Failed to disable 2FA");
      }
    } catch (error) {
      console.error("Error disabling 2FA:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center w-full h-[90vh]">
        <Loader size={100} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center flex-col justify-center text-white text-xl border-white w-full h-[90vh]">
        <h1 className="mb-4 text-2xl">Please sign in to access settings.</h1>
        <Btn
          classList="border-2 rounded-md cursor-pointer p-2 border-white hover:bg-white hover:text-[#550bb6] hover:border-[#550bb6] bg-[#550bb6]"
          onClick={() => router.push("/authentication")}
        >
          Sign in here!
        </Btn>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#550bb6] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Two-Factor Authentication Settings
          </h1>
          <p className="text-purple-200 max-w-2xl mx-auto">
            Secure your account with two-factor authentication. This adds an extra layer of security
            by requiring a code from your mobile device in addition to your password.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          {twoFactorEnabled === null ? (
            <div className="flex justify-center">
              <Loader size={60} className="text-white" />
            </div>
          ) : twoFactorEnabled ? (
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  2FA is Enabled
                </h2>
                <p className="text-gray-600">
                  Your account is protected with two-factor authentication.
                </p>
              </div>

              <div className="space-y-4">
                <Btn
                  classList="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                  onClick={disableTwoFactor}
                >
                  Disable 2FA
                </Btn>
                <Btn
                  classList="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                  onClick={() => router.push("/dashboard")}
                >
                  Back to Dashboard
                </Btn>
              </div>
            </div>
          ) : (
            <Setup2FA onComplete={handleSetupComplete} />
          )}
        </div>
      </div>
    </div>
  );
}