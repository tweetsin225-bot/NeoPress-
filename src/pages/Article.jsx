import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { basePosts } from "../data/mockPosts.js";
import { getVisiblePosts, mergePosts } from "../utils/posts.js";
import { loadDeletedIds, loadPosts } from "../utils/storage.js";

const Article = () => {
  const { id } = useParams();
  const posts = useMemo(() => {
    const stored = loadPosts();
    const deleted = loadDeletedIds();
    return getVisiblePosts(mergePosts(basePosts, stored, deleted));
  }, []);
  const article = posts.find((post) => post.id === id) || posts[0];
  const readTime = useMemo(() => {
    if (!article?.content) return "1 min read";
    const text = article.content.replace(/<[^>]*>/g, " ");
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    return `${minutes} min read`;
  }, [article]);
  const authorName = article?.author || "NeoPress Staff";
  const authorAvatar = `https://api.dicebear.com/8.x/thumbs/svg?seed=${encodeURIComponent(authorName)}`;

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
            <Link to={`/categories/${encodeURIComponent(article.category)}`}>{article.category}</Link>
            <span>{article.date}</span>
          </div>
          <p className="text-xs uppercase tracking-[0.3em] text-neo-blue/70">{readTime}</p>
          <h1 className="text-4xl font-semibold leading-tight">{article.title}</h1>
          <p className="text-base text-slate-300">{article.excerpt}</p>
          {article.tags?.length ? (
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.3em] text-neo-purple/70">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-full border border-neo-purple/40 bg-neo-purple/10 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-neo-purple"
                >
                  {tag}
                </Link>
              ))}
            </div>
          ) : null}
          <div className="rich-text space-y-4" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </div>

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

      <section className="mt-10 grid gap-6 md:grid-cols-[1.3fr_0.7fr]">
        <div className="glass rounded-3xl p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">About the Author</p>
          <div className="mt-4 flex items-center gap-4">
            <img
              src={authorAvatar}
              alt={authorName}
              className="h-14 w-14 rounded-full border border-white/10 bg-white/5"
            />
            <div>
              <p className="text-lg font-semibold">{authorName}</p>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{article.date}</p>
              <p className="mt-2 text-sm text-slate-400">
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
    </main>
  );
};

export default Article;
