// // components/Pagination.jsx
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// export default function Pagination({ currentPage, totalPages, onPageChange, darkMode }) {
//   return (
//     <div className="flex items-center justify-center gap-2 mt-6">
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} disabled:opacity-50`}
//       >
//         <FaChevronLeft className="text-sm" />
//       </button>
//       {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//         <button
//           key={page}
//           onClick={() => onPageChange(page)}
//           className={`px-3 py-1 rounded-lg transition-all ${
//             currentPage === page
//               ? 'bg-blue-500 text-white'
//               : darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
//           }`}
//         >
//           {page}
//         </button>
//       ))}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} disabled:opacity-50`}
//       >
//         <FaChevronRight className="text-sm" />
//       </button>
//     </div>
//   );
// }