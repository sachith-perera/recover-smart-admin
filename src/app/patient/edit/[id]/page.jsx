"use client";

import MasterTemplate from "../../../components/master";
import Swal from "sweetalert2";
import { useState, useEffect } from "react"; // Added useEffect
import { useParams, useRouter } from "next/navigation"; // Added for URL params and navigation
import { z } from "zod";

// Define Zod schema for patient validation
const patientSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .nonempty("First name is required"),
  middle_name: z
    .string()
    .max(2, "Middle name should be 1-2 characters")
    .optional(),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .nonempty("Last name is required"),
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must contain only letters, numbers, and underscores")
    .nonempty("Username is required"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .nonempty("Email is required"),
  mobile: z.string().nonempty("Mobile number is required"),
});

export default function EditPatient() {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    email: "",
    mobile: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true); // Loading state for fetching data
  const { id } = useParams(); // Get the patient ID from the URL
  const router = useRouter(); // For navigation after success
  const token = localStorage.getItem("token");

  // Fetch patient data when component mounts
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        if (!token) throw new Error("Authentication token not found");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/edit/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch patient data");
        const data = await response.json();
        setFormData(data); // Pre-fill form with fetched data
        setFetchLoading(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load patient data: " + error.message,
        });
        setFetchLoading(false);
      }
    };

    fetchPatientData();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate the field on change
    try {
      patientSchema.parse({ ...formData, [name]: value });
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    try {
      const partialSchema = patientSchema.partial().pick({ [name]: true });
      partialSchema.parse({ [name]: value });
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({
          ...prev,
          [name]: error.errors[0].message,
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

      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${id}/`, {
        method: "PUT", // Use PUT for updating (or PATCH if your API supports partial updates)
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update patient");
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Patient updated successfully",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/patient/index"); // Redirect to patient list
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = {};
        error.errors.forEach((err) => {
          fieldErrors[err.path[0]] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong! " + (error.message || "Unknown error"),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching data
  if (fetchLoading) {
    return (
      <MasterTemplate>
        <div className="row">
          <div className="col-sm-12 text-center">
            <h1>Loading...</h1>
          </div>
        </div>
      </MasterTemplate>
    );
  }

  return (
    <MasterTemplate>
      <div className="row">
        <div className="col-sm-12">
          <div>
            <h1>Edit Patient</h1>

            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label htmlFor="first_name" className="form-label">First Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
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
                <label htmlFor="middle_name" className="form-label">Middle Name (optional)</label>
                <input
                  type="text"
                  className={`form-control ${errors.middle_name ? "is-invalid" : ""}`}
                  id="middle_name"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.middle_name && <div className="invalid-feedback">{errors.middle_name}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="last_name" className="form-label">Last Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? "is-invalid" : ""}`}
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label htmlFor="mobile" className="form-label">Mobile (+X-XXX-XXX-XXXX)</label>
                <input
                  type="tel"
                  className={`form-control ${errors.mobile ? "is-invalid" : ""}`}
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="+1-555-666-7777"
                />
                {errors.mobile && <div className="invalid-feedback">{errors.mobile}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || Object.keys(errors).length > 0}
              >
                {loading ? "Updating..." : "Update Patient"}
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => router.push("/patient/index")}
                disabled={loading}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </div>
    </MasterTemplate>
  );
}