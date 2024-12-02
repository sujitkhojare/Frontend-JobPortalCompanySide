"use client";
import axios from "axios";
import { useState } from "react";

axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default function SignupForm() {
  // const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const tempErrors = {
      companyName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.companyName) {
      tempErrors.companyName = "Company Name is required.";
      valid = false;
    }

    if (!formData.email) {
      tempErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid email format.";
      valid = false;
    }

    if (!formData.password) {
      tempErrors.password = "Password is required.";
      valid = false;
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) return;

    try {
        await axios.post("http://localhost:8080/auth/register", formData, {
            withCredentials: true, // Include credentials (cookies)
        });
        setSuccessMessage("Verification email sent. Please check your inbox.");

      
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 409) {
            // Handle email already exists error
            setErrorMessage("Email already exists. Please use a different email.");
        } else {
            setErrorMessage("Signup failed. Please try again.");
        }
        console.error("Signup Error:", error);

        // Clear error message after 2 seconds
        setTimeout(() => {
            setErrorMessage("");
        }, 2000);
    }
};


  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {/* Success Message */}
        {successMessage && (
          <p className="text-center text-green-500 mb-4">{successMessage}</p>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p className="text-center text-red-500 mb-4">{errorMessage}</p>
        )}

        {/* Company Name Field */}
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={formData.companyName}
          onChange={handleChange}
          className={`w-full p-3 border rounded mb-2 ${
            errors.companyName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm mb-2">{errors.companyName}</p>
        )}

        {/* Email Field */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full p-3 border rounded mb-2 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mb-2">{errors.email}</p>
        )}

        {/* Password Field */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className={`w-full p-3 border rounded mb-2 ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mb-2">{errors.password}</p>
        )}

        {/* Confirm Password Field */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`w-full p-3 border rounded mb-2 ${
            errors.confirmPassword ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mb-2">{errors.confirmPassword}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
