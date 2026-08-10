import { useEffect, useState } from 'react';

export default function BackgroundGradient() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Animated gradient orbs */}
      <div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4), transparent)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent)',
          animation: 'floatDelay1 25s ease-in-out infinite',
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.3), transparent)',
          animation: 'floatDelay2 30s ease-in-out infinite',
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
