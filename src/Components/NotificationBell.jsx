// // Add WebSocket or polling for real-time updates
// // components/NotificationBell.jsx
// import { useEffect, useState } from "react";
// import { FaBell } from "react-icons/fa";

// export default function NotificationBell() {
//   const [hasNotifications, setHasNotifications] = useState(false);
  
//   // Poll for notifications
//   useEffect(() => {
//     const interval = setInterval(() => {
//       // Check for new notifications
//       setHasNotifications(Math.random() > 0.5);
//     }, 30000);
//     return () => clearInterval(interval);
//   }, []);
  
//   return (
//     <div className="relative">
//       <FaBell className="text-xl" />
//       {hasNotifications && (
//         <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
//       )}
//     </div>
//   );
// }