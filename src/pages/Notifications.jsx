// import { useState } from "react";
// import { 
//   FaBell, 
//   FaCheck, 
//   FaTrash, 
//   FaFilter, 
//   FaCheckDouble,
//   FaTimes,
//   FaStar,
//   FaClock,
//   FaUserCircle,
//   FaExclamationCircle,
//   FaChartLine,
//   FaReply,
//   FaInbox,
//   FaArchive,
//   FaSpinner,
//   FaTag,
//   FaUser,
//   FaCalendar,
//   FaSearch,
//   FaChevronLeft,
//   FaChevronRight,
//   FaPaperPlane,
//   FaArrowLeft,
//   FaEnvelope,
// } from "react-icons/fa";

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       title: "New Feedback Received",
//       message: "Customer submitted new feedback for Building A with a rating of 4.5 stars. They mentioned excellent service and quick response time.",
//       time: "2 minutes ago",
//       type: "feedback",
//       read: false,
//       priority: "high",
//       timestamp: Date.now() - 120000,
//       user: "Sarah Johnson",
//       from: "Customer Portal",
//       email: "sarah.johnson@customer.com",
//       replies: [],
//     },
//     {
//       id: 2,
//       title: "System Maintenance",
//       message: "System maintenance scheduled for tonight at 11 PM. Expected downtime: 30 minutes. Please ensure all work is saved before then.",
//       time: "1 hour ago",
//       type: "system",
//       read: false,
//       priority: "medium",
//       timestamp: Date.now() - 3600000,
//       user: "System Admin",
//       from: "System Admin",
//       email: "admin@daikin.com",
//       replies: [],
//     },
//     {
//       id: 3,
//       title: "Monthly Analytics Report",
//       message: "Your monthly analytics report for March is now available for download. Click the link below to access the detailed report.",
//       time: "3 hours ago",
//       type: "analytics",
//       read: true,
//       priority: "low",
//       timestamp: Date.now() - 10800000,
//       user: "Analytics Bot",
//       from: "Analytics Bot",
//       email: "analytics@daikin.com",
//       replies: [],
//     },
//     {
//       id: 4,
//       title: "Security Alert",
//       message: "New login detected from an unrecognized device. Please verify this activity. If this wasn't you, please change your password immediately.",
//       time: "5 hours ago",
//       type: "system",
//       read: false,
//       priority: "high",
//       timestamp: Date.now() - 18000000,
//       user: "Security System",
//       from: "Security System",
//       email: "security@daikin.com",
//       replies: [],
//     },
//     {
//       id: 5,
//       title: "New Customer Registration",
//       message: "Johnson & Sons Ltd. has registered as a new customer on the platform. Please review their details and complete the onboarding process.",
//       time: "1 day ago",
//       type: "feedback",
//       read: true,
//       priority: "medium",
//       timestamp: Date.now() - 86400000,
//       user: "Customer Portal",
//       from: "Customer Portal",
//       email: "customers@daikin.com",
//       replies: [],
//     },
//     {
//       id: 6,
//       title: "Performance Alert",
//       message: "Building A cooling system is operating at 85% efficiency. Recommended maintenance scheduled for next week. Please confirm availability.",
//       time: "2 days ago",
//       type: "analytics",
//       read: false,
//       priority: "high",
//       timestamp: Date.now() - 172800000,
//       user: "Monitoring System",
//       from: "Monitoring System",
//       email: "monitoring@daikin.com",
//       replies: [],
//     },
//   ]);

//   const [filter, setFilter] = useState("all");
//   const [selectedNotifications, setSelectedNotifications] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedNotification, setSelectedNotification] = useState(null);
//   const [replyText, setReplyText] = useState("");
//   const [showReply, setShowReply] = useState(false);
//   const [showDetailView, setShowDetailView] = useState(false);
//   const itemsPerPage = 5;

//   const getFilteredNotifications = () => {
//     let filtered = notifications;

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(n => 
//         n.title.toLowerCase().includes(term) ||
//         n.message.toLowerCase().includes(term) ||
//         n.from.toLowerCase().includes(term)
//       );
//     }

//     if (filter === "unread") {
//       filtered = filtered.filter(n => !n.read);
//     } else if (filter === "read") {
//       filtered = filtered.filter(n => n.read);
//     }

//     return filtered;
//   };

//   const filteredNotifications = getFilteredNotifications();
//   const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
//   const paginatedNotifications = filteredNotifications.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const markAsRead = (id) => {
//     setNotifications(prev =>
//       prev.map(n =>
//         n.id === id ? { ...n, read: true } : n
//       )
//     );
//   };

//   const markAsUnread = (id) => {
//     setNotifications(prev =>
//       prev.map(n =>
//         n.id === id ? { ...n, read: false } : n
//       )
//     );
//   };

//   const deleteNotification = (id) => {
//     if (window.confirm("Delete this notification?")) {
//       setNotifications(prev => prev.filter(n => n.id !== id));
//       if (selectedNotification?.id === id) {
//         setSelectedNotification(null);
//         setShowDetailView(false);
//       }
//     }
//   };

//   const markAllAsRead = () => {
//     setNotifications(prev =>
//       prev.map(n => ({ ...n, read: true }))
//     );
//   };

//   const toggleSelect = (id) => {
//     setSelectedNotifications(prev =>
//       prev.includes(id)
//         ? prev.filter(nid => nid !== id)
//         : [...prev, id]
//     );
//   };

//   const selectAll = () => {
//     if (selectedNotifications.length === paginatedNotifications.length && paginatedNotifications.length > 0) {
//       setSelectedNotifications([]);
//     } else {
//       setSelectedNotifications(paginatedNotifications.map(n => n.id));
//     }
//   };

//   const bulkDelete = () => {
//     if (window.confirm(`Delete ${selectedNotifications.length} selected notifications?`)) {
//       setNotifications(prev => 
//         prev.filter(n => !selectedNotifications.includes(n.id))
//       );
//       setSelectedNotifications([]);
//     }
//   };

//   const bulkMarkAsRead = () => {
//     setNotifications(prev =>
//       prev.map(n =>
//         selectedNotifications.includes(n.id)
//           ? { ...n, read: true }
//           : n
//       )
//     );
//     setSelectedNotifications([]);
//   };

//   const handleOpenNotification = (notification) => {
//     setSelectedNotification(notification);
//     setShowDetailView(true);
//     setShowReply(false);
//     setReplyText("");
//     if (!notification.read) {
//       markAsRead(notification.id);
//     }
//   };

//   const handleReply = () => {
//     if (!replyText.trim()) return;
    
//     const updatedNotifications = notifications.map(n =>
//       n.id === selectedNotification.id
//         ? { 
//             ...n, 
//             replies: [...(n.replies || []), {
//               id: Date.now(),
//               text: replyText,
//               time: new Date().toLocaleString(),
//               from: "You"
//             }]
//           }
//         : n
//     );
//     setNotifications(updatedNotifications);
//     setReplyText("");
//     setShowReply(false);
//     // Update selected notification
//     const updated = updatedNotifications.find(n => n.id === selectedNotification.id);
//     setSelectedNotification(updated);
//   };

//   const handleBackToList = () => {
//     setShowDetailView(false);
//     setSelectedNotification(null);
//     setShowReply(false);
//   };

//   const unreadCount = notifications.filter(n => !n.read).length;

//   const categories = [
//     { id: "all", label: "All", icon: FaInbox, count: notifications.length },
//     { id: "unread", label: "Unread", icon: FaSpinner, count: unreadCount },
//     { id: "read", label: "Read", icon: FaArchive, count: notifications.length - unreadCount },
//   ];

//   const getPriorityColor = (priority) => {
//     switch(priority) {
//       case 'high': return 'bg-red-500';
//       case 'medium': return 'bg-amber-500';
//       case 'low': return 'bg-emerald-500';
//       default: return 'bg-slate-400';
//     }
//   };

//   const getPriorityBadge = (priority) => {
//     switch(priority) {
//       case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
//       case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
//       case 'low': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
//       default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
//     }
//   };

//   // Detail View
//   if (showDetailView && selectedNotification) {
//     return (
//       <div className="max-w-6xl mx-auto space-y-6">
//         {/* Back Button */}
//         <button
//           onClick={handleBackToList}
//           className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white transition-all"
//         >
//           <FaArrowLeft className="text-sm" />
//           <span>Back to notifications</span>
//         </button>

//         {/* Notification Detail */}
//         <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
//           {/* Header */}
//           <div className="p-6 border-b border-slate-200 dark:border-slate-700">
//             <div className="flex items-start justify-between">
//               <div className="flex-1">
//                 <div className="flex items-center gap-3 mb-2">
//                   <h2 className="text-xl font-bold text-black dark:text-white">
//                     {selectedNotification.title}
//                   </h2>
//                   <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBadge(selectedNotification.priority)}`}>
//                     {selectedNotification.priority}
//                   </span>
//                   {!selectedNotification.read && (
//                     <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
//                       New
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
//                   <span className="flex items-center gap-1">
//                     <FaUser className="text-xs" />
//                     {selectedNotification.from}
//                   </span>
//                   <span>•</span>
//                   <span className="flex items-center gap-1">
//                     <FaClock className="text-xs" />
//                     {selectedNotification.time}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => {
//                     markAsUnread(selectedNotification.id);
//                     setSelectedNotification({...selectedNotification, read: false});
//                   }}
//                   className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-500 hover:text-amber-600"
//                   title="Mark as unread"
//                 >
//                   <FaClock className="text-sm" />
//                 </button>
//                 <button
//                   onClick={() => deleteNotification(selectedNotification.id)}
//                   className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-slate-500 hover:text-red-600"
//                   title="Delete"
//                 >
//                   <FaTrash className="text-sm" />
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Body */}
//           <div className="p-6">
//             <div className="prose dark:prose-invert max-w-none">
//               <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
//                 {selectedNotification.message}
//               </p>
//             </div>

//             {/* Replies */}
//             {selectedNotification.replies && selectedNotification.replies.length > 0 && (
//               <div className="mt-6 space-y-3">
//                 <h4 className="text-sm font-semibold text-black dark:text-white">Replies</h4>
//                 {selectedNotification.replies.map((reply) => (
//                   <div key={reply.id} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
//                     <div className="flex items-center justify-between mb-1">
//                       <span className="text-sm font-medium text-black dark:text-white">{reply.from}</span>
//                       <span className="text-xs text-slate-500 dark:text-slate-400">{reply.time}</span>
//                     </div>
//                     <p className="text-sm text-slate-700 dark:text-slate-300">{reply.text}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Reply Section */}
//           <div className="p-6 border-t border-slate-200 dark:border-slate-700">
//             {!showReply ? (
//               <button
//                 onClick={() => setShowReply(true)}
//                 className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all shadow-lg shadow-blue-500/25"
//               >
//                 <FaReply className="text-sm" />
//                 Reply
//               </button>
//             ) : (
//               <div className="space-y-3">
//                 <textarea
//                   value={replyText}
//                   onChange={(e) => setReplyText(e.target.value)}
//                   placeholder="Write your reply..."
//                   className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
//                   rows="3"
//                 />
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={handleReply}
//                     disabled={!replyText.trim()}
//                     className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <FaPaperPlane className="text-sm" />
//                     Send Reply
//                   </button>
//                   <button
//                     onClick={() => {
//                       setShowReply(false);
//                       setReplyText("");
//                     }}
//                     className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // List View
//   return (
//     <div className="max-w-7xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
//             <FaBell className="text-xl" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-black dark:text-white">
//               Notifications
//             </h1>
//             <p className="text-sm text-slate-600 dark:text-slate-400">
//               Stay updated with your latest activities
//             </p>
//           </div>
//           {unreadCount > 0 && (
//             <span className="px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-full animate-pulse">
//               {unreadCount} new
//             </span>
//           )}
//         </div>
        
//         <div className="flex items-center gap-2 flex-wrap">
//           <div className="relative">
//             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
//             <input
//               type="text"
//               placeholder="Search notifications..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-48 md:w-64 px-4 py-2 pl-9 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500 dark:placeholder:text-slate-400"
//             />
//           </div>

//           <button
//             onClick={markAllAsRead}
//             className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
//           >
//             <FaCheckDouble className="text-sm" />
//             <span className="hidden sm:inline">Mark all read</span>
//           </button>
//         </div>
//       </div>

//       {/* Category Tabs */}
//       <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
//         {categories.map((cat) => {
//           const Icon = cat.icon;
//           const isActive = filter === cat.id;
//           return (
//             <button
//               key={cat.id}
//               onClick={() => {
//                 setFilter(cat.id);
//                 setCurrentPage(1);
//               }}
//               className={`
//                 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
//                 ${isActive 
//                   ? "bg-white dark:bg-slate-700 text-black dark:text-white shadow-md" 
//                   : "text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
//                 }
//               `}
//             >
//               <Icon className={`text-base ${isActive ? 'text-blue-500 dark:text-blue-400' : ''}`} />
//               <span>{cat.label}</span>
//               {cat.count > 0 && (
//                 <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
//                   {cat.count}
//                 </span>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* Bulk Actions */}
//       {selectedNotifications.length > 0 && (
//         <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-between animate-fadeIn">
//           <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
//             {selectedNotifications.length} selected
//           </span>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={bulkMarkAsRead}
//               className="px-3 py-1.5 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center gap-1"
//             >
//               <FaCheck className="text-xs" />
//               Mark read
//             </button>
//             <button
//               onClick={bulkDelete}
//               className="px-3 py-1.5 text-sm rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all flex items-center gap-1"
//             >
//               <FaTrash className="text-xs" />
//               Delete
//             </button>
//             <button
//               onClick={() => setSelectedNotifications([])}
//               className="px-3 py-1.5 text-sm rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-black dark:text-white"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Notifications List */}
//       <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
//         {paginatedNotifications.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-16 text-center">
//             <div className="text-6xl mb-4">📭</div>
//             <h3 className="text-xl font-semibold text-black dark:text-white mb-1">
//               No notifications found
//             </h3>
//             <p className="text-sm text-slate-600 dark:text-slate-400">
//               {searchTerm ? "Try adjusting your search" : "You're all caught up!"}
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-slate-50 dark:bg-slate-900/50">
//                   <tr>
//                     <th className="px-4 py-3 w-10">
//                       <input
//                         type="checkbox"
//                         checked={selectedNotifications.length === paginatedNotifications.length && paginatedNotifications.length > 0}
//                         onChange={selectAll}
//                         className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                       />
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
//                       From
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
//                       Notification
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider hidden md:table-cell">
//                       Priority
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
//                       Time
//                     </th>
//                     <th className="px-4 py-3 text-center text-xs font-medium text-black dark:text-white uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
//                   {paginatedNotifications.map((notification) => (
//                     <tr 
//                       key={notification.id}
//                       className={`
//                         hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer
//                         ${!notification.read ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}
//                       `}
//                       onClick={() => handleOpenNotification(notification)}
//                     >
//                       <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
//                         <input
//                           type="checkbox"
//                           checked={selectedNotifications.includes(notification.id)}
//                           onChange={() => toggleSelect(notification.id)}
//                           className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
//                         />
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-medium">
//                             {notification.from.charAt(0).toUpperCase()}
//                           </div>
//                           <span className={`text-sm font-medium ${!notification.read ? 'text-black dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
//                             {notification.from}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div>
//                           <p className={`text-sm font-medium ${!notification.read ? 'text-black dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
//                             {notification.title}
//                           </p>
//                           <p className="text-xs text-slate-500 dark:text-slate-500 truncate max-w-xs">
//                             {notification.message}
//                           </p>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 hidden md:table-cell">
//                         <div className="flex items-center gap-2">
//                           <span className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} />
//                           <span className={`text-xs capitalize ${!notification.read ? 'text-black dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
//                             {notification.priority}
//                           </span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
//                           {notification.time}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
//                         <div className="flex items-center justify-center gap-1">
//                           {!notification.read ? (
//                             <button
//                               onClick={() => markAsRead(notification.id)}
//                               className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600 transition-all"
//                               title="Mark as read"
//                             >
//                               <FaCheck className="text-xs" />
//                             </button>
//                           ) : (
//                             <button
//                               onClick={() => markAsUnread(notification.id)}
//                               className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-600 transition-all"
//                               title="Mark as unread"
//                             >
//                               <FaClock className="text-xs" />
//                             </button>
//                           )}
//                           <button
//                             onClick={() => deleteNotification(notification.id)}
//                             className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 transition-all"
//                             title="Delete"
//                           >
//                             <FaTrash className="text-xs" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
//                 <span className="text-sm text-slate-600 dark:text-slate-400">
//                   Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredNotifications.length)} of {filteredNotifications.length}
//                 </span>
//                 <div className="flex items-center gap-2">
//                   <button
//                     onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//                     disabled={currentPage === 1}
//                     className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <FaChevronLeft className="text-sm" />
//                   </button>
//                   <span className="text-sm text-slate-600 dark:text-slate-400">
//                     {currentPage} / {totalPages}
//                   </span>
//                   <button
//                     onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//                     disabled={currentPage === totalPages}
//                     className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     <FaChevronRight className="text-sm" />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}
//       </div>

//       {/* Stats */}
//       {notifications.length > 0 && (
//         <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
//           <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
//             <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
//               <span>Total: <span className="font-medium text-black dark:text-white">{notifications.length}</span></span>
//               <span className="text-slate-300 dark:text-slate-600">•</span>
//               <span>Unread: <span className="font-medium text-black dark:text-white">{unreadCount}</span></span>
//               <span className="text-slate-300 dark:text-slate-600">•</span>
//               <span>Read: <span className="font-medium text-black dark:text-white">{notifications.length - unreadCount}</span></span>
//             </div>
//             <div className="flex items-center gap-3 text-xs">
//               <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
//                 <span className="w-2 h-2 rounded-full bg-red-500"></span>
//                 High
//               </span>
//               <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
//                 <span className="w-2 h-2 rounded-full bg-amber-500"></span>
//                 Medium
//               </span>
//               <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
//                 <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
//                 Low
//               </span>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }