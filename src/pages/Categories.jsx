import React, { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import ArticleCard from "../components/ArticleCard.jsx";
import { basePosts } from "../data/mockPosts.js";
import { getVisiblePosts, mergePosts } from "../utils/posts.js";
import { loadDeletedIds, loadPosts } from "../utils/storage.js";
import { getAllCategories } from "../utils/taxonomy.js";

const Categories = () => {
  const { category } = useParams();
  const decodedCategory = category ? decodeURIComponent(category) : "";

  const posts = useMemo(() => {
    const stored = loadPosts();
    const deleted = loadDeletedIds();
    return getVisiblePosts(mergePosts(basePosts, stored, deleted));
  }, []);

  const categories = getAllCategories(posts);
  const filteredPosts = decodedCategory
    ? posts.filter((post) => post.category === decodedCategory)
    : posts;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Categories</p>
          <h1 className="mt-2 text-3xl font-semibold">Explore article sections</h1>
        </div>
        {decodedCategory && (
          <Link
            to="/categories"
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200"
          >
            Clear filter
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((entry) => (
          <Link
            key={entry}
            to={`/categories/${encodeURIComponent(entry)}`}
            className={`rounded-full border px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] transition ${
              entry === decodedCategory
                ? "border-neo-blue/70 bg-neo-blue/20 text-neo-blue"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-neo-blue/40"
            }`}
          >
            {entry}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {filteredPosts.length === 0 ? (
          <div className="glass rounded-3xl p-6 text-sm text-slate-300">
            No articles match this category.
          </div>
        ) : (
          filteredPosts.map((post) => <ArticleCard key={post.id} article={post} variant="compact" />)
        )}
      </div>
    </main>
  );
};

export default Categories;
