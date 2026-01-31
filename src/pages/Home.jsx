import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel.jsx";
import AdPlaceholder from "../components/AdPlaceholder.jsx";
import ArticleCard from "../components/ArticleCard.jsx";
import { basePosts, heroSlides } from "../data/mockPosts.js";
import { getVisiblePosts, mergePosts } from "../utils/posts.js";
import { loadDeletedIds, loadPosts } from "../utils/storage.js";
import { getAllTags, groupPostsByCategory } from "../utils/taxonomy.js";

const Home = () => {
  const posts = useMemo(() => {
    const stored = loadPosts();
    const deleted = loadDeletedIds();
    return getVisiblePosts(mergePosts(basePosts, stored, deleted));
  }, []);

  const latestPosts = posts.slice(0, 4);
  const categoryGroups = groupPostsByCategory(posts).slice(0, 4);
  const trendingTags = getAllTags(posts).slice(0, 10);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10">
      <section className="grid gap-8 lg:grid-cols-[2.2fr_1fr]">
        <HeroCarousel slides={heroSlides} />
        <div className="flex flex-col gap-6">
          <div className="glass rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Daily Brief</p>
            <h2 className="mt-4 text-2xl font-semibold">Today in Neo-Tokyo</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>• Cyber Gacha Festival reveals 12 new co-op raids.</li>
              <li>• Studio PixelForge teases a surprise winter OVA.</li>
              <li>• VR Arena League sets record-breaking viewership.</li>
            </ul>
          </div>
          <div className="glass rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-neo-purple/70">Trending Tags</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <Link
                  key={tag}
                  to={`/tags/${encodeURIComponent(tag)}`}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-300"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Latest Dispatches</p>
            <h2 className="mt-2 text-3xl font-semibold">Fresh stories from the grid</h2>
          </div>
          <Link
            to="/categories"
            className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200"
          >
            Browse Sections
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {latestPosts.map((post) => (
            <ArticleCard key={post.id} article={post} variant="compact" />
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[3fr_1fr]">
        <div className="space-y-10">
          {categoryGroups.map((group) => (
            <div key={group.category} className="glass rounded-3xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Article Section</p>
                  <h3 className="mt-2 text-2xl font-semibold">{group.category}</h3>
                </div>
                <Link
                  to={`/categories/${encodeURIComponent(group.category)}`}
                  className="text-xs uppercase tracking-[0.3em] text-neo-blue"
                >
                  View all
                </Link>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {group.posts.slice(0, 3).map((post) => (
                  <ArticleCard key={post.id} article={post} variant="compact" />
                ))}
              </div>
            </div>
          ))}
        </div>
        <aside className="flex flex-col gap-6">
          <AdPlaceholder label="Rectangle" size="300x250" />
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
          <div className="glass rounded-3xl p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-neo-purple/70">Editor Picks</p>
            <p className="mt-4 text-sm text-slate-300">
              Deep dives, lore maps, and the interviews that make NeoPress a classic.
            </p>
            <Link
              to="/categories"
              className="mt-4 inline-flex rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-200"
            >
              Explore the archive
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
};

export default Home;
