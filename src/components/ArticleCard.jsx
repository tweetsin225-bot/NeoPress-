import React from "react";
import { Link } from "react-router-dom";

const ArticleCard = ({ article, variant = "default" }) => {
  const isCompact = variant === "compact";
  return (
    <article
      className={`glass group flex h-full flex-col gap-4 rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glow ${
        variant === "wide"
          ? "bento-card--wide"
          : variant === "tall"
          ? "bento-card--tall"
          : variant === "compact"
          ? ""
          : "bento-card"
      }`}
    >
      {article.image && isCompact && (
        <Link to={`/article/${article.id}`} className="overflow-hidden rounded-2xl border border-white/10">
          <img src={article.image} alt={article.title} className="h-40 w-full object-cover" />
        </Link>
      )}
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
        <Link to={`/categories/${encodeURIComponent(article.category)}`}>{article.category}</Link>
        <span>{article.date}</span>
      </div>
      <Link to={`/article/${article.id}`}>
        <h3 className="text-2xl font-semibold text-white group-hover:text-neo-blue">{article.title}</h3>
      </Link>
      <p className="text-sm text-slate-300">{article.excerpt}</p>
      <div className="mt-auto flex flex-wrap gap-2">
        {(article.tags || []).map((tag) => (
          <Link
            key={tag}
            to={`/tags/${encodeURIComponent(tag)}`}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-300"
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
};

export default ArticleCard;
