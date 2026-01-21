import { useState, useEffect } from "react";
import { deleteAccount, sendOtp } from "../../api/admin/authService";
import toast from "react-hot-toast";

const DeleteAccount = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [data, setData] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState<number | null>(null);
  const [accountDeleted, setAccountDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpResendCooldown, setOtpResendCooldown] = useState(0);

  // Check OTP expiration every second
  useEffect(() => {
    if (!otpSent || !otpSentTime) return;

    const checkExpiration = () => {
      const currentTime = Date.now();
      const elapsedMinutes = (currentTime - otpSentTime) / (1000 * 60);
      
      if (elapsedMinutes >= 5) {
        setOtpExpired(true);
        toast.error("OTP has expired. Please request a new one.");
      }
    };

    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [otpSent, otpSentTime]);

  // Handle resend cooldown
  useEffect(() => {
    if (otpResendCooldown <= 0) return;

    const timer = setTimeout(() => {
      setOtpResendCooldown(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [otpResendCooldown]);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (otpResendCooldown > 0) {
      toast.error(`Please wait ${otpResendCooldown} seconds before resending OTP`);
      return;
    }

    try {
      setLoading(true);
      const res = await sendOtp(email);
      
      if (res?.data) {
        setOtp(res.data);
        setOtpSent(true);
        setOtpSentTime(Date.now());
        setOtpExpired(false);
        setOtpResendCooldown(30); // 30 seconds cooldown
        toast.success("OTP sent to your email");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    await handleSendOtp();
  };

  const deleteAccountInfo = async () => {
    if (!data || !otp) {
      toast.error("Please enter OTP");
      return;
    }

    if (data !== otp) {
      toast.error("Invalid OTP");
      return;
    }

    if (otpExpired) {
      toast.error("OTP has expired. Please request a new one.");
      return;
    }

    try {
      setLoading(true);
      const res = await deleteAccount(email);
      
      if (res?.success) {
        setAccountDeleted(true);
        toast.success(res?.message || "Account deleted successfully");
      } else {
        toast.error(res?.message || "Failed to delete account");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error deleting account");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Success page after account deletion
  if (accountDeleted) {
    return (
      <div className="w-full inset-0 fixed z-100 bg-gray-100 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6 md:p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Deleted Successfully
          </h1>
          <p className="text-gray-600 mb-6">
            Your account has been permanently deleted from our system.
          </p>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to <strong>{email}</strong>
            </p>
          </div>

          {/* Home Button */}
          <button
            onClick={() => window.location.href = "/"}
            className="w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition"
          >
            Return to Homepage
          </button>

          {/* Footer */}
          <p className="text-xs text-gray-500 text-center mt-6">
            Thank you for using Krew Carwash
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full inset-0 fixed z-100 bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-6 md:p-8">
        {/* Header */}
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Delete Account
        </h1>
        <p className="text-sm text-gray-500 text-center mt-2">
          Krew Carwash
        </p>

        {/* Warning */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-700 font-semibold text-lg">
            ⚠️ Important Notice
          </h2>
          <p className="text-red-600 text-sm mt-2">
            This action is permanent and cannot be undone. All your data will be permanently deleted.
          </p>
        </div>

        {/* Email Input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Registered Email
          </label>
          <input
            type="email"
            value={email}
            placeholder="Enter your registered email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Send OTP Button */}
        {!otpSent && (
          <div className="mt-4">
            <button
              disabled={!email || loading}
              onClick={handleSendOtp}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                email && !loading
                  ? "bg-black text-white hover:bg-gray-900"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        )}

        {/* OTP Input */}
        {otpSent && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              {otpSentTime && (
                <div className="flex items-center gap-2">
                  <div className={`text-xs font-medium ${otpExpired ? 'text-red-600' : 'text-gray-500'}`}>
                    ⏰ {otpExpired ? 'Expired' : `Expires in ${formatTime(Math.max(0, 300 - Math.floor((Date.now() - otpSentTime) / 1000)))}`}
                  </div>
                </div>
              )}
            </div>
            
            <input
              type="text"
              maxLength={6}
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="6-digit OTP"
              className={`w-full border ${otpExpired ? 'border-red-300' : 'border-gray-300'} rounded-lg px-4 py-3 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-red-500`}
            />
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-500">
                OTP sent to <strong>{email}</strong>
              </p>
              
              <button
                onClick={handleResendOtp}
                disabled={otpResendCooldown > 0 || loading}
                className={`text-xs ${otpResendCooldown > 0 ? 'text-gray-400' : 'text-red-600 hover:text-red-800'}`}
              >
                {otpResendCooldown > 0 ? `Resend in ${otpResendCooldown}s` : 'Resend OTP'}
              </button>
            </div>

            {otpExpired && (
              <p className="text-xs text-red-600 mt-2">
                OTP has expired. Please request a new one.
              </p>
            )}
          </div>
        )}

        {/* Confirm Delete */}
        {otpSent && (
          <div className="mt-8">
            <button
              disabled={data.length !== 6 || otpExpired || loading}
              onClick={deleteAccountInfo}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                data.length === 6 && !otpExpired && !loading
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              {loading ? "Deleting..." : "Confirm & Delete Account"}
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Need help?{" "}
          <span className="text-gray-700 font-medium">
            support@krewcarwash.com
          </span>
        </p>
      </div>
    </div>
  );
};

export default DeleteAccount;