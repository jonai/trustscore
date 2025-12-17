"use client";

import { useState, useEffect } from "react";

export function MetricCard({
  icon: Icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`group relative p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 
        hover:bg-white/10 hover:border-white/20 transition-all duration-500 
        hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 group-hover:from-emerald-500/30 group-hover:to-emerald-600/20 transition-colors">
          <Icon className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground truncate">{label}</p>
          <p className="text-sm font-semibold text-white truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}
