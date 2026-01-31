import React, { useMemo } from "react";
import HeroCarousel from "../components/HeroCarousel.jsx";
import AdPlaceholder from "../components/AdPlaceholder.jsx";
import ArticleCard from "../components/ArticleCard.jsx";
import { basePosts, heroSlides } from "../data/mockPosts.js";
import { mergePosts } from "../utils/posts.js";
import { loadDeletedIds, loadPosts } from "../utils/storage.js";

const Home = () => {
  const posts = useMemo(() => {
    const stored = loadPosts();
    const deleted = loadDeletedIds();
    return mergePosts(basePosts, stored, deleted);
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10">
      <section className="grid gap-8 lg:grid-cols-[2.2fr_1fr]">
        <HeroCarousel slides={heroSlides} />
        <div className="flex flex-col gap-6">
          <AdPlaceholder label="Leaderboard" size="728x90" />
          <div className="glass rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">
              Quick Pulse
            </p>
            <h2 className="mt-4 text-2xl font-semibold">
              Today in Neo-Tokyo
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Cyber Gacha Festival reveals 12 new co-op raids.</li>
              <li>• Studio PixelForge teases a surprise winter OVA.</li>
              <li>• VR Arena League sets record-breaking viewership.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[3fr_1fr]">
        <div className="bento-grid">
          {posts.map((post, index) => {
            const variant = index % 5 === 0 ? "wide" : index % 4 === 0 ? "tall" : "default";
            return <ArticleCard key={post.id} article={post} variant={variant} />;
          })}
        </div>
        <aside className="flex flex-col gap-6">
          <AdPlaceholder label="Rectangle" size="300x250" />
          <div className="glass rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-neo-purple/70">Trending Tags</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["RPG", "Shonen", "Tech", "Indie", "MMO", "Cosplay"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="glass rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Newsletter</p>
            <p className="mt-4 text-sm text-slate-300">
              Get weekly drops of the hottest anime & gaming stories.
            </p>
            <input
              type="email"
              placeholder="you@neopress.io"
              className="mt-4 w-full rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-slate-500"
            />
            <button
              type="button"
              className="mt-3 w-full rounded-full bg-neo-blue px-4 py-2 text-xs uppercase tracking-[0.3em] text-neo-black"
            >
              Subscribe
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Home;
