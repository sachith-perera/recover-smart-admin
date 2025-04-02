"use client";

import MasterTemplate from "../../../components/master";
import Swal from "sweetalert2";
import { useState, useEffect } from "react"; // Added useEffect
import { useParams, useRouter } from "next/navigation"; // Added for URL params and navigation
import { z } from "zod";

// Define Zod schema for doctor validation
const doctorSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .nonempty("First name is required"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .nonempty("Last name is required")
});

export default function EditDoctor() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true); // Loading state for fetching data
  const { id } = useParams(); // Get the doctor ID from the URL
  const router = useRouter(); // For navigation after success
  const token = localStorage.getItem("token");

  // Fetch doctor data when component mounts
  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        if (!token) throw new Error("Authentication token not found");
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/edit/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch doctor data");
        const data = await response.json();
        setFormData(data); // Pre-fill form with fetched data
        setFetchLoading(false);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load doctor data: " + error.message,
        });
        setFetchLoading(false);
      }
    };

    fetchDoctorData();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Validate the field on change
    try {
      doctorSchema.parse({ ...formData, [name]: value });
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
      const partialSchema = doctorSchema.partial().pick({ [name]: true });
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
      doctorSchema.parse(formData);
      setErrors({});

      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/${id}/`, {
        method: "PUT", // Use PUT for updating (or PATCH if your API supports partial updates)
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update doctor");
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Doctor updated successfully",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push("/doctors/index"); // Redirect to doctor list
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
            <h1>Edit Doctor</h1>

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

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || Object.keys(errors).length > 0}
              >
                {loading ? "Updating..." : "Update Doctor"}
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => router.push("/doctor/index")}
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