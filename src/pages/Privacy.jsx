import React from "react";

const Privacy = () => {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <div className="glass rounded-3xl p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-neo-blue/70">Privacy Policy</p>
        <h1 className="mt-4 text-3xl font-semibold">Your Data, Your Control</h1>
        <p className="mt-4 text-sm text-slate-300">
          NeoPress collects minimal data to keep the experience fast and personalized. We only store
          your email if you opt into newsletters and never sell personal data.
        </p>
        <ul className="mt-6 list-disc space-y-3 pl-6 text-sm text-slate-300">
          <li>Analytics are anonymized and used to improve content recommendations.</li>
          <li>Cookies are used solely for session management and preferences.</li>
          <li>You can request data deletion at any time by contacting support.</li>
        </ul>
      </div>
    </main>
  );
};

export default Privacy;
