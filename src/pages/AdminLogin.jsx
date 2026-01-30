import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminCredentials, getAdminSession, setAdminSession } from "../utils/auth.js";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (getAdminSession()) {
      navigate("/admin/dashboard");
    }
  }, [navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === adminCredentials.email && password === adminCredentials.password) {
      setAdminSession(true);
      navigate("/admin/dashboard");
    } else {
      setError("Invalid credentials. Use the NeoPress admin access.");
    }
  };

  return (
    <main className="mx-auto w-full max-w-lg px-6 py-16">
      <div className="glass rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Admin Access</p>
        <h1 className="mt-4 text-3xl font-semibold">Sign in to the CMS</h1>
        <p className="mt-2 text-sm text-slate-300">
          Use the secure NeoPress credentials to manage posts.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@neopress.io"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
          />
          {error && <p className="text-sm text-neo-pink">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-neo-blue px-4 py-3 text-xs uppercase tracking-[0.3em] text-neo-black"
          >
            Enter CMS
          </button>
        </form>
        <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-4 text-xs text-slate-400">
          <p className="uppercase tracking-[0.3em]">Demo credentials</p>
          <p className="mt-2">Email: {adminCredentials.email}</p>
          <p>Password: {adminCredentials.password}</p>
        </div>
      </div>
    </main>
  );
};

export default AdminLogin;
