"use client";

export function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-10px",
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div
            className="w-3 h-3 rotate-45"
            style={{
              backgroundColor: [
                "#10b981",
                "#f59e0b",
                "#3b82f6",
                "#ec4899",
                "#8b5cf6",
              ][Math.floor(Math.random() * 5)],
            }}
          />
        </div>
      ))}
    </div>
  );
}
