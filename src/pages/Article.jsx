import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { basePosts } from "../data/mockPosts.js";
import { mergePosts } from "../utils/posts.js";
import { loadDeletedIds, loadPosts } from "../utils/storage.js";

const Article = () => {
  const { id } = useParams();
  const posts = useMemo(() => {
    const stored = loadPosts();
    const deleted = loadDeletedIds();
    return mergePosts(basePosts, stored, deleted);
  }, []);
  const article = posts.find((post) => post.id === id) || posts[0];

  if (!article) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-20">
        <p className="text-slate-300">No article found.</p>
      </main>
    );
  }

  const related = posts.filter((post) => post.id !== article.id).slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-16">
      <div className="glass overflow-hidden rounded-3xl">
        <img src={article.image} alt={article.title} className="h-72 w-full object-cover" />
        <div className="space-y-6 p-8">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-slate-400">
            <span>{article.category}</span>
            <span>{article.date}</span>
          </div>
          <h1 className="text-4xl font-semibold leading-tight">{article.title}</h1>
          <p className="text-base text-slate-300">{article.excerpt}</p>
          <div className="rich-text space-y-4" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>

      <section className="mt-10 grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">About the Author</p>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neo-purple/20 text-lg font-semibold">
              {article.author?.charAt(0) ?? "N"}
            </div>
            <div>
              <p className="text-lg font-semibold">{article.author || "NeoPress Staff"}</p>
              <p className="text-sm text-slate-400">
                Covering anime worlds, gaming worlds, and everything between.
              </p>
            </div>
          </div>
        </div>
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-neo-purple/70">Comments</p>
          <p className="mt-4 text-sm text-slate-300">
            Comments are launching soon. Stay tuned for the next-gen community feed.
          </p>
        </div>
      </section>

      <section className="mt-12">
        <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Related Articles</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {related.map((post) => (
            <Link key={post.id} to={`/article/${post.id}`} className="glass rounded-2xl p-4">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{post.category}</p>
              <h3 className="mt-2 text-lg font-semibold">{post.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{post.date}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Article;
