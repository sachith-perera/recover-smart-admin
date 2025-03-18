import MasterTemplate from "../components/master";

export default function DashboardPage() {
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
                <div className="row">
                  <div className="col-sm-12">
                    <div className="statistics-details d-flex align-items-center justify-content-between">
                      <div>
                        <p className="statistics-title">Number of Patients</p>
                        <h3 className="rate-percentage">50</h3>
                        <p className="text-danger d-flex">
                          <i className="mdi mdi-menu-down" />
                          <span>-0.5%</span>
                        </p>
                      </div>
                      <div>
                        <p className="statistics-title">Doctors</p>
                        <h3 className="rate-percentage">25</h3>
                        <p className="text-success d-flex">
                          <i className="mdi mdi-menu-up" />
                          <span>+0.1%</span>
                        </p>
                      </div>
                      <div>
                        <p className="statistics-title">
                          Recovery Completion Rate
                        </p>
                        <h3 className="rate-percentage">68.8</h3>
                        <p className="text-danger d-flex">
                          <i className="mdi mdi-menu-down" />
                          <span>68.8</span>
                        </p>
                      </div>
                      <div className="d-none d-md-block">
                        <p className="statistics-title">
                          Average Recovery Time
                        </p>
                        <h3 className="rate-percentage">2m:35s</h3>
                        <p className="text-success d-flex">
                          <i className="mdi mdi-menu-down" />
                          <span>+0.8%</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 d-flex flex-column">
                    <div className="row flex-grow">
                      <div className="col-12 col-lg-4 col-lg-12 grid-margin stretch-card">
                        <div className="card card-rounded">
                          <div className="card-body">
                            <div className="d-sm-flex justify-content-between align-items-start">
                              <div>
                                <h4 className="card-title card-title-dash">
                                  Performance Line Chart
                                </h4>
                                <h5 className="card-subtitle card-subtitle-dash">
                                  Lorem Ipsum is simply dummy text of the
                                  printing
                                </h5>
                              </div>
                              <div id="performanceLine-legend" />
                            </div>
                            <div className="chartjs-wrapper mt-4">
                              <canvas id="performanceLine" width="" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 d-flex flex-column">
                    <div className="row flex-grow">
                      <div className="col-md-6 col-lg-12 grid-margin stretch-card">
                        <div className="card bg-primary card-rounded">
                          <div className="card-body pb-0">
                            <h4 className="card-title card-title-dash text-white mb-4">
                              Status Summary
                            </h4>
                            <div className="row">
                              <div className="col-sm-4">
                                <p className="status-summary-ight-white mb-1">
                                  Closed Value
                                </p>
                                <h2 className="text-info">357</h2>
                              </div>
                              <div className="col-sm-8">
                                <div className="status-summary-chart-wrapper pb-4">
                                  <canvas id="status-summary" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-12 grid-margin stretch-card">
                        <div className="card card-rounded">
                          <div className="card-body">
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="d-flex justify-content-between align-items-center mb-2 mb-sm-0">
                                  <div className="circle-progress-width">
                                    <div
                                      id="totalVisitors"
                                      className="progressbar-js-circle pr-2"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-small mb-2">
                                      Total Visitors
                                    </p>
                                    <h4 className="mb-0 fw-bold">26.80%</h4>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="d-flex justify-content-between align-items-center">
                                  <div className="circle-progress-width">
                                    <div
                                      id="visitperday"
                                      className="progressbar-js-circle pr-2"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-small mb-2">
                                      Visits per day
                                    </p>
                                    <h4 className="mb-0 fw-bold">9065</h4>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-8 d-flex flex-column">
                    <div className="row flex-grow">
                      <div className="col-12 grid-margin stretch-card">
                        <div className="card card-rounded">
                          <div className="card-body">
                            <div className="d-sm-flex justify-content-between align-items-start">
                              <div>
                                <h4 className="card-title card-title-dash">
                                  Market Overview
                                </h4>
                                <p className="card-subtitle card-subtitle-dash">
                                  Lorem ipsum dolor sit amet consectetur
                                  adipisicing elit
                                </p>
                              </div>
                              <div>
                                <div className="dropdown">
                                  <button
                                    className="btn btn-light dropdown-toggle toggle-dark btn-lg mb-0 me-0"
                                    type="button"
                                    id="dropdownMenuButton2"
                                    data-bs-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    {" "}
                                    This month{" "}
                                  </button>
                                  <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton2"
                                  >
                                    <h6 className="dropdown-header">
                                      Settings
                                    </h6>
                                    <a className="dropdown-item" href="#">
                                      Action
                                    </a>
                                    <a className="dropdown-item" href="#">
                                      Another action
                                    </a>
                                    <a className="dropdown-item" href="#">
                                      Something else here
                                    </a>
                                    <div className="dropdown-divider" />
                                    <a className="dropdown-item" href="#">
                                      Separated link
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="d-sm-flex align-items-center mt-1 justify-content-between">
                              <div className="d-sm-flex align-items-center mt-4 justify-content-between">
                                <h2 className="me-2 fw-bold">$36,2531.00</h2>
                                <h4 className="me-2">USD</h4>
                                <h4 className="text-success">(+1.37%)</h4>
                              </div>
                              <div className="me-3">
                                <div id="marketingOverview-legend" />
                              </div>
                            </div>
                            <div className="chartjs-bar-wrapper mt-3">
                              <canvas id="marketingOverview" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterTemplate>
  );
}
