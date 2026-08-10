// src/pages/Header.jsx
import { useState } from "react";
import { FaBars, FaSun, FaMoon, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import LogoutModal from "./LogoutModal";

export default function Header({
  user,
  setUser,
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    window.location.reload();
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
        darkMode={darkMode}
      />

      <header className={`
        sticky top-0 z-30 px-4 py-3 border-b-2 transition-all duration-300
        ${darkMode 
          ? "bg-slate-900/95 border-blue-800/30" 
          : "bg-white/95 border-blue-200/50"
        }
        shadow-sm
      `}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left Section - Hamburger Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`
                p-2.5 rounded-full transition-all duration-300
                ${darkMode 
                  ? "hover:bg-slate-800 text-slate-400 hover:text-[#44C8F5]" 
                  : "hover:bg-blue-50 text-slate-600 hover:text-[#3B82F6]"
                }
                hover:scale-105
              `}
              aria-label="Toggle sidebar"
            >
              <FaBars className="text-xl" />
            </button>

            {/* User Info - Optional */}
            {user && (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${darkMode ? "bg-slate-800" : "bg-blue-100"}
                `}>
                  <FaUserCircle className={`text-lg ${darkMode ? "text-[#44C8F5]" : "text-[#3B82F6]"}`} />
                </div>
                <span className={`text-sm font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                  {user?.name || user?.email || "User"}
                </span>
              </div>
            )}
          </div>

          {/* Right Section - Theme Toggle & Logout */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-full
                transition-all duration-300 ease-in-out font-medium text-sm
                ${darkMode 
                  ? "bg-slate-800/80 text-slate-100 border-2 border-blue-800/40 hover:bg-slate-700/80" 
                  : "bg-white text-slate-900 border-2 border-blue-200/60 hover:bg-blue-50"
                }
                hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/20
              `}
              aria-label="Toggle theme"
            >
              <span className="text-lg transition-transform duration-500">
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
                    ? "bg-[#3B82F6] shadow-lg shadow-[#3B82F6]/30"
                    : "bg-slate-300 shadow-inner"
                  }
                `}
              >
                <span
                  className={`
                    absolute top-0.5 left-0.5
                    w-5 h-5 rounded-full bg-white shadow-md
                    transform transition-all duration-300 ease-in-out
                    flex items-center justify-center
                    ${darkMode ? "translate-x-6" : "translate-x-0"}
                  `}
                >
                  <span className={`text-[10px] font-bold ${darkMode ? "text-[#3B82F6]" : "text-slate-400"}`}>
                    {darkMode ? "✓" : "✕"}
                  </span>
                </span>
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full
                transition-all duration-300 font-medium text-sm
                ${darkMode
                  ? "bg-gradient-to-r from-[#3B82F6] to-[#44C8F5] text-white hover:shadow-lg hover:shadow-[#3B82F6]/30 hover:scale-105"
                  : "bg-gradient-to-r from-[#3B82F6] to-[#44C8F5] text-white hover:shadow-lg hover:shadow-[#3B82F6]/30 hover:scale-105"
                }
                shadow-md
              `}
              aria-label="Logout"
            >
              <FaSignOutAlt className="text-sm" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
// import { FaBars, FaMoon, FaSun } from "react-icons/fa";

// export default function Header({
//   user,
//   setUser,
//   darkMode,
//   setDarkMode,
//   sidebarOpen,
//   setSidebarOpen,
// }) {
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
//             Daikin Portal
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           {/* Dark Mode Toggle - Daikin Blue Theme */}
//           <button
//             onClick={() => setDarkMode(!darkMode)}
//             className={`
//               group relative flex items-center gap-2.5 px-4 md:px-5 py-2 rounded-full
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
//             <span className="text-base md:text-lg">
//               {darkMode ? "🌙" : "☀️"}
//             </span>
//             <span className="hidden sm:inline font-medium">
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
//                 <span className="text-[10px] text-[#0097E0]">{darkMode ? "✓" : "✕"}</span>
//               </span>
//             </span>
//           </button>

//           <span className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
//             Welcome, {user?.name || "User"}
//           </span>
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