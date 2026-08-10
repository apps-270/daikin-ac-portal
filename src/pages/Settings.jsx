import { useState, useEffect } from "react";
import {
  FaMoon,
  FaSun,
  FaBell,
  FaEnvelope,
  FaSave,
  FaShieldAlt,
  FaPalette,
  FaUser,
  FaLock,
  FaDatabase,
  FaDesktop,
  FaMobile,
  FaLanguage,
  FaCog,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserCircle,
  FaClock,
  FaHistory,
  FaSlidersH,
  FaVolumeUp,
  FaRegBell,
  FaRegEnvelope,
  FaChevronDown,
  FaChevronUp,
  FaLeaf,
  FaBolt,
} from "react-icons/fa";

export default function Settings({
  darkMode,
  setDarkMode,
}) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback to defaults
      }
    }
    return {
      notifications: true,
      emailAlerts: true,
      autoSave: true,
      twoFA: false,
      language: "English",
      themeColor: "Blue",
      soundEffects: true,
      desktopNotifications: false,
      weeklyReports: true,
      dataSharing: false,
      autoUpdate: true,
      compactMode: false,
      vibration: true,
      smartSuggestions: true,
    };
  });

  const [activeTab, setActiveTab] = useState("preferences");
  const [showSaved, setShowSaved] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Load settings on mount
  useEffect(() => {
    const saved = localStorage.getItem("appSettings");
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
  }, []);

  // Apply theme color
  useEffect(() => {
    const root = document.documentElement;
    const colorMap = {
      Blue: "#3b82f6",
      Emerald: "#10b981",
      Teal: "#14b8a6",
      Indigo: "#6366f1",
      Purple: "#8b5cf6",
      Pink: "#ec4899",
      Rose: "#f43f5e",
      Orange: "#f59e0b",
    };
    root.style.setProperty('--accent-color', colorMap[settings.themeColor] || "#3b82f6");
  }, [settings.themeColor]);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    // Auto-save when toggled
    setTimeout(() => {
      const updated = { ...settings, [key]: !settings[key] };
      localStorage.setItem("appSettings", JSON.stringify(updated));
    }, 100);
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setShowLanguageDropdown(false);
  };

  const handleSave = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    setShowSaved(true);
    setSaveMessage("✅ All settings saved successfully!");
    setTimeout(() => {
      setShowSaved(false);
      setSaveMessage("");
    }, 3000);
  };

  // Apply language change
  const handleLanguageChange = (language) => {
    setSettings(prev => ({
      ...prev,
      language: language
    }));
    setShowLanguageDropdown(false);
    console.log("Language changed to:", language);
  };

  // Handle compact mode
  const handleCompactMode = () => {
    const newValue = !settings.compactMode;
    setSettings(prev => ({
      ...prev,
      compactMode: newValue
    }));
    if (newValue) {
      document.documentElement.classList.add("compact-mode");
    } else {
      document.documentElement.classList.remove("compact-mode");
    }
    localStorage.setItem("appSettings", JSON.stringify({ ...settings, compactMode: newValue }));
  };

  // Handle two factor authentication
  const handleTwoFA = () => {
    const newValue = !settings.twoFA;
    setSettings(prev => ({
      ...prev,
      twoFA: newValue
    }));
    if (newValue) {
      alert("🔐 Two Factor Authentication enabled!\n\nYou'll now need to verify your identity when logging in.");
    } else {
      alert("Two Factor Authentication disabled.");
    }
    localStorage.setItem("appSettings", JSON.stringify({ ...settings, twoFA: newValue }));
  };

  // Handle change password
  const handleChangePassword = () => {
    const currentPassword = prompt("Enter your current password:");
    if (!currentPassword) return;
    
    const newPassword = prompt("Enter your new password:");
    if (!newPassword) return;
    
    const confirmPassword = prompt("Confirm your new password:");
    if (newPassword !== confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }
    
    if (newPassword.length < 6) {
      alert("❌ Password must be at least 6 characters!");
      return;
    }
    
    localStorage.setItem("userPassword", newPassword);
    alert("✅ Password changed successfully!");
  };

  // Handle notification preferences
  const handleNotificationsToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    const message = key === 'notifications' 
      ? `Push notifications ${!settings.notifications ? 'enabled' : 'disabled'}`
      : key === 'emailAlerts'
      ? `Email alerts ${!settings.emailAlerts ? 'enabled' : 'disabled'}`
      : `${key} ${!settings[key] ? 'enabled' : 'disabled'}`;
    setSaveMessage(`🔔 ${message}`);
    setTimeout(() => setSaveMessage(""), 2000);
  };

  const tabs = [
    { id: "preferences", label: "Preferences", icon: FaSlidersH },
    { id: "appearance", label: "Appearance", icon: FaPalette },
    { id: "security", label: "Security", icon: FaLock },
    { id: "notifications", label: "Notifications", icon: FaRegBell },
  ];

  const colorOptions = [
    { name: "Blue", class: "bg-blue-500" },
    { name: "Emerald", class: "bg-emerald-500" },
    { name: "Teal", class: "bg-teal-500" },
    { name: "Indigo", class: "bg-indigo-500" },
    { name: "Purple", class: "bg-purple-500" },
    { name: "Pink", class: "bg-pink-500" },
    { name: "Rose", class: "bg-rose-500" },
    { name: "Orange", class: "bg-orange-500" },
  ];

  const languageOptions = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "한국어", flag: "🇰🇷" },
    { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
  ];

  const SettingItem = ({ icon: Icon, title, description, children }) => (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group border border-transparent hover:border-blue-200/30 dark:hover:border-blue-800/20">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-100/80 dark:bg-blue-900/30 flex items-center justify-center text-[#3B82F6] dark:text-[#44C8F5] group-hover:scale-110 transition-all">
          <Icon className="text-base" />
        </div>
        <div>
          <div className="font-medium text-black dark:text-white text-sm">
            {title}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            {description}
          </div>
        </div>
      </div>
      {children}
    </div>
  );

  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
        checked ? 'bg-[#3B82F6] shadow-lg shadow-[#3B82F6]/30' : 'bg-slate-300 dark:bg-slate-600'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#44C8F5] flex items-center justify-center shadow-lg shadow-[#3B82F6]/30">
            <FaCog className="text-xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-black dark:text-white">
              Settings
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Customize your AI Energy Simulator experience
            </p>
          </div>
        </div>
        
        {showSaved && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800/30 animate-fadeIn">
            <FaCheckCircle className="text-emerald-500 text-sm" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              {saveMessage || "Saved!"}
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 mb-6 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/30 dark:border-slate-700/30">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? "bg-white dark:bg-slate-700 text-black dark:text-white shadow-md border border-blue-200/50 dark:border-blue-800/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50"
                }
              `}
            >
              <Icon className={`text-sm ${activeTab === tab.id ? 'text-[#3B82F6] dark:text-[#44C8F5]' : ''}`} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="bg-white/95 dark:bg-slate-900/95 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-slate-800/50 border-2 border-blue-200/30 dark:border-blue-800/20 overflow-hidden">
        <div className="p-6 space-y-6">
          
          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-[#3B82F6] rounded-full" />
                  General
                </h3>
                <div className="space-y-1">
                  <SettingItem
                    icon={FaSave}
                    title="Auto Save"
                    description="Automatically save your changes"
                  >
                    <ToggleSwitch
                      checked={settings.autoSave}
                      onChange={() => handleToggle("autoSave")}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={FaClock}
                    title="Auto Update"
                    description="Automatically update to latest version"
                  >
                    <ToggleSwitch
                      checked={settings.autoUpdate}
                      onChange={() => handleToggle("autoUpdate")}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={FaLeaf}
                    title="Smart Suggestions"
                    description="Get AI-powered energy saving recommendations"
                  >
                    <ToggleSwitch
                      checked={settings.smartSuggestions}
                      onChange={() => handleToggle("smartSuggestions")}
                    />
                  </SettingItem>
                </div>
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
                <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-teal-500 rounded-full" />
                  Language & Region
                </h3>
                <div className="space-y-3">
                  <div className="relative">
                    <button
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                      className="w-full md:w-60 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border-2 border-blue-200/50 dark:border-blue-800/30 hover:border-[#3B82F6] transition-all flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 text-black dark:text-white">
                        <FaLanguage className="text-[#3B82F6] dark:text-[#44C8F5]" />
                        {settings.language}
                      </span>
                      {showLanguageDropdown ? (
                        <FaChevronUp className="text-[#3B82F6] dark:text-[#44C8F5] text-xs" />
                      ) : (
                        <FaChevronDown className="text-[#3B82F6] dark:text-[#44C8F5] text-xs" />
                      )}
                    </button>

                    {showLanguageDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-full md:w-60 bg-white dark:bg-slate-800 rounded-lg border-2 border-blue-200/30 dark:border-blue-800/30 shadow-xl z-50 overflow-hidden animate-fadeIn">
                        {languageOptions.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.name)}
                            className={`
                              w-full px-4 py-2.5 text-left flex items-center gap-3 transition-all text-sm
                              ${settings.language === lang.name
                                ? "bg-blue-50 dark:bg-blue-900/20 text-[#3B82F6] dark:text-[#44C8F5]"
                                : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-black dark:text-white"
                              }
                            `}
                          >
                            <span className="text-lg">{lang.flag}</span>
                            <span className="font-medium">{lang.name}</span>
                            {settings.language === lang.name && (
                              <FaCheckCircle className="ml-auto text-[#3B82F6] dark:text-[#44C8F5] text-sm" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <SettingItem
                    icon={FaHistory}
                    title="Weekly Reports"
                    description="Receive weekly energy summary reports via email"
                  >
                    <ToggleSwitch
                      checked={settings.weeklyReports}
                      onChange={() => handleToggle("weeklyReports")}
                    />
                  </SettingItem>
                </div>
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
                <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-amber-500 rounded-full" />
                  Data & Privacy
                </h3>
                <SettingItem
                  icon={FaDatabase}
                  title="Data Sharing"
                  description="Share anonymous usage data to improve the AI models"
                >
                  <ToggleSwitch
                    checked={settings.dataSharing}
                    onChange={() => handleToggle("dataSharing")}
                  />
                </SettingItem>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-purple-500 rounded-full" />
                  Theme
                </h3>
                <div className="space-y-1">
                  <SettingItem
                    icon={darkMode ? FaMoon : FaSun}
                    title="Dark Mode"
                    description={darkMode ? "Dark theme enabled" : "Light theme enabled"}
                  >
                    <ToggleSwitch
                      checked={darkMode}
                      onChange={() => setDarkMode(!darkMode)}
                    />
                  </SettingItem>

                  <SettingItem
                    icon={FaDesktop}
                    title="Compact Mode"
                    description="Reduce spacing for more content"
                  >
                    <ToggleSwitch
                      checked={settings.compactMode}
                      onChange={handleCompactMode}
                    />
                  </SettingItem>
                </div>
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
                <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-rose-500 rounded-full" />
                  Accent Color
                </h3>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => handleChange("themeColor", color.name)}
                      className={`
                        w-8 h-8 rounded-full ${color.class} transition-all
                        ${settings.themeColor === color.name
                          ? 'ring-2 ring-offset-2 ring-[#3B82F6] dark:ring-offset-slate-900 scale-110 shadow-md'
                          : 'hover:scale-110 hover:shadow-md'
                        }
                      `}
                      title={color.name}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  Selected: <span className="font-medium text-black dark:text-white">{settings.themeColor}</span>
                </p>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-rose-500 rounded-full" />
                Security
              </h3>
              
              <SettingItem
                icon={FaShieldAlt}
                title="Two Factor Authentication"
                description="Add an extra layer of security to your account"
              >
                <ToggleSwitch
                  checked={settings.twoFA}
                  onChange={handleTwoFA}
                />
              </SettingItem>

              {settings.twoFA && (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 animate-fadeIn">
                  <div className="flex items-start gap-2">
                    <FaCheckCircle className="text-emerald-500 mt-0.5 text-sm" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
                        2FA Enabled
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-500">
                        Your account is protected with two-factor authentication.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
                <div className="flex items-start gap-2">
                  <FaExclamationTriangle className="text-amber-500 mt-0.5 text-sm" />
                  <div>
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
                      Security Tip
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-500">
                      Enable Two Factor Authentication to protect your account.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleChangePassword}
                className="w-full md:w-auto px-5 py-2.5 rounded-lg border-2 border-blue-200/50 dark:border-blue-800/30 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center gap-2 font-medium text-sm text-black dark:text-white"
              >
                <FaUserCircle className="text-[#3B82F6] dark:text-[#44C8F5]" />
                Change Password
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-blue-500 rounded-full" />
                Notifications
              </h3>

              <SettingItem
                icon={FaRegBell}
                title="Push Notifications"
                description="Receive notifications in app"
              >
                <ToggleSwitch
                  checked={settings.notifications}
                  onChange={() => handleNotificationsToggle("notifications")}
                />
              </SettingItem>

              <SettingItem
                icon={FaRegEnvelope}
                title="Email Alerts"
                description="Receive notifications via email"
              >
                <ToggleSwitch
                  checked={settings.emailAlerts}
                  onChange={() => handleNotificationsToggle("emailAlerts")}
                />
              </SettingItem>

              <SettingItem
                icon={FaDesktop}
                title="Desktop Notifications"
                description="Show notifications on desktop"
              >
                <ToggleSwitch
                  checked={settings.desktopNotifications}
                  onChange={() => handleNotificationsToggle("desktopNotifications")}
                />
              </SettingItem>

              <SettingItem
                icon={FaVolumeUp}
                title="Sound Effects"
                description="Play sound for notifications"
              >
                <ToggleSwitch
                  checked={settings.soundEffects}
                  onChange={() => handleNotificationsToggle("soundEffects")}
                />
              </SettingItem>

              <SettingItem
                icon={FaMobile}
                title="Vibration"
                description="Vibrate on mobile devices"
              >
                <ToggleSwitch
                  checked={settings.vibration}
                  onChange={() => handleNotificationsToggle("vibration")}
                />
              </SettingItem>
            </div>
          )}

          {/* Save Button */}
          <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleSave}
              className="w-full sm:w-auto px-8 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#44C8F5] hover:from-[#2563EB] hover:to-[#3B82F6] text-white rounded-xl shadow-lg shadow-[#3B82F6]/30 transition-all flex items-center justify-center gap-2 font-medium text-sm hover:scale-[1.02]"
            >
              <FaSave className="text-sm" />
              Save Settings
            </button>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              All changes applied immediately
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// import { useState, useEffect } from "react";
// import {
//   FaMoon,
//   FaSun,
//   FaBell,
//   FaEnvelope,
//   FaSave,
//   FaShieldAlt,
//   FaPalette,
//   FaUser,
//   FaLock,
//   FaDatabase,
//   FaDesktop,
//   FaMobile,
//   FaLanguage,
//   FaCog,
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaUserCircle,
//   FaClock,
//   FaHistory,
//   FaSlidersH,
//   FaVolumeUp,
//   FaRegBell,
//   FaRegEnvelope,
//   FaChevronDown,
//   FaChevronUp,
// } from "react-icons/fa";

// export default function Settings({
//   darkMode,
//   setDarkMode,
// }) {
//   const [settings, setSettings] = useState({
//     notifications: true,
//     emailAlerts: true,
//     autoSave: true,
//     twoFA: false,
//     language: "English",
//     themeColor: "Blue",
//     soundEffects: true,
//     desktopNotifications: false,
//     weeklyReports: true,
//     dataSharing: false,
//     autoUpdate: true,
//     compactMode: false,
//     vibration: true,
//     smartSuggestions: true,
//   });

//   const [activeTab, setActiveTab] = useState("preferences");
//   const [showSaved, setShowSaved] = useState(false);
//   const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

//   // Apply theme color
//   useEffect(() => {
//     const root = document.documentElement;
//     const colorMap = {
//       Blue: "#3b82f6",
//       Indigo: "#6366f1",
//       Purple: "#8b5cf6",
//       Pink: "#ec4899",
//       Rose: "#f43f5e",
//       Emerald: "#10b981",
//       Teal: "#14b8a6",
//       Orange: "#f59e0b",
//     };
//     root.style.setProperty('--accent-color', colorMap[settings.themeColor] || "#3b82f6");
//   }, [settings.themeColor]);

//   const handleToggle = (key) => {
//     setSettings(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const handleChange = (key, value) => {
//     setSettings(prev => ({
//       ...prev,
//       [key]: value
//     }));
//     setShowLanguageDropdown(false);
//   };

//   const handleSave = () => {
//     setShowSaved(true);
//     setTimeout(() => setShowSaved(false), 3000);
//   };

//   const tabs = [
//     { id: "preferences", label: "Preferences", icon: FaSlidersH },
//     { id: "appearance", label: "Appearance", icon: FaPalette },
//     { id: "security", label: "Security", icon: FaLock },
//     { id: "notifications", label: "Notifications", icon: FaRegBell },
//   ];

//   const colorOptions = [
//     { name: "Blue", class: "bg-blue-500" },
//     { name: "Indigo", class: "bg-indigo-500" },
//     { name: "Purple", class: "bg-purple-500" },
//     { name: "Pink", class: "bg-pink-500" },
//     { name: "Rose", class: "bg-rose-500" },
//     { name: "Emerald", class: "bg-emerald-500" },
//     { name: "Teal", class: "bg-teal-500" },
//     { name: "Orange", class: "bg-orange-500" },
//   ];

//   const languageOptions = [
//     { code: "en", name: "English", flag: "🇬🇧" },
//     { code: "zh", name: "中文", flag: "🇨🇳" },
//     { code: "ja", name: "日本語", flag: "🇯🇵" },
//     { code: "ko", name: "한국어", flag: "🇰🇷" },
//     { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
//     { code: "es", name: "Español", flag: "🇪🇸" },
//     { code: "fr", name: "Français", flag: "🇫🇷" },
//     { code: "de", name: "Deutsch", flag: "🇩🇪" },
//   ];

//   const SettingItem = ({ icon: Icon, title, description, children }) => (
//     <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all cursor-pointer group">
//       <div className="flex items-center gap-3">
//         <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:scale-110 transition-all">
//           <Icon className="text-base" />
//         </div>
//         <div>
//           <div className="font-medium text-black dark:text-white text-sm">
//             {title}
//           </div>
//           <div className="text-xs text-slate-600 dark:text-slate-400">
//             {description}
//           </div>
//         </div>
//       </div>
//       {children}
//     </div>
//   );

//   const ToggleSwitch = ({ checked, onChange }) => (
//     <button
//       onClick={onChange}
//       className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
//         checked ? 'bg-blue-500 shadow-lg shadow-blue-500/25' : 'bg-slate-300 dark:bg-slate-600'
//       }`}
//     >
//       <span
//         className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
//           checked ? 'translate-x-5' : 'translate-x-0'
//         }`}
//       />
//     </button>
//   );

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
//             <FaCog className="text-xl text-white" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold text-black dark:text-white">
//               Settings
//             </h1>
//             <p className="text-sm text-slate-600 dark:text-slate-400">
//               Customize your experience
//             </p>
//           </div>
//         </div>
        
//         {showSaved && (
//           <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800/30 animate-fadeIn">
//             <FaCheckCircle className="text-emerald-500 text-sm" />
//             <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
//               Saved!
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-1 p-1 mb-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           return (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`
//                 flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
//                 ${activeTab === tab.id
//                   ? "bg-white dark:bg-slate-700 text-black dark:text-white shadow-md"
//                   : "text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
//                 }
//               `}
//             >
//               <Icon className="text-sm" />
//               <span className="hidden sm:inline">{tab.label}</span>
//             </button>
//           );
//         })}
//       </div>

//       {/* Content */}
//       <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
//         <div className="p-6 space-y-6">
          
//           {/* Preferences Tab */}
//           {activeTab === "preferences" && (
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
//                   <span className="w-1 h-5 bg-blue-500 rounded-full" />
//                   General
//                 </h3>
//                 <div className="space-y-1">
//                   <SettingItem
//                     icon={FaSave}
//                     title="Auto Save"
//                     description="Automatically save your changes"
//                   >
//                     <ToggleSwitch
//                       checked={settings.autoSave}
//                       onChange={() => handleToggle("autoSave")}
//                     />
//                   </SettingItem>

//                   <SettingItem
//                     icon={FaClock}
//                     title="Auto Update"
//                     description="Automatically update to latest version"
//                   >
//                     <ToggleSwitch
//                       checked={settings.autoUpdate}
//                       onChange={() => handleToggle("autoUpdate")}
//                     />
//                   </SettingItem>

//                   <SettingItem
//                     icon={FaDatabase}
//                     title="Smart Suggestions"
//                     description="Get AI-powered recommendations"
//                   >
//                     <ToggleSwitch
//                       checked={settings.smartSuggestions}
//                       onChange={() => handleToggle("smartSuggestions")}
//                     />
//                   </SettingItem>
//                 </div>
//               </div>

//               <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
//                 <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
//                   <span className="w-1 h-5 bg-emerald-500 rounded-full" />
//                   Language & Region
//                 </h3>
//                 <div className="space-y-3">
//                   <div className="relative">
//                     <button
//                       onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
//                       className="w-full md:w-60 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all flex items-center justify-between text-sm"
//                     >
//                       <span className="flex items-center gap-2 text-black dark:text-white">
//                         <FaLanguage className="text-slate-600 dark:text-slate-400" />
//                         {settings.language}
//                       </span>
//                       {showLanguageDropdown ? (
//                         <FaChevronUp className="text-slate-600 dark:text-slate-400 text-xs" />
//                       ) : (
//                         <FaChevronDown className="text-slate-600 dark:text-slate-400 text-xs" />
//                       )}
//                     </button>

//                     {showLanguageDropdown && (
//                       <div className="absolute top-full left-0 mt-1 w-full md:w-60 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden animate-fadeIn">
//                         {languageOptions.map((lang) => (
//                           <button
//                             key={lang.code}
//                             onClick={() => handleChange("language", lang.name)}
//                             className={`
//                               w-full px-4 py-2.5 text-left flex items-center gap-3 transition-all text-sm
//                               ${settings.language === lang.name
//                                 ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
//                                 : "hover:bg-slate-50 dark:hover:bg-slate-700/50 text-black dark:text-white"
//                               }
//                             `}
//                           >
//                             <span className="text-lg">{lang.flag}</span>
//                             <span className="font-medium">{lang.name}</span>
//                             {settings.language === lang.name && (
//                               <FaCheckCircle className="ml-auto text-blue-500 text-sm" />
//                             )}
//                           </button>
//                         ))}
//                       </div>
//                     )}
//                   </div>

//                   <SettingItem
//                     icon={FaHistory}
//                     title="Weekly Reports"
//                     description="Receive weekly summary reports via email"
//                   >
//                     <ToggleSwitch
//                       checked={settings.weeklyReports}
//                       onChange={() => handleToggle("weeklyReports")}
//                     />
//                   </SettingItem>
//                 </div>
//               </div>

//               <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
//                 <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
//                   <span className="w-1 h-5 bg-amber-500 rounded-full" />
//                   Data & Privacy
//                 </h3>
//                 <SettingItem
//                   icon={FaDatabase}
//                   title="Data Sharing"
//                   description="Share anonymous usage data to improve the app"
//                 >
//                   <ToggleSwitch
//                     checked={settings.dataSharing}
//                     onChange={() => handleToggle("dataSharing")}
//                   />
//                 </SettingItem>
//               </div>
//             </div>
//           )}

//           {/* Appearance Tab */}
//           {activeTab === "appearance" && (
//             <div className="space-y-6">
//               <div>
//                 <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
//                   <span className="w-1 h-5 bg-purple-500 rounded-full" />
//                   Theme
//                 </h3>
//                 <div className="space-y-1">
//                   <SettingItem
//                     icon={darkMode ? FaMoon : FaSun}
//                     title="Dark Mode"
//                     description={darkMode ? "Dark theme enabled" : "Light theme enabled"}
//                   >
//                     <ToggleSwitch
//                       checked={darkMode}
//                       onChange={() => setDarkMode(!darkMode)}
//                     />
//                   </SettingItem>

//                   <SettingItem
//                     icon={FaDesktop}
//                     title="Compact Mode"
//                     description="Reduce spacing for more content"
//                   >
//                     <ToggleSwitch
//                       checked={settings.compactMode}
//                       onChange={() => handleToggle("compactMode")}
//                     />
//                   </SettingItem>
//                 </div>
//               </div>

//               <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
//                 <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
//                   <span className="w-1 h-5 bg-rose-500 rounded-full" />
//                   Accent Color
//                 </h3>
//                 <div className="flex flex-wrap gap-2">
//                   {colorOptions.map((color) => (
//                     <button
//                       key={color.name}
//                       onClick={() => handleChange("themeColor", color.name)}
//                       className={`
//                         w-8 h-8 rounded-full ${color.class} transition-all
//                         ${settings.themeColor === color.name
//                           ? 'ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-900 scale-110 shadow-md'
//                           : 'hover:scale-110 hover:shadow-md'
//                         }
//                       `}
//                       title={color.name}
//                     />
//                   ))}
//                 </div>
//                 <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
//                   Selected: <span className="font-medium text-black dark:text-white">{settings.themeColor}</span>
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Security Tab */}
//           {activeTab === "security" && (
//             <div className="space-y-6">
//               <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
//                 <span className="w-1 h-5 bg-rose-500 rounded-full" />
//                 Security
//               </h3>
              
//               <SettingItem
//                 icon={FaShieldAlt}
//                 title="Two Factor Authentication"
//                 description="Add an extra layer of security to your account"
//               >
//                 <ToggleSwitch
//                   checked={settings.twoFA}
//                   onChange={() => handleToggle("twoFA")}
//                 />
//               </SettingItem>

//               {settings.twoFA && (
//                 <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 animate-fadeIn">
//                   <div className="flex items-start gap-2">
//                     <FaCheckCircle className="text-emerald-500 mt-0.5 text-sm" />
//                     <div>
//                       <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">
//                         2FA Enabled
//                       </p>
//                       <p className="text-xs text-emerald-700 dark:text-emerald-500">
//                         Your account is protected with two-factor authentication.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30">
//                 <div className="flex items-start gap-2">
//                   <FaExclamationTriangle className="text-amber-500 mt-0.5 text-sm" />
//                   <div>
//                     <p className="text-sm font-medium text-amber-800 dark:text-amber-400">
//                       Security Tip
//                     </p>
//                     <p className="text-xs text-amber-700 dark:text-amber-500">
//                       Enable Two Factor Authentication to protect your account.
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <button className="w-full md:w-auto px-5 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 font-medium text-sm text-black dark:text-white">
//                 <FaUserCircle className="text-slate-600 dark:text-slate-400" />
//                 Change Password
//               </button>
//             </div>
//           )}

//           {/* Notifications Tab */}
//           {activeTab === "notifications" && (
//             <div className="space-y-4">
//               <h3 className="text-sm font-semibold text-black dark:text-white mb-3 flex items-center gap-2">
//                 <span className="w-1 h-5 bg-blue-500 rounded-full" />
//                 Notifications
//               </h3>

//               <SettingItem
//                 icon={FaRegBell}
//                 title="Push Notifications"
//                 description="Receive notifications in app"
//               >
//                 <ToggleSwitch
//                   checked={settings.notifications}
//                   onChange={() => handleToggle("notifications")}
//                 />
//               </SettingItem>

//               <SettingItem
//                 icon={FaRegEnvelope}
//                 title="Email Alerts"
//                 description="Receive notifications via email"
//               >
//                 <ToggleSwitch
//                   checked={settings.emailAlerts}
//                   onChange={() => handleToggle("emailAlerts")}
//                 />
//               </SettingItem>

//               <SettingItem
//                 icon={FaDesktop}
//                 title="Desktop Notifications"
//                 description="Show notifications on desktop"
//               >
//                 <ToggleSwitch
//                   checked={settings.desktopNotifications}
//                   onChange={() => handleToggle("desktopNotifications")}
//                 />
//               </SettingItem>

//               <SettingItem
//                 icon={FaVolumeUp}
//                 title="Sound Effects"
//                 description="Play sound for notifications"
//               >
//                 <ToggleSwitch
//                   checked={settings.soundEffects}
//                   onChange={() => handleToggle("soundEffects")}
//                 />
//               </SettingItem>

//               <SettingItem
//                 icon={FaMobile}
//                 title="Vibration"
//                 description="Vibrate on mobile devices"
//               >
//                 <ToggleSwitch
//                   checked={settings.vibration}
//                   onChange={() => handleToggle("vibration")}
//                 />
//               </SettingItem>
//             </div>
//           )}

//           {/* Save Button */}
//           <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6 flex flex-col sm:flex-row items-center gap-3">
//             <button
//               onClick={handleSave}
//               className="w-full sm:w-auto px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 font-medium text-sm"
//             >
//               <FaSave className="text-sm" />
//               Save Settings
//             </button>
//             <p className="text-sm text-slate-600 dark:text-slate-400">
//               All changes applied immediately
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }