// app/company-details/__tests__/page.test.tsx

import { describe, it, jest } from '@jest/globals';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import CompanyDetailsPage from '../page';

describe('CompanyDetailsPage', () => {
  it('renders the Company Details Page with form fields', () => {
    render(<CompanyDetailsPage />);

    // Check if all form fields are present
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/About Us/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Website URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Industry Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/LinkedIn Profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
  });

  it('displays error messages for empty required fields upon submit', () => {
    render(<CompanyDetailsPage />);

    // Trigger form submission
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    // Expect validation errors for required fields
    expect(screen.getByText(/Company name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
  });

  it('validates email format correctly', () => {
    render(<CompanyDetailsPage />);

    const emailInput = screen.getByLabelText(/Contact Email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Invalid email format/i)).toBeInTheDocument();
  });

  it('validates phone number correctly', () => {
    render(<CompanyDetailsPage />);

    const phoneInput = screen.getByLabelText(/Phone Number/i);
    fireEvent.change(phoneInput, { target: { value: '123abc456' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Phone number must be 10 digits/i)).toBeInTheDocument();
  });

  it('calls validateCompanyDetails on form submission', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const validateSpy = jest.spyOn(require('../companyValidation'), 'validateCompanyDetails');

    render(<CompanyDetailsPage />);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(validateSpy).toHaveBeenCalled(); 

    validateSpy.mockRestore();
});


  it("returns error for invalid website URL format", () => {
    render(<CompanyDetailsPage />);

    const websiteInput = screen.getByLabelText(/Website URL/i);
    fireEvent.change(websiteInput, { target: { value: 'invalid-url' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Invalid URL format/i)).toBeInTheDocument();
  });

  it("returns error for invalid LinkedIn profile URL format", () => {
    render(<CompanyDetailsPage />);

    const linkedinInput = screen.getByLabelText(/LinkedIn Profile/i);
    fireEvent.change(linkedinInput, { target: { value: 'linkedin-profile' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Invalid LinkedIn URL format/i)).toBeInTheDocument();
  });

  it("returns error for invalid pincode format (non-numeric)", () => {
    render(<CompanyDetailsPage />);

    const pincodeInput = screen.getByLabelText(/Pincode/i);
    fireEvent.change(pincodeInput, { target: { value: '123abc' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Pincode must be numeric/i)).toBeInTheDocument();
  });

  it("validates city name for alphabetic characters only", () => {
    render(<CompanyDetailsPage />);

    const cityInput = screen.getByLabelText(/City/i);
    fireEvent.change(cityInput, { target: { value: 'City123' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/City can only contain letters/i)).toBeInTheDocument();
  });

  it("validates state name for alphabetic characters only", () => {
    render(<CompanyDetailsPage />);

    const stateInput = screen.getByLabelText(/State/i);
    fireEvent.change(stateInput, { target: { value: 'State@!' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/State can only contain letters/i)).toBeInTheDocument();
  });

  it("validates country name for alphabetic characters only", () => {
    render(<CompanyDetailsPage />);

    const countryInput = screen.getByLabelText(/Country/i);
    fireEvent.change(countryInput, { target: { value: 'Country123' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Country can only contain letters/i)).toBeInTheDocument();
  });

  it("does not show any error for valid inputs", () => {
    render(<CompanyDetailsPage />);

    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'Valid Company' } });
    fireEvent.change(screen.getByLabelText(/Contact Email/i), { target: { value: 'valid@example.com' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Website URL/i), { target: { value: 'https://example.com' } });
    fireEvent.change(screen.getByLabelText(/LinkedIn Profile/i), { target: { value: 'https://linkedin.com/in/validprofile' } });
    fireEvent.change(screen.getByLabelText(/Pincode/i), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'ValidCity' } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'ValidState' } });
    fireEvent.change(screen.getByLabelText(/Country/i), { target: { value: 'ValidCountry' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    fireEvent.click(submitButton);

    expect(screen.queryByText(/is required/i)).toBeNull();
    expect(screen.queryByText(/Invalid/i)).toBeNull();
  });
});
