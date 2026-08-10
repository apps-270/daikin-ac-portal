// components/Breadcrumb.jsx
import { Link, useLocation } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";

export default function Breadcrumb({ darkMode }) {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <Link to="/" className="text-slate-500 hover:text-blue-500">Home</Link>
      {paths.map((path, index) => (
        <div key={index} className="flex items-center gap-2">
          <FaChevronRight className="text-slate-400 text-xs" />
          <span className="text-slate-700 dark:text-slate-300">
            {path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ')}
          </span>
        </div>
      ))}
    </div>
  );
}