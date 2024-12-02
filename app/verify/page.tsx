"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const VerificationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get("token"); // Get the token from the search params

      if (token) {
        try {
          const response = await fetch(`http://localhost:8080/auth/verify?token=${token}`, {
            method: "GET",
            credentials: "include", // Include credentials (cookies) in the request
          });

          const data = await response.json();
          console.log(data);
          console.log(data.userVerified);
          

          if (data.userVerified) { 
            console.log(data.userVerified);
            setSuccessMessage("User verified successfully");
            console.log("User verified successfully");

            // Redirect to login after 3 seconds
            setTimeout(() => {
              router.push("/login");
            }, 6000);
          } 
         
        } catch (error) {
          setErrorMessage("Error verifying token");
          console.error("Error verifying token:", error);
        }
      }
    };

    verifyToken();
  }, [router, searchParams]);

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-blue-50 p-6">
      {/* Success Message */}
      {successMessage && (
        <p className="text-center text-green-500 mb-4">{successMessage}</p>
      )}

      {/* Error Message */}
      {errorMessage && (
        <p className="text-center text-red-500 mb-4">{errorMessage}</p>
      )}
    </div>
  );
};

export default VerificationPage;
