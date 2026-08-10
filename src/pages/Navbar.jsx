// src/pages/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaBuilding,
  FaHistory,
  FaUser,
  FaTimes,
  FaSignOutAlt,
  FaCircle,
  FaBars,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdHistory } from "react-icons/md";

export default function Navbar({ user, setUser, darkMode, sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
      isActive
        ? "bg-[#0097E0] text-white shadow-lg shadow-[#0097E0]/25"
        : darkMode
        ? "text-slate-300 hover:bg-slate-800/50 hover:text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const iconClass = ({ isActive }) =>
    `text-base transition-all duration-200 ${
      isActive
        ? "text-white"
        : darkMode
        ? "text-slate-400 group-hover:text-white"
        : "text-slate-400 group-hover:text-slate-700"
    }`;

  const NavItem = ({ to, icon: Icon, children, end }) => (
    <NavLink
      to={to}
      end={end}
      className={linkClass}
      onClick={() => {
        // Close sidebar on mobile
        if (window.innerWidth < 1024) {
          setSidebarOpen(false);
        }
      }}
    >
      {({ isActive }) => (
        <>
          <Icon className={iconClass({ isActive })} />
          <span className="flex-1 text-sm">{children}</span>
          {isActive && (
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </>
      )}
    </NavLink>
  );

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    // Close sidebar on mobile when logout is clicked
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    navigate("/login");
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={cancelLogout} 
          />
          <div className={`
            relative w-full max-w-sm rounded-2xl shadow-2xl p-6
            ${darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"}
            animate-scaleIn
          `}>
            <div className="flex justify-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${darkMode ? "bg-red-500/20" : "bg-red-50"}`}>
                <FaExclamationTriangle className={`text-3xl ${darkMode ? "text-red-400" : "text-red-500"}`} />
              </div>
            </div>
            <h3 className={`text-lg font-semibold text-center mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
              Confirm Logout
            </h3>
            <p className={`text-sm text-center mb-6 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Are you sure you want to logout? You will need to login again to access your account.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={cancelLogout} 
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-all ${darkMode ? "bg-slate-700 text-slate-300 hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout} 
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Mobile Menu Button - Always visible on mobile */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`
          fixed top-4 left-4 z-40 lg:hidden
          p-2.5 rounded-xl transition-all duration-300
          ${darkMode ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white text-slate-900 hover:bg-slate-100"}
          shadow-lg border ${darkMode ? "border-slate-700" : "border-slate-200"}
        `}
        aria-label="Open sidebar"
      >
        <FaBars className="text-lg" />
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-[280px] z-50
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${darkMode ? "bg-[#0a1628] border-r border-slate-700/50" : "bg-white border-r border-slate-200"}
        flex flex-col shadow-2xl
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <img 
                src="https://i.pinimg.com/1200x/46/81/2a/46812a48e4f995aa032077ff57a9b985.jpg"
                alt="Daikin Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span class="text-[#0097E0] text-sm font-bold">DAIKIN</span>`;
                }}
              />
            </div>
            <div>
              <h2 className={`font-semibold text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>
                AI Energy Simulator
              </h2>
              <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Daikin Smart Solutions
              </p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className={`
              p-1.5 rounded-lg transition-all duration-200
              ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"}
            `}
            aria-label="Close sidebar"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-0.5">
            <NavItem to="/building-analysis" icon={FaBuilding} end>
              Energy Analysis
            </NavItem>
            <NavItem to="/analysis-history" icon={MdHistory}>
              History
            </NavItem>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700/50" />
          <div className="space-y-0.5">
            <NavItem to="/profile" icon={FaUser}>
              User Profile
            </NavItem>
          </div>
        </div>

        {/* User Footer */}
        <div className={`border-t border-slate-200 dark:border-slate-700/50 p-3 flex-shrink-0 ${darkMode ? "bg-[#0a1628]" : "bg-white"}`}>
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm text-white bg-[#0097E0]`}>
                {user?.name?.charAt(0) || "U"}
              </div>
              <FaCircle className="absolute bottom-0 right-0 text-[#0097E0] text-[8px]" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className={`text-sm font-medium truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
                {user?.name || "User Name"}
              </p>
              <p className={`text-xs truncate ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {user?.role || "Energy Analyst"}
              </p>
            </div>
            <div 
              onClick={handleLogoutClick} 
              className={`p-1.5 rounded-lg transition-all duration-200 cursor-pointer ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"}`} 
              title="Logout"
            >
              <FaSignOutAlt className="text-sm" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
// import { NavLink, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import {
//   FaBuilding,
//   FaHistory,
//   FaUser,
//   FaTimes,
//   FaSignOutAlt,
//   FaCircle,
//   FaBars,
// } from "react-icons/fa";
// import { MdHistory } from "react-icons/md";
// import LogoutModal from "../pages/LogoutModal";

// export default function Navbar({ user, setUser, darkMode }) {
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);

//   const linkClass = ({ isActive }) =>
//     `group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
//       isActive
//         ? "bg-[#0097E0] text-white shadow-lg shadow-[#0097E0]/25"
//         : darkMode
//         ? "text-slate-300 hover:bg-slate-800/50 hover:text-white"
//         : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
//     }`;

//   const iconClass = ({ isActive }) =>
//     `text-base transition-all duration-200 ${
//       isActive
//         ? "text-white"
//         : darkMode
//         ? "text-slate-400 group-hover:text-white"
//         : "text-slate-400 group-hover:text-slate-700"
//     }`;

//   const NavItem = ({ to, icon: Icon, children, end }) => (
//     <NavLink to={to} end={end} className={linkClass}>
//       {({ isActive }) => (
//         <>
//           <Icon className={iconClass({ isActive })} />
//           <span className="flex-1 text-sm">{children}</span>
//           {isActive && (
//             <span className="w-1.5 h-1.5 rounded-full bg-white" />
//           )}
//         </>
//       )}
//     </NavLink>
//   );

//   // Logout handlers
//   const handleLogoutClick = () => {
//     setShowLogoutModal(true);
//   };

//   const confirmLogout = () => {
//     localStorage.removeItem("currentUser");
//     setUser(null);
//     navigate("/login");
//     setShowLogoutModal(false);
//   };

//   const cancelLogout = () => {
//     setShowLogoutModal(false);
//   };

//   return (
//     <>
//       {/* Logout Modal */}
//       <LogoutModal
//         isOpen={showLogoutModal}
//         onClose={cancelLogout}
//         onConfirm={confirmLogout}
//         darkMode={darkMode}
//       />

//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       <button
//         onClick={() => setSidebarOpen(true)}
//         className={`
//           fixed top-4 left-4 z-40 lg:hidden
//           p-2.5 rounded-xl transition-all duration-300
//           ${darkMode 
//             ? "bg-slate-800 text-white hover:bg-slate-700" 
//             : "bg-white text-slate-900 hover:bg-slate-100"
//           }
//           shadow-lg border ${darkMode ? "border-slate-700" : "border-slate-200"}
//           ${sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
//         `}
//         aria-label="Open sidebar"
//       >
//         <FaBars className="text-lg" />
//       </button>

//       <aside
//         className={`
//           fixed top-0 left-0 h-full w-[280px] z-50
//           transition-transform duration-300 ease-in-out
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           ${darkMode 
//             ? "bg-[#0a1628] border-r border-slate-700/50" 
//             : "bg-white border-r border-slate-200"
//           }
//           flex flex-col
//           shadow-2xl
//         `}
//       >
//         {/* Header with Logo */}
//         <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
//               <img 
//                 src="https://i.pinimg.com/1200x/46/81/2a/46812a48e4f995aa032077ff57a9b985.jpg"
//                 alt="Daikin Logo"
//                 className="w-full h-full object-contain"
//                 onError={(e) => {
//                   e.target.style.display = 'none';
//                   e.target.parentElement.innerHTML = `
//                     <span class="text-[#0097E0] text-sm font-bold">DAIKIN</span>
//                   `;
//                 }}
//               />
//             </div>
//             <div>
//               <h2 className={`font-semibold text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>
//                 AI Energy Simulator
//               </h2>
//               <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
//                 Daikin Smart Solutions
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={() => setSidebarOpen(false)}
//             className={`
//               p-1.5 rounded-lg transition-all duration-200
//               lg:hidden
//               ${darkMode 
//                 ? "hover:bg-slate-800 text-slate-400 hover:text-white" 
//                 : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
//               }
//             `}
//             aria-label="Close sidebar"
//           >
//             <FaTimes size={16} />
//           </button>
//         </div>

//         {/* Scrollable Content */}
//         <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
//           <div className="space-y-0.5">
//             <NavItem to="/building-analysis" icon={FaBuilding} end>
//               Energy Analysis
//             </NavItem>
//             <NavItem to="/analysis-history" icon={MdHistory}>
//               History
//             </NavItem>
//           </div>

//           <div className="border-t border-slate-200 dark:border-slate-700/50" /> 

//           <div className="space-y-0.5">
//             <NavItem to="/profile" icon={FaUser}>
//               User Profile
//             </NavItem>
//           </div>
//         </div>

//         {/* Footer - User Profile */}
//         <div className={`
//           border-t border-slate-200 dark:border-slate-700/50 p-3 flex-shrink-0
//           ${darkMode ? "bg-[#0a1628]" : "bg-white"}
//         `}>
//           <div className="flex items-center gap-3 px-2 py-2">
//             <div className="relative">
//               <div
//                 className={`
//                   w-9 h-9 rounded-full flex items-center justify-center
//                   font-semibold text-sm text-white
//                   bg-[#0097E0]
//                 `}
//               >
//                 {user?.name?.charAt(0) || "U"}
//               </div>
//               <FaCircle className="absolute bottom-0 right-0 text-[#0097E0] text-[8px]" />
//             </div>

//             <div className="flex-1 text-left min-w-0">
//               <p className="text-sm font-medium truncate text-slate-900 dark:text-white">
//                 {user?.name || "User Name"}
//               </p>
//               <p className="text-xs truncate text-slate-500 dark:text-slate-400">
//                 {user?.role || "Energy Analyst"}
//               </p>
//             </div>

//             <div
//               className={`
//                 p-1.5 rounded-lg transition-all duration-200 cursor-pointer
//                 ${darkMode 
//                   ? "hover:bg-slate-800 text-slate-400 hover:text-white" 
//                   : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
//                 }
//               `}
//               onClick={handleLogoutClick}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                   e.preventDefault();
//                   handleLogoutClick();
//                 }
//               }}
//               title="Logout"
//             >
//               <FaSignOutAlt className="text-sm" />
//             </div>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }
