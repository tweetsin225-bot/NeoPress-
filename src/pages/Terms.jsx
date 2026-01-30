import React from "react";

const Terms = () => {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="glass rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-neo-purple/70">Terms & Conditions</p>
        <h1 className="mt-4 text-3xl font-semibold">Respect the Feed</h1>
        <p className="mt-4 text-sm text-slate-300">
          By accessing NeoPress you agree to use the content for personal, non-commercial purposes.
          Redistribution or scraping of content is prohibited without written permission.
        </p>
        <ul className="mt-6 list-disc space-y-3 pl-6 text-sm text-slate-300">
          <li>All reviews and opinions are editorial and may change with updates.</li>
          <li>User comments will be moderated for safety and respect.</li>
          <li>NeoPress may update these terms as the platform evolves.</li>
        </ul>
      </div>
    </main>
  );
};

export default Terms;
