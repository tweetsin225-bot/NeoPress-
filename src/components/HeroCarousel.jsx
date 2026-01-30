import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroCarousel = ({ slides }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-hero-gradient p-8 shadow-glow">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(56,189,248,0.2),transparent_55%)]" />
      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">
            Featured Drop
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
            {activeSlide.title}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-slate-300 md:text-base">
            {activeSlide.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {activeSlide.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-neo-purple/40 bg-neo-purple/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-neo-purple"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6">
          <img
            src={activeSlide.image}
            alt={activeSlide.title}
            className="h-56 w-full rounded-xl object-cover"
          />
          <div className="mt-4">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Spotlight Author
            </p>
            <p className="text-lg font-semibold text-white">
              {activeSlide.author}
            </p>
            <p className="text-sm text-slate-400">{activeSlide.date}</p>
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-neo-blue hover:text-neo-blue"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white hover:border-neo-blue hover:text-neo-blue"
        >
          <ChevronRight size={18} />
        </button>
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex ? "w-10 bg-neo-blue" : "w-4 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
