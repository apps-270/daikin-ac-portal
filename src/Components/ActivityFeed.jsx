// import { FaUser, FaBuilding, FaBell, FaClock } from "react-icons/fa";

// export default function ActivityFeed() {
//   const activities = [
//     { id: 1, user: "Sarah Johnson", action: "added new feedback", time: "2 min ago", type: "feedback" },
//     { id: 2, user: "Mike Chen", action: "updated Building A settings", time: "15 min ago", type: "building" },
//     { id: 3, user: "Emma Wilson", action: "generated monthly report", time: "1 hour ago", type: "report" },
//     { id: 4, user: "John Doe", action: "completed analysis", time: "3 hours ago", type: "analysis" },
//   ];

//   const getIcon = (type) => {
//     switch(type) {
//       case 'feedback': return <FaBell className="text-blue-500" />;
//       case 'building': return <FaBuilding className="text-emerald-500" />;
//       case 'report': return <FaClock className="text-purple-500" />;
//       default: return <FaUser className="text-slate-500" />;
//     }
//   };

//   return (
//     <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4">
//       <h3 className="font-semibold text-black dark:text-white mb-4">Recent Activity</h3>
//       <div className="space-y-3">
//         {activities.map((activity) => (
//           <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
//             <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
//               {getIcon(activity.type)}
//             </div>
//             <div className="flex-1">
//               <p className="text-sm text-black dark:text-white">
//                 <span className="font-medium">{activity.user}</span> {activity.action}
//               </p>
//               <p className="text-xs text-slate-500">{activity.time}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }