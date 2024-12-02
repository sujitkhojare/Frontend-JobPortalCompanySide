"use client";
import { useEffect, useState } from "react";

interface JobFormProps {
  userId: string | null;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onClose: () => void;
  initialData: Job | null;
}

interface Job {
  id?: number;
  jobDesignation: string;
  workType: string;
  jobType: string;
  location: string;
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
}
export default function JobForm({
  userId,
  onSuccess,
  onError,
  onClose,
  initialData,
}: JobFormProps) {
  const [formData, setFormData] = useState<Job>({
    jobDesignation: "",
    workType: "",
    jobType: "",
    location: "",
    aboutJob: "",
    education: "",
    employmentType: "",
    goodToHaveSkills: "",
    industryType: "",
    jobDescription: "",
    keySkills: "",
    mustHaveSkills: "",
    requiredExperience: "",
    roleCategory: "",
    rolesAndResponsibilities: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        jobDesignation: "",
        workType: "",
        jobType: "",
        location: "",
        aboutJob: "",
        education: "",
        employmentType: "",
        goodToHaveSkills: "",
        industryType: "",
        jobDescription: "",
        keySkills: "",
        mustHaveSkills: "",
        requiredExperience: "",
        roleCategory: "",
        rolesAndResponsibilities: "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    // Real-time validation for character-only fields
    const charOnlyFields = ["jobDesignation", "workType", "jobType", "employmentType", "industryType"];
    const charOnlyRegex = /^[A-Za-z\s]*$/; // Allow letters and spaces only
  
    if (charOnlyFields.includes(name) && !charOnlyRegex.test(value)) {
      setErrors({ ...errors, [name]: "Only letters are allowed" });
      return;
    }
  
    setFormData({ ...formData, [name]: value });
  
    // Clear error when user fixes the input
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
  
    // Only allow alphabetic characters for these fields
    const charOnlyRegex = /^[A-Za-z\s]+$/;
  
    if (!formData.jobDesignation) {
      newErrors.jobDesignation = "Job designation is required";
    } else if (!charOnlyRegex.test(formData.jobDesignation)) {
      newErrors.jobDesignation = "Job designation must contain only letters";
    }
  
    if (!formData.workType) {
      newErrors.workType = "Work type is required";
    } else if (!charOnlyRegex.test(formData.workType)) {
      newErrors.workType = "Work type must contain only letters";
    }
  
    if (!formData.jobType) {
      newErrors.jobType = "Job type is required";
    } else if (!charOnlyRegex.test(formData.jobType)) {
      newErrors.jobType = "Job type must contain only letters";
    }
  
    if (!formData.employmentType) {
      newErrors.employmentType = "Employment type is required";
    } else if (!charOnlyRegex.test(formData.employmentType)) {
      newErrors.employmentType = "Employment type must contain only letters";
    }
  
    if (!formData.industryType) {
      newErrors.industryType = "Industry type is required";
    } else if (!charOnlyRegex.test(formData.industryType)) {
      newErrors.industryType = "Industry type must contain only letters";
    }
  
    if (!formData.location) {
      newErrors.location = "Location is required";
    }
  
    if (!formData.aboutJob) {
      newErrors.aboutJob = "About job is required";
    }
  
    if (!formData.education) {
      newErrors.education = "Education is required";
    }
  
    if (!formData.mustHaveSkills) {
      newErrors.mustHaveSkills = "Must-have skills are required";
    }
  
    if (!formData.requiredExperience) {
      newErrors.requiredExperience = "Required experience is required";
    }
  
    if (!formData.rolesAndResponsibilities) {
      newErrors.rolesAndResponsibilities = "Roles and responsibilities are required";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    const method = initialData ? "PUT" : "POST";
    const url = initialData
      ? `http://localhost:8080/api/companyjobs/company/${initialData.id}`
      : `http://localhost:8080/api/companyjobs/company/${userId}`;
  
    const token = sessionStorage.getItem("token"); // Get token from sessionStorage
  
    const res = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Add Authorization header
      },
      body: JSON.stringify({ ...formData, userId }),
    });
  
    if (res.ok) {
      onSuccess(initialData ? "Job updated successfully!" : "Job created successfully!");
  
      if (!initialData) {
        // Clear the form if adding a new job
        setFormData({
          jobDesignation: "",
          workType: "",
          jobType: "",
          location: "",
          aboutJob: "",
          education: "",
          employmentType: "",
          goodToHaveSkills: "",
          industryType: "",
          jobDescription: "",
          keySkills: "",
          mustHaveSkills: "",
          requiredExperience: "",
          roleCategory: "",
          rolesAndResponsibilities: "",
        });
      }
    } else {
      const errorText = await res.text();
      onError(`Failed to save job: ${errorText}`);
    }
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Job Details" : "Add Job Details"}</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Input fields with validation error display */}
        {[
          { label: "Job Designation", name: "jobDesignation" },
          { label: "Work Type", name: "workType" },
          { label: "Job Type", name: "jobType" },
          { label: "Location", name: "location" },
          { label: "About Job", name: "aboutJob", type: "textarea" },
          { label: "Education", name: "education" },
          { label: "Employment Type", name: "employmentType" },
          { label: "Good to Have Skills", name: "goodToHaveSkills" },
          { label: "Industry Type", name: "industryType" },
          { label: "Job Description", name: "jobDescription", type: "textarea" },
          { label: "Key Skills", name: "keySkills" },
          { label: "Must Have Skills", name: "mustHaveSkills" },
          { label: "Required Experience", name: "requiredExperience" },
          { label: "Role Category", name: "roleCategory" },
          { label: "Roles and Responsibilities", name: "rolesAndResponsibilities", type: "textarea" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-blue-700 font-medium mb-2" htmlFor={field.name}>
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={formData[field.name as keyof Job]}
                onChange={handleChange}
                className={`shadow appearance-none border ${
                  errors[field.name] ? "border-red-500" : ""
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              />
            ) : (
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={formData[field.name as keyof Job]}
                onChange={handleChange}
                className={`shadow appearance-none border ${
                  errors[field.name] ? "border-red-500" : ""
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              />
            )}
            {errors[field.name] && (
              <p className="text-red-500">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {initialData ? "Update Job" : "Create Job"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
