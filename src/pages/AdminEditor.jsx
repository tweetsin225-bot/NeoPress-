import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { basePosts } from "../data/mockPosts.js";
import { supabase } from "../lib/supabaseClient.js";
import { getAdminSession } from "../utils/auth.js";
import { canEditPosts, getStoredRole } from "../utils/roles.js";
import { loadDeletedIds, loadPosts, saveDeletedIds, savePosts } from "../utils/storage.js";

const formatAction = (command, value = null) => {
  document.execCommand(command, false, value);
};

const generateId = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || `post-${Date.now()}`;

const AdminEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const editorRef = useRef(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("Anime & Gaming");
  const [author, setAuthor] = useState("NeoPress Staff");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState(() => getStoredRole());

  const isAuthed = useMemo(() => getAdminSession(), []);

  useEffect(() => {
    if (!isAuthed) {
      navigate("/admin");
    }
  }, [isAuthed, navigate]);

  useEffect(() => {
    if (!canEditPosts(role)) {
      navigate("/admin/dashboard");
    }
  }, [navigate, role]);

  useEffect(() => {
    if (!id) return;
    const stored = loadPosts();
    const merged = new Map(basePosts.map((post) => [post.id, post]));
    stored.forEach((post) => merged.set(post.id, post));
    const existing = merged.get(id);
    if (existing) {
      setTitle(existing.title);
      setExcerpt(existing.excerpt);
      setTags(existing.tags.join(", "));
      setCategory(existing.category);
      setAuthor(existing.author || "NeoPress Staff");
      setCoverImage(existing.image);
      if (editorRef.current) {
        editorRef.current.innerHTML = existing.content || "";
      }
    }
  }, [id]);

  const handleCoverImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCoverImage(reader.result?.toString() || "");
    };
    reader.readAsDataURL(file);
  };

  const handleEmbedImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      formatAction("insertImage", reader.result?.toString() || "");
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async () => {
    if (!editorRef.current) return;
    const nextId = id || generateId(title);
    const newPost = {
      id: nextId,
      title,
      excerpt,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      category,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      author,
      image: coverImage || "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80",
      content: editorRef.current.innerHTML,
    };

    const stored = loadPosts();
    const filtered = stored.filter((post) => post.id !== nextId);
    const updated = [newPost, ...filtered];
    savePosts(updated);
    const deleted = loadDeletedIds().filter((deletedId) => deletedId !== nextId);
    saveDeletedIds(deleted);

    if (supabase) {
      await supabase.from("posts").upsert({
        id: newPost.id,
        title: newPost.title,
        content: newPost.content,
        image_url: newPost.image,
        date: newPost.date,
        author: newPost.author,
      });
    }

    setStatus("Published! The homepage is updated.");
    navigate("/admin/dashboard");
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Editor</p>
          <h1 className="mt-2 text-3xl font-semibold">Craft a New Story</h1>
          <p className="mt-2 text-sm text-slate-400">
            {supabase
              ? "Supabase connected. Publishing will sync to your database."
              : "Local mode active. Add VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to enable sync."}
          </p>
        </div>
        <button
          type="button"
          onClick={handlePublish}
          className="rounded-full bg-neo-blue px-5 py-2 text-xs uppercase tracking-[0.3em] text-neo-black"
        >
          Publish
        </button>
      </div>

      {status && <p className="mt-4 text-sm text-neo-blue">{status}</p>}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.4fr]">
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Headline that punches hard"
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-lg text-white placeholder:text-slate-500"
            />
          </div>
          <div className="glass rounded-3xl p-6">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              placeholder="Short summary to tease the story"
              className="mt-3 min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
          </div>
          <div className="glass rounded-3xl p-6">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => formatAction("formatBlock", "H1")}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => formatAction("formatBlock", "H2")}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => formatAction("bold")}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => formatAction("italic")}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt("Enter link URL");
                  if (url) formatAction("createLink", url);
                }}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                Link
              </button>
              <label className="cursor-pointer rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">
                Embed Image
                <input type="file" accept="image/*" className="hidden" onChange={handleEmbedImage} />
              </label>
            </div>
            <div
              ref={editorRef}
              className="rich-text mt-4 min-h-[320px] rounded-2xl border border-white/10 bg-white/5 p-4 focus:outline-none"
              contentEditable
              suppressContentEditableWarning
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Category</label>
            <input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
          </div>
          <div className="glass rounded-3xl p-6">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Tags</label>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="RPG, Shonen, Tech"
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
          </div>
          <div className="glass rounded-3xl p-6">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Author</label>
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            />
          </div>
          <div className="glass rounded-3xl p-6">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Cover Image</label>
            {coverImage && (
              <img src={coverImage} alt="Cover preview" className="mt-4 h-32 w-full rounded-2xl object-cover" />
            )}
            <label className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 px-4 py-6 text-xs uppercase tracking-[0.3em] text-slate-300">
              Upload Cover
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverImage} />
            </label>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminEditor;
