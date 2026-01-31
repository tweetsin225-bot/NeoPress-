import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, isSupabaseConfigured, onAuthStateChange, signInWithPassword } from "../utils/auth.js";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      const session = await getSession();
      if (session && isMounted) {
        navigate("/admin/dashboard");
      }
    };
    checkSession();
    const { data } = onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/admin/dashboard");
      }
    });
    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isConfigured) {
      setError("Connect Supabase Auth to sign in.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: authError } = await signInWithPassword(email, password);
    if (authError) {
      setError(authError.message);
    }
    setLoading(false);
  };

  return (
    <main className="mx-auto w-full max-w-lg px-6 py-16">
      <div className="glass rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Admin Access</p>
        <h1 className="mt-4 text-3xl font-semibold">Sign in to the CMS</h1>
        <p className="mt-2 text-sm text-slate-300">
          Sign in with your Supabase Auth account to manage posts.
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
            disabled={loading || !isConfigured}
            className="w-full rounded-xl bg-neo-blue px-4 py-3 text-xs uppercase tracking-[0.3em] text-neo-black"
          >
            {loading ? "Signing in..." : "Enter CMS"}
          </button>
        </form>
        {!isConfigured && (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-4 text-xs text-slate-400">
            <p className="uppercase tracking-[0.3em]">Supabase required</p>
            <p className="mt-2">
              Add <span className="text-white">VITE_SUPABASE_URL</span> and{" "}
              <span className="text-white">VITE_SUPABASE_ANON_KEY</span> to your environment.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminLogin;
