"use client";

import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBriefcase, FaChartLine, FaUserTie } from "react-icons/fa";

// Define the token decoding type
interface DecodedToken {
  companyName: string;
  exp: number;
  // Add other fields if necessary
}

export default function Services() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Token validation and decoding logic
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      // No token found, set error message and redirect to login
      setErrorMessage("Access denied Please log in !");
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token expired
        setErrorMessage("Session expired. Please log in again.");
        sessionStorage.removeItem("token");
        router.push("/login");
      } else {
        // Token is valid, set company name from the token
        setCompanyName(decoded.companyName || "Intelalgos Pvt Ltd");
        setErrorMessage(null); // Clear any previous error message
      }
    } catch (error) {
      console.error("Invalid token format:", error);
      setErrorMessage("An error occurred. Please log in again.");
      sessionStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  // If there's an error message, don't render the rest of the content
  if (errorMessage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 font-bold">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      {/* Navbar or Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-8 rounded-lg shadow-lg mb-10 w-full max-w-4xl text-center">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-white font-semibold">{companyName}</span>!
        </h1>
        <p className="text-lg mb-6">
          Empowering your business with the best talent and seamless hiring process.
        </p>
        <Link href="/company-details" className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow hover:bg-gray-100 transition duration-300">
          Go to Profile
        </Link>
      </div>

      {/* Services Section */}
      <h2 className="text-4xl font-bold text-blue-600 mb-8">Our Services for Companies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full max-w-6xl">
        {/* Service 1: Job Posting */}
        <div className="bg-white shadow-md p-8 rounded-md text-center hover:shadow-lg transition duration-300">
          <div className="text-blue-500 mb-4">
            <FaBriefcase size={50} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Job Posting</h3>
          <p className="text-gray-600">
            Post job openings to reach a wide range of candidates, manage postings, and track applications in real-time.
          </p>
        </div>

        {/* Service 2: Candidate Management */}
        <div className="bg-white shadow-md p-8 rounded-md text-center hover:shadow-lg transition duration-300">
          <div className="text-green-500 mb-4">
            <FaUserTie size={50} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Candidate Management</h3>
          <p className="text-gray-600">
            Easily manage candidate applications, filter by skills, and review candidate profiles.
          </p>
        </div>

        {/* Service 3: Performance Analytics */}
        <div className="bg-white shadow-md p-8 rounded-md text-center hover:shadow-lg transition duration-300">
          <div className="text-yellow-500 mb-4">
            <FaChartLine size={50} />
          </div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Performance Analytics</h3>
          <p className="text-gray-600">
            Get insights and analytics on job postings and candidate engagement to make better hiring decisions.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-gray-600 mb-6">
          Sign up today and start optimizing your hiring process with {companyName}!
        </p>
        <div className="flex space-x-6">
          <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition duration-300">
            Login
          </Link>
          <Link href="/signup" className="border-2 border-blue-600 hover:bg-blue-600 hover:text-white text-blue-600 font-semibold py-3 px-6 rounded-full transition duration-300">
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
