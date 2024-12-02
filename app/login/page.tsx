// LoginForm.tsx
"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from '../AuthContext'; // Import the useAuth hook


interface DecodedToken {
  companyName: string;

}


const LoginForm = () => {
  const router = useRouter();
  const { setCompanyName } = useAuth(); // Use context
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    const tempErrors = { email: "", password: "" };

    // Email validation
    if (!formData.email) {
      tempErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid.";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      tempErrors.password = "Password is required.";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:8080/auth/login", formData);
      setSuccessMessage("Login successful....");
      sessionStorage.setItem("token", response.data.token);
      
      
      // Set the company name in the context
      const decoded = jwtDecode<DecodedToken>(response.data.token);
      if (decoded && decoded.companyName) {
        setCompanyName(decoded.companyName);
      }

      // Redirect to the home page after a short delay to show the success message
      setTimeout(() => {
        router.push("/");
      }, 1000);

      // Clear success message after 2 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Login failed. Please check your credentials.");

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
        <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>

        {/* Success Message */}
        {successMessage && (
          <p className="text-green-500 text-center">{successMessage}</p>
        )}

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-500 text-center">{errorMessage}</p>
        )}

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <div className="flex justify-end">
          <a href="/forgot-password" className="text-blue-600 hover:underline text-sm">
            Forgot Password?
          </a>
        </div>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
