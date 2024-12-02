

interface CompanyDetails {
    companyName: string;
    companyImg: string;
    aboutUs: string;
    websiteUrl: string;
    industryType: string;
    contactEmail: string;
    phoneNumber: string;
    linkdinProfile: string;
    address: string;
    pincode: string;
    city: string;
    state: string;
    country: string;
  }
  
  export function validateCompanyDetails(details: CompanyDetails) {
    const errors: Partial<CompanyDetails> = {};
  
    // Validate Company Name (allow chars, numbers, and special characters)
    if (!details.companyName.trim()) {
      errors.companyName = "Company name is required";
    } else if (!/^[a-zA-Z0-9\s\-_,\.:;]+$/.test(details.companyName)) {
      errors.companyName = "Company name can only contain letters, numbers, and special characters";
    }
  
    // Validate Website URL
    if (details.websiteUrl && !/^https?:\/\/.+\..+$/.test(details.websiteUrl)) {
      errors.websiteUrl = "Invalid website URL format";
    }
  
    // Validate LinkedIn Profile
    if (details.linkdinProfile && !/^https?:\/\/(www\.)?linkedin\.com\/.+/.test(details.linkdinProfile)) {
      errors.linkdinProfile = "Invalid LinkedIn profile URL";
    }
  
    // Validate Contact Email
    if (!details.contactEmail.trim()) {
      errors.contactEmail = "Contact email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(details.contactEmail)) {
      errors.contactEmail = "Invalid email format";
    }
  
    // Validate Phone Number (must be 10 digits)
    if (details.phoneNumber && !/^\d{10}$/.test(details.phoneNumber)) {
      errors.phoneNumber = "Phone number must be 10 digits and cannot contain letters or special characters.";
    }
  
    // Validate Address
    if (!details.address.trim()) {
      errors.address = "Address is required";
    }
  
   // Validate Pincode (must be a 6-digit number)
if (!details.pincode.trim()) {
  errors.pincode = "Pincode is required";
} else if (!/^\d{6}$/.test(details.pincode)) {
  errors.pincode = "Pincode must be a 6-digit number and cannot contain letters or special characters.";
}

  
    // Validate City (only alphabetic characters allowed)
    if (!details.city.trim()) {
      errors.city = "City is required";
    } else if (!/^[a-zA-Z\s]+$/.test(details.city)) {
      errors.city = "City must only contain letters";
    }
  
    // Validate State (only alphabetic characters allowed)
    if (!details.state.trim()) {
      errors.state = "State is required";
    } else if (!/^[a-zA-Z\s]+$/.test(details.state)) {
      errors.state = "State must only contain letters";
    }
  
    // Validate Country (only alphabetic characters allowed)
    if (!details.country.trim()) {
      errors.country = "Country is required";
    } else if (!/^[a-zA-Z\s]+$/.test(details.country)) {
      errors.country = "Country must only contain letters";
    }
  
    return errors;
  }
  
  