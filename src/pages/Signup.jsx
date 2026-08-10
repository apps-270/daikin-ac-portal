import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import DaikinLogo from "../assets/Daikin.jpg";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaArrowLeft,
  FaUserPlus,
  FaSpinner,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

export default function Signup({ setShowSignup }) {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Employee",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setMessageType("error");
      setMessage("Please fill in all fields.");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email.trim())) {
      setMessageType("error");
      setMessage("Please enter a valid email address (e.g., name@domain.com).");
      return false;
    }

    if (formData.password.length < 6) {
      setMessageType("error");
      setMessage("Password must be at least 6 characters.");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessageType("error");
      setMessage("Passwords do not match.");
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const email = formData.email.trim().toLowerCase();
      const password = formData.password;
      const name = formData.name.trim();
      const role = formData.role;

      console.log("Attempting signup for:", email);

      if (!email.includes('@') || !email.includes('.')) {
        throw new Error("Please enter a valid email address with @ and .");
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            role: role,
          },
        },
      });

      if (authError) {
        console.error("Auth error:", authError);
        throw authError;
      }

      console.log("Auth data:", authData);

      if (authData.user) {
        console.log("User created, inserting profile...");
        
        const { error: profileError } = await supabase
          .from("users")
          .insert([
            {
              id: authData.user.id,
              name: name,
              email: email,
              role: role,
              created_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error("Profile creation error:", profileError);
          
          if (profileError.code === "42501" || profileError.message?.includes("permission denied")) {
            throw new Error(
              "Permission denied. Please ensure RLS policies are properly configured."
            );
          } else if (profileError.code === "23505") {
            throw new Error("This email is already registered.");
          } else {
            throw new Error("Account created but profile setup failed. Please contact support.");
          }
        }

        console.log("Profile created successfully!");
      }

      setMessageType("success");
      setMessage(
        "🎉 Account created successfully! Please check your email to verify your account."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Employee",
      });

      setTimeout(() => {
        setShowSignup(false);
      }, 3000);

    } catch (err) {
      console.error("Signup error:", err);
      setMessageType("error");
      
      if (err.message?.includes("User already registered") || err.message?.includes("duplicate") || err.code === "23505") {
        setMessage("This email is already registered. Please login instead.");
      } else if (err.message?.includes("permission denied") || err.code === "42501") {
        setMessage(
          "Permission denied. Please ensure RLS policies are properly configured in Supabase."
        );
      } else if (err.message?.includes("password") || err.message?.includes("Password should be at least")) {
        setMessage("Password must be at least 6 characters long.");
      } else if (err.message?.includes("valid email") || err.message?.includes("Email address")) {
        setMessage(`Invalid email address. Please use a valid email format.`);
      } else {
        setMessage(err.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-10">
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
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-slate-700 overflow-hidden">

          {/* Header - Daikin Blue Theme */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 p-8 text-center">
            {!imageError ? (
              <img 
                src={DaikinLogo}
                alt="Daikin Logo"
                className="h-16 w-auto object-contain rounded-xl mx-auto mb-4"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="mx-auto w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-lg shadow-lg mb-4">
                <FaUserPlus className="text-4xl text-white" />
              </div>
            )}

            <h1 className="text-3xl font-bold text-white">
              Create Account
            </h1>

            <p className="text-blue-100 mt-2">
              Join the Daikin Smart Energy Platform
            </p>
          </div>

          <form onSubmit={handleSignup} className="p-8 space-y-5">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="mt-2 relative">
                <FaUser className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Smith"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <div className="mt-2 relative">
                <FaEnvelope className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-2 relative">
                <FaLock className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.password && formData.password.length > 0 && (
                <p className={`text-xs mt-1 ${formData.password.length >= 6 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formData.password.length >= 6 ? '✓ Strong password' : `Password needs ${6 - formData.password.length} more characters`}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="mt-2 relative">
                <FaLock className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  disabled={loading}
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-4 top-4 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors disabled:opacity-50"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.confirmPassword && formData.password && (
                <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Role
              </label>
              <div className="relative mt-2">
                <FaBuilding className="absolute left-4 top-4 text-slate-400 dark:text-slate-500" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-60"
                >
                  <option value="Employee">👤 Employee</option>
                  <option value="Service Engineer">🔧 Service Engineer</option>
                  <option value="Marketing Executive">📊 Marketing Executive</option>
                  <option value="Admin">👑 Admin</option>
                </select>
              </div>
            </div>

            {/* Alert Message */}
            {message && (
              <div
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                  messageType === "success"
                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                    : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-700"
                }`}
              >
                {messageType === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
                <span>{message}</span>
              </div>
            )}

            {/* Sign Up Button - Daikin Blue */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="flex justify-center items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <span className="flex justify-center items-center gap-2">
                  <FaUserPlus />
                  Create Account
                </span>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
              <span className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                OR
              </span>
              <div className="flex-1 h-px bg-slate-300 dark:bg-slate-700"></div>
            </div>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => setShowSignup(false)}
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 py-3 font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FaArrowLeft />
              Back to Login
            </button>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setShowSignup(false)}
                disabled={loading}
                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors disabled:opacity-50"
              >
                Sign In
              </button>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}// import { useState } from "react";
// import { supabase } from "../supabase";
// import DaikinLogo from "../assets/Daikin.jpg";

// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaBuilding,
//   FaArrowLeft,
//   FaUserPlus,
//   FaSpinner,
//   FaCheckCircle,
//   FaExclamationCircle,
// } from "react-icons/fa";

// export default function Signup({ setShowSignup }) {
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState("success");
//   const [imageError, setImageError] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: "Employee",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const validateForm = () => {
//     if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
//       setMessageType("error");
//       setMessage("Please fill in all fields.");
//       return false;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email.trim())) {
//       setMessageType("error");
//       setMessage("Please enter a valid email address.");
//       return false;
//     }

//     if (formData.password.length < 6) {
//       setMessageType("error");
//       setMessage("Password must be at least 6 characters.");
//       return false;
//     }

//     if (formData.password !== formData.confirmPassword) {
//       setMessageType("error");
//       setMessage("Passwords do not match.");
//       return false;
//     }

//     return true;
//   };

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setMessageType("");

//     if (!validateForm()) return;

//     setLoading(true);

//     try {
//       const email = formData.email.trim().toLowerCase();
//       const password = formData.password;
//       const name = formData.name.trim();
//       const role = formData.role;

//       console.log("Attempting signup for:", email);

//       // 1. Sign up with Supabase Auth
//       const { data: authData, error: authError } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             name: name,
//             role: role,
//           },
//         },
//       });

//       if (authError) {
//         console.error("Auth error:", authError);
//         throw authError;
//       }

//       console.log("Auth data:", authData);

//       if (authData.user) {
//         console.log("User created, inserting profile...");
        
//         // 2. Insert user into the users table
//         const { error: profileError } = await supabase
//           .from("users")
//           .insert([
//             {
//               id: authData.user.id,
//               name: name,
//               email: email,
//               role: role,
//               created_at: new Date().toISOString(),
//             },
//           ]);

//         if (profileError) {
//           console.error("Profile creation error:", profileError);
          
//           if (profileError.code === "42501" || profileError.message?.includes("permission denied")) {
//             throw new Error(
//               "Permission denied. Please ensure RLS policies are properly configured."
//             );
//           } else if (profileError.code === "23505") {
//             throw new Error("This email is already registered.");
//           } else {
//             throw new Error("Account created but profile setup failed. Please contact support.");
//           }
//         }

//         console.log("Profile created successfully!");
//       }

//       setMessageType("success");
//       setMessage(
//         "🎉 Account created successfully! Please check your email to verify your account."
//       );

//       setFormData({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         role: "Employee",
//       });

//       setTimeout(() => {
//         setShowSignup(false);
//       }, 3000);

//     } catch (err) {
//       console.error("Signup error:", err);
//       setMessageType("error");
      
//       if (err.message?.includes("User already registered") || err.message?.includes("duplicate")) {
//         setMessage("This email is already registered. Please login instead.");
//       } else if (err.message?.includes("permission denied")) {
//         setMessage(
//           "Permission denied. Please ensure RLS policies are properly configured in Supabase."
//         );
//       } else if (err.message?.includes("password")) {
//         setMessage("Password must be at least 6 characters long.");
//       } else if (err.message?.includes("valid email")) {
//         setMessage("Please enter a valid email address.");
//       } else {
//         setMessage(err.message || "An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center px-6 py-10">
//       {/* Background Image */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center bg-no-repeat"
//         style={{
//           backgroundImage: `url('https://i.pinimg.com/1200x/a7/49/a3/a749a3383dc39565b5062490646a83bb.jpg')`
//         }}
//       />
      
//       {/* Dark Overlay for readability */}
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

//       <div className="relative w-full max-w-md z-10">
//         <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">

//           {/* Header - Daikin Blue Theme */}
//           <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 p-8 text-center">
//             {/* Daikin Logo */}
//             {!imageError ? (
//               <img 
//                 src={DaikinLogo}
//                 alt="Daikin Logo"
//                 className="h-16 w-auto object-contain rounded-xl mx-auto mb-4"
//                 onError={() => setImageError(true)}
//               />
//             ) : (
//               <div className="mx-auto w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-lg shadow-lg mb-4">
//                 <FaUserPlus className="text-4xl text-white" />
//               </div>
//             )}

//             <h1 className="text-3xl font-bold text-white">
//               Create Account
//             </h1>

//             <p className="text-blue-100 mt-2">
//               Join the Daikin Smart Energy Platform
//             </p>
//           </div>

//           <form onSubmit={handleSignup} className="p-8 space-y-5">
//             {/* Name */}
//             <div>
//               <label className="text-sm font-medium text-slate-700">
//                 Full Name
//               </label>
//               <div className="mt-2 relative">
//                 <FaUser className="absolute left-4 top-4 text-slate-400" />
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   placeholder="John Smith"
//                   disabled={loading}
//                   className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:opacity-60"
//                 />
//               </div>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="text-sm font-medium text-slate-700">
//                 Email
//               </label>
//               <div className="mt-2 relative">
//                 <FaEnvelope className="absolute left-4 top-4 text-slate-400" />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="example@email.com"
//                   disabled={loading}
//                   className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:opacity-60"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="text-sm font-medium text-slate-700">
//                 Password
//               </label>
//               <div className="mt-2 relative">
//                 <FaLock className="absolute left-4 top-4 text-slate-400" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Min 6 characters"
//                   disabled={loading}
//                   className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:opacity-60"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   disabled={loading}
//                   className="absolute right-4 top-4 text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
//                 >
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {formData.password && formData.password.length > 0 && (
//                 <p className={`text-xs mt-1 ${formData.password.length >= 6 ? 'text-green-500' : 'text-red-500'}`}>
//                   {formData.password.length >= 6 ? '✓ Strong password' : `Password needs ${6 - formData.password.length} more characters`}
//                 </p>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label className="text-sm font-medium text-slate-700">
//                 Confirm Password
//               </label>
//               <div className="mt-2 relative">
//                 <FaLock className="absolute left-4 top-4 text-slate-400" />
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Confirm Password"
//                   disabled={loading}
//                   className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 disabled:opacity-60"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   disabled={loading}
//                   className="absolute right-4 top-4 text-slate-500 hover:text-slate-700 transition-colors disabled:opacity-50"
//                 >
//                   {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {formData.confirmPassword && formData.password && (
//                 <p className={`text-xs mt-1 ${formData.password === formData.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
//                   {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
//                 </p>
//               )}
//             </div>

//             {/* Role */}
//             <div>
//               <label className="text-sm font-medium text-slate-700">
//                 Role
//               </label>
//               <div className="relative mt-2">
//                 <FaBuilding className="absolute left-4 top-4 text-slate-400" />
//                 <select
//                   name="role"
//                   value={formData.role}
//                   onChange={handleChange}
//                   disabled={loading}
//                   className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white/90 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 disabled:opacity-60"
//                 >
//                   <option value="Employee">👤 Employee</option>
//                   <option value="Service Engineer">🔧 Service Engineer</option>
//                   <option value="Marketing Executive">📊 Marketing Executive</option>
//                   <option value="Admin">👑 Admin</option>
//                 </select>
//               </div>
//             </div>

//             {/* Alert Message */}
//             {message && (
//               <div
//                 className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
//                   messageType === "success"
//                     ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
//                     : "bg-red-100 text-red-700 border border-red-300"
//                 }`}
//               >
//                 {messageType === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
//                 <span>{message}</span>
//               </div>
//             )}

//             {/* Sign Up Button - Daikin Blue */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 py-3 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
//             >
//               {loading ? (
//                 <span className="flex justify-center items-center gap-2">
//                   <FaSpinner className="animate-spin" />
//                   Creating Account...
//                 </span>
//               ) : (
//                 <span className="flex justify-center items-center gap-2">
//                   <FaUserPlus />
//                   Create Account
//                 </span>
//               )}
//             </button>

//             {/* Divider */}
//             <div className="flex items-center gap-4 py-2">
//               <div className="flex-1 h-px bg-slate-300"></div>
//               <span className="text-xs uppercase tracking-widest text-slate-500">
//                 OR
//               </span>
//               <div className="flex-1 h-px bg-slate-300"></div>
//             </div>

//             {/* Back Button */}
//             <button
//               type="button"
//               onClick={() => setShowSignup(false)}
//               disabled={loading}
//               className="w-full rounded-xl border border-slate-300 py-3 font-medium text-slate-700 transition-all hover:bg-slate-100 flex items-center justify-center gap-2 disabled:opacity-50"
//             >
//               <FaArrowLeft />
//               Back to Login
//             </button>

//             <p className="text-center text-sm text-slate-500 mt-6">
//               Already have an account?{" "}
//               <button
//                 type="button"
//                 onClick={() => setShowSignup(false)}
//                 disabled={loading}
//                 className="font-semibold text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
//               >
//                 Sign In
//               </button>
//             </p>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }