import React from "react";
import { NavLink } from "react-router-dom";
import { Gamepad2, Sparkles } from "lucide-react";

const navLinkClass = ({ isActive }) =>
  `text-sm uppercase tracking-[0.2em] transition ${
    isActive ? "text-neo-blue" : "text-slate-300 hover:text-white"
  }`;

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-neo-black/70 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neo-purple/20 text-neo-blue shadow-glow">
            <Gamepad2 size={22} />
          </span>
          <div>
            <p className="text-lg font-semibold text-white">NeoPress</p>
            <p className="text-xs uppercase tracking-[0.3em] text-neo-blue/70">
              New-Gen Media
            </p>
          </div>
        </NavLink>
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/categories" className={navLinkClass}>
            Sections
          </NavLink>
          <NavLink to="/tags" className={navLinkClass}>
            Tags
          </NavLink>
          <NavLink to="/privacy" className={navLinkClass}>
            Privacy
          </NavLink>
          <NavLink to="/terms" className={navLinkClass}>
            Terms
          </NavLink>
        </nav>
        <NavLink
          to="/admin"
          className="flex items-center gap-2 rounded-full border border-neo-blue/30 bg-neo-blue/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-neo-blue transition hover:border-neo-blue hover:text-white"
        >
          <Sparkles size={14} /> Admin
        </NavLink>
      </div>
    </header>
  );
};

export default Navbar;
