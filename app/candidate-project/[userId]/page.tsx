"use client"; 

import { useParams } from "next/navigation"; // Import useParams
import { useEffect, useState } from "react";



interface CandidateProject {
  id: number;
  about: string;
  applicationLink: string;
  githubLink: string;
  insertFile: string;
  projectName: string;
  toolsAndTechnology: string;
  userId: number;
  socialUserId: number;
}

const CandidateProjectsPage: React.FC = () => {
  const { userId } = useParams(); // Extract userId from the route parameters
  const [projects, setProjects] = useState<CandidateProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(0); // State for the current page
  const [totalPages, setTotalPages] = useState<number>(1); // State for total pages
  const pageSize = 5; // Define the number of projects per page

  useEffect(() => {
    const fetchProjects = async () => {
      if (!userId) return; // Exit if userId is not available

      const token = sessionStorage.getItem("token"); // Get token from sessionStorage

      try {
        const response = await fetch(`http://localhost:8080/api/jobs/projects/${userId}?page=${page}&size=${pageSize}`, {
          headers: {
            "Authorization": `Bearer ${token}`, // Add Authorization header
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }

        const data = await response.json();
        setProjects(data.content); // Assuming the response contains a content array
        setTotalPages(data.totalPages); // Set total pages from response
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false); // Set loading to false regardless of success/failure
      }
    };

    fetchProjects();
  }, [userId, page]); // Add page to the dependency array

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 0)); // Decrease page number but not below 0
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(prev + 1, totalPages - 1)); // Increase page number but not above total pages
  };

  if (loading) {
    return <div>Loading...</div>; // Optional loading state
  }

  return (
    <div className="max-w-screen-xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Candidate Projects</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
              <h1 className="text-xl font-bold mb-2">{project.projectName}</h1>
              <p className="text-gray-700 mb-2"><strong>About:</strong> {project.about}</p>
              <p className="text-gray-700 mb-2"><strong>Application Link:</strong> 
                <a href={project.applicationLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"> View Application</a>
              </p>
              <p className="text-gray-700 mb-2"><strong>GitHub Link:</strong> 
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"> View GitHub</a>
              </p>
              <p className="text-gray-700 mb-2"><strong>Download File:</strong> 
                <a href={project.insertFile} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline"> Download File</a>
              </p>
              <p className="text-gray-700 mb-2"><strong>Tools & Technology:</strong> {project.toolsAndTechnology}</p>
            </div>
          ))
        ) : (
          <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 text-center">
            <p>No projects found.</p>
          </div>
        )}
      </div>

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

export default CandidateProjectsPage;
