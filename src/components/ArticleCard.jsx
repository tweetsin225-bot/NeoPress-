import React from "react";
import { Link } from "react-router-dom";

const ArticleCard = ({ article, variant = "default" }) => {
  return (
    <Link
      to={`/article/${article.id}`}
      className={`glass group flex h-full flex-col gap-4 rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glow ${
        variant === "wide" ? "bento-card--wide" : variant === "tall" ? "bento-card--tall" : "bento-card"
      }`}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
        <span>{article.category}</span>
        <span>{article.date}</span>
      </div>
      <h3 className="text-2xl font-semibold text-white group-hover:text-neo-blue">
        {article.title}
      </h3>
      <p className="text-sm text-slate-300">{article.excerpt}</p>
      <div className="mt-auto flex flex-wrap gap-2">
        {article.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-300"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
};

export default ArticleCard;
