"use client";

import { useState, useEffect } from "react";
import MasterTemplate from "../components/master";
import { useRouter } from "next/navigation"; // Added for redirect
import Swal from "sweetalert2"; // Added for user-friendly alerts

export default function DashboardPage() {
  const [data, setData] = useState({
    number_of_patients: 0,
    doctors: 0,
    recovery_completion_rate: 0,
    average_recovery_time: "0m:0s",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null); // Store token in state
  const router = useRouter();

  const fetchDashboardData = async (authToken) => {
    try {
      setLoading(true);
      if (!authToken) throw new Error("Authentication token not found");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Error fetching dashboard data: ${response.statusText}`);

      const result = await response.json();
      setData({
        number_of_patients: result.totalPatients || 0,
        doctors: result.totalDoctors || 0,
        recovery_completion_rate: result.recoveryCompletionRate || 0,
        average_recovery_time: result.recoveryTime || "0m:0s",
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setData({
        number_of_patients: 0,
        doctors: 0,
        recovery_completion_rate: 0,
        average_recovery_time: "0m:0s",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch token and data on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);

      if (storedToken) {
        fetchDashboardData(storedToken);
      } else {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Authentication Required",
          text: "Please log in to view the dashboard.",
        }).then(() => router.push("/login")); // Redirect to login
      }
    }
  }, [router]);

  return (
    <MasterTemplate>
      <div className="row">
        <div className="col-sm-12">
          <div className="home-tab">
            <div className="d-sm-flex align-items-center justify-content-between border-bottom">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active ps-0"
                    id="home-tab"
                    data-bs-toggle="tab"
                    href="#overview"
                    role="tab"
                    aria-controls="overview"
                    aria-selected="true"
                  >
                    Overview
                  </a>
                </li>
              </ul>
            </div>
            <div className="tab-content tab-content-basic">
              <div
                className="tab-pane fade show active"
                id="overview"
                role="tabpanel"
                aria-labelledby="overview"
              >
                {loading ? (
                  <div className="text-center p-5">
                    <div className="d-flex justify-content-center align-items-center">
                      <div className="spinner-border text-primary me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span>Loading dashboard data...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger mt-3" role="alert">
                    <strong>Error: </strong>
                    <span>{error}</span>
                  </div>
                ) : (
                  <>
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="statistics-details d-flex align-items-center justify-content-between">
                          <div>
                            <p className="statistics-title">Number of Patients</p>
                            <h3 className="rate-percentage">{data.number_of_patients}</h3>
                          </div>
                          <div>
                            <p className="statistics-title">Doctors</p>
                            <h3 className="rate-percentage">{data.doctors}</h3>
                          </div>
                          <div>
                            <p className="statistics-title">Recovery Completion Rate</p>
                            <h3 className="rate-percentage">{data.recovery_completion_rate}%</h3>
                          </div>
                          <div className="d-none d-md-block">
                            <p className="statistics-title">Average Recovery Time</p>
                            <h3 className="rate-percentage">{data.average_recovery_time}</h3>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12 d-flex flex-column">
                        <div className="row flex-grow">
                          <div className="col-12 col-lg-4 col-lg-12 grid-margin stretch-card">
                            <div className="card card-rounded">
                              <div className="card-body">
                                <div className="d-sm-flex justify-content-between align-items-start">
                                  <div>
                                    <h4 className="card-title card-title-dash">Recovery Chart</h4>
                                    <h5 className="card-subtitle card-subtitle-dash">
                                      Visual representation of recovery trends
                                    </h5>
                                  </div>
                                  <div id="performanceLine-legend" />
                                </div>
                                <div className="chartjs-wrapper mt-4">
                                  <canvas id="performanceLine" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterTemplate>
  );
}