"use client";

import MasterTemplate from "../../components/master";
import Swal from 'sweetalert2';
import { useState } from 'react';
import { z } from 'zod';
import { useRouter } from "next/navigation"; // Import useRouter for redirect
// Define Zod schema for doctor validation
const patientSchema = z.object({
  first_name: z.string()
    .min(2, "First name must be at least 2 characters")
    .nonempty("First name is required"),
  last_name: z.string()
    .min(2, "Last name must be at least 2 characters")
    .nonempty("Last name is required"),
});

export default function CreatePatient() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Works with Next.js App Router

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Validate the entire form on change to keep errors up-to-date
    try {
      patientSchema.parse({ ...formData, [name]: value });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    try {
      const partialSchema = patientSchema.partial().pick({ [name]: true });
      partialSchema.parse({ [name]: value });
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name]: error.errors[0].message
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate entire form with Zod
      patientSchema.parse(formData);
      setErrors({});

      // Get token from localStorage
      const token = localStorage.getItem("token");

      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create doctor');
      }

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Patient created successfully',
        timer: 1500,
        showConfirmButton: true
      });
      router.push('/doctors/index')
      // Reset form
      setFormData({
        first_name: '',
        middle_name: '',
        last_name: '',
        username: '',
        email: '',
        mobile: ''
      });
      setErrors({});

    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! ' + (error.message || 'Unknown error'),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MasterTemplate>
      <div className="row">
        <div className="col-sm-12">
          <div>
            <h1>Add Doctor</h1>
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
              </div>


              <div className="mb-3">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || Object.keys(errors).length > 0}
              >
                {loading ? 'Submitting...' : 'Create Doctor'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MasterTemplate>
  );
}