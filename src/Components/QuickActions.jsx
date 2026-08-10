// import { FaPlus, FaSearch, FaFilter, FaDownload } from "react-icons/fa";

// export default function QuickActions() {
//   const actions = [
//     { label: "New Analysis", icon: FaPlus, color: "bg-blue-500" },
//     { label: "Search Records", icon: FaSearch, color: "bg-emerald-500" },
//     { label: "Apply Filter", icon: FaFilter, color: "bg-purple-500" },
//     { label: "Export Data", icon: FaDownload, color: "bg-amber-500" },
//   ];

//   return (
//     <div className="flex flex-wrap gap-2">
//       {actions.map((action) => (
//         <button
//           key={action.label}
//           className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${action.color} hover:opacity-90 transition-all text-sm`}
//         >
//           <action.icon className="text-sm" />
//           {action.label}
//         </button>
//       ))}
//     </div>
//   );
// }