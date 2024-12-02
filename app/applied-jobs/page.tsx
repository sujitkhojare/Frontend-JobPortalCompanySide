/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; // Ensure this is a client component

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation"; // Use useRouter from next/navigation
import React, { useEffect, useState } from "react";


// Define the structure of the decoded token
interface DecodedToken {
  id: string;
}

// Define the structure of the CompanyJobs data
interface CompanyJobs {
  id: number;
  jobDesignation: string;
  workType: string;
  jobType: string;
  location: string;
  createdAt: string; // or use LocalDateTime if parsing later
  aboutJob: string;
  education: string;
  employmentType: string;
  goodToHaveSkills: string;
  industryType: string;
  jobDescription: string;
  keySkills: string;
  mustHaveSkills: string;
  requiredExperience: string;
  roleCategory: string;
  rolesAndResponsibilities: string;
  jobId: number;
}

const MatchedJobs: React.FC = () => {
  const router = useRouter(); // Get the router instance
  const [userId, setUserId] = useState<string | null>(null);
  const [matchedJobs, setMatchedJobs] = useState<CompanyJobs[]>([]);
  const [page, setPage] = useState<number>(0); // State for the current page
  const [totalPages, setTotalPages] = useState<number>(1); // State for total pages
  const pageSize = 10; // Define the number of jobs per page

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded && decoded.id) {
          setUserId(decoded.id); // Keep the userId for potential future use
          fetchMatchedJobs(decoded.id, page);
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        sessionStorage.removeItem("token");
        setUserId(null);
      }
    }
  }, [page]); // Refetch jobs when the page changes

  const fetchMatchedJobs = async (companyId: string, page: number) => {
    const token = sessionStorage.getItem("token"); // Get token from sessionStorage

    try {
      const response = await fetch(`http://localhost:8080/api/jobs/matchedjobs/${companyId}?page=${page}&size=${pageSize}`, {
        headers: {
          "Authorization": `Bearer ${token}`, // Add Authorization header
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch matched jobs");
      }

      const data = await response.json();
      console.log("Fetched matched jobs:", data); // Log fetched jobs
      setMatchedJobs(data.content); // Assuming 'content' contains the jobs list
      setTotalPages(data.totalPages); // Assuming 'totalPages' is available in the response
    } catch (error) {
      console.error("Error fetching matched jobs:", error);
    }
  };

  const handleViewCandidates = (jobId: number) => {
    // Redirect to the candidates page
    router.push(`/candidate-profile/${jobId}`); // Change to your desired route
  };

  const formatDate = (dateInput: string | null | undefined | number[]): string => {
    if (Array.isArray(dateInput)) {
        const [year, month, day, hour, minute, second, milliseconds] = dateInput;
        const date = new Date(year, month - 1, day, hour, minute, second, milliseconds);
        return date.toLocaleString(); // Format to local string
    }
    if (typeof dateInput !== "string" || dateInput.trim() === "") {
        return "Date not available"; // Handle empty string
    }
    const isoDateString = dateInput.replace(" ", "T"); // Convert to ISO 8601 format
    const date = new Date(isoDateString); // Create Date object
    return !isNaN(date.getTime()) ? date.toLocaleString() : 'Date not available'; // Format date or return error message
  };

  // Pagination Controls
  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  if (matchedJobs.length === 0) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Applied Job Details</h1>
      <ul className="space-y-4">
        {matchedJobs.map((job) => (
          <li
            key={job.id}
            className="w-full border border-gray-300 rounded-lg p-6 shadow-md bg-white transition duration-200 hover:bg-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-xl text-blue-600 mb-2">
                {job.jobDesignation}
              </h3>
              <button
                className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                onClick={() => handleViewCandidates(job.jobId)}
              >
                View Candidates
              </button>
            </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <span className="font-medium text-lg text-gray-800">Location:</span>
                  <p className="text-gray-600">{job.location}</p>
                </div>
                <div>
                  <span className="font-medium text-lg text-gray-800">Employment Type:</span>
                  <p className="text-gray-600">{job.employmentType}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 mb-4">
                <div className="mb-4">
                  <span className="font-medium text-lg text-gray-800">About:</span>
                  <p className="text-gray-600">{job.aboutJob}</p>
                </div>
                <div>
                  <span className="font-medium text-lg text-gray-800">Created At:</span>
                  <p className="text-gray-600">
                    {formatDate(job.createdAt)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <span className="font-medium text-lg text-gray-800">Education:</span>
                  <p className="text-gray-600">{job.education}</p>
                </div>
                <div>
                  <span className="font-medium text-lg text-gray-800">Good to Have Skills:</span>
                  <p className="text-gray-600">{job.goodToHaveSkills}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <span className="font-medium text-lg text-gray-800">Industry Type:</span>
                  <p className="text-gray-600">{job.industryType}</p>
                </div>
                <div>
                  <span className="font-medium text-lg text-gray-800">Job Description:</span>
                  <p className="text-gray-600">{job.jobDescription}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <span className="font-medium text-lg text-gray-800">Key Skills:</span>
                  <p className="text-gray-600">{job.keySkills}</p>
                </div>
                <div>
                  <span className="font-medium text-lg text-gray-800">Must Have Skills:</span>
                  <p className="text-gray-600">{job.mustHaveSkills}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <span className="font-medium text-lg text-gray-800">Required Experience:</span>
                  <p className="text-gray-600">{job.requiredExperience}</p>
                </div>
                <div>
                  <span className="font-medium text-lg text-gray-800">Role Category:</span>
                  <p className="text-gray-600">{job.roleCategory}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 mb-4">
                <div>
                  <span className="font-medium text-lg text-gray-800">Roles and Responsibilities:</span>
                  <p className="text-gray-600">{job.rolesAndResponsibilities}</p>
                </div>
                <div>
                  <span className="font-medium text-lg text-gray-800">Work Type:</span>
                  <p className="text-gray-600">{job.workType}</p>
                </div>
              </div>
              </li>
        ))}
      </ul>

      {/* Pagination Controls */}
          <div className="flex justify-center space-x-4 mt-6">
      <button
        className={`w-32 p-3 rounded-md transition duration-200 ${
          page === 0 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-black hover:bg-gray-400"
        }`}
        onClick={handlePreviousPage}
        disabled={page === 0} // Disable if on the first page
      >
        Previous
      </button>

      {/* Render page numbers dynamically */}
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index}
          className={`w-12 p-3 rounded-md transition duration-200 ${
            index === page ? "bg-blue-500 text-white" : "bg-gray-300 text-black hover:bg-gray-400"
          }`}
          onClick={() => setPage(index)}
        >
          {index + 1}
        </button>
      ))}

      <button
        className={`w-32 p-3 rounded-md transition duration-200 ${
          page === totalPages - 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-gray-300 text-black hover:bg-gray-400"
        }`}
        onClick={handleNextPage}
        disabled={page === totalPages - 1} // Disable if on the last page
      >
        Next
      </button>
    </div>

</div>
  );
};

export default MatchedJobs;