// import { useEffect, useState } from "react";
// import { supabase } from "../supabase";
// import {
//   FaHistory,
//   FaTrash,
//   FaDownload,
//   FaBuilding,
//   FaTemperatureLow,
//   FaClock,
//   FaCalendarAlt,
//   FaSearch,
//   FaFilter,
//   FaTimes,
//   FaEye,
//   FaEyeSlash,
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaInfoCircle,
//   FaSync,
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
//   FaDollarSign,
//   FaLeaf,
//   FaBolt,
//   FaChartLine,
//   FaThermometerHalf,
//   FaTachometerAlt,
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
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [deleting, setDeleting] = useState(false);
//   const [deleteSuccess, setDeleteSuccess] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [showFullDetails, setShowFullDetails] = useState(false);
//   const [stats, setStats] = useState({
//     total: 0,
//     buildings: 0,
//     customers: 0,
//     types: {},
//   });

//   useEffect(() => {
//     fetchHistory();
//   }, []);

//   const fetchHistory = async () => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       const { data, error } = await supabase
//         .from("analysis_history")
//         .select("*")
//         .order("id", { ascending: false });

//       if (error) {
//         console.error("Supabase Error:", error);
//         setError(`Failed to fetch history: ${error.message}`);
//         setHistory([]);
//       } else {
//         console.log("✅ Fetched data from Supabase:", data?.length || 0, "records");
//         setHistory(data || []);
//         calculateStats(data || []);
//         localStorage.setItem("analysis_history", JSON.stringify(data || []));
//       }
//     } catch (err) {
//       console.error("Unexpected Error:", err);
//       setError("An unexpected error occurred. Please try again.");
//       setHistory([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calculateStats = (data) => {
//     const buildingSet = new Set();
//     const customerSet = new Set();
//     const typeCount = {};

//     data.forEach(item => {
//       if (item.building_id) buildingSet.add(item.building_id);
//       if (item.customer_name) customerSet.add(item.customer_name);
//       if (item.building_type) {
//         typeCount[item.building_type] = (typeCount[item.building_type] || 0) + 1;
//       }
//     });

//     setStats({
//       total: data.length,
//       buildings: buildingSet.size,
//       customers: customerSet.size,
//       types: typeCount,
//     });
//   };

//   const clearHistory = async () => {
//     if (!window.confirm("⚠️ Are you sure you want to delete ALL analysis history? This action cannot be undone!")) {
//       return;
//     }

//     try {
//       const { error } = await supabase
//         .from("analysis_history")
//         .delete()
//         .neq("id", 0);

//       if (error) {
//         console.error("Delete Error:", error);
//         alert(`Failed to clear history: ${error.message}`);
//       } else {
//         setHistory([]);
//         setStats({ total: 0, buildings: 0, customers: 0, types: {} });
//         localStorage.removeItem("analysis_history");
//         alert("✅ All history cleared successfully.");
//         await fetchHistory();
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("An error occurred while clearing history.");
//     }
//   };

//   const deleteRecord = async (id) => {
//     if (!window.confirm("Delete this record?")) return;

//     setDeleting(true);
//     try {
//       const { error } = await supabase
//         .from("analysis_history")
//         .delete()
//         .eq("id", id);

//       if (error) {
//         console.error("Delete Error:", error);
//         alert(`Failed to delete record: ${error.message}`);
//       } else {
//         const updatedHistory = history.filter(item => item.id !== id);
//         setHistory(updatedHistory);
//         calculateStats(updatedHistory);
//         if (expandedRow === id) {
//           setExpandedRow(null);
//           setShowFullDetails(false);
//         }
//         localStorage.setItem("analysis_history", JSON.stringify(updatedHistory));
//         setDeleteSuccess(true);
//         setTimeout(() => setDeleteSuccess(false), 3000);
//         alert("✅ Record deleted successfully.");
//       }
//     } catch (err) {
//       console.error("Error:", err);
//       alert("An error occurred while deleting the record.");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const downloadReport = () => {
//     if (history.length === 0) {
//       alert("No history to export.");
//       return;
//     }

//     let report = `
// ╔═══════════════════════════════════════════════════════════════╗
// ║           AI ENERGY SAVING SIMULATOR REPORT                   ║
// ╚═══════════════════════════════════════════════════════════════╝

// Generated On: ${new Date().toLocaleString()}
// Total Records: ${history.length}

// ═══════════════════════════════════════════════════════════════

// `;

//     history.forEach((item, index) => {
//       report += `
// ┌───────────────────────────────────────────────────────────────┐
// │ Record #${index + 1}                                       │
// ├───────────────────────────────────────────────────────────────┤
// │ Customer Name    : ${item.customer_name || 'N/A'}          │
// │ Building Type    : ${item.building_type || 'N/A'}          │
// │ Building Age     : ${item.building_age || 'N/A'} years    │
// │ Operating Hours  : ${item.operating_hours || 'N/A'} hrs   │
// │ Azimuth          : ${item.azimuth_direction || 'N/A'}     │
// │ Base Efficiency  : ${item.base_efficiency || 'N/A'}%      │
// │ AI Efficiency    : ${item.ai_efficiency || 'N/A'}%        │
// │ Energy Saving    : ${item.saving_percentage || 'N/A'}%    │
// │ Annual Savings   : $${item.annual_savings || 'N/A'}      │
// │ ROI              : ${item.roi_in_years || 'N/A'} years    │
// │ Generated At     : ${item.generated_at || 'N/A'}          │
// └───────────────────────────────────────────────────────────────┘
// `;
//     });

//     report += `
// ═══════════════════════════════════════════════════════════════
// End of Report
// `;

//     try {
//       const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `Energy_Analysis_Report_${new Date().toISOString().split('T')[0]}.txt`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//       alert("✅ Report downloaded successfully!");
//     } catch (err) {
//       console.error("Download Error:", err);
//       alert("Failed to download report.");
//     }
//   };

//   const getFilteredHistory = () => {
//     let filtered = history;

//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(item =>
//         (item.customer_name?.toLowerCase() || '').includes(term) ||
//         (item.building_id?.toLowerCase() || '').includes(term) ||
//         (item.building_type?.toLowerCase() || '').includes(term) ||
//         (item.azimuth_direction?.toLowerCase() || '').includes(term) ||
//         (item.email?.toLowerCase() || '').includes(term)
//       );
//     }

//     if (filterType !== "all") {
//       filtered = filtered.filter(item => item.building_type === filterType);
//     }

//     return filtered;
//   };

//   const filteredHistory = getFilteredHistory();
//   const buildingTypes = [...new Set(history.map(item => item.building_type).filter(Boolean))];

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleString();
//     } catch {
//       return dateString;
//     }
//   };

//   // ============================================
//   // RENDER EXPANDED DETAILS WITH CHARTS
//   // ============================================
//   const renderExpandedDetails = (item) => {
//     if (!item) return null;

//     // Prepare chart data
//     const chartData = [
//       { name: "Base Efficiency", value: item.base_efficiency || 0 },
//       { name: "AI Efficiency", value: item.ai_efficiency || 0 },
//     ];

//     const pieData = [
//       { name: "Without AI", value: item.without_ai || 0, color: "#f59e0b" },
//       { name: "With AI", value: item.with_ai || 0, color: "#10b981" },
//     ];

//     const comparisonData = [
//       { metric: "Efficiency", "Without AI": item.base_efficiency || 0, "With AI": item.ai_efficiency || 0 },
//       { metric: "Energy Saving", "Without AI": 0, "With AI": item.saving_percentage || 0 },
//       { metric: "ROI", "Without AI": 0, "With AI": parseFloat(item.roi_in_years || 0) * 10 },
//     ];

//     // Calculate realistic AI efficiency improvement (7-12%)
//     const baseEff = item.base_efficiency || 0;
//     const aiEff = item.ai_efficiency || 0;
//     const improvement = aiEff - baseEff;

//     return (
//       <tr className="bg-slate-50 dark:bg-slate-900/30">
//         <td colSpan="7" className="px-4 py-6">
//           <div className="space-y-6">
//             {/* Full Details Header */}
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-semibold text-black dark:text-white flex items-center gap-2">
//                 <FaInfoCircle className="text-emerald-500" />
//                 Full Analysis Details
//               </h3>
//               <button
//                 onClick={() => setShowFullDetails(!showFullDetails)}
//                 className="text-sm text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-all"
//               >
//                 {showFullDetails ? "Show Less" : "Show All Details"}
//               </button>
//             </div>

//             {/* Stats Grid */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">Customer</p>
//                 <p className="text-sm font-medium text-black dark:text-white">{item.customer_name || 'N/A'}</p>
//               </div>
//               <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
//                 <p className="text-sm font-medium text-black dark:text-white">{item.email || 'N/A'}</p>
//               </div>
//               <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
//                 <p className="text-sm font-medium text-black dark:text-white">{item.mobile || 'N/A'}</p>
//               </div>
//               <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">Address</p>
//                 <p className="text-sm font-medium text-black dark:text-white">{item.address || 'N/A'}</p>
//               </div>
//             </div>

//             {/* Building Details */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">Building Type</p>
//                 <p className="text-sm font-medium text-black dark:text-white">{item.building_type || 'N/A'}</p>
//               </div>
//               <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">Building Age</p>
//                 <p className="text-sm font-medium text-black dark:text-white">{item.building_age || 'N/A'} years</p>
//               </div>
//               <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">Operating Hours</p>
//                 <p className="text-sm font-medium text-black dark:text-white">{item.operating_hours || 'N/A'} hrs</p>
//               </div>
//               <div className="p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">Azimuth</p>
//                 <p className="text-sm font-medium text-black dark:text-white">{item.azimuth_direction || 'N/A'} ({item.azimuth_angle || 'N/A'}°)</p>
//               </div>
//             </div>

//             {/* Energy Metrics - Updated with realistic AI efficiency */}
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30">
//                 <p className="text-xs text-blue-700 dark:text-blue-400">Base Efficiency</p>
//                 <p className="text-lg font-bold text-blue-700 dark:text-blue-400">{item.base_efficiency || 0}%</p>
//                 {baseEff > 0 && (
//                   <p className="text-[10px] text-blue-600 dark:text-blue-500">Current performance</p>
//                 )}
//               </div>
//               <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
//                 <p className="text-xs text-emerald-700 dark:text-emerald-400">AI Efficiency</p>
//                 <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{item.ai_efficiency || 0}%</p>
//                 {improvement > 0 && (
//                   <p className="text-[10px] text-emerald-600 dark:text-emerald-500">↑ {improvement}% improvement</p>
//                 )}
//               </div>
//               <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30">
//                 <p className="text-xs text-amber-700 dark:text-amber-400">Energy Savings</p>
//                 <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{item.saving_percentage || 0}%</p>
//                 <p className="text-[10px] text-amber-600 dark:text-amber-500">Potential savings</p>
//               </div>
//             </div>

//             {/* Financial Metrics */}
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30">
//                 <p className="text-xs text-purple-700 dark:text-purple-400">Annual Savings</p>
//                 <p className="text-lg font-bold text-purple-700 dark:text-purple-400">${item.annual_savings || 0}</p>
//               </div>
//               <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/30">
//                 <p className="text-xs text-rose-700 dark:text-rose-400">ROI</p>
//                 <p className="text-lg font-bold text-rose-700 dark:text-rose-400">{item.roi_in_years || 0} years</p>
//               </div>
//               <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
//                 <p className="text-xs text-slate-500 dark:text-slate-400">Generated</p>
//                 <p className="text-sm font-medium text-black dark:text-white">{formatDate(item.generated_at)}</p>
//               </div>
//             </div>

//             {/* Charts */}
//             {showFullDetails && (
//               <div className="space-y-6 animate-fadeIn">
//                 <h4 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
//                   <FaChartLine className="text-emerald-500" />
//                   Performance Charts
//                 </h4>
                
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Bar Chart - Efficiency Comparison */}
//                   <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
//                     <h5 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">Efficiency Comparison</h5>
//                     <ResponsiveContainer width="100%" height={200}>
//                       <BarChart data={chartData}>
//                         <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                         <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
//                         <YAxis stroke="#64748b" fontSize={10} />
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: 'white',
//                             border: '1px solid #e2e8f0',
//                             borderRadius: '8px',
//                           }}
//                         />
//                         <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
//                       </BarChart>
//                     </ResponsiveContainer>
//                   </div>

//                   {/* Pie Chart - Energy Distribution */}
//                   <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
//                     <h5 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">Energy Distribution</h5>
//                     <ResponsiveContainer width="100%" height={200}>
//                       <PieChart>
//                         <Pie
//                           data={pieData}
//                           cx="50%"
//                           cy="50%"
//                           innerRadius={40}
//                           outerRadius={70}
//                           paddingAngle={4}
//                           dataKey="value"
//                           label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                           labelLine={{ strokeWidth: 1 }}
//                         >
//                           {pieData.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         <Tooltip
//                           contentStyle={{
//                             backgroundColor: 'white',
//                             border: '1px solid #e2e8f0',
//                             borderRadius: '8px',
//                           }}
//                         />
//                       </PieChart>
//                     </ResponsiveContainer>
//                   </div>
//                 </div>

//                 {/* Line Chart - Performance Comparison */}
//                 <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
//                   <h5 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-3">Performance Comparison</h5>
//                   <ResponsiveContainer width="100%" height={200}>
//                     <LineChart data={comparisonData}>
//                       <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
//                       <XAxis dataKey="metric" stroke="#64748b" fontSize={10} />
//                       <YAxis stroke="#64748b" fontSize={10} />
//                       <Tooltip
//                         contentStyle={{
//                           backgroundColor: 'white',
//                           border: '1px solid #e2e8f0',
//                           borderRadius: '8px',
//                         }}
//                       />
//                       <Legend />
//                       <Line type="monotone" dataKey="Without AI" stroke="#f59e0b" strokeWidth={2} />
//                       <Line type="monotone" dataKey="With AI" stroke="#10b981" strokeWidth={2} />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//             )}

//             {!showFullDetails && (
//               <button
//                 onClick={() => setShowFullDetails(true)}
//                 className="w-full py-2 text-sm text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300 transition-all border border-emerald-200 dark:border-emerald-800/30 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/10"
//               >
//                 📊 Click to view charts & graphs
//               </button>
//             )}
//           </div>
//         </td>
//       </tr>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin text-4xl mb-4">⏳</div>
//           <p className="text-slate-600 dark:text-slate-400">Loading history...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
//             <FaHistory className="text-xl" />
//           </div>
//           <div>
//             <h1 className="text-2xl font-bold text-black dark:text-white">
//               Analysis History
//             </h1>
//             <p className="text-sm text-slate-600 dark:text-slate-400">
//               View and manage all your energy analysis records
//             </p>
//           </div>
//           {stats.total > 0 && (
//             <span className="px-3 py-1 text-xs font-medium text-white bg-emerald-500 rounded-full animate-pulse">
//               {stats.total} records
//             </span>
//           )}
//           {deleteSuccess && (
//             <span className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-full animate-fadeIn">
//               Deleted ✓
//             </span>
//           )}
//         </div>
        
//         <div className="flex items-center gap-2 flex-wrap">
//           <button
//             onClick={fetchHistory}
//             className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-black dark:text-white transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
//           >
//             <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
//             <span className="hidden sm:inline">Refresh</span>
//           </button>

//           <button
//             onClick={downloadReport}
//             disabled={history.length === 0}
//             className={`
//               px-4 py-2 rounded-lg transition-all flex items-center gap-2
//               ${history.length > 0
//                 ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
//                 : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
//               }
//             `}
//           >
//             <FaDownload className="text-sm" />
//             <span className="hidden sm:inline">Export</span>
//           </button>

//           <button
//             onClick={clearHistory}
//             disabled={history.length === 0}
//             className={`
//               px-4 py-2 rounded-lg transition-all flex items-center gap-2
//               ${history.length > 0
//                 ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
//                 : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
//               }
//             `}
//           >
//             <FaTrash className="text-sm" />
//             <span className="hidden sm:inline">Clear All</span>
//           </button>
//         </div>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 flex items-start gap-3">
//           <FaExclamationTriangle className="text-red-500 mt-0.5" />
//           <div>
//             <p className="text-sm font-medium text-red-800 dark:text-red-400">Error</p>
//             <p className="text-sm text-red-700 dark:text-red-500">{error}</p>
//             <button
//               onClick={fetchHistory}
//               className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
//             >
//               Try again
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Stats Overview */}
//       {stats.total > 0 && !error && (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
//             <p className="text-sm text-slate-600 dark:text-slate-400">Total Records</p>
//             <p className="text-2xl font-bold text-black dark:text-white">{stats.total}</p>
//           </div>
//           <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
//             <p className="text-sm text-slate-600 dark:text-slate-400">Buildings</p>
//             <p className="text-2xl font-bold text-black dark:text-white">{stats.buildings}</p>
//           </div>
//           <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
//             <p className="text-sm text-slate-600 dark:text-slate-400">Customers</p>
//             <p className="text-2xl font-bold text-black dark:text-white">{stats.customers}</p>
//           </div>
//           <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
//             <p className="text-sm text-slate-600 dark:text-slate-400">Building Types</p>
//             <p className="text-2xl font-bold text-black dark:text-white">{Object.keys(stats.types).length}</p>
//           </div>
//         </div>
//       )}

//       {/* Search and Filter */}
//       {history.length > 0 && !error && (
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="relative flex-1">
//             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
//             <input
//               type="text"
//               placeholder="Search by Customer, Building ID, Type..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
//             />
//             {searchTerm && (
//               <button
//                 onClick={() => setSearchTerm("")}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
//               >
//                 <FaTimes className="text-sm" />
//               </button>
//             )}
//           </div>
          
//           <select
//             value={filterType}
//             onChange={(e) => setFilterType(e.target.value)}
//             className="px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
//           >
//             <option value="all">All Types</option>
//             {buildingTypes.map(type => (
//               <option key={type} value={type}>{type}</option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* History Table */}
//       {history.length === 0 && !loading && !error ? (
//         <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
//           <div className="text-6xl mb-4">📭</div>
//           <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
//             No Analysis Records Found
//           </h3>
//           <p className="text-slate-600 dark:text-slate-400">
//             Run your first building energy simulation to start tracking history here.
//           </p>
//           <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
//             Tip: Go to AI Energy Saving Simulator and run a simulation
//           </p>
//         </div>
//       ) : filteredHistory.length === 0 && !error ? (
//         <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700">
//           <p className="text-slate-600 dark:text-slate-400">
//             No records match your search criteria.
//           </p>
//           <button
//             onClick={() => { setSearchTerm(""); setFilterType("all"); }}
//             className="mt-4 text-emerald-600 dark:text-emerald-400 hover:underline"
//           >
//             Clear filters
//           </button>
//         </div>
//       ) : !error && (
//         <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50 dark:bg-slate-900/50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
//                     Customer
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
//                     Building Type
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider hidden sm:table-cell">
//                     AI Efficiency
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider hidden md:table-cell">
//                     Energy Saved
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider hidden lg:table-cell">
//                     ROI
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-black dark:text-white uppercase tracking-wider text-center">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
//                 {filteredHistory.map((item) => (
//                   <>
//                     <tr 
//                       key={item.id}
//                       className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
//                     >
//                       <td className="px-4 py-3 text-sm font-medium text-black dark:text-white">
//                         <span className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
//                           {item.customer_name || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
//                         {item.building_type || 'N/A'}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hidden sm:table-cell">
//                         {item.ai_efficiency || 'N/A'}%
//                       </td>
//                       <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hidden md:table-cell">
//                         {item.saving_percentage || 'N/A'}%
//                       </td>
//                       <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 hidden lg:table-cell">
//                         {item.roi_in_years || 'N/A'} yrs
//                       </td>
//                       <td className="px-4 py-3 text-sm text-black dark:text-white whitespace-nowrap">
//                         {formatDate(item.generated_at)}
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center justify-center gap-1">
//                           <button
//                             onClick={() => {
//                               setExpandedRow(expandedRow === item.id ? null : item.id);
//                               setShowFullDetails(false);
//                             }}
//                             className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600 transition-all"
//                             title={expandedRow === item.id ? "Hide Details" : "View Details"}
//                           >
//                             {expandedRow === item.id ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
//                           </button>
//                           <button
//                             onClick={() => deleteRecord(item.id)}
//                             disabled={deleting}
//                             className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                             title="Delete"
//                           >
//                             <FaTrash className="text-sm" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                     {/* Expanded Details Row with Charts */}
//                     {expandedRow === item.id && renderExpandedDetails(item)}
//                   </>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }