export default function navbar() {
  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
    <ul className="nav">
      <li className="nav-item">
        <a className="nav-link" href="index.html">
          <i className="mdi mdi-grid-large menu-icon" />
          <span className="menu-title">Dashboard</span>
        </a>
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
              {" "}
              <a
                className="nav-link"
                href="pages/ui-features/buttons.html"
              >
                Add
              </a>
            </li>
            <li className="nav-item">
              {" "}
              <a
                className="nav-link"
                href="pages/ui-features/dropdowns.html"
              >
                View
              </a>
            </li>
           
          </ul>
        </div>
      </li>
  
    </ul>
  </nav>
  );
}