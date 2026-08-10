import { useState, useEffect } from "react";
// import { login } from "./utils/auth";
// import Signup from "./components/Signup";
import { login } from "../utils/auth";
import Signup from "../pages/Signup";
import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
import DaikinLogo from "../assets/Daikin.jpg";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  // Apply dark mode class to html element
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (showSignup) {
    return <Signup setShowSignup={setShowSignup} />;
  }

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      console.log("Login attempt with:", email);
      
      const user = await login(email, password);
      
      if (user) {
        console.log("Login successful, user:", user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        setUser(user);
        setError("");
        window.location.reload();
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.message?.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Please verify your email before logging in.");
      } else if (err.message?.includes("rate limit")) {
        setError("Too many login attempts. Please wait a moment and try again.");
      } else {
        setError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  const handleTestLogin = () => {
    setEmail("test@example.com");
    setPassword("test123456");
    setTimeout(() => handleLogin(), 100);
  };

  return (
    <div className="login-page relative min-h-screen flex items-center justify-center p-4">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://i.pinimg.com/1200x/e7/c2/85/e7c285a62d8151bf132c9777cac724bc.jpg')`
        }}
      />
      
      {/* Dark/Light Overlay */}
      {/* <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" /> */}

      {/* Dark Mode Toggle - Top Right Corner of Screen */}
      {/* <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleDarkMode}
          className={`
            relative flex items-center gap-2 px-4 py-2 rounded-full
            transition-all duration-300 ease-in-out font-medium text-sm
            ${darkMode 
              ? "bg-slate-800/90 text-slate-100 border border-slate-700/50 hover:bg-slate-700/90" 
              : "bg-white/90 text-slate-900 border border-slate-200/50 hover:bg-slate-50/90"
            }
            hover:scale-105 hover:shadow-xl
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097E0]
            backdrop-blur-sm shadow-lg
          `}
          aria-label="Toggle theme"
        >
          <span className="text-base md:text-lg transition-transform duration-500">
            {darkMode ? "🌙" : "☀️"}
          </span>
          <span className="hidden sm:inline font-medium">
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
                absolute top-0.5 left-0.5
                w-5 h-5 rounded-full bg-white shadow-md
                transform transition-all duration-300 ease-in-out
                flex items-center justify-center
                ${darkMode ? "translate-x-6" : "translate-x-0"}
              `}
            >
              <span className={`text-[10px] font-bold ${darkMode ? "text-[#0097E0]" : "text-slate-400"}`}>
                {darkMode ? "✓" : "✕"}
              </span>
            </span>
          </span>
        </button>
      </div> */}

      <div className="relative w-full max-w-md z-10">
        {/* Card - Changes with dark mode */}
        <div className="bg-white dark:bg-slate-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600"></div>

          <div className="p-8 md:p-10">
            <div className="text-center mb-8">
              {!imageError ? (
                <img 
                  src={DaikinLogo}
                  alt="Daikin Logo"
                  className="h-20 w-auto object-contain rounded-xl mx-auto mb-4"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 mb-4">
                  <span className="text-white font-bold text-4xl">❄️</span>
                </div>
              )}
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                AI Energy Simulator
              </h1>
              <p className="text-sm text-slate-700 dark:text-white mt-1">
                Smart Energy Optimization Platform
              </p>
              <p className="text-xs text-slate-500 dark:text-white/80 mt-3">
                Login to start simulating energy savings
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white">
                  <FaEnvelope className="text-slate-400 dark:text-white/80 text-sm" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/60" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white">
                  <FaLock className="text-slate-400 dark:text-white/80 text-sm" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/60" />
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 flex items-start gap-2 animate-fadeIn">
                  <span className="text-red-500 dark:text-red-400 mt-0.5">⚠️</span>
                  <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className={`
                  w-full py-3.5 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2
                  ${loading 
                    ? "bg-slate-400 dark:bg-slate-600 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
                  }
                `}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <FaArrowRight className="text-sm" />
                  </>
                )}
              </button>

              {process.env.NODE_ENV === 'development' && (
                <button
                  type="button"
                  onClick={handleTestLogin}
                  className="w-full py-2 text-xs text-slate-500 dark:text-white/70 hover:text-blue-600 dark:hover:text-white transition-colors"
                >
                  ⚡ Quick Test Login (dev only)
                </button>
              )}
          <button
            onClick={() => setShowSignup(true)}
            disabled={loading}
            className="w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            style={{ 
              color: '#2563eb', 
              border: '2px solid #3b82f6',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#87CEEB';
              e.currentTarget.style.borderColor = '#1d4ed8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
          >
            Create New Account
          </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-xs text-slate-500 dark:text-white/50">
                AI Energy Simulator v2.0.1
              </p>
              <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
                © 2026. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}// import { useState, useEffect } from "react";
// // import { login } from "./utils/auth";
// // import Signup from "./components/Signup";
// import { login } from "../utils/auth";
// import Signup from "../pages/Signup";
// import { FaEnvelope, FaLock, FaArrowRight } from "react-icons/fa";
// import DaikinLogo from "../assets/Daikin.jpg";

// export default function Login({ setUser }) {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [showSignup, setShowSignup] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [imageError, setImageError] = useState(false);
  
//   // Dark mode state
//   const [darkMode, setDarkMode] = useState(() => {
//     const savedMode = localStorage.getItem("darkMode");
//     return savedMode ? JSON.parse(savedMode) : false;
//   });

//   // Apply dark mode class to html element
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

//   // Toggle dark mode
//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode);
//   };

//   if (showSignup) {
//     return <Signup setShowSignup={setShowSignup} />;
//   }

//   const handleLogin = async () => {
//     setError("");

//     if (!email || !password) {
//       setError("Please fill in all fields");
//       return;
//     }

//     if (!email.includes('@') || !email.includes('.')) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     if (password.length < 6) {
//       setError("Password must be at least 6 characters");
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log("Login attempt with:", email);
      
//       const user = await login(email, password);
      
//       if (user) {
//         console.log("Login successful, user:", user);
//         localStorage.setItem("currentUser", JSON.stringify(user));
//         setUser(user);
//         setError("");
//         window.location.reload();
//       } else {
//         setError("Invalid email or password");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
      
//       if (err.message?.includes("Invalid login credentials")) {
//         setError("Invalid email or password. Please try again.");
//       } else if (err.message?.includes("Email not confirmed")) {
//         setError("Please verify your email before logging in.");
//       } else if (err.message?.includes("rate limit")) {
//         setError("Too many login attempts. Please wait a moment and try again.");
//       } else {
//         setError(err.message || "Login failed. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleLogin();
//     }
//   };

//   const handleTestLogin = () => {
//     setEmail("test@example.com");
//     setPassword("test123456");
//     setTimeout(() => handleLogin(), 100);
//   };

//   return (
//     <div className="login-page relative min-h-screen flex items-center justify-center p-4">
//       {/* Background Image */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: `url('https://i.pinimg.com/1200x/a7/49/a3/a749a3383dc39565b5062490646a83bb.jpg')`
//         }}
//       />
      
//       {/* Dark/Light Overlay */}
//       <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

//       {/* Dark Mode Toggle - Top Right Corner of Screen */}
//       <div className="absolute top-4 right-4 z-20">
//         <button
//           onClick={toggleDarkMode}
//           className={`
//             relative flex items-center gap-2 px-4 py-2 rounded-full
//             transition-all duration-300 ease-in-out font-medium text-sm
//             ${darkMode 
//               ? "bg-slate-800/90 text-slate-100 border border-slate-700/50 hover:bg-slate-700/90" 
//               : "bg-white/90 text-slate-900 border border-slate-200/50 hover:bg-slate-50/90"
//             }
//             hover:scale-105 hover:shadow-xl
//             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0097E0]
//             backdrop-blur-sm shadow-lg
//           `}
//           aria-label="Toggle theme"
//         >
//           <span className="text-base md:text-lg transition-transform duration-500">
//             {darkMode ? "🌙" : "☀️"}
//           </span>
//           <span className="hidden sm:inline font-medium">
//             {darkMode ? "Dark" : "Light"}
//           </span>
//           <span
//             className={`
//               relative inline-flex items-center w-12 h-6 rounded-full 
//               transition-all duration-300 flex-shrink-0
//               ${darkMode
//                 ? "bg-[#0097E0] shadow-lg shadow-[#0097E0]/25"
//                 : "bg-slate-300 shadow-inner"
//               }
//             `}
//           >
//             <span
//               className={`
//                 absolute top-0.5 left-0.5
//                 w-5 h-5 rounded-full bg-white shadow-md
//                 transform transition-all duration-300 ease-in-out
//                 flex items-center justify-center
//                 ${darkMode ? "translate-x-6" : "translate-x-0"}
//               `}
//             >
//               <span className={`text-[10px] font-bold ${darkMode ? "text-[#0097E0]" : "text-slate-400"}`}>
//                 {darkMode ? "✓" : "✕"}
//               </span>
//             </span>
//           </span>
//         </button>
//       </div>

//       <div className="relative w-full max-w-md z-10">
//         <div className="bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700 overflow-hidden">
//           <div className="h-1.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600"></div>

//           <div className="p-8 md:p-10">
//             <div className="text-center mb-8">
//               {!imageError ? (
//                 <img 
//                   src={DaikinLogo}
//                   alt="Daikin Logo"
//                   className="h-20 w-auto object-contain rounded-xl mx-auto mb-4"
//                   onError={() => setImageError(true)}
//                 />
//               ) : (
//                 <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 mb-4">
//                   <span className="text-white font-bold text-4xl">❄️</span>
//                 </div>
//               )}
//               <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
//                 AI Energy Simulator
//               </h1>
//               <p className="text-sm text-slate-700 dark:text-white mt-1">
//                 Smart Energy Optimization Platform
//               </p>
//               <p className="text-xs text-slate-500 dark:text-white/80 mt-3">
//                 Login to start simulating energy savings
//               </p>
//             </div>

//             <div className="space-y-4">
//               <div className="space-y-1.5">
//                 <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white">
//                   <FaEnvelope className="text-slate-400 dark:text-white/80 text-sm" />
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="email"
//                     className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     disabled={loading}
//                   />
//                   <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/60" />
//                 </div>
//               </div>

//               <div className="space-y-1.5">
//                 <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-white">
//                   <FaLock className="text-slate-400 dark:text-white/80 text-sm" />
//                   Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="password"
//                     className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
//                     placeholder="Enter your password"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     onKeyPress={handleKeyPress}
//                     disabled={loading}
//                   />
//                   <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/60" />
//                 </div>
//               </div>

//               {error && (
//                 <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 flex items-start gap-2 animate-fadeIn">
//                   <span className="text-red-500 dark:text-red-400 mt-0.5">⚠️</span>
//                   <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
//                 </div>
//               )}

//               <button
//                 onClick={handleLogin}
//                 disabled={loading}
//                 className={`
//                   w-full py-3.5 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2
//                   ${loading 
//                     ? "bg-slate-400 dark:bg-slate-600 cursor-not-allowed" 
//                     : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]"
//                   }
//                 `}
//               >
//                 {loading ? (
//                   <>
//                     <span className="animate-spin">⏳</span>
//                     Logging in...
//                   </>
//                 ) : (
//                   <>
//                     Login
//                     <FaArrowRight className="text-sm" />
//                   </>
//                 )}
//               </button>

//               {process.env.NODE_ENV === 'development' && (
//                 <button
//                   type="button"
//                   onClick={handleTestLogin}
//                   className="w-full py-2 text-xs text-slate-500 dark:text-white/70 hover:text-blue-600 dark:hover:text-white transition-colors"
//                 >
//                   ⚡ Quick Test Login (dev only)
//                 </button>
//               )}

//               <div className="relative my-6">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-4 bg-white dark:bg-slate-800 text-slate-500 dark:text-white/70">
//                     or
//                   </span>
//                 </div>
//               </div>

//               <button
//                 onClick={() => setShowSignup(true)}
//                 disabled={loading}
//                 className="w-full py-3 rounded-xl font-medium text-blue-600 dark:text-white border-2 border-blue-200 dark:border-white/30 hover:border-blue-500 dark:hover:border-white hover:bg-blue-50 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2"
//               >
//                 Create New Account
//               </button>
//             </div>

//             <div className="text-center mt-6">
//               <p className="text-xs text-slate-500 dark:text-white/50">
//                 AI Energy Simulator v2.0.1
//               </p>
//               <p className="text-xs text-slate-500 dark:text-white/50 mt-1">
//                 © 2026. All rights reserved.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }