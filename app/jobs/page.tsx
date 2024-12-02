/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { BriefcaseIcon, PencilSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import ConfirmationModal from './ConfirmationModal'; // Import the modal
import JobForm from './JobForm';

interface Job {
  id: number;
  jobDesignation: string;
  workType: string;
  jobType: string;
  location: string;
  aboutJob: string;
  education: string;
  createdAt: string; 
  employmentType: string;
  goodToHaveSkills: string;
  industryType: string;
  jobDescription: string;
  keySkills: string;
  mustHaveSkills: string;
  requiredExperience: string;
  roleCategory: string;
  rolesAndResponsibilities: string;
}

export default function Jobs() {
  const [showForm, setShowForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 5; // Number of items to display per page

  const fetchJobs = async () => {
    const token = sessionStorage.getItem("token"); // Get token from sessionStorage

    if (userId) {
      const res = await fetch(`http://localhost:8080/api/companyjobs/company/${userId}?page=${currentPage}&size=${itemsPerPage}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const jobData = await res.json();
        setJobs(jobData.content);
        setTotalPages(jobData.totalPages);
        setErrorMessage(null);
      } else {
        const errorText = await res.text();
        setErrorMessage(`Failed to fetch jobs: ${errorText}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 2000);
      }
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<{ id: string }>(token);
        setUserId(decoded.id);
      } catch (error) {
        sessionStorage.removeItem("token");
        setUserId(null);
      }
    }
    fetchJobs();
  }, [userId, currentPage]); // Add currentPage to the dependency array

  const handleEdit = (job: Job) => {
    setSelectedJob(job);
    setShowForm(true);
  };

  const handleDelete = async () => {
    const token = sessionStorage.getItem("token");

    if (jobToDelete !== null) {
      const res = await fetch(`http://localhost:8080/api/companyjobs/company/${jobToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setJobs(jobs.filter(job => job.id !== jobToDelete));
        setSuccessMessage("Job deleted successfully!");

        setTimeout(() => {
          setSuccessMessage(null);
        }, 2000);
      } else {
        const errorText = await res.text();
        setErrorMessage(`Failed to delete job: ${errorText}`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 2000);
      }

      setShowConfirmModal(false);
      setJobToDelete(null);
    }
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    fetchJobs();
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  };

  const handleCloseForm = () => {
    setSelectedJob(null);
    setShowForm(false);
  };

  const formatDate = (dateInput: string | null | undefined | number[]): string => {
    if (Array.isArray(dateInput)) {
      const [year, month, day, hour, minute, second, milliseconds] = dateInput;
      const date = new Date(year, month - 1, day, hour, minute, second, milliseconds);
      return date.toLocaleString();
    }
    if (typeof dateInput !== "string" || dateInput.trim() === "") {
      return "Date not available";
    }
    const isoDateString = dateInput.replace(" ", "T");
    const date = new Date(isoDateString);
    return !isNaN(date.getTime()) ? date.toLocaleString() : 'Date not available';
  };

  return (
    <div className="p-4">
      <nav className="bg-white shadow-md mb-6 h-16 w-full max-w-screen-xl mx-auto flex items-center justify-between px-4">
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => {
                setSelectedJob(null);
                setShowForm(false);
              }}
              className={`flex items-center text-lg font-bold ${!showForm ? 'text-white bg-blue-500' : 'text-blue-500 bg-white'} transition duration-200 py-2 px-4 rounded-md`}
            >
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              View Jobs
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setSelectedJob(null);
                setShowForm(prev => !prev);
              }}
              className={`flex items-center text-lg font-bold ${showForm ? 'text-white bg-green-500' : 'text-green-500 bg-white'} transition duration-200 py-2 px-4 rounded-md`}
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Job
            </button>
          </li>
        </ul>
      </nav>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 border border-green-400 rounded-md">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded-md">
          {errorMessage}
        </div>
      )}

      {showForm ? (
        <JobForm
          userId={userId}
          onSuccess={handleSuccess}
          onError={(message: string) => setErrorMessage(message)}
          onClose={handleCloseForm}
          initialData={selectedJob}
        />
      ) : (
        <div className="max-w-screen-xl mx-auto"> 
          <ul className="space-y-4">
            {jobs.map(job => (
              <li key={job.id} className="w-full border border-gray-300 rounded-lg p-6 shadow-md bg-white mx-auto transition duration-200 hover:bg-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-xl text-blue-600 mb-2">{job.jobDesignation}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(job)} 
                      className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
                      title="Edit"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirmModal(true);
                        setJobToDelete(job.id);
                      }}
                      className="p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
                      title="Delete"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
               {/* First Section: Work Type, Job Type, Location, Employment Type */}
               <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <span className="font-medium text-lg text-gray-800">Work Type:</span>
                    <p className="text-gray-600">{job.workType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-lg text-gray-800">Job Type:</span>
                    <p className="text-gray-600">{job.jobType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-lg text-gray-800">Location:</span>
                    <p className="text-gray-600">{job.location}</p>
                  </div>
                  <div>
                    <span className="font-medium text-lg text-gray-800">Employment Type:</span>
                    <p className="text-gray-600">{job.employmentType}</p>
                  </div>
                </div>

                {/* Second Section: Job Description and About Job */}
                <div className="grid grid-cols-1 mb-4">
                  <div className="mb-4">
                    <span className="font-medium text-lg text-gray-800">About Job:</span>
                    <p className="text-gray-600">{job.aboutJob}</p>
                  </div>
                  <div>
                    <span className="font-medium text-lg text-gray-800">Job Description:</span>
                    <p className="text-gray-600">{job.jobDescription}</p>
                  </div>
                </div>

                {/* Third Section: Good To Have Skills, Key Skills, Must Have Skills, Required Experience */}
                <div className="grid grid-cols-2 gap-6 mb-4">
                  <div>
                    <span className="font-medium text-lg text-gray-800">Good To Have Skills:</span>
                    <p className="text-gray-600">{job.goodToHaveSkills}</p>
                  </div>
                  <div>
                    <span className="font-medium text-lg text-gray-800">Key Skills:</span>
                    <p className="text-gray-600">{job.keySkills}</p>
                  </div>
                  <div>
                    <span className="font-medium text-lg text-gray-800">Must Have Skills:</span>
                    <p className="text-gray-600">{job.mustHaveSkills}</p>
                  </div>
                  <div>
                    <span className="font-medium text-lg text-gray-800">Required Experience:</span>
                    <p className="text-gray-600">{job.requiredExperience}</p>
                  </div>
                  <div>
                  <span className="font-medium text-lg text-gray-800">Education:</span>
                  <p className="text-gray-600">{job.education}</p>
                  </div>
                  <div>
                  <span className="font-medium text-lg text-gray-800">Created At:</span>
                 <p className="text-gray-600">{formatDate(job.createdAt)}</p>
                </div>
                </div>

                {/* Fourth Section: Role Category, Roles and Responsibilities */}
                <div className="grid grid-cols-1 mb-4">
                  <div className="mb-4">
                    <span className="font-medium text-lg text-gray-800">Role Category:</span>
                    <p className="text-gray-600">{job.roleCategory}</p>
                  </div>
                  <div>
                    <span className="font-medium text-lg text-gray-800">Roles and Responsibilities:</span>
                    <p className="text-gray-600">{job.rolesAndResponsibilities}</p>
                  </div>
                </div>

              </li>
            ))}
          </ul>

          {/* Pagination */}
      <div className="flex justify-center mt-6 items-center">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 0} // Disable if on the first page
          className={`mx-2 w-32 px-4 py-2 rounded-md ${currentPage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`mx-2 w-12 px-4 py-2 rounded-md ${currentPage === index ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {index + 1}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages - 1} // Disable if on the last page
          className={`mx-2 w-32 px-4 py-2 rounded-md ${currentPage === totalPages - 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
          Next
        </button>
      </div>

        </div>
      )}

      {showConfirmModal && (
        <ConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmModal(false)}
          message="Are you sure you want to delete this job?"
        />
      )}
    </div>
  );
}
