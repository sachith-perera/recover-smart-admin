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
          href="#ui-basic"
          aria-expanded="false"
          aria-controls="ui-basic"
        >
          <i className="menu-icon mdi mdi-human-male-female" />
          <span className="menu-title">Patients</span>
          <i className="menu-arrow" />
        </a>
        <div className="collapse" id="ui-basic">
          <ul className="nav flex-column sub-menu">
            <li className="nav-item">
              <Link className="nav-link" href="/patient/index">
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
  
    </ul>
  </nav>
  );
}