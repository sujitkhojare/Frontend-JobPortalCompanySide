"use client";
import axios from 'axios';
import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    try {
      // Make the POST request to initiate the password reset process
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const response = await axios.post(
        "http://localhost:8080/auth/forgot-password",
        { email },
        { withCredentials: true } // Include credentials with the request
      );
      setMessage("Check your email for the reset link."); // Set success message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setMessage("Error: " + (error.response?.data || "An error occurred")); // Handle error
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h4 className="text-2xl font-semibold mb-6 text-center text-gray-800">Forgot Password</h4>
        <input
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="button"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          onClick={handleForgotPassword}
        >
          Send Reset Link
        </button>
        {message && (
          <p
            className={`text-center mt-4 ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;