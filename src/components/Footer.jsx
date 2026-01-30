import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-neo-charcoal/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-lg font-semibold">NeoPress</p>
          <p className="text-sm text-slate-400">
            New-Gen Anime & Gaming coverage from Neo-Tokyo.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <NavLink to="/privacy" className="hover:text-white">
            Privacy Policy
          </NavLink>
          <NavLink to="/terms" className="hover:text-white">
            Terms & Conditions
          </NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
