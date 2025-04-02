import Link from "next/link";


const fetchPatients = async () => {


  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Works with Next.js App Router
  const token = localStorage.getItem("token");
  
  try {
    setLoading(true);

    if (!token) {
      throw new Error("Authentication token not found");
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/user/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching doctors: ${response.statusText}`);
    }

    const result = await response.json();
    setData(result);
    setError(null);
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "An unknown error occurred"
    );
    setData([]);
  } finally {
    setLoading(false);
  }
};


export default function topbar() {
    return ( 
        <nav className="navbar default-layout col-lg-12 col-12 p-0 fixed-top d-flex align-items-top flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
          <div className="me-3">
            <button
              className="navbar-toggler navbar-toggler align-self-center"
              type="button"
              data-bs-toggle="minimize"
            >
              <span className="icon-menu" />
            </button>
          </div>
          <div>
            <Link className="navbar-brand brand-logo" href="/dashboard" >
              <img src="/assets/images/logo.jpg" alt="logo" />
            </Link>
            <Link className="navbar-brand brand-logo-mini" href="/dashboard" >
              <img src="/assets/images/logo.jpg" alt="logo" />
            </Link>
          </div>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-top">
          <ul className="navbar-nav">
            <li className="nav-item fw-semibold d-none d-lg-block ms-0">
              <h1 className="welcome-text">
                Good Morning, <span className="text-black fw-bold">John Doe</span>
              </h1>
              <h3 className="welcome-sub-text">
                Your performance summary this week{" "}
              </h3>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
          
            <li className="nav-item">
              <form className="search-form" action="#">
                <i className="icon-search" />
                <input
                  type="search"
                  className="form-control"
                  placeholder="Search Here"
                  title="Search here"
                />
              </form>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link count-indicator"
                id="notificationDropdown"
                href="#"
                data-bs-toggle="dropdown"
              >
                <i className="icon-bell" />
                <span className="count" />
              </a>
              <div
                className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0"
                aria-labelledby="notificationDropdown"
              >
                <a className="dropdown-item py-3 border-bottom">
                  <p className="mb-0 fw-medium float-start">
                    You have 4 new notifications{" "}
                  </p>
                  <span className="badge badge-pill badge-primary float-end">
                    View all
                  </span>
                </a>
                <a className="dropdown-item preview-item py-3">
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-alert m-auto text-primary" />
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject fw-normal text-dark mb-1">
                      Application Error
                    </h6>
                    <p className="fw-light small-text mb-0"> Just now </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item py-3">
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-lock-outline m-auto text-primary" />
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject fw-normal text-dark mb-1">
                      Settings
                    </h6>
                    <p className="fw-light small-text mb-0"> Private message </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item py-3">
                  <div className="preview-thumbnail">
                    <i className="mdi mdi-airballoon m-auto text-primary" />
                  </div>
                  <div className="preview-item-content">
                    <h6 className="preview-subject fw-normal text-dark mb-1">
                      New user registration
                    </h6>
                    <p className="fw-light small-text mb-0"> 2 days ago </p>
                  </div>
                </a>
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link count-indicator"
                id="countDropdown"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="icon-mail icon-lg" />
              </a>
              <div
                className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list pb-0"
                aria-labelledby="countDropdown"
              >
                <a className="dropdown-item py-3">
                  <p className="mb-0 fw-medium float-start">
                    You have 7 unread mails{" "}
                  </p>
                  <span className="badge badge-pill badge-primary float-end">
                    View all
                  </span>
                </a>
                <div className="dropdown-divider" />
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img
                      src="/assets/images/faces/face10.jpg"
                      alt="image"
                      className="img-sm profile-pic"
                    />
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis fw-medium text-dark">
                      Marian Garner{" "}
                    </p>
                    <p className="fw-light small-text mb-0">
                      {" "}
                      The meeting is cancelled{" "}
                    </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img
                      src="/assets/images/faces/face12.jpg"
                      alt="image"
                      className="img-sm profile-pic"
                    />
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis fw-medium text-dark">
                      David Grey{" "}
                    </p>
                    <p className="fw-light small-text mb-0">
                      {" "}
                      The meeting is cancelled{" "}
                    </p>
                  </div>
                </a>
                <a className="dropdown-item preview-item">
                  <div className="preview-thumbnail">
                    <img
                      src="/assets/images/faces/face1.jpg"
                      alt="image"
                      className="img-sm profile-pic"
                    />
                  </div>
                  <div className="preview-item-content flex-grow py-2">
                    <p className="preview-subject ellipsis fw-medium text-dark">
                      Travis Jenkins{" "}
                    </p>
                    <p className="fw-light small-text mb-0">
                      {" "}
                      The meeting is cancelled{" "}
                    </p>
                  </div>
                </a>
              </div>
            </li>
            <li className="nav-item dropdown d-none d-lg-block user-dropdown">
              <a
                className="nav-link"
                id="UserDropdown"
                href="#"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  className="img-xs rounded-circle"
                  src="/assets/images/faces/face8.jpg"
                  alt="Profile image"
                />{" "}
              </a>
              <div
                className="dropdown-menu dropdown-menu-right navbar-dropdown"
                aria-labelledby="UserDropdown"
              >
                <div className="dropdown-header text-center">
                  <img
                    className="img-md rounded-circle"
                    src="/assets/images/faces/face8.jpg"
                    alt="Profile image"
                  />
                  <p className="mb-1 mt-3 fw-semibold">Allen Moreno</p>
                  <p className="fw-light text-muted mb-0">allenmoreno@gmail.com</p>
                </div>
                <a className="dropdown-item">
                  <i className="dropdown-item-icon mdi mdi-account-outline text-primary me-2" />{" "}
                  My Profile{" "}
                  <span className="badge badge-pill badge-danger">1</span>
                </a>
                <a className="dropdown-item">
                  <i className="dropdown-item-icon mdi mdi-message-text-outline text-primary me-2" />{" "}
                  Messages
                </a>
                <a className="dropdown-item">
                  <i className="dropdown-item-icon mdi mdi-calendar-check-outline text-primary me-2" />{" "}
                  Activity
                </a>
                <a className="dropdown-item">
                  <i className="dropdown-item-icon mdi mdi-help-circle-outline text-primary me-2" />{" "}
                  FAQ
                </a>
                <a className="dropdown-item">
                  <i className="dropdown-item-icon mdi mdi-power text-primary me-2" />
                  Sign Out
                </a>
              </div>
            </li>
          </ul>
          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            data-bs-toggle="offcanvas"
          >
            <span className="mdi mdi-menu" />
          </button>
        </div>
      </nav>
    )
}