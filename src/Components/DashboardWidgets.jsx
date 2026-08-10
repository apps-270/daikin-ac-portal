// // components/DashboardWidgets.jsx
// import { FaUsers, FaBuilding, FaChartLine, FaClock } from "react-icons/fa";

// export default function DashboardWidgets({ darkMode }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//       <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-slate-500">Total Buildings</p>
//             <p className="text-2xl font-bold text-black dark:text-white">24</p>
//             <p className="text-xs text-emerald-500">↑ 12% this month</p>
//           </div>
//           <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
//             <FaBuilding className="text-blue-600 dark:text-blue-400" />
//           </div>
//         </div>
//       </div>
      
//       <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-slate-500">Active Users</p>
//             <p className="text-2xl font-bold text-black dark:text-white">156</p>
//             <p className="text-xs text-emerald-500">↑ 8% this week</p>
//           </div>
//           <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
//             <FaUsers className="text-emerald-600 dark:text-emerald-400" />
//           </div>
//         </div>
//       </div>
      
//       <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-slate-500">Energy Savings</p>
//             <p className="text-2xl font-bold text-black dark:text-white">18.4%</p>
//             <p className="text-xs text-emerald-500">↑ 3% this month</p>
//           </div>
//           <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
//             <FaChartLine className="text-purple-600 dark:text-purple-400" />
//           </div>
//         </div>
//       </div>
      
//       <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-sm text-slate-500">Active Alerts</p>
//             <p className="text-2xl font-bold text-black dark:text-white">3</p>
//             <p className="text-xs text-amber-500">2 need attention</p>
//           </div>
//           <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
//             <FaClock className="text-amber-600 dark:text-amber-400" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }