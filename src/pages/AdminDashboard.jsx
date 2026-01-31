import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { basePosts } from "../data/mockPosts.js";
import { getPostStatus, mergePosts } from "../utils/posts.js";
import { getSession, isSupabaseConfigured, signOut } from "../utils/auth.js";
import { loadDeletedIds, loadPosts, saveDeletedIds, savePosts } from "../utils/storage.js";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(() => {
    const stored = loadPosts();
    const deleted = loadDeletedIds();
    return mergePosts(basePosts, stored, deleted);
  });
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        navigate("/admin");
      }
    };
    checkSession();
  }, [navigate]);

  const sortedPosts = useMemo(
    () => posts.slice().sort((a, b) => new Date(b.updatedAt || b.date) - new Date(a.updatedAt || a.date)),
    [posts]
  );

  const handleDelete = (id) => {
    const stored = loadPosts();
    const updatedStored = stored.filter((post) => post.id !== id);
    savePosts(updatedStored);
    const deleted = loadDeletedIds();
    if (!deleted.includes(id)) {
      saveDeletedIds([...deleted, id]);
    }
    setPosts((prev) => prev.filter((post) => post.id !== id));
  };

  const handleSignOut = () => {
    signOut().finally(() => navigate("/admin"));
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Admin Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold">Content Control Center</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/editor"
            className="rounded-full bg-neo-blue px-5 py-2 text-xs uppercase tracking-[0.3em] text-neo-black"
          >
            New Post
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {!isConfigured && (
          <div className="glass rounded-3xl border border-dashed border-neo-purple/40 p-6 text-sm text-slate-300">
            Supabase Auth is not configured. Add your environment keys to enable secure access.
          </div>
        )}
        {sortedPosts.map((post) => {
          const status = getPostStatus(post);
          const featuredLabel = post.featured ? " • featured" : "";
          return (
          <div key={post.id} className="glass flex flex-col gap-4 rounded-3xl p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {post.category} • {status}
                {featuredLabel}
                {post.scheduledFor && status === "scheduled"
                  ? ` • Schedules ${new Date(post.scheduledFor).toLocaleString()}`
                  : ""}
              </p>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-slate-400">{post.date}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/admin/editor/${post.id}`}
                className="rounded-full border border-neo-blue/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-neo-blue"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(post.id)}
                className="rounded-full border border-neo-pink/40 px-4 py-2 text-xs uppercase tracking-[0.3em] text-neo-pink"
              >
                Delete
              </button>
            </div>
          </div>
        )})}
      </div>
    </main>
  );
};

export default AdminDashboard;
