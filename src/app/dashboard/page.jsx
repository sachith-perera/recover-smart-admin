"use client";

import { useState, useEffect } from "react";
import MasterTemplate from "../components/master";

export default function DashboardPage() {
  const [data, setData] = useState({
    number_of_patients: 0,
    doctors: 0,
    recovery_completion_rate: 0,
    average_recovery_time: "0m:0s",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      if (!token) throw new Error("Authentication token not found");

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard`, {
        headers: {
          Authorization: `Bearer ${token}`,
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
                            <p className="text-danger d-flex">
                            </p>
                          </div>
                          <div>
                            <p className="statistics-title">Doctors</p>
                            <h3 className="rate-percentage">{data.doctors}</h3>
                            <p className="text-success d-flex">
                            </p>
                          </div>
                          <div>
                            <p className="statistics-title">Recovery Completion Rate</p>
                            <h3 className="rate-percentage">{data.recovery_completion_rate}%</h3>
                          </div>
                          <div className="d-none d-md-block">
                            <p className="statistics-title">Average Recovery Time</p>
                            <h3 className="rate-percentage">{data.average_recovery_time} Day(s)</h3>
                        
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
                                    <h4 className="card-title card-title-dash">
                                     Recovery Chart
                                    </h4>
                                    <h5 className="card-subtitle card-subtitle-dash">
                                     
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