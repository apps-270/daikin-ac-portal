import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FaHome,
  FaChartBar,
  FaBuilding,
  FaHistory,
  FaCog,
  FaUser,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaCircle,
  FaBars,
} from "react-icons/fa";
import { MdHistory } from "react-icons/md";
import { BsPlusCircle } from "react-icons/bs";

export default function Sidebar({
  user,
  darkMode,
  sidebarOpen,
  setSidebarOpen,
}) {
  const navigate = useNavigate();
  const [mainOpen, setMainOpen] = useState(true);
  const [analysisOpen, setAnalysisOpen] = useState(true);
  const [search, setSearch] = useState("");

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
      isActive
        ? "bg-gradient-to-r from-[#3B82F6] to-[#44C8F5] text-white shadow-lg shadow-[#3B82F6]/30"
        : darkMode
        ? "text-slate-300 hover:bg-slate-800/50 hover:text-white"
        : "text-slate-600 hover:bg-blue-50 hover:text-[#3B82F6]"
    }`;

  const iconClass = ({ isActive }) =>
    `text-base transition-all duration-200 ${
      isActive
        ? "text-white"
        : darkMode
        ? "text-slate-400 group-hover:text-[#44C8F5]"
        : "text-slate-400 group-hover:text-[#3B82F6]"
    }`;

  // Close sidebar function - reusable
  const closeSidebarOnMobile = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  // Updated NavItem - closes sidebar on mobile when clicked
  const NavItem = ({ to, icon: Icon, children, end }) => (
    <NavLink to={to} end={end} className={linkClass} onClick={closeSidebarOnMobile}>
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

  const SectionTitle = ({ title, icon: Icon, open, setOpen }) => (
    <button
      onClick={() => setOpen(!open)}
      className={`
        w-full flex items-center justify-between px-2 py-1.5
        text-xs font-medium uppercase tracking-wider rounded-lg
        transition-all duration-200
        ${darkMode 
          ? "text-slate-400 hover:text-[#44C8F5] hover:bg-slate-800/30" 
          : "text-slate-500 hover:text-[#3B82F6] hover:bg-blue-50/50"
        }
      `}
    >
      <span className="flex items-center gap-2">
        {Icon && <Icon className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`} />}
        {title}
      </span>
      <span className="transition-transform duration-200">
        {open ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
      </span>
    </button>
  );

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  const handleNewSimulation = () => {
    navigate("/building-analysis");
    closeSidebarOnMobile();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeSidebarOnMobile}
        />
      )}

      <button
        onClick={() => setSidebarOpen(true)}
        className={`
          fixed top-4 left-4 z-40 lg:hidden
          p-2.5 rounded-xl transition-all duration-300
          ${darkMode 
            ? "bg-slate-800 text-white hover:bg-slate-700" 
            : "bg-white text-slate-900 hover:bg-blue-50"
          }
          shadow-lg border-2 ${darkMode ? "border-slate-700" : "border-blue-200/50"}
          ${sidebarOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
          hover:scale-105
        `}
        aria-label="Open sidebar"
      >
        <FaBars className="text-lg text-[#3B82F6] dark:text-[#44C8F5]" />
      </button>

      <aside
        className={`
          fixed top-0 left-0 h-full w-[280px] z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${darkMode 
            ? "bg-slate-900 border-r-2 border-blue-800/30" 
            : "bg-white border-r-2 border-blue-200/30"
          }
          flex flex-col
          shadow-2xl
        `}
      >
        {/* Header with Logo - No blue background */}
        <div className="flex items-center justify-between px-4 py-4 border-b-2 border-blue-200/20 dark:border-blue-800/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Daikin Logo - Bigger, no background color */}
            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">
              <img 
                src="https://i.pinimg.com/1200x/46/81/2a/46812a48e4f995aa032077ff57a9b985.jpg"
                alt="Daikin Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <span class="text-[#3B82F6] text-sm font-bold">DAIKIN</span>
                  `;
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
            onClick={closeSidebarOnMobile}
            className={`
              p-1.5 rounded-lg transition-all duration-200
              lg:hidden
              ${darkMode 
                ? "hover:bg-slate-800 text-slate-400 hover:text-white" 
                : "hover:bg-blue-50 text-slate-500 hover:text-[#3B82F6]"
              }
            `}
            aria-label="Close sidebar"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Navigation */}
          <div className="space-y-1">
            <NavItem to="/building-analysis" icon={FaBuilding} end>
              Energy Analysis
            </NavItem>
            <NavItem to="/analysis-history" icon={MdHistory}>
              History
            </NavItem>
          </div>

          <div className="border-t-2 border-blue-200/20 dark:border-blue-800/20" /> 

          {/* Settings Section */}
          <div className="space-y-1">
            <NavItem to="/profile" icon={FaUser}>
              User Profile
            </NavItem>
            <NavItem to="/settings" icon={FaCog}>
              Settings
            </NavItem>
          </div>
        </div>

        {/* Footer - User Profile */}
        <div className={`
          border-t-2 border-blue-200/20 dark:border-blue-800/20 p-3 flex-shrink-0
          ${darkMode ? "bg-slate-900" : "bg-white"}
        `}>
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="relative">
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center
                  font-semibold text-sm text-white
                  bg-gradient-to-r from-[#3B82F6] to-[#44C8F5]
                  shadow-lg shadow-[#3B82F6]/30
                `}
              >
                {user?.name?.charAt(0) || "U"}
              </div>
              <FaCircle className="absolute bottom-0 right-0 text-[#3B82F6] text-[8px]" />
            </div>

            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate text-slate-900 dark:text-white">
                {user?.name || "User Name"}
              </p>
              <p className="text-xs truncate text-slate-500 dark:text-slate-400">
                {user?.role || "Energy Analyst"}
              </p>
            </div>

            <div
              className={`
                p-1.5 rounded-lg transition-all duration-200 cursor-pointer
                ${darkMode 
                  ? "hover:bg-slate-800 text-slate-400 hover:text-[#44C8F5]" 
                  : "hover:bg-blue-50 text-slate-500 hover:text-[#3B82F6]"
                }
                hover:scale-110
              `}
              onClick={handleLogout}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLogout();
                }
              }}
              title="Logout"
            >
              <FaSignOutAlt className="text-sm" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}// import { NavLink, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import {
//   FaHome,
//   FaChartBar,
//   FaBuilding,
//   FaHistory,
//   FaCog,
//   FaUser,
//   FaTimes,
//   FaChevronDown,
//   FaChevronRight,
//   FaSearch,
//   FaBell,
//   FaSignOutAlt,
//   FaCircle,
//   FaBars,
// } from "react-icons/fa";
// import { MdHistory } from "react-icons/md";
// import { BsPlusCircle } from "react-icons/bs";

// export default function Sidebar({
//   user,
//   darkMode,
//   sidebarOpen,
//   setSidebarOpen,
// }) {
//   const navigate = useNavigate();
//   const [mainOpen, setMainOpen] = useState(true);
//   const [analysisOpen, setAnalysisOpen] = useState(true);
//   const [search, setSearch] = useState("");

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

//   // Close sidebar function - reusable
//   const closeSidebarOnMobile = () => {
//     if (window.innerWidth < 1024) {
//       setSidebarOpen(false);
//     }
//   };

//   // Updated NavItem - closes sidebar on mobile when clicked
//   const NavItem = ({ to, icon: Icon, children, end }) => (
//     <NavLink to={to} end={end} className={linkClass} onClick={closeSidebarOnMobile}>
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

//   const SectionTitle = ({ title, icon: Icon, open, setOpen }) => (
//     <button
//       onClick={() => setOpen(!open)}
//       className={`
//         w-full flex items-center justify-between px-2 py-1.5
//         text-xs font-medium uppercase tracking-wider rounded-lg
//         transition-all duration-200
//         ${darkMode 
//           ? "text-slate-400 hover:text-slate-300 hover:bg-slate-800/30" 
//           : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
//         }
//       `}
//     >
//       <span className="flex items-center gap-2">
//         {Icon && <Icon className="text-sm" />}
//         {title}
//       </span>
//       <span className="transition-transform duration-200">
//         {open ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
//       </span>
//     </button>
//   );

//   const handleLogout = () => {
//     localStorage.removeItem("currentUser");
//     window.location.reload();
//   };

//   const handleNewSimulation = () => {
//     navigate("/building-analysis");
//     closeSidebarOnMobile();
//   };

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={closeSidebarOnMobile}
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
//         {/* Header with Logo - No blue background */}
//         <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200 dark:border-slate-700/50 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             {/* Daikin Logo - Bigger, no background color */}
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
//             onClick={closeSidebarOnMobile}
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
//           {/* Navigation */}
//           <div className="space-y-0.5">
//             <NavItem to="/building-analysis" icon={FaBuilding} end>
//               Energy Analysis
//             </NavItem>
//             <NavItem to="/analysis-history" icon={MdHistory}>
//               History
//             </NavItem>
//           </div>

//           <div className="border-t border-slate-200 dark:border-slate-700/50" /> 

//           {/* Settings Section */}
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
//               onClick={handleLogout}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                   e.preventDefault();
//                   handleLogout();
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