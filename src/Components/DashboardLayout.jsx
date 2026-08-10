// src/components/DashboardLayout.jsx
import Header from "../pages/Header";
import Navbar from "../pages/Navbar";

export default function DashboardLayout({ 
  children, 
  user, 
  setUser, 
  darkMode, 
  setDarkMode,
  sidebarOpen,
  setSidebarOpen 
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Navbar - Fixed on left */}
      <Navbar 
        user={user} 
        setUser={setUser} 
        darkMode={darkMode} 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Main Content Area - No margin, content flows naturally */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header 
          user={user} 
          setUser={setUser} 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto py-4 md:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import { useState, useEffect } from "react";

// export default function DashboardLayout({
//   user,
//   setUser,
//   children,
//   darkMode,
//   setDarkMode,
//   sidebarOpen,
//   setSidebarOpen,
// }) {
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <div className="relative flex min-h-screen">
//       {/* Sidebar - Fixed position */}
//       <Sidebar
//         user={user}
//         darkMode={darkMode}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />

//       {/* Main Content - Shifts right when sidebar is open */}
//       <div
//         className={`
//           flex-1 transition-all duration-300 ease-in-out
//           ${sidebarOpen ? "lg:ml-[280px] ml-0" : "ml-0"}
//         `}
//       >
//         <div
//           className={`
//             sticky top-0 z-30 transition-all duration-300
//             ${scrolled
//               ? darkMode
//                 ? "bg-[#0a1628]/90 border-b border-slate-800/50 backdrop-blur-md"
//                 : "bg-white/90 border-b border-slate-200/50 backdrop-blur-md"
//               : darkMode
//                 ? "bg-[#0a1628]"
//                 : "bg-transparent"
//             }
//           `}
//         >
//           <Header
//             user={user}
//             setUser={setUser}
//             darkMode={darkMode}
//             setDarkMode={setDarkMode}
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//           />
//         </div>

//         <main className={`p-4 md:p-6 ${darkMode ? 'bg-[#0a1628]' : 'bg-slate-50'}`}>
//           <div className="max-w-7xl mx-auto">
//             {children}
//           </div>
//         </main>

//         <footer
//           className={`
//             px-4 md:px-8 py-4 border-t transition-colors duration-300
//             ${darkMode
//               ? "border-slate-800/50 text-slate-400 bg-[#0a1628]"
//               : "border-slate-200/50 text-slate-500 bg-white"
//             }
//           `}
//         >
//           <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs md:text-sm">
//             <span>© 2026 Daikin. All rights reserved.</span>
//             <div className="flex items-center gap-4">
//               <span>Made with ❤️</span>
//               <span
//                 className={`
//                   w-1 h-1 rounded-full
//                   ${darkMode ? "bg-slate-700" : "bg-slate-300"}
//                 `}
//               />
//               <span 
//                 className={darkMode ? "text-[#0097E0]" : "text-[#0097E0]"}
//               >
//                 v1.0.1
//               </span>
//             </div>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }
