import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";
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
  FaChartLine,
  FaCog,
  FaShieldAlt,
  FaBell,
  FaLeaf,
  FaDollarSign,
  FaTachometerAlt,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";

// Move InfoField outside the component
const InfoField = ({ label, value, icon: Icon, name, isEditing, onChange }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 mt-0.5 flex-shrink-0">
      <Icon className="text-sm" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value || ""}
          onChange={onChange}
          className="w-full mt-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          autoComplete="off"
        />
      ) : (
        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
          {value || "Not provided"}
        </p>
      )}
    </div>
  </div>
);

export default function UserProfile({ user, darkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [coverUrl, setCoverUrl] = useState(null);
  const [imageKey, setImageKey] = useState(Date.now());
  
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  
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
    totalBuildings: 0,
    totalHorsepower: 0,
    avgEfficiency: 0,
    totalSavings: 0,
    totalAnalyses: 0,
    avgSavingPercentage: 0,
  });

  const [recentAnalyses, setRecentAnalyses] = useState([]);

  // Load profile and stats
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      
      // Load from localStorage
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      const userProfileKey = currentUser ? `userProfile_${currentUser.id}` : null;
      
      let savedProfile = null;
      if (userProfileKey) {
        savedProfile = localStorage.getItem(userProfileKey);
      }
      
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfileData({
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          address: parsed.address || "",
          company: parsed.company || "Daikin",
          role: parsed.role || "Energy Analyst",
          joinDate: parsed.joinDate || new Date().toLocaleDateString(),
          department: parsed.department || "Operations",
          bio: parsed.bio || "",
        });
      } else if (user) {
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          company: user.company || "Daikin",
          role: user.role || "Energy Analyst",
          joinDate: user.joinDate || new Date().toLocaleDateString(),
          department: user.department || "Operations",
          bio: user.bio || "",
        });
      }

      // Fetch avatar and cover
      if (user || currentUser) {
        const userId = user?.id || currentUser?.id;
        await fetchImages(userId);
      }

      // Fetch stats
      await fetchStats();
      
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const fetchImages = async (userId) => {
    if (!userId) return;
    
    try {
      const timestamp = Date.now();
      
      // Fetch profile picture with cache busting
      const { data: avatarData, error: avatarError } = await supabase
        .storage
        .from('profile-pictures')
        .createSignedUrl(`${userId}/profile.jpg`, 60 * 60 * 24 * 365);

      if (!avatarError && avatarData?.signedUrl) {
        setAvatarUrl(`${avatarData.signedUrl}&t=${timestamp}`);
      } else {
        setAvatarUrl(null);
      }

      // Fetch cover picture with cache busting
      const { data: coverData, error: coverError } = await supabase
        .storage
        .from('profile-pictures')
        .createSignedUrl(`${userId}/cover.jpg`, 60 * 60 * 24 * 365);

      if (!coverError && coverData?.signedUrl) {
        setCoverUrl(`${coverData.signedUrl}&t=${timestamp}`);
      } else {
        setCoverUrl(null);
      }
      
      setImageKey(timestamp);
    } catch (err) {
      console.error('Error fetching images:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: analyses, error } = await supabase
        .from("analysis_history")
        .select("*")
        .order("generated_at", { ascending: false });

      if (error) {
        console.error("Error fetching analyses:", error);
        return;
      }

      if (analyses) {
        const totalAnalyses = analyses.length;
        const totalHorsepower = analyses.reduce((sum, a) => sum + (a.total_horsepower || 0), 0);
        const totalSavings = analyses.reduce((sum, a) => sum + (a.annual_savings || 0), 0);
        const avgEfficiency = analyses.length > 0 
          ? (analyses.reduce((sum, a) => sum + (a.ai_efficiency || 0), 0) / analyses.length).toFixed(1)
          : 0;
        const avgSavingPercentage = analyses.length > 0
          ? (analyses.reduce((sum, a) => sum + (a.saving_percentage || 0), 0) / analyses.length).toFixed(1)
          : 0;

        setStats({
          totalBuildings: totalAnalyses,
          totalHorsepower: Math.round(totalHorsepower),
          avgEfficiency: parseFloat(avgEfficiency),
          totalSavings: Math.round(totalSavings),
          totalAnalyses: totalAnalyses,
          avgSavingPercentage: parseFloat(avgSavingPercentage),
        });

        setRecentAnalyses(analyses.slice(0, 5));
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    setUploading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      const userId = currentUser?.id || user?.id;

      if (!userId) {
        alert('User not found. Please login again.');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = type === 'profile' ? `profile.${fileExt}` : `cover.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('profile-pictures')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '0',
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('Failed to upload image: ' + uploadError.message);
        return;
      }

      const timestamp = Date.now();
      const { data: urlData } = await supabase
        .storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      if (urlData?.publicUrl) {
        const newUrl = `${urlData.publicUrl}?t=${timestamp}`;
        if (type === 'profile') {
          setAvatarUrl(newUrl);
        } else {
          setCoverUrl(newUrl);
        }
        
        setImageKey(timestamp);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }

    } catch (err) {
      console.error('Error uploading image:', err);
      alert('An error occurred while uploading the image.');
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleRemoveImage = async (type) => {
    if (!confirm(`Remove your ${type === 'profile' ? 'profile picture' : 'cover picture'}?`)) return;

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      const userId = currentUser?.id || user?.id;

      if (!userId) return;

      const fileName = type === 'profile' ? 'profile.jpg' : 'cover.jpg';
      const { error } = await supabase
        .storage
        .from('profile-pictures')
        .remove([`${userId}/${fileName}`]);

      if (error) {
        console.error('Remove error:', error);
        alert('Failed to remove image.');
        return;
      }

      if (type === 'profile') {
        setAvatarUrl(null);
      } else {
        setCoverUrl(null);
      }
      setImageKey(Date.now());
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err) {
      console.error('Error removing image:', err);
      alert('An error occurred.');
    }
  };

  const handleSave = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser) {
      const userProfileKey = `userProfile_${currentUser.id}`;
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

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-2 rounded-lg ${color} flex-shrink-0`}>
          <Icon className="text-white text-sm" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25">
            <FaUser className="text-xl" />
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
        
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
              >
                <FaSave className="text-sm" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all flex items-center gap-2 text-slate-700 dark:text-white"
              >
                <FaTimes className="text-sm" />
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              <FaEdit className="text-sm" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 flex items-center gap-3 animate-fadeIn">
          <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />
          <div>
            <p className="font-medium text-emerald-800 dark:text-emerald-400">
              {uploading ? "Uploading image..." : "Profile updated successfully!"}
            </p>
            <p className="text-sm text-emerald-700 dark:text-emerald-500">
              {uploading ? "Please wait..." : "Your changes have been saved."}
            </p>
          </div>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative group">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
              key={`cover-${imageKey}`}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
          )}
          
          {/* Cover image upload button */}
          <div className="absolute top-4 right-4 flex gap-2">
            {coverUrl && (
              <button
                onClick={() => handleRemoveImage('cover')}
                className="p-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition-all shadow-lg backdrop-blur-sm"
                title="Remove cover image"
              >
                <FaTrash className="text-sm" />
              </button>
            )}
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploading}
              className="p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-all shadow-lg backdrop-blur-sm"
              title="Upload cover image"
            >
              {uploading ? (
                <FaSpinner className="text-sm animate-spin" />
              ) : (
                <FaCamera className="text-sm" />
              )}
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'cover')}
              className="hidden"
            />
          </div>

          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-6 flex items-end gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-xl">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-xl object-cover"
                    key={`avatar-${imageKey}`}
                    onError={(e) => {
                      e.target.src = `${avatarUrl}&retry=${Date.now()}`;
                    }}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                    {profileData.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              
              {/* Profile picture upload button */}
              <div className="absolute -bottom-1 -right-1 flex gap-1">
                {avatarUrl && (
                  <button
                    onClick={() => handleRemoveImage('profile')}
                    className="p-1.5 rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all"
                    title="Remove profile picture"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                )}
                <button
                  onClick={() => profileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-1.5 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all"
                  title="Upload profile picture"
                >
                  {uploading ? (
                    <FaSpinner className="text-xs animate-spin" />
                  ) : (
                    <FaCamera className="text-xs" />
                  )}
                </button>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'profile')}
                  className="hidden"
                />
              </div>
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
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-500 rounded-full" />
                Personal Information
              </h3>
              <div className="space-y-1">
                <InfoField
                  label="Full Name"
                  value={profileData.name}
                  icon={FaUser}
                  name="name"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoField
                  label="Email Address"
                  value={profileData.email}
                  icon={FaEnvelope}
                  name="email"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoField
                  label="Phone Number"
                  value={profileData.phone}
                  icon={FaPhone}
                  name="phone"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoField
                  label="Address"
                  value={profileData.address}
                  icon={FaMapMarkerAlt}
                  name="address"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
              </div>

              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 pt-4">
                <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                Professional Information
              </h3>
              <div className="space-y-1">
                <InfoField
                  label="Company"
                  value={profileData.company}
                  icon={FaBuilding}
                  name="company"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoField
                  label="Department"
                  value={profileData.department}
                  icon={FaBriefcase}
                  name="department"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoField
                  label="Role"
                  value={profileData.role}
                  icon={FaUserCircle}
                  name="role"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <InfoField
                  label="Join Date"
                  value={profileData.joinDate}
                  icon={FaCalendarAlt}
                  name="joinDate"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
              </div>

              {/* Bio */}
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 pt-4">
                <div className="w-1 h-5 bg-purple-500 rounded-full" />
                About Me
              </h3>
              <div className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={profileData.bio || ""}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {profileData.bio || "No bio provided yet."}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Stats & Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <div className="w-1 h-5 bg-amber-500 rounded-full" />
                Activity Summary
              </h3>
              <div className="space-y-3">
                <StatCard
                  icon={FaBuilding}
                  title="Total Buildings"
                  value={stats.totalBuildings}
                  color="bg-blue-500"
                />
                <StatCard
                  icon={FaTachometerAlt}
                  title="Total Horsepower"
                  value={stats.totalHorsepower}
                  color="bg-indigo-500"
                />
                <StatCard
                  icon={FaLeaf}
                  title="Avg AI Efficiency"
                  value={`${stats.avgEfficiency}%`}
                  color="bg-emerald-500"
                  subtitle={`Avg savings: ${stats.avgSavingPercentage}%`}
                />
                <StatCard
                  icon={FaDollarSign}
                  title="Annual Savings"
                  value={`$${stats.totalSavings.toLocaleString()}`}
                  color="bg-amber-500"
                />
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Link
                    to="#"
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm text-slate-700 dark:text-white no-underline"
                  >
                    <FaCog className="text-slate-400" />
                    <span>Account Settings</span>
                  </Link>
                  <Link
                    to="#"
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm text-slate-700 dark:text-white no-underline"
                  >
                    <FaShieldAlt className="text-slate-400" />
                    <span>Security</span>
                  </Link>
                  <Link
                    to="#"
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm text-slate-700 dark:text-white no-underline"
                  >
                    <FaBell className="text-slate-400" />
                    <span>Notifications</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { supabase } from "../supabase";
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
//   FaLeaf,
//   FaDollarSign,
//   FaTachometerAlt,
// } from "react-icons/fa";

// export default function UserProfile({ user, darkMode }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [loading, setLoading] = useState(true);
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
//     totalBuildings: 0,
//     totalHorsepower: 0,
//     avgEfficiency: 0,
//     totalSavings: 0,
//     totalAnalyses: 0,
//     avgSavingPercentage: 0,
//   });

//   const [recentAnalyses, setRecentAnalyses] = useState([]);

//   useEffect(() => {
//     const loadProfileAndStats = async () => {
//       setLoading(true);
      
//       // Load profile data from localStorage or user prop
//       const savedProfile = localStorage.getItem("userProfile");
//       if (savedProfile) {
//         setProfileData(JSON.parse(savedProfile));
//       } else if (user) {
//         setProfileData({
//           name: user.name || "",
//           email: user.email || "",
//           phone: user.phone || "",
//           address: user.address || "",
//           company: user.company || "Daikin",
//           role: user.role || "Administrator",
//           joinDate: user.joinDate || new Date().toLocaleDateString(),
//           department: user.department || "Operations",
//           bio: user.bio || "",
//         });
//       }

//       // Fetch statistics from Supabase
//       try {
//         // Get all analyses for this user
//         const { data: analyses, error } = await supabase
//           .from("analysis_history")
//           .select("*")
//           .order("generated_at", { ascending: false });

//         if (error) {
//           console.error("Error fetching analyses:", error);
//         } else if (analyses) {
//           // Calculate stats
//           const totalAnalyses = analyses.length;
//           const totalHorsepower = analyses.reduce((sum, a) => sum + (a.total_horsepower || 0), 0);
//           const totalSavings = analyses.reduce((sum, a) => sum + (a.annual_savings || 0), 0);
//           const avgEfficiency = analyses.length > 0 
//             ? (analyses.reduce((sum, a) => sum + (a.ai_efficiency || 0), 0) / analyses.length).toFixed(1)
//             : 0;
//           const avgSavingPercentage = analyses.length > 0
//             ? (analyses.reduce((sum, a) => sum + (a.saving_percentage || 0), 0) / analyses.length).toFixed(1)
//             : 0;

//           setStats({
//             totalBuildings: totalAnalyses,
//             totalHorsepower: Math.round(totalHorsepower),
//             avgEfficiency: parseFloat(avgEfficiency),
//             totalSavings: Math.round(totalSavings),
//             totalAnalyses: totalAnalyses,
//             avgSavingPercentage: parseFloat(avgSavingPercentage),
//           });

//           // Get recent analyses (last 5)
//           setRecentAnalyses(analyses.slice(0, 5));
//         }
//       } catch (err) {
//         console.error("Error loading stats:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadProfileAndStats();
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

//   const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
//     <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition-all`}>
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-xs text-slate-500 dark:text-slate-400">{title}</p>
//           <p className="text-xl font-bold text-black dark:text-white">{value}</p>
//           {subtitle && (
//             <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
//           )}
//         </div>
//         <div className={`p-2 rounded-lg ${color}`}>
//           <Icon className="text-white text-sm" />
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

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-slate-600 dark:text-slate-400">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25">
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
//         <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
//           <div className="absolute -bottom-12 left-6 flex items-end gap-4">
//             <div className="relative">
//               <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-xl">
//                 <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
//                   {profileData.name?.charAt(0) || "U"}
//                 </div>
//               </div>
//               <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all">
//                 <FaCamera className="text-xs" />
//               </button>
//             </div>
//             <div className="mb-2">
//               <h2 className="text-xl font-bold text-white drop-shadow-lg">
//                 {profileData.name || "User Name"}
//               </h2>
//               <p className="text-sm text-white/80 drop-shadow-lg">
//                 {profileData.role || "Role"}
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

//               {/* Recent Analyses */}
//               {recentAnalyses.length > 0 && (
//                 <div>
//                   <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 pt-4">
//                     <div className="w-1 h-5 bg-indigo-500 rounded-full" />
//                     Recent Analyses
//                   </h3>
//                   <div className="space-y-2 mt-2">
//                     {recentAnalyses.map((analysis, index) => (
//                       <div 
//                         key={analysis.id || index}
//                         className="p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-200 dark:border-slate-700"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="text-sm font-medium text-black dark:text-white">
//                               {analysis.customer_name || "Unknown Customer"}
//                             </p>
//                             <p className="text-xs text-slate-500 dark:text-slate-400">
//                               {analysis.building_use || "N/A"} • {analysis.total_horsepower || 0} HP
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
//                               {analysis.saving_percentage || 0}% savings
//                             </p>
//                             <p className="text-xs text-slate-500 dark:text-slate-400">
//                               {analysis.generated_at ? new Date(analysis.generated_at).toLocaleDateString() : "N/A"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Right Column - Stats & Quick Actions */}
//             <div className="space-y-4">
//               <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
//                 <div className="w-1 h-5 bg-amber-500 rounded-full" />
//                 Activity Summary
//               </h3>
//               <div className="space-y-3">
//                 <StatCard
//                   icon={FaBuilding}
//                   title="Total Buildings Analyzed"
//                   value={stats.totalBuildings}
//                   color="bg-blue-500"
//                 />
//                 <StatCard
//                   icon={FaTachometerAlt}
//                   title="Total Horsepower"
//                   value={stats.totalHorsepower}
//                   color="bg-indigo-500"
//                   subtitle={`${stats.totalBuildings} buildings analyzed`}
//                 />
//                 <StatCard
//                   icon={FaLeaf}
//                   title="Avg AI Efficiency"
//                   value={`${stats.avgEfficiency}%`}
//                   color="bg-emerald-500"
//                   subtitle={`Avg savings: ${stats.avgSavingPercentage}%`}
//                 />
//                 <StatCard
//                   icon={FaDollarSign}
//                   title="Total Annual Savings"
//                   value={`$${stats.totalSavings.toLocaleString()}`}
//                   color="bg-amber-500"
//                 />
//               </div>

//               {/* Quick Actions */}
//               <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
//                 <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
//                   Quick Actions
//                 </h4>

//                 <div className="space-y-2">
//                   <Link
//                     to="/profile"
//                     className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm text-black dark:text-white no-underline"
//                   >
//                     <FaCog className="text-slate-400" />
//                     <span>Account Settings</span>
//                   </Link>

//                   <Link
//                     to="/profile"
//                     className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm text-black dark:text-white no-underline"
//                   >
//                     <FaShieldAlt className="text-slate-400" />
//                     <span>Security</span>
//                   </Link>

//                   <Link
//                     to="/profile"
//                     className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm text-black dark:text-white no-underline"
//                   >
//                     <FaBell className="text-slate-400" />
//                     <span>Notification Preferences</span>
//                   </Link>

//                   <Link
//                     to="/"
//                     className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all text-sm text-black dark:text-white no-underline"
//                   >
//                     <FaChartLine className="text-slate-400" />
//                     <span>View Dashboard</span>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }