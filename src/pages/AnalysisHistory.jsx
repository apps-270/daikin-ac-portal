import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabase";
import {
  FaHistory,
  FaTrash,
  FaDownload,
  FaSearch,
  FaTimes,
  FaSync,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaArrowLeft,
  FaExpand,
  FaCompress,
  FaUser,
  FaBuilding,
  FaCalendarAlt,
  FaDollarSign,
  FaLeaf,
  FaBolt,
  FaClock,
  FaEye,
  FaEyeSlash,
  FaMapMarkerAlt,
  FaArrowRight,
  FaLightbulb,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend,
} from "recharts";

export default function AnalysisHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [deleting, setDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, types: {} });
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Add darkMode detection
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             document.documentElement.classList.contains('dark-mode');
    }
    return false;
  });

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark') || 
                     document.documentElement.classList.contains('dark-mode');
      setDarkMode(isDark);
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'N/A';
    
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    if (diffInSeconds < 0) return formatDate(dateString);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    } else if (diffInSeconds < 2592000) {
      const weeks = Math.floor(diffInSeconds / 604800);
      return `${weeks}w ago`;
    } else if (diffInSeconds < 31536000) {
      const months = Math.floor(diffInSeconds / 2592000);
      return `${months}mo ago`;
    } else {
      const years = Math.floor(diffInSeconds / 31536000);
      return `${years}y ago`;
    }
  };

  const formatDate = (d) => {
    if (!d) return 'N/A';
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("analysis_history")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;
      setHistory(data || []);
      calculateStats(data || []);
      localStorage.setItem("analysis_history", JSON.stringify(data || []));
    } catch (err) {
      setError(err.message);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const typeCount = {};
    data.forEach(item => {
      if (item.building_use) {
        typeCount[item.building_use] = (typeCount[item.building_use] || 0) + 1;
      }
    });
    setStats({ total: data.length, types: typeCount });
  };

  const deleteRecord = async (id) => {
    if (!confirm("Delete this record?")) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("analysis_history").delete().eq("id", id);
      if (error) throw error;
      const updated = history.filter(item => item.id !== id);
      setHistory(updated);
      calculateStats(updated);
      localStorage.setItem("analysis_history", JSON.stringify(updated));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    } finally {
      setDeleting(false);
    }
  };

  const downloadReport = () => {
    if (!history.length) return alert("No history to export.");
    const report = history.map((item, i) => `
Record #${i + 1}
Customer: ${item.customer_name || 'N/A'}
Building: ${item.building_use || 'N/A'}
AI Efficiency: ${item.ai_efficiency || 0}%
Energy Saved: ${item.saving_percentage || 0}%
Annual Savings: $${item.annual_savings || 0}
ROI: ${item.roi_in_years || 0} years
`).join('\n---\n');
    
    const blob = new Blob([report], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const getFiltered = () => {
    let filtered = history;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.customer_name?.toLowerCase().includes(term) ||
        item.building_use?.toLowerCase().includes(term) ||
        item.email?.toLowerCase().includes(term)
      );
    }
    if (filterType !== "all") {
      filtered = filtered.filter(item => item.building_use === filterType);
    }
    return filtered;
  };

  const filteredHistory = getFiltered();
  const buildingTypes = [...new Set(history.map(item => item.building_use).filter(Boolean))];
  const getInitials = (name) => (name || "Unknown")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();

  const DetailsModal = ({ item, onClose }) => {
    if (!item) return null;

    const chartData = [
      { name: "Base", value: item.base_efficiency || 0 },
      { name: "AI", value: item.ai_efficiency || 0 },
    ];
    const pieData = [
      { name: "Without AI", value: item.without_ai || 0, color: "#cbd5e1" },
      { name: "With AI", value: item.with_ai || 0, color: "#3b82f6" },
    ];
    const lineData = [
      { metric: "Efficiency", "Without AI": item.base_efficiency || 0, "With AI": item.ai_efficiency || 0 },
      { metric: "Energy Saved", "Without AI": 0, "With AI": item.saving_percentage || 0 },
      { metric: "ROI", "Without AI": 0, "With AI": parseFloat(item.roi_in_years || 0) * 10 },
    ];

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl rounded-[40px] border border-white/20 dark:border-slate-700/30 animate-scaleIn">
          <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/30 dark:border-slate-700/30 p-6 z-10 rounded-t-[40px]">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  {item.customer_name || 'Analysis Details'}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {item.building_use || 'Building'} • {formatDate(item.generated_at)}
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Stats Grid - Enhanced light mode highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 dark:from-blue-900/20 dark:to-blue-900/5 p-5 rounded-[32px] border-2 border-blue-300/60 dark:border-blue-500/30 shadow-md shadow-blue-100/50 dark:shadow-none transition-all hover:scale-[1.02] hover:shadow-lg">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wider">AI Efficiency</p>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1">{item.ai_efficiency || 0}%</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-900/20 dark:to-emerald-900/5 p-5 rounded-[32px] border-2 border-emerald-300/60 dark:border-emerald-500/30 shadow-md shadow-emerald-100/50 dark:shadow-none transition-all hover:scale-[1.02] hover:shadow-lg">
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Energy Saved</p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{item.saving_percentage || 0}%</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/60 dark:from-purple-900/20 dark:to-purple-900/5 p-5 rounded-[32px] border-2 border-purple-300/60 dark:border-purple-500/30 shadow-md shadow-purple-100/50 dark:shadow-none transition-all hover:scale-[1.02] hover:shadow-lg">
                <p className="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase tracking-wider">Annual Savings</p>
                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-1">${item.annual_savings || 0}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-900/20 dark:to-amber-900/5 p-5 rounded-[32px] border-2 border-amber-300/60 dark:border-amber-500/30 shadow-md shadow-amber-100/50 dark:shadow-none transition-all hover:scale-[1.02] hover:shadow-lg">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wider">ROI</p>
                <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 mt-1">{item.roi_in_years || 0}y</p>
              </div>
            </div>

            {/* Charts - Glass morphism */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-5 rounded-[32px] border-2 border-blue-200/30 dark:border-blue-800/20 shadow-lg shadow-blue-100/20 dark:shadow-none transition-all hover:shadow-xl">
                <h3 className="text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FaChartLine className="text-[#3B82F6] text-sm" />
                  Efficiency Comparison
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tick={{ fill: '#64748b' }} />
                    <YAxis stroke="#64748b" fontSize={12} tick={{ fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }} 
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? '#94a3b8' : '#3b82f6'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-5 rounded-[32px] border-2 border-blue-200/30 dark:border-blue-800/20 shadow-lg shadow-blue-100/20 dark:shadow-none transition-all hover:shadow-xl">
                <h3 className="text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FaChartLine className="text-purple-500 text-sm" />
                  Energy Distribution
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label>
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }} 
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-2 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-5 rounded-[32px] border-2 border-blue-200/30 dark:border-blue-800/20 shadow-lg shadow-blue-100/20 dark:shadow-none transition-all hover:shadow-xl">
                <h3 className="text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <FaChartLine className="text-emerald-500 text-sm" />
                  Performance Comparison
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                    <XAxis dataKey="metric" stroke="#64748b" fontSize={12} tick={{ fill: '#64748b' }} />
                    <YAxis stroke="#64748b" fontSize={12} tick={{ fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '16px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Without AI" stroke="#94a3b8" strokeWidth={3} />
                    <Line type="monotone" dataKey="With AI" stroke="#3b82f6" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Details - Glass pill */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white/60 dark:bg-slate-800/40 backdrop-blur-sm p-5 rounded-[32px] border-2 border-blue-200/30 dark:border-blue-800/20 shadow-lg shadow-blue-100/20 dark:shadow-none">
              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Customer</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-1 flex items-center justify-center gap-2">
                  <FaUser className="text-[#3B82F6] text-xs" />
                  {item.customer_name || 'N/A'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Building</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-1 flex items-center justify-center gap-2">
                  <FaBuilding className="text-[#3B82F6] text-xs" />
                  {item.building_use || 'N/A'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Age</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-1 flex items-center justify-center gap-2">
                  <FaCalendarAlt className="text-[#3B82F6] text-xs" />
                  {item.building_age || 0} years
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hours</p>
                <p className="font-semibold text-slate-900 dark:text-white mt-1 flex items-center justify-center gap-2">
                  <FaClock className="text-[#3B82F6] text-xs" />
                  {item.operating_hours || 0}h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 border-4 border-slate-200/30 dark:border-slate-700/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-[#3B82F6] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-4 font-medium">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showModal && selectedItem && (
        <DetailsModal item={selectedItem} onClose={() => { setShowModal(false); setSelectedItem(null); }} />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 bg-gradient-to-b from-slate-50/30 to-white/30 dark:from-slate-900/30 dark:to-slate-800/30 min-h-screen">
        {/* Header - Fluid glass morphism */}
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-white/80 via-white/60 to-blue-50/40 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-blue-950/30 backdrop-blur-xl p-6 border border-white/20 dark:border-slate-700/30 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
          
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#44C8F5] to-[#3B82F6] rounded-[24px] blur-xl opacity-40 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-[#44C8F5] to-[#3B82F6] p-3 rounded-[24px] text-white shadow-lg shadow-[#44C8F5]/30">
                  <FaHistory className="text-2xl text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">History</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">View all your energy analysis records</p>
              </div>
              {stats.total > 0 && (
                <span className="ml-2 rounded-full bg-blue-500/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20 animate-fadeIn">
                  {stats.total} records
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={fetchHistory} 
                className="rounded-full border-2 border-blue-200/50 dark:border-blue-800/30 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 transition-all duration-200 hover:scale-105 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:border-blue-400/50 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                title="Refresh"
              >
                <FaSync className={`text-sm text-[#3B82F6] dark:text-[#44C8F5] ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button 
                onClick={downloadReport} 
                disabled={!history.length} 
                className={`rounded-full p-3 transition-all duration-200 ${
                  history.length 
                    ? 'bg-gradient-to-r from-[#44C8F5] to-[#3B82F6] text-white shadow-lg shadow-[#44C8F5]/30 hover:shadow-xl hover:shadow-[#44C8F5]/40 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-blue-500/30' 
                    : 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed backdrop-blur-sm'
                }`}
              >
                <FaDownload className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Error - Soft glass */}
        {error && (
          <div className="p-5 rounded-[32px] bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm border-2 border-red-200/50 dark:border-red-800/30 text-red-700 dark:text-red-400 shadow-lg shadow-red-100/20 dark:shadow-none animate-fadeIn">
            <p className="font-medium flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              {error}
            </p>
            <button onClick={fetchHistory} className="text-sm underline mt-2 hover:text-red-800 dark:hover:text-red-300 transition-colors">Try again</button>
          </div>
        )}

        {/* Stats - Fluid pills */}
        {stats.total > 0 && !error && (
          <div className="grid grid-cols-2 gap-3 animate-fadeIn">
            <div className="group rounded-[32px] bg-gradient-to-br from-white/80 to-slate-50/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-sm p-5 border-2 border-blue-200/30 dark:border-blue-800/20 shadow-lg shadow-blue-100/20 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-blue-300/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Records</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">{stats.total}</p>
                </div>
                <div className="rounded-full bg-gradient-to-br from-[#44C8F5]/10 to-[#3B82F6]/10 p-3 text-[#3B82F6] dark:text-[#44C8F5] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]">
                  <FaChartLine className="text-xl" />
                </div>
              </div>
            </div>
            <div className="group rounded-[32px] bg-gradient-to-br from-white/80 to-slate-50/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-sm p-5 border-2 border-blue-200/30 dark:border-blue-800/20 shadow-lg shadow-blue-100/20 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-blue-300/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Building Types</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">{Object.keys(stats.types).length}</p>
                </div>
                <div className="rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-3 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
                  <FaBuilding className="text-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filter - Fluid glass */}
        {history.length > 0 && !error && (
          <div className="flex flex-col gap-3 rounded-[40px] bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-4 border-2 border-blue-200/30 dark:border-blue-800/20 shadow-lg shadow-blue-100/20 dark:shadow-none sm:flex-row transition-all duration-300 hover:shadow-xl">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-sm" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-full border-2 border-blue-200/50 dark:border-blue-800/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-3 pl-11 pr-10 text-slate-900 dark:text-white shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-[#3B82F6]/50 focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#3B82F6] dark:hover:text-[#44C8F5] transition-colors">
                  <FaTimes className="text-sm" />
                </button>
              )}
            </div>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="rounded-full border-2 border-blue-200/50 dark:border-blue-800/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-5 py-3 text-slate-900 dark:text-white shadow-sm transition-all duration-200 hover:border-[#3B82F6]/50 dark:hover:border-[#44C8F5]/50 focus:border-[#3B82F6]/50 focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 cursor-pointer"
            >
              <option value="all">All Types</option>
              {buildingTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        )}

        {/* Empty State - Fluid glass */}
        {!history.length && !loading && !error && (
          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-white/80 to-slate-50/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-sm p-16 text-center border-2 border-blue-200/30 dark:border-blue-800/20 shadow-xl animate-fadeIn">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="text-7xl mb-4 animate-bounce">📊</div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">No Records Yet</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Run your first energy analysis simulation to start building your history.</p>
            </div>
          </div>
        )}

        {/* Cards - Fluid glass with enhanced light mode highlights */}
        {filteredHistory.length > 0 && !error && (
          <div className="space-y-4 animate-fadeIn">
            {filteredHistory.map((item, index) => (
              <div 
                key={item.id} 
                className="group relative overflow-hidden rounded-[32px] bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border-2 border-blue-200/30 dark:border-blue-800/20 shadow-lg shadow-blue-100/20 dark:shadow-none transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:border-blue-300/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#44C8F5] to-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="p-6 relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#44C8F5] to-[#3B82F6] rounded-[20px] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#44C8F5] to-[#3B82F6] text-sm font-bold tracking-wide text-white shadow-lg shadow-[#44C8F5]/30 group-hover:shadow-[#44C8F5]/40 transition-all duration-300 group-hover:scale-105">
                          {getInitials(item.customer_name)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white group-hover:text-[#3B82F6] dark:group-hover:text-[#44C8F5] transition-colors duration-300">
                            {item.customer_name || 'Unknown'}
                          </h3>
                          <span className="text-xs px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-500/20 backdrop-blur-sm text-blue-700 dark:text-blue-400 font-medium border border-blue-300/50 dark:border-blue-500/30">
                            {item.building_use || 'Building'}
                          </span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <FaClock className="text-xs text-[#3B82F6] dark:text-[#44C8F5]" />
                            {formatTimeAgo(item.generated_at)}
                          </span>
                          <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                          <span className="inline-flex items-center gap-1.5">
                            <FaCalendarAlt className="text-xs text-[#3B82F6] dark:text-[#44C8F5]" />
                            {formatDate(item.generated_at)}
                          </span>
                          <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <FaLeaf className="text-xs" />
                            {item.saving_percentage || 0}% saved
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => deleteRecord(item.id)} 
                        disabled={deleting} 
                        className="rounded-full p-2.5 text-slate-400 transition-all duration-200 hover:bg-red-50/80 hover:text-red-600 hover:scale-110 dark:hover:bg-red-900/20"
                        title="Delete record"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                      <button 
                        onClick={() => handleViewDetails(item)}
                        className="rounded-full p-2.5 text-slate-400 transition-all duration-200 hover:scale-110 hover:bg-blue-50/80 hover:text-[#3B82F6] dark:hover:bg-blue-900/20"
                        title="View Details"
                      >
                        <FaEye className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats - Enhanced light mode highlights */}
                  <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/30 dark:border-slate-700/30">
                    <div className="text-center bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200/30 dark:border-slate-700/30 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Base Eff.</p>
                      <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{item.base_efficiency || 0}%</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-900/30 dark:to-blue-900/10 rounded-2xl p-3 border-2 border-blue-300/60 dark:border-blue-500/30 shadow-md shadow-blue-100/50 dark:shadow-none transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <p className="text-xs text-blue-700 dark:text-blue-400 font-medium uppercase tracking-wider">AI Eff.</p>
                      <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-1">{item.ai_efficiency || 0}%</p>
                    </div>
                    <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100/70 dark:from-purple-900/30 dark:to-purple-900/10 rounded-2xl p-3 border-2 border-purple-300/60 dark:border-purple-500/30 shadow-md shadow-purple-100/50 dark:shadow-none transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                      <p className="text-xs text-purple-700 dark:text-purple-400 font-medium uppercase tracking-wider">ROI</p>
                      <p className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-1">{item.roi_in_years || 0}y</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredHistory.length === 0 && history.length > 0 && !error && (
          <div className="rounded-[40px] bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 text-center border-2 border-blue-200/30 dark:border-blue-800/20 shadow-lg animate-fadeIn">
            <p className="text-slate-500 dark:text-slate-400">No matches found for your search.</p>
            <button 
              onClick={() => { setSearchTerm(''); setFilterType('all'); }} 
              className="mt-3 text-[#3B82F6] dark:text-[#44C8F5] hover:underline font-medium transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </>
  );
}// import { useEffect, useState, useRef } from "react";
// import { supabase } from "../supabase";
// import {
//   FaHistory,
//   FaTrash,
//   FaDownload,
//   FaSearch,
//   FaTimes,
//   FaSync,
//   FaChartLine,
//   FaChevronDown,
//   FaChevronUp,
//   FaArrowLeft,
//   FaExpand,
//   FaCompress,
//   FaUser,
//   FaBuilding,
//   FaCalendarAlt,
//   FaDollarSign,
//   FaLeaf,
//   FaBolt,
//   FaClock,
//   FaEye,
//   FaEyeSlash,
//   FaMapMarkerAlt,
//   FaArrowRight,
//   FaLightbulb,
// } from "react-icons/fa";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Cell,
//   PieChart,
//   Pie,
//   LineChart,
//   Line,
//   Legend,
// } from "recharts";

// export default function AnalysisHistory() {
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all");
//   const [deleting, setDeleting] = useState(false);
//   const [stats, setStats] = useState({ total: 0, types: {} });
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const formatTimeAgo = (dateString) => {
//     if (!dateString) return 'N/A';
    
//     const now = new Date();
//     const past = new Date(dateString);
//     const diffInSeconds = Math.floor((now - past) / 1000);
    
//     if (diffInSeconds < 0) return formatDate(dateString);
    
//     if (diffInSeconds < 60) {
//       return 'Just now';
//     } else if (diffInSeconds < 3600) {
//       const minutes = Math.floor(diffInSeconds / 60);
//       return `${minutes}m ago`;
//     } else if (diffInSeconds < 86400) {
//       const hours = Math.floor(diffInSeconds / 3600);
//       return `${hours}h ago`;
//     } else if (diffInSeconds < 604800) {
//       const days = Math.floor(diffInSeconds / 86400);
//       return `${days}d ago`;
//     } else if (diffInSeconds < 2592000) {
//       const weeks = Math.floor(diffInSeconds / 604800);
//       return `${weeks}w ago`;
//     } else if (diffInSeconds < 31536000) {
//       const months = Math.floor(diffInSeconds / 2592000);
//       return `${months}mo ago`;
//     } else {
//       const years = Math.floor(diffInSeconds / 31536000);
//       return `${years}y ago`;
//     }
//   };

//   const formatDate = (d) => {
//     if (!d) return 'N/A';
//     const date = new Date(d);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const fetchHistory = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const { data, error } = await supabase
//         .from("analysis_history")
//         .select("*")
//         .order("id", { ascending: false });

//       if (error) throw error;
//       setHistory(data || []);
//       calculateStats(data || []);
//       localStorage.setItem("analysis_history", JSON.stringify(data || []));
//     } catch (err) {
//       setError(err.message);
//       setHistory([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (data) => {
//     const typeCount = {};
//     data.forEach(item => {
//       if (item.building_use) {
//         typeCount[item.building_use] = (typeCount[item.building_use] || 0) + 1;
//       }
//     });
//     setStats({ total: data.length, types: typeCount });
//   };

//   const deleteRecord = async (id) => {
//     if (!confirm("Delete this record?")) return;
//     setDeleting(true);
//     try {
//       const { error } = await supabase.from("analysis_history").delete().eq("id", id);
//       if (error) throw error;
//       const updated = history.filter(item => item.id !== id);
//       setHistory(updated);
//       calculateStats(updated);
//       localStorage.setItem("analysis_history", JSON.stringify(updated));
//     } catch (err) {
//       alert("Failed to delete: " + err.message);
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const downloadReport = () => {
//     if (!history.length) return alert("No history to export.");
//     const report = history.map((item, i) => `
// Record #${i + 1}
// Customer: ${item.customer_name || 'N/A'}
// Building: ${item.building_use || 'N/A'}
// AI Efficiency: ${item.ai_efficiency || 0}%
// Energy Saved: ${item.saving_percentage || 0}%
// Annual Savings: $${item.annual_savings || 0}
// ROI: ${item.roi_in_years || 0} years
// `).join('\n---\n');
    
//     const blob = new Blob([report], { type: "text/plain" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = `Report_${new Date().toISOString().split('T')[0]}.txt`;
//     a.click();
//     URL.revokeObjectURL(a.href);
//   };

//   const getFiltered = () => {
//     let filtered = history;
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(item =>
//         item.customer_name?.toLowerCase().includes(term) ||
//         item.building_use?.toLowerCase().includes(term) ||
//         item.email?.toLowerCase().includes(term)
//       );
//     }
//     if (filterType !== "all") {
//       filtered = filtered.filter(item => item.building_use === filterType);
//     }
//     return filtered;
//   };

//   const filteredHistory = getFiltered();
//   const buildingTypes = [...new Set(history.map(item => item.building_use).filter(Boolean))];
//   const getInitials = (name) => (name || "Unknown")
//     .split(" ")
//     .filter(Boolean)
//     .slice(0, 2)
//     .map(part => part[0])
//     .join("")
//     .toUpperCase();

//   const DetailsModal = ({ item, onClose }) => {
//     if (!item) return null;

//     const chartData = [
//       { name: "Base", value: item.base_efficiency || 0 },
//       { name: "AI", value: item.ai_efficiency || 0 },
//     ];
//     const pieData = [
//       { name: "Without AI", value: item.without_ai || 0, color: "#cbd5e1" },
//       { name: "With AI", value: item.with_ai || 0, color: "#3b82f6" },
//     ];
//     const lineData = [
//       { metric: "Efficiency", "Without AI": item.base_efficiency || 0, "With AI": item.ai_efficiency || 0 },
//       { metric: "Energy Saved", "Without AI": 0, "With AI": item.saving_percentage || 0 },
//       { metric: "ROI", "Without AI": 0, "With AI": parseFloat(item.roi_in_years || 0) * 10 },
//     ];

//     return (
//       <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
//         <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
//         <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl rounded-[40px] border border-white/20 dark:border-slate-700/30 animate-scaleIn">
//           <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/30 dark:border-slate-700/30 p-6 z-10 rounded-t-[40px]">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
//                   {item.customer_name || 'Analysis Details'}
//                 </h2>
//                 <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
//                   {item.building_use || 'Building'} • {formatDate(item.generated_at)}
//                 </p>
//               </div>
//               <button 
//                 onClick={onClose} 
//                 className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 text-slate-400 hover:text-slate-600 dark:hover:text-white"
//               >
//                 <FaTimes className="text-lg" />
//               </button>
//             </div>
//           </div>

//           <div className="p-6 space-y-6">
//             {/* Stats Grid - Enhanced light mode highlights */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               <div className="bg-gradient-to-br from-blue-50 to-blue-100/60 dark:from-blue-900/20 dark:to-blue-900/5 p-5 rounded-[32px] border-2 border-blue-200/60 dark:border-blue-800/20 shadow-sm shadow-blue-100/50 dark:shadow-none">
//                 <p className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wider">AI Efficiency</p>
//                 <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-1">{item.ai_efficiency || 0}%</p>
//               </div>
//               <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-900/20 dark:to-emerald-900/5 p-5 rounded-[32px] border-2 border-emerald-200/60 dark:border-emerald-800/20 shadow-sm shadow-emerald-100/50 dark:shadow-none">
//                 <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Energy Saved</p>
//                 <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{item.saving_percentage || 0}%</p>
//               </div>
//               <div className="bg-gradient-to-br from-purple-50 to-purple-100/60 dark:from-purple-900/20 dark:to-purple-900/5 p-5 rounded-[32px] border-2 border-purple-200/60 dark:border-purple-800/20 shadow-sm shadow-purple-100/50 dark:shadow-none">
//                 <p className="text-xs font-medium text-purple-700 dark:text-purple-400 uppercase tracking-wider">Annual Savings</p>
//                 <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mt-1">${item.annual_savings || 0}</p>
//               </div>
//               <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-900/20 dark:to-amber-900/5 p-5 rounded-[32px] border-2 border-amber-200/60 dark:border-amber-800/20 shadow-sm shadow-amber-100/50 dark:shadow-none">
//                 <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wider">ROI</p>
//                 <p className="text-3xl font-bold text-amber-700 dark:text-amber-300 mt-1">{item.roi_in_years || 0}y</p>
//               </div>
//             </div>

//             {/* Charts */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//               <div className="bg-slate-50/60 dark:bg-slate-800/40 p-5 rounded-[32px] border border-slate-200/20 dark:border-slate-700/20">
//                 <h3 className="text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300 uppercase tracking-wider">Efficiency Comparison</h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <BarChart data={chartData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                     <XAxis dataKey="name" stroke="#64748b" fontSize={12} tick={{ fill: '#64748b' }} />
//                     <YAxis stroke="#64748b" fontSize={12} tick={{ fill: '#64748b' }} />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'white', 
//                         border: '1px solid #e2e8f0', 
//                         borderRadius: '16px',
//                         boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
//                       }} 
//                     />
//                     <Bar dataKey="value" radius={[6, 6, 0, 0]}>
//                       {chartData.map((entry, index) => (
//                         <Cell 
//                           key={`cell-${index}`} 
//                           fill={index === 0 ? '#94a3b8' : '#3b82f6'} 
//                         />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="bg-slate-50/60 dark:bg-slate-800/40 p-5 rounded-[32px] border border-slate-200/20 dark:border-slate-700/20">
//                 <h3 className="text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300 uppercase tracking-wider">Energy Distribution</h3>
//                 <ResponsiveContainer width="100%" height={250}>
//                   <PieChart>
//                     <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label>
//                       {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
//                     </Pie>
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'white', 
//                         border: '1px solid #e2e8f0', 
//                         borderRadius: '16px',
//                         boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
//                       }} 
//                     />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="lg:col-span-2 bg-slate-50/60 dark:bg-slate-800/40 p-5 rounded-[32px] border border-slate-200/20 dark:border-slate-700/20">
//                 <h3 className="text-sm font-semibold mb-4 text-slate-700 dark:text-slate-300 uppercase tracking-wider">Performance Comparison</h3>
//                 <ResponsiveContainer width="100%" height={220}>
//                   <LineChart data={lineData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                     <XAxis dataKey="metric" stroke="#64748b" fontSize={12} tick={{ fill: '#64748b' }} />
//                     <YAxis stroke="#64748b" fontSize={12} tick={{ fill: '#64748b' }} />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'white', 
//                         border: '1px solid #e2e8f0', 
//                         borderRadius: '16px',
//                         boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
//                       }} 
//                     />
//                     <Legend />
//                     <Line type="monotone" dataKey="Without AI" stroke="#94a3b8" strokeWidth={3} />
//                     <Line type="monotone" dataKey="With AI" stroke="#3b82f6" strokeWidth={3} />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Details - Soft pills */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50/60 dark:bg-slate-800/40 p-5 rounded-[32px] border border-slate-200/20 dark:border-slate-700/20">
//               <div>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Customer</p>
//                 <p className="font-semibold text-slate-900 dark:text-white mt-1">{item.customer_name || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Building</p>
//                 <p className="font-semibold text-slate-900 dark:text-white mt-1">{item.building_use || 'N/A'}</p>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Age</p>
//                 <p className="font-semibold text-slate-900 dark:text-white mt-1">{item.building_age || 0} years</p>
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hours</p>
//                 <p className="font-semibold text-slate-900 dark:text-white mt-1">{item.operating_hours || 0}h</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const handleViewDetails = (item) => {
//     setSelectedItem(item);
//     setShowModal(true);
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="text-center">
//           <div className="relative w-16 h-16 mx-auto">
//             <div className="absolute inset-0 border-4 border-slate-200/30 dark:border-slate-700/30 rounded-full"></div>
//             <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
//           </div>
//           <p className="text-slate-500 dark:text-slate-400 mt-4">Loading history...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {showModal && selectedItem && (
//         <DetailsModal item={selectedItem} onClose={() => { setShowModal(false); setSelectedItem(null); }} />
//       )}

//       <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
//         {/* Header - Fluid glass morphism */}
//         <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-white/80 via-white/60 to-blue-50/40 dark:from-slate-900/80 dark:via-slate-900/60 dark:to-blue-950/30 backdrop-blur-xl p-6 border border-white/20 dark:border-slate-700/30 shadow-xl">
//           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
//           <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          
//           <div className="relative flex flex-wrap items-center justify-between gap-4">
//             <div className="flex items-center gap-4">
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[24px] blur-xl opacity-40"></div>
//                 <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-[24px] text-white shadow-lg shadow-blue-500/30">
//                   <FaHistory className="text-2xl" />
//                 </div>
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">History</h1>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">View all your energy analysis records</p>
//               </div>
//               {stats.total > 0 && (
//                 <span className="ml-2 rounded-full bg-blue-500/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
//                   {stats.total} records
//                 </span>
//               )}
//             </div>
//             <div className="flex gap-2">
//               <button 
//                 onClick={fetchHistory} 
//                 className="rounded-full border border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-3 transition-all duration-200 hover:scale-105 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
//                 title="Refresh"
//               >
//                 <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
//               </button>
//               <button 
//                 onClick={downloadReport} 
//                 disabled={!history.length} 
//                 className={`rounded-full p-3 transition-all duration-200 ${
//                   history.length 
//                     ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30' 
//                     : 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 cursor-not-allowed backdrop-blur-sm'
//                 }`}
//               >
//                 <FaDownload className="text-sm" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Error - Soft */}
//         {error && (
//           <div className="p-5 rounded-[32px] bg-red-50/60 dark:bg-red-900/20 backdrop-blur-sm border border-red-200/30 dark:border-red-800/30 text-red-700 dark:text-red-400">
//             <p className="font-medium">{error}</p>
//             <button onClick={fetchHistory} className="text-sm underline mt-2 hover:text-red-800 dark:hover:text-red-300">Try again</button>
//           </div>
//         )}

//         {/* Stats - Fluid pills */}
//         {stats.total > 0 && !error && (
//           <div className="grid grid-cols-2 gap-3">
//             <div className="group rounded-[32px] bg-gradient-to-br from-white/80 to-slate-50/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-sm p-5 border border-white/20 dark:border-slate-700/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Records</p>
//                   <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">{stats.total}</p>
//                 </div>
//                 <div className="rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-3 text-blue-600 dark:text-blue-400 transition-transform duration-300 group-hover:scale-110">
//                   <FaChartLine className="text-xl" />
//                 </div>
//               </div>
//             </div>
//             <div className="group rounded-[32px] bg-gradient-to-br from-white/80 to-slate-50/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-sm p-5 border border-white/20 dark:border-slate-700/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Building Types</p>
//                   <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mt-1">{Object.keys(stats.types).length}</p>
//                 </div>
//                 <div className="rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-3 text-emerald-600 dark:text-emerald-400 transition-transform duration-300 group-hover:scale-110">
//                   <FaBuilding className="text-xl" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Search & Filter - Fluid */}
//         {history.length > 0 && !error && (
//           <div className="flex flex-col gap-3 rounded-[40px] bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-4 border border-white/20 dark:border-slate-700/30 shadow-lg sm:flex-row">
//             <div className="relative flex-1">
//               <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
//               <input
//                 type="text"
//                 placeholder="Search records..."
//                 value={searchTerm}
//                 onChange={e => setSearchTerm(e.target.value)}
//                 className="w-full rounded-full border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm py-3 pl-11 pr-10 text-slate-900 dark:text-white shadow-sm transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10"
//               />
//               {searchTerm && (
//                 <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
//                   <FaTimes className="text-sm" />
//                 </button>
//               )}
//             </div>
//             <select
//               value={filterType}
//               onChange={e => setFilterType(e.target.value)}
//               className="rounded-full border border-slate-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-5 py-3 text-slate-900 dark:text-white shadow-sm transition-all duration-200 hover:border-blue-300/50 dark:hover:border-blue-700/50 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 cursor-pointer"
//             >
//               <option value="all">All Types</option>
//               {buildingTypes.map(type => <option key={type} value={type}>{type}</option>)}
//             </select>
//           </div>
//         )}

//         {/* Empty State - Fluid */}
//         {!history.length && !loading && !error && (
//           <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-white/80 to-slate-50/40 dark:from-slate-800/80 dark:to-slate-900/40 backdrop-blur-sm p-16 text-center border border-white/20 dark:border-slate-700/30 shadow-xl">
//             <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>
//             <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>
//             <div className="relative">
//               <div className="text-7xl mb-4">📊</div>
//               <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">No Records Yet</h3>
//               <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Run your first energy analysis simulation to start building your history.</p>
//             </div>
//           </div>
//         )}

//         {/* Cards - Fluid glass with enhanced light mode highlights */}
//         {filteredHistory.length > 0 && !error && (
//           <div className="space-y-4">
//             {filteredHistory.map(item => (
//               <div 
//                 key={item.id} 
//                 className="group relative overflow-hidden rounded-[32px] bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/30 dark:border-slate-700/30 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
//               >
//                 <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
//                 <div className="p-6">
//                   <div className="flex items-start justify-between gap-4">
//                     <div className="flex min-w-0 flex-1 items-center gap-4">
//                       <div className="relative">
//                         <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[20px] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
//                         <div className="relative flex h-12 w-12 items-center justify-center rounded-[20px] bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-bold tracking-wide text-white shadow-lg">
//                           {getInitials(item.customer_name)}
//                         </div>
//                       </div>
//                       <div className="min-w-0 flex-1">
//                         <div className="flex items-center gap-3 flex-wrap">
//                           <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
//                             {item.customer_name || 'Unknown'}
//                           </h3>
//                           <span className="text-xs px-3 py-1 rounded-full bg-blue-100/80 dark:bg-blue-500/20 backdrop-blur-sm text-blue-700 dark:text-blue-400 font-medium border border-blue-300/50 dark:border-blue-500/30">
//                             {item.building_use || 'Building'}
//                           </span>
//                         </div>
//                         <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
//                           <span className="inline-flex items-center gap-1.5">
//                             <FaClock className="text-xs" />
//                             {formatTimeAgo(item.generated_at)}
//                           </span>
//                           <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
//                           <span className="inline-flex items-center gap-1.5">
//                             <FaCalendarAlt className="text-xs" />
//                             {formatDate(item.generated_at)}
//                           </span>
//                           <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
//                           <span className="font-semibold text-emerald-600 dark:text-emerald-400">
//                             {item.saving_percentage || 0}% saved
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex gap-1">
//                       <button 
//                         onClick={() => deleteRecord(item.id)} 
//                         disabled={deleting} 
//                         className="rounded-full p-2.5 text-slate-400 transition-all hover:bg-red-50/80 hover:text-red-600 hover:scale-105 dark:hover:bg-red-900/20"
//                         title="Delete record"
//                       >
//                         <FaTrash className="text-sm" />
//                       </button>
//                       <button 
//                         onClick={() => handleViewDetails(item)}
//                         className="rounded-full p-2.5 text-slate-400 transition-all hover:scale-105 hover:bg-blue-50/80 hover:text-blue-600 dark:hover:bg-blue-900/20"
//                         title="View Details"
//                       >
//                         <FaEye className="text-sm" />
//                       </button>
//                     </div>
//                   </div>

//                   {/* Quick Stats - Enhanced light mode highlights */}
//                   <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/30 dark:border-slate-700/30">
//                     <div className="text-center bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl p-3 border border-slate-200/30 dark:border-slate-700/30 shadow-sm">
//                       <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Base Eff.</p>
//                       <p className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{item.base_efficiency || 0}%</p>
//                     </div>
//                     <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100/70 dark:from-blue-900/30 dark:to-blue-900/10 rounded-2xl p-3 border-2 border-blue-300/60 dark:border-blue-500/30 shadow-md shadow-blue-100/50 dark:shadow-none">
//                       <p className="text-xs text-blue-700 dark:text-blue-400 font-medium uppercase tracking-wider">AI Eff.</p>
//                       <p className="text-xl font-bold text-blue-700 dark:text-blue-300 mt-1">{item.ai_efficiency || 0}%</p>
//                     </div>
//                     <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100/70 dark:from-purple-900/30 dark:to-purple-900/10 rounded-2xl p-3 border-2 border-purple-300/60 dark:border-purple-500/30 shadow-md shadow-purple-100/50 dark:shadow-none">
//                       <p className="text-xs text-purple-700 dark:text-purple-400 font-medium uppercase tracking-wider">ROI</p>
//                       <p className="text-xl font-bold text-purple-700 dark:text-purple-300 mt-1">{item.roi_in_years || 0}y</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {filteredHistory.length === 0 && history.length > 0 && !error && (
//           <div className="rounded-[40px] bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl p-8 text-center border border-white/20 dark:border-slate-700/30 shadow-lg">
//             <p className="text-slate-500 dark:text-slate-400">No matches found for your search.</p>
//             <button 
//               onClick={() => { setSearchTerm(''); setFilterType('all'); }} 
//               className="mt-3 text-blue-600 dark:text-blue-400 hover:underline font-medium"
//             >
//               Clear filters
//             </button>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }