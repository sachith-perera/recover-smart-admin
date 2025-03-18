import Sidebar from "./sidebar";
import Footer from "./footer";
export default function Master() {
  return (
    <div id="app">
      <div id="sidebar">
        <Sidebar />
      </div>
      <div id="main">
        <header className="mb-3">
          <a href="#" className="burger-btn d-block d-xl-none">
            <i className="bi bi-justify fs-3" />
          </a>
        </header>
        <Footer />
      </div>
    </div>
  );
}
