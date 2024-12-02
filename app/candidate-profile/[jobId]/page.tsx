"use client"; // Ensure this is a client component

import { jwtDecode } from "jwt-decode"; // Import jwtDecode
import { useParams, useRouter } from "next/navigation"; // Import useRouter
import React, { useEffect, useState } from "react";


// Interface for the decoded token structure
interface DecodedToken {
  id: string; // The companyId is stored as 'id' in your token
  email: string;
  companyName: string;
}

interface CandidateProfile {
  id: number;
  address: string;
  city: string;
  contactNo: string;
  gender: string;
  pinCode: string;
  state: string;
  userId: number; 
  dob: string[]; 
  profileImageUrl: string;
  resumeUrl: string;
  skills: string;
  name: string;
  email: string;
}

const CandidatesPage: React.FC = () => {
  const { jobId } = useParams(); // Extract jobId from the route parameters
  const router = useRouter(); // Use the router for navigation
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState<string | null>(null); // State to store companyId
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]); // State for candidates
  const [page, setPage] = useState<number>(0); // State for the current page
  const [totalPages, setTotalPages] = useState<number>(1); // State for total pages
  const pageSize = 5; // Define the number of candidates per page

  useEffect(() => {
    // Fetch companyId from the session token
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: DecodedToken = jwtDecode(token); // Decode the token
        setCompanyId(decodedToken.id); // Set the companyId from the decoded token's id
      } catch (error) {
        console.error("Error decoding token:", error);
        sessionStorage.removeItem("token"); // Remove invalid token
      }
    }
  }, []);

  useEffect(() => {
    if (!jobId || !companyId) return; // Exit if jobId or companyId is not available

    const fetchCandidates = async () => {
      const token = sessionStorage.getItem("token"); // Get token from sessionStorage

      try {
        const response = await fetch(`http://localhost:8080/api/jobs/candidates/${jobId}?companyId=${companyId}&page=${page}&size=${pageSize}`, {
          headers: {
            "Authorization": `Bearer ${token}`, // Add Authorization header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch candidates");
        }

        const data = await response.json();
        setCandidates(data.content); // Assuming the API response has 'content' for candidate profiles
        setTotalPages(data.totalPages); // Set the total number of pages from the response
      } catch (error) {
        console.error("Error fetching candidates:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success/failure
      }
    };

    fetchCandidates();
  }, [jobId, companyId, page]); // Added page as a dependency

  const handleProjectsClick = (userId: number) => {
    // Redirect to the candidate's projects page
    router.push(`/candidate-project/${userId}`); 
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

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6">

      <h1 className="text-3xl font-bold text-center mb-6">Candidates Profile Details</h1>
      <ul className="space-y-6">
        {candidates.map((candidate) => (
          <li key={candidate.id} className="border border-gray-300 rounded-lg p-6 shadow-lg bg-white mx-4">
            <div className="flex items-center space-x-20 mb-4">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-3"></div>
                <img
                  src={candidate.profileImageUrl || "/default-profile.png"}
                  alt={`Profile of ${candidate.name}`}
                  className="w-full h-full rounded-full object-cover border-8 border-white relative"
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div>
                  <h2 className="text-lg font-medium mb-2">Name:</h2>
                  <p className="text-gray-700">{candidate.name}</p>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-2">Email:</h2>
                  <p className="text-gray-700">{candidate.email}</p>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-2">Skills:</h2>
                  <p className="text-gray-700">{candidate.skills}</p>
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-2">Contact No:</h2>
                  <p className="text-gray-700">{candidate.contactNo}</p>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="col-span-2">
                  <p className="text-lg font-medium mb-2"><strong>Address Details:</strong></p>
                </div>
                <div className="flex-1 ml-28">
                  <p className="text-gray-700 font-medium">Address: {candidate.address}</p>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 font-medium">City: {candidate.city}</p>
                </div>
                <div className="flex-1 ml-28">
                  <p className="text-gray-700 font-medium">State: {candidate.state}</p>
                </div>
                <div className="flex-1">
                  <p className="text-gray-700 font-medium">Pin Code: {candidate.pinCode}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-lg font-medium"><strong>Gender:</strong></p>
                <p className="text-gray-700">{candidate.gender}</p>
              </div>
              <div>
                <p className="text-lg font-medium"><strong>Date of Birth:</strong></p>
                <p className="text-gray-700">{new Date(candidate.dob.join('-')).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-lg font-medium"><strong>Resume:</strong></p>
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View Resume
                </a>
              </div>
              <div className="flex justify-end mt-4 space-x-4">
                <button
                  onClick={() => handleProjectsClick(candidate.userId)}
                  className="inline-block text-white bg-green-500 hover:bg-green-600 font-medium py-2 px-4 rounded-md"
                >
                  Candidate Projects
                </button>
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

export default CandidatesPage;
