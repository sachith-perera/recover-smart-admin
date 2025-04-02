import Link from "next/link";

export default function navbar() {
  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
    <ul className="nav">
      <li className="nav-item">
        <Link className="nav-link" href="/dashboard" >
          <i className="mdi mdi-grid-large menu-icon" />
          <span className="menu-title">Dashboard</span>
        </Link>
      </li>
      <li className="nav-item">
        <a
          className="nav-link"
          data-bs-toggle="collapse"
          href="#ui-patients"
          aria-expanded="false"
          aria-controls="ui-patients"
        >
          <i className="menu-icon mdi mdi-human-male-female" />
          <span className="menu-title">Patients</span>
          <i className="menu-arrow" />
        </a>
        <div className="collapse" id="ui-patients">
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <Link className="nav-link" href="/patient/create">
                  Add
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/patient/index">
                  View
              </Link>
            </li>
           
          </ul>
        </div>
      </li>
      <li className="nav-item">
        <a
          className="nav-link"
          data-bs-toggle="collapse"
          href="#ui-checklist"
          aria-expanded="false"
          aria-controls="ui-checklist"
        >
          <i className="menu-icon mdi mdi-account-check" />
          <span className="menu-title">Checklist</span>
          <i className="menu-arrow" />
        </a>
        <div className="collapse" id="ui-checklist">
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <Link className="nav-link" href="/checklist/create">
                  Add
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/checklist/index">
                  View
              </Link>
            </li>
           
          </ul>
        </div>
      </li>
      <li className="nav-item">
        <a
          className="nav-link"
          data-bs-toggle="collapse"
          href="#ui-doctors"
          aria-expanded="false"
          aria-controls="ui-doctors"
        >
          <i className="menu-icon mdi mdi-medical-bag" />
          <span className="menu-title">Doctors</span>
          <i className="menu-arrow" />
        </a>
        <div className="collapse" id="ui-doctors">
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <Link className="nav-link" href="/doctors/create">
                  Add
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/doctors/index">
                  View
              </Link>
            </li>
           
          </ul>
        </div>
      </li>
    </ul>
  </nav>
  );
}