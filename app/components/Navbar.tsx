// Navbar.tsx
"use client";
import { jwtDecode } from "jwt-decode"; // Use named import
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from '../AuthContext'; // Import the useAuth hook

interface DecodedToken {
  companyName: string;
}

export default function Navbar() {
  const { companyName, setCompanyName } = useAuth(); // Use context
  const [showLogout, setShowLogout] = useState<boolean>(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        // Ensure the token is valid and decode it
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded && decoded.companyName) {
          setCompanyName(decoded.companyName); // Set company name in context
        } else {
          console.error("Token does not contain valid data.");
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        sessionStorage.removeItem("token"); // Remove invalid token
        setCompanyName(null); // Reset company name in context
      }
    }
  }, [setCompanyName]);

  const handleCompanyNameClick = () => {
    setShowLogout((prev) => !prev);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setCompanyName(null);
    setShowLogout(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center">
          <img
            src="/images/logo.jpg"
            alt="Logo"
            className="h-10 w-10 rounded-full mr-2"
          />
          <span className="text-2xl font-bold">JobAdmin</span>
        </div>
        <div className="space-x-4">
          {companyName ? (
            <div className="flex items-center">
              <span
                onClick={handleCompanyNameClick}
                className="flex items-center bg-white text-gray-800 py-1 px-2 rounded-full shadow-md cursor-pointer"
              >
                <span className="text-green-500 font-semibold mr-1">Welcome,</span>
                <span className="text-blue-500 font-semibold">{companyName}!</span>
              </span>
              {showLogout && (
                <button
                  onClick={handleLogout}
                  className="ml-4 bg-red-500 text-white py-2 px-4 rounded-full"
                >
                  Logout
                </button>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link href="/signup">
                <span className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-full border border-blue-600 transition duration-300 text-lg hover:border-blue-400 hover:text-blue-400">
                  Signup
                </span>
              </Link>
              <Link href="/login">
                <span className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-full border border-blue-600 transition duration-300 text-lg hover:border-blue-400 hover:text-blue-400">
                  Login
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
