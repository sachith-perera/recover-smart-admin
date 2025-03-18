import Footer from "./footer";
import TopBar from "../components/topbar";
import NavBar from "../components/navbar";

export default function Master({ children }) {
  return (
    <div className="container-scroller">
      {/* Top Navbar */}
      <TopBar />
      <div className="container-fluid page-body-wrapper">
        {/* Navbar */}
        <NavBar />
        <div className="main-panel">
          {/* content-wrapper */}
          <div className="content-wrapper">
              {children}
          </div>
          {/* Footer */}
          <Footer/>
        </div>
      </div>
    </div>
  );
}
