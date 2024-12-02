"use client";
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useState } from 'react';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter(); // Initialize useRouter
  const token = searchParams.get('token');

  const handleResetPassword = async () => {
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Simple length check for the new password
    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true); // Start loading

    try {
      // Make the POST request to reset the password with credentials
      const response = await axios.post(
        "http://localhost:8080/auth/reset-password",
        { token, newPassword },
        { withCredentials: true } // Include credentials with the request
      );

      setMessage(response.data); // Set success message

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/login'); // Redirect to app/page.tsx
      }, 5000); // 5000 milliseconds = 5 seconds

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage("Error: " + (error.response?.data || "An error occurred")); // Handle error
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Reset Password</h2>
        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="New Password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          className={`w-full ${loading ? "bg-gray-400" : "bg-blue-600"} text-white py-3 rounded-lg hover:bg-blue-700 transition-colors`}
          onClick={handleResetPassword}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
        {message && (
          <p className={`text-center mt-4 ${message.includes("Error") ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
