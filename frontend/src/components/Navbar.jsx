import { NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-primary text-white shadow-lg" : "text-slate-600 hover:bg-white hover:text-primary"
  }`;

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-white shadow-panel">
            VC
          </div>
          <div>
            <p className="text-base font-semibold text-ink">VisionCheck AI</p>
            <p className="text-xs text-slate-500">Rule-Based Ishihara Screening</p>
          </div>
        </NavLink>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/calibration" className={navLinkClass}>
            Start Test
          </NavLink>
          <NavLink to="/admin" className={navLinkClass}>
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
