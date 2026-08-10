// components/LoadingSkeleton.jsx
export default function LoadingSkeleton({ darkMode }) {
  return (
    <div className="space-y-4">
      <div className={`h-12 rounded-lg animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-24 rounded-lg animate-pulse ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
        ))}
      </div>
    </div>
  );
}