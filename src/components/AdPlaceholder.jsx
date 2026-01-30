import React from "react";

const AdPlaceholder = ({ label, size }) => {
  return (
    <div className="glass flex h-full w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 p-6 text-center text-xs uppercase tracking-[0.3em] text-slate-400">
      <span>{label}</span>
      <span className="text-sm text-neo-blue">{size}</span>
    </div>
  );
};

export default AdPlaceholder;
