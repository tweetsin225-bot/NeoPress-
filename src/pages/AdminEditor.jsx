import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { basePosts } from "../data/mockPosts.js";
import { supabase } from "../lib/supabaseClient.js";
import { getSession } from "../utils/auth.js";
import { mergePosts } from "../utils/posts.js";
import { loadDeletedIds, loadPosts, saveDeletedIds, savePosts } from "../utils/storage.js";

const fallbackImage =
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=900&q=80";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const generateId = (title) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || `post-${Date.now()}`;

const AdminEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("Anime & Gaming");
  const [author, setAuthor] = useState("NeoPress Staff");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("draft");
  const [scheduledFor, setScheduledFor] = useState("");
  const [content, setContent] = useState("");
  const [featured, setFeatured] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [lastSaved, setLastSaved] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (!session) {
        navigate("/admin");
      }
    };
    checkSession();
  }, [navigate]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: false,
        HTMLAttributes: {
          class: "rounded-2xl border border-white/10",
        },
      }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: "Start drafting the story here...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "rich-text min-h-[320px] rounded-2xl border border-white/10 bg-white/5 p-4 focus:outline-none",
      },
    },
  });

  const existingPost = useMemo(() => {
    if (!id) return null;
    const stored = loadPosts();
    const deleted = loadDeletedIds();
    const merged = mergePosts(basePosts, stored, deleted);
    return merged.find((post) => post.id === id) || null;
  }, [id]);

  useEffect(() => {
    if (!existingPost) return;
    setTitle(existingPost.title || "");
    setExcerpt(existingPost.excerpt || "");
    setTags(Array.isArray(existingPost.tags) ? existingPost.tags.join(", ") : "");
    setCategory(existingPost.category || "Anime & Gaming");
    setAuthor(existingPost.author || "NeoPress Staff");
    setCoverImage(existingPost.image || "");
    setStatus(existingPost.status || "published");
    setScheduledFor(existingPost.scheduledFor || "");
    setFeatured(Boolean(existingPost.featured));
    setContent(existingPost.content || "");
    if (editor && existingPost.content) {
      editor.commands.setContent(existingPost.content, false);
    }
  }, [existingPost, editor]);

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
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result?.toString() || "";
      if (src) {
        editor.chain().focus().setImage({ src }).run();
      }
    };
    reader.readAsDataURL(file);
  };

  const buildPost = (nextStatus = status) => {
    const nextId = id || generateId(title);
    const now = new Date();
    const effectiveStatus =
      nextStatus === "scheduled" && !scheduledFor ? "draft" : nextStatus || "draft";
    const scheduledDate = effectiveStatus === "scheduled" ? scheduledFor : "";
    const publishDate =
      effectiveStatus === "scheduled" && scheduledDate ? formatDate(scheduledDate) : formatDate(now);

    return {
      id: nextId,
      title,
      excerpt,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      category,
      date: existingPost?.date || publishDate,
      author,
      image: coverImage || fallbackImage,
      content,
      status: effectiveStatus,
      scheduledFor: scheduledDate || null,
      featured,
      updatedAt: now.toISOString(),
    };
  };

  const persistPost = async ({ nextStatus = status, announce = true } = {}) => {
    if (!editor) return;
    const newPost = buildPost(nextStatus);
    const stored = loadPosts();
    const filtered = stored.filter((post) => post.id !== newPost.id);
    const updated = [newPost, ...filtered];
    savePosts(updated);
    const deleted = loadDeletedIds().filter((deletedId) => deletedId !== newPost.id);
    saveDeletedIds(deleted);

    if (supabase) {
      await supabase.from("posts").upsert({
        id: newPost.id,
        title: newPost.title,
        excerpt: newPost.excerpt,
        content: newPost.content,
        image_url: newPost.image,
        date: newPost.date,
        author: newPost.author,
        status: newPost.status,
        scheduled_for: newPost.scheduledFor,
        tags: newPost.tags,
        category: newPost.category,
        featured: newPost.featured,
        updated_at: newPost.updatedAt,
      });
    }

    if (announce) {
      setStatusMessage(
        newPost.status === "draft"
          ? "Draft saved."
          : newPost.status === "scheduled"
          ? "Scheduled! The post will publish automatically."
          : "Published! The homepage is updated."
      );
    }
    setLastSaved(new Date().toLocaleTimeString());
  };

  const handlePrimaryAction = async () => {
    if (status === "scheduled" && !scheduledFor) {
      setStatusMessage("Select a schedule time before publishing.");
      return;
    }
    await persistPost({ nextStatus: status, announce: true });
    navigate("/admin/dashboard");
  };

  const handleSaveDraft = async () => {
    setStatus("draft");
    await persistPost({ nextStatus: "draft", announce: true });
  };

  useEffect(() => {
    if (!editor) return;
    const autosave = setTimeout(() => {
      if (!title && !content) return;
      persistPost({ nextStatus: status, announce: false });
    }, 1500);
    return () => clearTimeout(autosave);
  }, [title, excerpt, tags, category, author, coverImage, status, scheduledFor, content, editor]);

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
          {lastSaved && <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">Autosaved at {lastSaved}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="rounded-full bg-neo-blue px-5 py-2 text-xs uppercase tracking-[0.3em] text-neo-black"
          >
            {status === "scheduled" ? "Schedule" : "Publish"}
          </button>
        </div>
      </div>

      {statusMessage && <p className="mt-4 text-sm text-neo-blue">{statusMessage}</p>}

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
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                Bold
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                Italic
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                Bullet
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                Numbered
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                Quote
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt("Enter link URL");
                  if (url) {
                    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                  }
                }}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                Link
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().unsetLink().run()}
                className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white"
              >
                Unlink
              </button>
              <label className="cursor-pointer rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white">
                Insert Image
                <input type="file" accept="image/*" className="hidden" onChange={handleEmbedImage} />
              </label>
            </div>
            <EditorContent editor={editor} className="mt-4" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-6">
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="scheduled">Scheduled</option>
            </select>
            {status === "scheduled" && (
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(event) => setScheduledFor(event.target.value)}
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
              />
            )}
            <label className="mt-4 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-300">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) => setFeatured(event.target.checked)}
                className="h-4 w-4 rounded border border-white/20 bg-white/5 text-neo-blue"
              />
              Feature in homepage drop
            </label>
          </div>
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
