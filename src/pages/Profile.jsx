import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaCheckCircle,
  FaUserCircle,
  FaBriefcase,
  FaClock,
  FaChartLine,
  FaUsers,
  FaStar,
  FaCog,
  FaShieldAlt,
  FaBell,
  FaArrowRight,
  FaLeaf,
  FaBolt,
  FaDollarSign,
} from "react-icons/fa";

export default function UserProfile({ user, darkMode }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    role: "",
    joinDate: "",
    department: "",
    bio: "",
  });

  const [stats, setStats] = useState({
    totalSimulations: 0,
    avgEfficiency: 0,
    avgEnergySaving: 0,
    totalProjects: 0,
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    
    if (currentUser) {
      const userProfileKey = `userProfile_${currentUser.id}`;
      const savedProfile = localStorage.getItem(userProfileKey);
      
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      } else {
        setProfileData({
          name: currentUser.name || "",
          email: currentUser.email || "",
          phone: currentUser.phone || "",
          address: currentUser.address || "",
          company: currentUser.company || "AI Energy Simulator",
          role: currentUser.role || "Energy Analyst",
          joinDate: currentUser.joinDate || new Date().toLocaleDateString(),
          department: currentUser.department || "Energy Optimization",
          bio: currentUser.bio || "",
        });
      }
    } else if (user) {
      const userProfileKey = `userProfile_${user.id}`;
      const savedProfile = localStorage.getItem(userProfileKey);
      
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      } else {
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          company: user.company || "AI Energy Simulator",
          role: user.role || "Energy Analyst",
          joinDate: user.joinDate || new Date().toLocaleDateString(),
          department: user.department || "Energy Optimization",
          bio: user.bio || "",
        });
      }
    }

    const analysisHistory = JSON.parse(localStorage.getItem("analysis_history") || "[]");
    const entries = JSON.parse(localStorage.getItem("entries") || "[]");
    
    const totalSimulations = analysisHistory.length;
    
    let avgEfficiency = 0;
    if (analysisHistory.length > 0) {
      const totalEfficiency = analysisHistory.reduce((sum, item) => {
        return sum + Number(item.ai_efficiency || item.efficiency || 0);
      }, 0);
      avgEfficiency = Math.round(totalEfficiency / analysisHistory.length);
    }
    
    let avgEnergySaving = 0;
    if (analysisHistory.length > 0) {
      const totalSaving = analysisHistory.reduce((sum, item) => {
        return sum + Number(item.saving_percentage || item.energy_saving || 0);
      }, 0);
      avgEnergySaving = Math.round(totalSaving / analysisHistory.length);
    }
    
    setStats({
      totalSimulations: totalSimulations,
      avgEfficiency: avgEfficiency,
      avgEnergySaving: avgEnergySaving,
      totalProjects: entries.length,
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSave = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser) {
      const userProfileKey = `userProfile_${currentUser.id}`;
      localStorage.setItem(userProfileKey, JSON.stringify(profileData));
    } else if (user) {
      const userProfileKey = `userProfile_${user.id}`;
      localStorage.setItem(userProfileKey, JSON.stringify(profileData));
    }
    
    setShowSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setIsEditing(false);
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser) {
      const userProfileKey = `userProfile_${currentUser.id}`;
      const savedProfile = localStorage.getItem(userProfileKey);
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    }
  };

  const handleAccountSettings = () => navigate("/settings");
  const handleSecurity = () => navigate("/settings");
  const handleNotificationPreferences = () => navigate("/settings");

  // Icon wrapper to force blue color
  const BlueIcon = ({ icon: Icon, className = "text-sm" }) => (
    <span style={{ color: '#3B82F6 !important', display: 'inline-flex', alignItems: 'center' }}>
      <Icon className={className} style={{ color: '#3B82F6' }} />
    </span>
  );

  const StatCard = ({ icon: Icon, title, value, color, suffix = "" }) => {
    const colorMap = {
      blue: { bg: "from-blue-500 to-blue-600", text: "text-blue-600" },
      emerald: { bg: "from-emerald-500 to-emerald-600", text: "text-emerald-600" },
      amber: { bg: "from-amber-500 to-amber-600", text: "text-amber-600" },
      purple: { bg: "from-purple-500 to-purple-600", text: "text-purple-600" },
    };
    const colors = colorMap[color] || colorMap.blue;

    return (
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.bg} flex-shrink-0`}>
            <Icon className="text-white text-base" style={{ color: 'white' }} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className={`text-2xl font-bold ${colors.text} dark:text-white`}>{value}{suffix}</p>
          </div>
        </div>
      </div>
    );
  };

  const InfoField = ({ label, value, icon: Icon, isEditing: fieldEditing, name }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 mt-0.5 flex-shrink-0">
        <Icon className="text-sm" style={{ color: '#3B82F6' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {fieldEditing ? (
          <input
            type="text"
            name={name}
            value={value || ""}
            onChange={handleChange}
            className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
        ) : (
          <p className="text-base font-semibold text-slate-900 dark:text-white truncate">
            {value || "Not provided"}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/90 via-white/70 to-blue-50/50 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-blue-950/30 p-6 border border-blue-200/30 dark:border-blue-800/20 shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#44C8F5] to-[#3B82F6] text-white shadow-lg shadow-[#44C8F5]/30 flex-shrink-0">
              <FaUser className="text-xl" style={{ color: 'white' }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                User Profile
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Manage your personal information and preferences
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#44C8F5] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#44C8F5] text-white font-medium transition-all flex items-center gap-2 shadow-lg shadow-[#44C8F5]/25"
                >
                  <FaSave className="text-sm" style={{ color: 'white' }} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-all flex items-center gap-2 text-slate-700 dark:text-white font-medium border border-slate-300 dark:border-slate-600"
                >
                  <FaTimes className="text-sm" style={{ color: darkMode ? '#94a3b8' : '#475569' }} />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#44C8F5] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#44C8F5] text-white font-medium transition-all flex items-center gap-2 shadow-lg shadow-[#44C8F5]/25"
              >
                <FaEdit className="text-sm" style={{ color: 'white' }} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-3 animate-fadeIn">
          <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" style={{ color: '#10b981' }} />
          <div>
            <p className="font-medium text-emerald-800 dark:text-emerald-400">
              Profile updated successfully!
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-500">
              Your changes have been saved.
            </p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-[#44C8F5] to-[#3B82F6] relative">
          <div className="absolute -bottom-12 left-6 flex items-end gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-xl">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#44C8F5] to-[#3B82F6] flex items-center justify-center text-white text-3xl font-bold">
                  {profileData.name?.charAt(0) || "U"}
                </div>
              </div>
              {isEditing && (
                <button 
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[#3B82F6] text-white shadow-lg hover:bg-[#2563EB] transition-all"
                  onClick={() => alert("Change profile photo feature coming soon!")}
                >
                  <FaCamera className="text-xs" style={{ color: 'white' }} />
                </button>
              )}
            </div>
            <div className="mb-2">
              <h2 className="text-xl font-bold text-white drop-shadow-lg">
                {profileData.name || "User Name"}
              </h2>
              <p className="text-sm text-white/80 drop-shadow-lg">
                {profileData.role || "Energy Analyst"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-14 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Info */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-2">
                <div className="w-1 h-5 bg-[#3B82F6] rounded-full" style={{ backgroundColor: '#3B82F6' }} />
                Personal Information
              </h3>
              <div className="space-y-1">
                <InfoField
                  label="Full Name"
                  value={profileData.name}
                  icon={FaUser}
                  isEditing={isEditing}
                  name="name"
                />
                <InfoField
                  label="Email Address"
                  value={profileData.email}
                  icon={FaEnvelope}
                  isEditing={isEditing}
                  name="email"
                />
                <InfoField
                  label="Phone Number"
                  value={profileData.phone}
                  icon={FaPhone}
                  isEditing={isEditing}
                  name="phone"
                />
                <InfoField
                  label="Address"
                  value={profileData.address}
                  icon={FaMapMarkerAlt}
                  isEditing={isEditing}
                  name="address"
                />
              </div>

              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-2 pt-4">
                <div className="w-1 h-5 bg-emerald-500 rounded-full" style={{ backgroundColor: '#10b981' }} />
                Professional Information
              </h3>
              <div className="space-y-1">
                <InfoField
                  label="Company"
                  value={profileData.company}
                  icon={FaBuilding}
                  isEditing={isEditing}
                  name="company"
                />
                <InfoField
                  label="Department"
                  value={profileData.department}
                  icon={FaBriefcase}
                  isEditing={isEditing}
                  name="department"
                />
                <InfoField
                  label="Role"
                  value={profileData.role}
                  icon={FaUserCircle}
                  isEditing={isEditing}
                  name="role"
                />
                <InfoField
                  label="Join Date"
                  value={profileData.joinDate}
                  icon={FaCalendarAlt}
                  isEditing={isEditing}
                  name="joinDate"
                />
              </div>

              {/* Bio */}
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-2 pt-4">
                <div className="w-1 h-5 bg-purple-500 rounded-full" style={{ backgroundColor: '#8b5cf6' }} />
                About Me
              </h3>
              <div className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio || ""}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-base text-slate-700 dark:text-slate-400">
                    {profileData.bio || "No bio provided yet."}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Stats & Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-2">
                <div className="w-1 h-5 bg-amber-500 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
                Activity Summary
              </h3>
              <div className="space-y-3">
                <StatCard
                  icon={FaChartLine}
                  title="Total Simulations"
                  value={stats.totalSimulations}
                  color="blue"
                />
                <StatCard
                  icon={FaLeaf}
                  title="Avg Efficiency"
                  value={stats.avgEfficiency}
                  suffix="%"
                  color="emerald"
                />
                <StatCard
                  icon={FaBolt}
                  title="Avg Energy Saved"
                  value={stats.avgEnergySaving}
                  suffix="%"
                  color="amber"
                />
                <StatCard
                  icon={FaBuilding}
                  title="Total Projects"
                  value={stats.totalProjects}
                  color="purple"
                />
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={handleAccountSettings}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm text-slate-700 dark:text-white border border-transparent hover:border-blue-200 dark:hover:border-blue-800/30 group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-all flex-shrink-0">
                      <FaCog className="text-sm" style={{ color: '#3B82F6' }} />
                    </div>
                    <span className="flex-1 text-left font-medium">Account Settings</span>
                    <FaArrowRight className="text-xs text-slate-400 group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-all flex-shrink-0" style={{ color: '#3B82F6' }} />
                  </button>

                  <button
                    onClick={handleSecurity}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm text-slate-700 dark:text-white border border-transparent hover:border-blue-200 dark:hover:border-blue-800/30 group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-all flex-shrink-0">
                      <FaShieldAlt className="text-sm" style={{ color: '#3B82F6' }} />
                    </div>
                    <span className="flex-1 text-left font-medium">Security</span>
                    <FaArrowRight className="text-xs text-slate-400 group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-all flex-shrink-0" style={{ color: '#3B82F6' }} />
                  </button>

                  <button
                    onClick={handleNotificationPreferences}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm text-slate-700 dark:text-white border border-transparent hover:border-blue-200 dark:hover:border-blue-800/30 group"
                  >
                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-all flex-shrink-0">
                      <FaBell className="text-sm" style={{ color: '#3B82F6' }} />
                    </div>
                    <span className="flex-1 text-left font-medium">Notification Preferences</span>
                    <FaArrowRight className="text-xs text-slate-400 group-hover:text-[#3B82F6] group-hover:translate-x-0.5 transition-all flex-shrink-0" style={{ color: '#3B82F6' }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { 
//   FaUser, 
//   FaEnvelope, 
//   FaPhone, 
//   FaMapMarkerAlt, 
//   FaBuilding, 
//   FaCalendarAlt,
//   FaEdit,
//   FaSave,
//   FaTimes,
//   FaCamera,
//   FaCheckCircle,
//   FaUserCircle,
//   FaBriefcase,
//   FaClock,
//   FaChartLine,
//   FaUsers,
//   FaStar,
//   FaCog,
//   FaShieldAlt,
//   FaBell,
//   FaArrowRight,
//   FaLeaf,
//   FaBolt,
//   FaDollarSign,
// } from "react-icons/fa";

// export default function UserProfile({ user, darkMode }) {
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [profileData, setProfileData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//     company: "",
//     role: "",
//     joinDate: "",
//     department: "",
//     bio: "",
//   });

//   const [stats, setStats] = useState({
//     totalSimulations: 0,
//     avgEfficiency: 0,
//     avgEnergySaving: 0,
//     totalProjects: 0,
//   });

//   useEffect(() => {
//     const savedProfile = localStorage.getItem("userProfile");
//     if (savedProfile) {
//       setProfileData(JSON.parse(savedProfile));
//     } else if (user) {
//       setProfileData({
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         address: user.address || "",
//         company: user.company || "AI Energy Simulator",
//         role: user.role || "Energy Analyst",
//         joinDate: user.joinDate || new Date().toLocaleDateString(),
//         department: user.department || "Energy Optimization",
//         bio: user.bio || "",
//       });
//     }

//     // Load energy simulation data instead of customer feedback
//     const analysisHistory = JSON.parse(localStorage.getItem("analysis_history") || "[]");
//     const entries = JSON.parse(localStorage.getItem("entries") || "[]");
    
//     // Calculate stats from simulations
//     const totalSimulations = analysisHistory.length;
    
//     // Calculate average efficiency
//     let avgEfficiency = 0;
//     if (analysisHistory.length > 0) {
//       const totalEfficiency = analysisHistory.reduce((sum, item) => {
//         return sum + Number(item.ai_efficiency || item.efficiency || 0);
//       }, 0);
//       avgEfficiency = Math.round(totalEfficiency / analysisHistory.length);
//     }
    
//     // Calculate average energy saving
//     let avgEnergySaving = 0;
//     if (analysisHistory.length > 0) {
//       const totalSaving = analysisHistory.reduce((sum, item) => {
//         return sum + Number(item.saving_percentage || item.energy_saving || 0);
//       }, 0);
//       avgEnergySaving = Math.round(totalSaving / analysisHistory.length);
//     }
    
//     setStats({
//       totalSimulations: totalSimulations,
//       avgEfficiency: avgEfficiency,
//       avgEnergySaving: avgEnergySaving,
//       totalProjects: entries.length,
//     });
//   }, [user]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData({
//       ...profileData,
//       [name]: value,
//     });
//   };

//   const handleSave = () => {
//     localStorage.setItem("userProfile", JSON.stringify(profileData));
//     setShowSuccess(true);
//     setIsEditing(false);
//     setTimeout(() => setShowSuccess(false), 3000);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     const savedProfile = localStorage.getItem("userProfile");
//     if (savedProfile) {
//       setProfileData(JSON.parse(savedProfile));
//     }
//   };

//   const handleAccountSettings = () => {
//     navigate("/settings");
//   };

//   const handleSecurity = () => {
//     navigate("/settings");
//   };

//   const handleNotificationPreferences = () => {
//     navigate("/settings");
//   };

//   const StatCard = ({ icon: Icon, title, value, color, suffix = "" }) => (
//     <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all`}>
//       <div className="flex items-center gap-3">
//         <div className={`p-2 rounded-lg ${color}`}>
//           <Icon className="text-white" />
//         </div>
//         <div>
//           <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
//           <p className="text-xl font-bold text-black dark:text-white">{value}{suffix}</p>
//         </div>
//       </div>
//     </div>
//   );

//   const InfoField = ({ label, value, icon: Icon, isEditing: fieldEditing, name }) => (
//     <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
//       <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 mt-0.5">
//         <Icon className="text-sm" />
//       </div>
//       <div className="flex-1 min-w-0">
//         <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
//         {fieldEditing ? (
//           <input
//             type="text"
//             name={name}
//             value={value || ""}
//             onChange={handleChange}
//             className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
//           />
//         ) : (
//           <p className="text-sm font-medium text-black dark:text-white truncate">
//             {value || "Not provided"}
//           </p>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
//             <FaUser className="text-xl" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-black dark:text-white">
//               User Profile
//             </h1>
//             <p className="text-sm text-slate-600 dark:text-slate-400">
//               Manage your personal information and preferences
//             </p>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-2">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
//               >
//                 <FaSave className="text-sm" />
//                 Save Changes
//               </button>
//               <button
//                 onClick={handleCancel}
//                 className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all flex items-center gap-2 text-black dark:text-white"
//               >
//                 <FaTimes className="text-sm" />
//                 Cancel
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={() => setIsEditing(true)}
//               className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
//             >
//               <FaEdit className="text-sm" />
//               Edit Profile
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Success Message */}
//       {showSuccess && (
//         <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-3 animate-fadeIn">
//           <FaCheckCircle className="text-emerald-500 text-lg" />
//           <div>
//             <p className="font-medium text-emerald-800 dark:text-emerald-400">
//               Profile updated successfully!
//             </p>
//             <p className="text-sm text-emerald-700 dark:text-emerald-500">
//               Your changes have been saved.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Profile Card */}
//       <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
//         {/* Cover Image */}
//         <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-500 relative">
//           <div className="absolute -bottom-12 left-6 flex items-end gap-4">
//             <div className="relative">
//               <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-xl">
//                 <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
//                   {profileData.name?.charAt(0) || "U"}
//                 </div>
//               </div>
//               <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-all">
//                 <FaCamera className="text-xs" />
//               </button>
//             </div>
//             <div className="mb-2">
//               <h2 className="text-xl font-bold text-white drop-shadow-lg">
//                 {profileData.name || "User Name"}
//               </h2>
//               <p className="text-sm text-white/80 drop-shadow-lg">
//                 {profileData.role || "Energy Analyst"}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Profile Content */}
//         <div className="pt-14 p-6">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left Column - Info */}
//             <div className="lg:col-span-2 space-y-4">
//               <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                 <div className="w-1 h-5 bg-blue-500 rounded-full" />
//                 Personal Information
//               </h3>
//               <div className="space-y-1">
//                 <InfoField
//                   label="Full Name"
//                   value={profileData.name}
//                   icon={FaUser}
//                   isEditing={isEditing}
//                   name="name"
//                 />
//                 <InfoField
//                   label="Email Address"
//                   value={profileData.email}
//                   icon={FaEnvelope}
//                   isEditing={isEditing}
//                   name="email"
//                 />
//                 <InfoField
//                   label="Phone Number"
//                   value={profileData.phone}
//                   icon={FaPhone}
//                   isEditing={isEditing}
//                   name="phone"
//                 />
//                 <InfoField
//                   label="Address"
//                   value={profileData.address}
//                   icon={FaMapMarkerAlt}
//                   isEditing={isEditing}
//                   name="address"
//                 />
//               </div>

//               <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 pt-4">
//                 <div className="w-1 h-5 bg-emerald-500 rounded-full" />
//                 Professional Information
//               </h3>
//               <div className="space-y-1">
//                 <InfoField
//                   label="Company"
//                   value={profileData.company}
//                   icon={FaBuilding}
//                   isEditing={isEditing}
//                   name="company"
//                 />
//                 <InfoField
//                   label="Department"
//                   value={profileData.department}
//                   icon={FaBriefcase}
//                   isEditing={isEditing}
//                   name="department"
//                 />
//                 <InfoField
//                   label="Role"
//                   value={profileData.role}
//                   icon={FaUserCircle}
//                   isEditing={isEditing}
//                   name="role"
//                 />
//                 <InfoField
//                   label="Join Date"
//                   value={profileData.joinDate}
//                   icon={FaCalendarAlt}
//                   isEditing={isEditing}
//                   name="joinDate"
//                 />
//               </div>

//               {/* Bio */}
//               <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 pt-4">
//                 <div className="w-1 h-5 bg-purple-500 rounded-full" />
//                 About Me
//               </h3>
//               <div className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
//                 {isEditing ? (
//                   <textarea
//                     name="bio"
//                     value={profileData.bio || ""}
//                     onChange={handleChange}
//                     rows="3"
//                     className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
//                     placeholder="Tell us about yourself..."
//                   />
//                 ) : (
//                   <p className="text-sm text-slate-600 dark:text-slate-400">
//                     {profileData.bio || "No bio provided yet."}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Right Column - Stats & Quick Actions */}
//             <div className="space-y-4">
//               <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                 <div className="w-1 h-5 bg-amber-500 rounded-full" />
//                 Activity Summary
//               </h3>
//               <div className="space-y-3">
//                 <StatCard
//                   icon={FaChartLine}
//                   title="Total Simulations"
//                   value={stats.totalSimulations}
//                   color="bg-blue-500"
//                 />
//                 <StatCard
//                   icon={FaLeaf}
//                   title="Avg Efficiency"
//                   value={stats.avgEfficiency}
//                   suffix="%"
//                   color="bg-emerald-500"
//                 />
//                 <StatCard
//                   icon={FaBolt}
//                   title="Avg Energy Saved"
//                   value={stats.avgEnergySaving}
//                   suffix="%"
//                   color="bg-amber-500"
//                 />
//                 <StatCard
//                   icon={FaBuilding}
//                   title="Total Projects"
//                   value={stats.totalProjects}
//                   color="bg-purple-500"
//                 />
//               </div>

//               {/* Quick Actions */}
//               <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
//                 <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
//                   Quick Actions
//                 </h4>
//                 <div className="space-y-2">
//                   <button
//                     onClick={handleAccountSettings}
//                     className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm text-black dark:text-white border border-transparent hover:border-blue-200 dark:hover:border-blue-800/30 group"
//                   >
//                     <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
//                       <FaCog className="text-sm" />
//                     </div>
//                     <span className="flex-1 text-left font-medium">Account Settings</span>
//                     <FaArrowRight className="text-xs text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
//                   </button>

//                   <button
//                     onClick={handleSecurity}
//                     className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm text-black dark:text-white border border-transparent hover:border-blue-200 dark:hover:border-blue-800/30 group"
//                   >
//                     <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
//                       <FaShieldAlt className="text-sm" />
//                     </div>
//                     <span className="flex-1 text-left font-medium">Security</span>
//                     <FaArrowRight className="text-xs text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
//                   </button>

//                   <button
//                     onClick={handleNotificationPreferences}
//                     className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all text-sm text-black dark:text-white border border-transparent hover:border-blue-200 dark:hover:border-blue-800/30 group"
//                   >
//                     <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all">
//                       <FaBell className="text-sm" />
//                     </div>
//                     <span className="flex-1 text-left font-medium">Notification Preferences</span>
//                     <FaArrowRight className="text-xs text-slate-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }