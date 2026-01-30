import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { basePosts } from "../data/mockPosts.js";
import { getAdminSession, setAdminSession } from "../utils/auth.js";
import { loadDeletedIds, loadPosts, saveDeletedIds, savePosts } from "../utils/storage.js";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState(() => {
    const stored = loadPosts();
    const deleted = loadDeletedIds();
    const merged = new Map(basePosts.map((post) => [post.id, post]));
    stored.forEach((post) => merged.set(post.id, post));
    return Array.from(merged.values()).filter((post) => !deleted.includes(post.id));
  });

  useEffect(() => {
    if (!getAdminSession()) {
      navigate("/admin");
    }
  }, [navigate]);

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
    setAdminSession(false);
    navigate("/admin");
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
        {posts.map((post) => (
          <div key={post.id} className="glass flex flex-col gap-4 rounded-3xl p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{post.category}</p>
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
        ))}
      </div>
    </main>
  );
};

export default AdminDashboard;
