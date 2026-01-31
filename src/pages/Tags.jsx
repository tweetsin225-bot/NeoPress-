import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ArticleCard from "../components/ArticleCard.jsx";
import { basePosts } from "../data/mockPosts.js";
import { getVisiblePosts, mergePosts } from "../utils/posts.js";
import { loadDeletedIds, loadPosts } from "../utils/storage.js";
import { getAllTags } from "../utils/taxonomy.js";

const Tags = () => {
  const { tag } = useParams();
  const decodedTag = tag ? decodeURIComponent(tag) : "";

  const posts = useMemo(() => {
    const stored = loadPosts();
    const deleted = loadDeletedIds();
    return getVisiblePosts(mergePosts(basePosts, stored, deleted));
  }, []);

  const tags = getAllTags(posts);
  const filteredPosts = decodedTag
    ? posts.filter((post) => (post.tags || []).some((entry) => entry === decodedTag))
    : posts;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neo-purple/70">Tags</p>
          <h1 className="mt-2 text-3xl font-semibold">Browse by tag</h1>
        </div>
        {decodedTag && (
          <Link
            to="/tags"
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200"
          >
            Clear filter
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((entry) => (
          <Link
            key={entry}
            to={`/tags/${encodeURIComponent(entry)}`}
            className={`rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] transition ${
              entry === decodedTag
                ? "border-neo-purple/70 bg-neo-purple/20 text-neo-purple"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-neo-purple/40"
            }`}
          >
            {entry}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filteredPosts.length === 0 ? (
          <div className="glass rounded-3xl p-6 text-sm text-slate-300">No articles match this tag.</div>
        ) : (
          filteredPosts.map((post) => <ArticleCard key={post.id} article={post} variant="compact" />)
        )}
      </div>
    </main>
  );
};

export default Tags;
