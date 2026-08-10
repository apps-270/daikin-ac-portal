import { FaBars } from "react-icons/fa";
import { useState } from "react";
import LogoutModal from "../pages/LogoutModal";

export default function Header({
  user,
  setUser,
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("currentUser");
    setShowLogoutModal(false);
    setUser(null);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        darkMode={darkMode}
      />
      <header className={`
      sticky top-0 z-30 px-4 py-3 border-b transition-all duration-300
      ${darkMode 
        ? "bg-[#0a1628]/90 border-slate-800/50 backdrop-blur-md" 
        : "bg-white/90 border-slate-200/50 backdrop-blur-md"
      }
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`
              p-2 rounded-lg transition-all duration-300
              ${darkMode 
                ? "hover:bg-slate-800 text-slate-400 hover:text-white" 
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
              }
            `}
          >
            <FaBars className="text-lg" />
          </button>
          
          {/* Daikin Logo Image - Horizontally Bigger
            <img 
              src="https://i.pinimg.com/736x/f3/56/6b/f3566bd77081fb3ecde14d184eb791e5.jpg"
              alt="Daikin Logo"
              className="h-14 w-auto max-w-[200px] object-contain rounded-lg" // Added rounded-lg
            /> */}
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-full
              transition-all duration-300 ease-in-out font-medium text-sm
              ${darkMode 
                ? "bg-slate-800/80 text-slate-100 border border-slate-700/50 hover:bg-slate-700/80" 
                : "bg-white/80 text-slate-900 border border-slate-200/50 hover:bg-slate-50/80"
              }
              hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097E0]
              backdrop-blur-sm
            `}
            aria-label="Toggle theme"
          >
            <span className="text-base md:text-lg transition-transform duration-500">
              {darkMode ? "🌙" : "☀️"}
            </span>
            <span className="font-medium hidden sm:inline">
              {darkMode ? "Dark" : "Light"}
            </span>
            <span
              className={`
                relative inline-flex items-center w-12 h-6 rounded-full 
                transition-all duration-300 flex-shrink-0
                ${darkMode
                  ? "bg-[#0097E0] shadow-lg shadow-[#0097E0]/25"
                  : "bg-slate-300 shadow-inner"
                }
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md
                  transform transition-all duration-300 ease-in-out flex items-center justify-center
                  ${darkMode ? "translate-x-6" : "translate-x-0"}
                `}
              >
                <span className={`text-[10px] font-bold ${darkMode ? "text-[#0097E0]" : "text-slate-400"}`}>
                  {darkMode ? "✓" : "✕"}
                </span>
              </span>
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-sm text-white transition-all duration-200 bg-[#0097E0] hover:bg-[#0077B3]"
          >
            Logout
          </button>
        </div>
      </div>
      </header>
    </>
  );
}// import { FaBars, FaSun, FaMoon } from "react-icons/fa";

// export default function Header({
//   user,
//   setUser,
//   darkMode,
//   setDarkMode,
//   sidebarOpen,
//   setSidebarOpen,
// }) {
//   // Get user role display name
//   const getRoleDisplay = (role) => {
//     if (!role) return "Employee";
//     const roleMap = {
//       admin: "Admin",
//       administrator: "Admin",
//       manager: "Manager",
//       employee: "Employee",
//       analyst: "Energy Analyst",
//       engineer: "Engineer",
//       technician: "Technician",
//     };
//     return roleMap[role.toLowerCase()] || role;
//   };

//   return (
//     <header className={`
//       sticky top-0 z-30 px-4 py-3 border-b transition-all duration-300
//       ${darkMode 
//         ? "bg-[#0a1628]/90 border-slate-800/50 backdrop-blur-md" 
//         : "bg-white/90 border-slate-200/50 backdrop-blur-md"
//       }
//     `}>
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className={`
//               p-2 rounded-lg transition-all duration-300
//               ${darkMode 
//                 ? "hover:bg-slate-800 text-slate-400 hover:text-white" 
//                 : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
//               }
//             `}
//           >
//             <FaBars className="text-lg" />
//           </button>
//           <h1 className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
//             ⚡ AI Energy Simulator
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* Modern Dark/Light Mode Toggle Button - Daikin Blue Theme */}
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className={`
//               relative flex items-center gap-2 px-4 py-2 rounded-full
//               transition-all duration-300 ease-in-out font-medium text-sm
//               ${darkMode 
//                 ? "bg-slate-800/80 text-slate-100 border border-slate-700/50 hover:bg-slate-700/80" 
//                 : "bg-white/80 text-slate-900 border border-slate-200/50 hover:bg-slate-50/80"
//               }
//               hover:scale-105 hover:shadow-xl
//               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097E0]
//               backdrop-blur-sm
//             `}
//             aria-label="Toggle theme"
//           >
//             <span className="text-base md:text-lg transition-transform duration-500">
//               {darkMode ? "🌙" : "☀️"}
//             </span>
//             <span className="font-medium hidden sm:inline">
//               {darkMode ? "Dark" : "Light"}
//             </span>
//             <span
//               className={`
//                 relative inline-flex items-center w-12 h-6 rounded-full 
//                 transition-all duration-300 flex-shrink-0
//                 ${darkMode
//                   ? "bg-[#0097E0] shadow-lg shadow-[#0097E0]/25"
//                   : "bg-slate-300 shadow-inner"
//                 }
//               `}
//             >
//               <span
//                 className={`
//                   absolute top-0.5 left-0.5
//                   w-5 h-5 rounded-full bg-white shadow-md
//                   transform transition-all duration-300 ease-in-out
//                   flex items-center justify-center
//                   ${darkMode ? "translate-x-6" : "translate-x-0"}
//                 `}
//               >
//                 <span className={`text-[10px] font-bold ${darkMode ? "text-[#0097E0]" : "text-slate-400"}`}>
//                   {darkMode ? "✓" : "✕"}
//                 </span>
//               </span>
//             </span>
//           </button>

//           <div className="flex flex-col items-end">
//             <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-900"}`}>
//               {user?.name || "User"}
//             </span>
//             <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
//               {getRoleDisplay(user?.role)}
//             </span>
//           </div>

//           <button
//             onClick={() => {
//               localStorage.removeItem("currentUser");
//               window.location.reload();
//             }}
//             className={`
//               px-3 py-1.5 rounded-lg text-sm transition-all duration-200
//               ${darkMode 
//                 ? "bg-[#0097E0] text-white hover:bg-[#0077B3]" 
//                 : "bg-[#0097E0] text-white hover:bg-[#0077B3]"
//               }
//             `}
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }
