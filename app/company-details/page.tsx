//app/company-details/page.tsx
"use client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FaCamera } from "react-icons/fa";
import { validateCompanyDetails } from './companyValidation';

interface DecodedToken {
  id: string;
}

export default function CompanyDetails() {
  const [userId, setUserId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<typeof companyDetails>>({});
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    companyImg: "",
    aboutUs: "",
    websiteUrl: "",
    industryType: "",
    contactEmail: "",
    phoneNumber: "",
    linkdinProfile: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded && decoded.id) {
          setUserId(decoded.id);
          fetchCompanyDetails(decoded.id);
        }
      } catch (error) {
        console.error("Invalid token format:", error);
        sessionStorage.removeItem("token");
        setUserId(null);
      }
    }
  }, []);

  const fetchCompanyDetails = async (userId: string) => { 
    try {
      const token = sessionStorage.getItem("token"); // Get token from sessionStorage
  
      const response = await axios.get(
        `http://localhost:8080/api/companies/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add Authorization header
          },
        }
      );
      
      if (response.data.length > 0) {
        const company = response.data[0];
        setCompanyDetails(company);
        setIsEditing(true);
        setCompanyId(company.id);
        if (company.companyImg) {
          setImagePreview(company.companyImg);
        }
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      setIsEditing(false);
    }
  };
  

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCompanyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    // Clear error for the specific field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: undefined,
    }));
  };
  

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file); // Preview the image
    }
  };

  const handleSaveCompany = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateCompanyDetails(companyDetails);
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors); // Set validation errors
        return;
    }

    if (!userId) {
        setErrorMessage("User is not authenticated.");
        setTimeout(() => setErrorMessage(""), 2000); // Clear error message after 2 seconds
        return;
    }

    try {
        const formData = new FormData();
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        const file = fileInput.files?.[0];

        if (file) {
            formData.append("file", file);
        }

        formData.append("companyDetails", JSON.stringify(companyDetails));

        if (isEditing && companyId) {
            await axios.put(
                `http://localhost:8080/api/companies/user/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                }
            );
            setSuccessMessage("Company details updated successfully!");
            setErrorMessage(""); // Clear error message on success
            setErrors({}); // Clear errors on success
        } else {
            const response = await axios.post(
                `http://localhost:8080/api/companies/user/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                }
            );
            setCompanyId(response.data.id);
            setSuccessMessage("Company created successfully!");
            setErrorMessage(""); // Clear error message on success
            setErrors({}); // Clear errors on success
            setIsEditing(true);
        }

        // Clear success message after 2 seconds
        setTimeout(() => setSuccessMessage(""), 2000);

    } catch (error) {
        console.error("Error saving company details:", error);
        setErrorMessage("An error occurred while saving the company details.");
        // Clear error message after 2 seconds
        setTimeout(() => setErrorMessage(""), 2000);
    }
};

  

  
  return (
    <div>
    {/* Error and Success Messages */}
    {successMessage && (
      <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
        {successMessage}
      </div>
    )}
    {errorMessage && (
      <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
        {errorMessage}
      </div>
    )}
  
    <div className="border border-gray-300 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isEditing ? "Update Company Details" : "Fill Company Details"}
      </h2>
  
      <form onSubmit={handleSaveCompany}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Image Upload Section */}
          <div className="col-span-2 flex items-center justify-center">
            <div className="relative flex items-center space-x-6">
              {imagePreview ? (
                <div className="w-32 h-32 rounded-full border-4 p-1 bg-gradient-to-r from-blue-500 to-purple-500">
                  <img
                    src={imagePreview}
                    alt="Company logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-full shadow-md border-4 border-gray-300">
                  <FaCamera className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute bottom-0 right-0">
                <label htmlFor="companyImg">
                  <div className="bg-gray-800 text-white p-2 rounded-full cursor-pointer">
                    <FaCamera className="w-6 h-6" />
                  </div>
                </label>
              </div>
              <input
                id="companyImg"
                type="file"
                accept="image/*"
                name="companyImg"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
  
          {/* Form Fields */}
          <div className="md:col-span-1">
            <label className="block text-blue-700 font-medium mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              placeholder="Company Name"
              value={companyDetails.companyName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            {errors.companyName && (
              <div className="  text-red-500">
                {errors.companyName}
              </div>
            )}
          </div>
  
          <div className="md:col-span-1">
            <label className="block text-blue-700 font-medium mb-2">
              Website URL
            </label>
            <input
              type="text"
              name="websiteUrl"
              placeholder="Website URL"
              value={companyDetails.websiteUrl}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            {errors.websiteUrl && (
              <div className="  text-red-500">
                {errors.websiteUrl}
              </div>
            )}
          </div>
  
          <div className="col-span-2">
            <label className="block text-blue-700 font-medium mb-2">
              About Us
            </label>
            <textarea
              name="aboutUs"
              placeholder="About Us"
              value={companyDetails.aboutUs}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full h-23"
            />
            {errors.aboutUs && (
              <div className="  text-red-500">
                {errors.aboutUs}
              </div>
            )}
          </div>
  
          {/* Additional Fields */}
          <div className="md:col-span-1">
            <label className="block text-blue-700 font-medium mb-2">
              Industry Type
            </label>
            <input
              type="text"
              name="industryType"
              placeholder="Industry Type"
              value={companyDetails.industryType}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            {errors.industryType && (
              <div className="  text-red-500">
                {errors.industryType}
              </div>
            )}
          </div>
  
          <div className="md:col-span-1">
            <label className="block text-blue-700 font-medium mb-2">
              Contact Email
            </label>
            <input
              type="email"
              name="contactEmail"
              placeholder="Contact Email"
              value={companyDetails.contactEmail}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            {errors.contactEmail && (
              <div className="  text-red-500">
                {errors.contactEmail}
              </div>
            )}
          </div>
  
          <div className="md:col-span-1">
            <label className="block text-blue-700 font-medium mb-2">
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={companyDetails.phoneNumber}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            {errors.phoneNumber && (
              <div className="  text-red-500">
                {errors.phoneNumber}
              </div>
            )}
          </div>
  
          <div className="md:col-span-1">
            <label className="block text-blue-700 font-medium mb-2">
              LinkedIn Profile
            </label>
            <input
              type="text"
              name="linkdinProfile"
              placeholder="LinkedIn Profile URL"
              value={companyDetails.linkdinProfile}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            {errors.linkdinProfile && (
              <div className="  text-red-500">
                {errors.linkdinProfile}
              </div>
            )}
          </div>
  
          <div className="md:col-span-1">
            <label className="block text-blue-700 font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={companyDetails.address}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-lg p-3 w-full"
            />
            {errors.address && (
              <div className="  text-red-500">
                {errors.address}
              </div>
            )}
          </div>

            <div className="md:col-span-1">
              <label className="block text-blue-700 font-medium mb-2">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                placeholder="Pincode"
                value={companyDetails.pincode}
                onChange={handleInputChange}
                
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
               {errors.pincode && (
              <div className="  text-red-500">
                {errors.pincode}
              </div>
            )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-blue-700 font-medium mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={companyDetails.city}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-lg p-3 w-full"
              /> {errors.city && (
                <div className="  text-red-500">
                  {errors.city}
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-blue-700 font-medium mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={companyDetails.state}
                onChange={handleInputChange}
                
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
               {errors.state && (
              <div className="  text-red-500">
                {errors.state}
              </div>
            )}
            </div>

            <div className="md:col-span-1">
              <label className="block text-blue-700 font-medium mb-2">
                Country
              </label>
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={companyDetails.country}
                onChange={handleInputChange}
                
                className="border border-gray-300 rounded-lg p-3 w-full"
              />
               {errors.country && (
              <div className="  text-red-500">
                {errors.country}
              </div>
            )}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
            >
              {isEditing ? "Update Company" : "Add Company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}