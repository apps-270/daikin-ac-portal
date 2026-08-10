// App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import DashboardLayout from "./Components/DashboardLayout";

import BuildingAnalysis from "./pages/BuildingAnalysis";
import AnalysisHistory from "./pages/AnalysisHistory";
import UserProfile from "./pages/UserProfile";

export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    if (savedState !== null) {
      return JSON.parse(savedState);
    }
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!user) {
    return <Login setUser={setUser} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* <BrowserRouter> */}
      <BrowserRouter basename="/daikin-ac-portal">
        <DashboardLayout
          user={user}
          setUser={setUser}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        >
          <Routes>
            <Route path="/" element={<BuildingAnalysis />} />
            <Route path="/building-analysis" element={<BuildingAnalysis />} />
            <Route path="/analysis-history" element={<AnalysisHistory />} />
            <Route path="/profile" element={<UserProfile user={user} darkMode={darkMode} />} />
          </Routes>
        </DashboardLayout>
      </BrowserRouter>
    </div>
  );
}// import { useState, useEffect } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Login from "./pages/Login";
// import DashboardLayout from "./components/DashboardLayout";

// import BuildingAnalysis from "./pages/BuildingAnalysis";
// import AnalysisHistory from "./pages/AnalysisHistory";
// import UserProfile from "./pages/UserProfile";

// export default function App() {
//   const [user, setUser] = useState(() => {
//     const stored = localStorage.getItem("currentUser");
//     return stored ? JSON.parse(stored) : null;
//   });

//   const [darkMode, setDarkMode] = useState(() => {
//     const savedMode = localStorage.getItem("darkMode");
//     return savedMode ? JSON.parse(savedMode) : false;
//   });

//   const [sidebarOpen, setSidebarOpen] = useState(() => {
//     const savedState = localStorage.getItem("sidebarOpen");
//     if (savedState !== null) {
//       return JSON.parse(savedState);
//     }
//     return window.innerWidth >= 1024;
//   });

//   useEffect(() => {
//     localStorage.setItem("darkMode", JSON.stringify(darkMode));
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//       document.documentElement.classList.add("dark-mode");
//     } else {
//       document.documentElement.classList.remove("dark");
//       document.documentElement.classList.remove("dark-mode");
//     }
//   }, [darkMode]);

//   useEffect(() => {
//     localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
//   }, [sidebarOpen]);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setSidebarOpen(false);
//       }
//     };
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // ✅ Wrap everything in BrowserRouter
//   return (
//     <BrowserRouter>
//       <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
//         {!user ? (
//           <Login setUser={setUser} />
//         ) : (
//           <DashboardLayout
//             user={user}
//             setUser={setUser}
//             darkMode={darkMode}
//             setDarkMode={setDarkMode}
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//           >
//             <Routes>
//               <Route path="/" element={<BuildingAnalysis />} />
//               <Route path="/building-analysis" element={<BuildingAnalysis />} />
//               <Route path="/analysis-history" element={<AnalysisHistory />} />
//               <Route path="/profile" element={<UserProfile user={user} darkMode={darkMode} />} />
//             </Routes>
//           </DashboardLayout>
//         )}
//       </div>
//     </BrowserRouter>
//   );
// }