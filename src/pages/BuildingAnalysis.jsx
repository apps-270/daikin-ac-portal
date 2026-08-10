import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
} from "recharts";
import {
  FaBuilding,
  FaChartLine,
  FaDollarSign,
  FaLeaf,
  FaThermometerHalf,
  FaHome,
  FaHospital,
  FaStore,
  FaCity,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaUser,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaCompass,
  FaSchool,
  FaHotel,
  FaWarehouse,
  FaServer,
  FaFlask,
  FaBook,
  FaPlane,
  FaFutbol,
  FaIndustry,
  FaArrowLeft,
  FaTachometerAlt,
  FaUtensils,
  FaUsers,
  FaLayerGroup,
  FaMoneyBillWave,
  FaCalendarWeek,
} from "react-icons/fa";

// Required star component - always red in both themes.
const RequiredStar = () => (
  <span className="required-star" aria-hidden="true">*</span>
);

export default function BuildingAnalysis() {
  const [formData, setFormData] = useState({
    customerName: "",
    mobile: "",
    email: "",
    address: "",
    totalHorsepower: "",
    outdoorOperatingTime: "",
    completionYear: "after 2017",
    buildingUse: "Office",
    outerWallAzimuthType: "0",
    numberOfFloors: "",
    unitPrice: "",
    excludedDaysOfWeek: [],
  });

  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [savingToSupabase, setSavingToSupabase] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Add darkMode state
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             document.documentElement.classList.contains('dark-mode');
    }
    return false;
  });

  // Add useEffect to detect dark mode changes
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

  // Clear form data when component mounts (new page load)
  useEffect(() => {
    // Clear form data when coming back to this page
    setFormData({
      customerName: "",
      mobile: "",
      email: "",
      address: "",
      totalHorsepower: "",
      outdoorOperatingTime: "",
      completionYear: "after 2017",
      buildingUse: "Office",
      outerWallAzimuthType: "0",
      numberOfFloors: "",
      unitPrice: "",
      excludedDaysOfWeek: [],
    });
  }, []);

  const buildingUseTypes = [
    { value: "Office", icon: FaCity, label: "Office" },
    { value: "Hotel", icon: FaHotel, label: "Hotel" },
    { value: "Hospital", icon: FaHospital, label: "Hospital" },
    { value: "Store", icon: FaStore, label: "Store" },
    { value: "School", icon: FaSchool, label: "School" },
    { value: "Restaurant", icon: FaUtensils, label: "Restaurant" },
    { value: "Meeting Place", icon: FaUsers, label: "Meeting Place" },
    { value: "Apartment", icon: FaHome, label: "Apartment" },
    { value: "Airport", icon: FaPlane, label: "Airport" },
  ];

  const completionYearOptions = [
    { value: "before 1980", label: "Before 1980" },
    { value: "1981-1992", label: "1981-1992" },
    { value: "1993-1999", label: "1993-1999" },
    { value: "2000-2013", label: "2000-2013" },
    { value: "2014-2016", label: "2014-2016" },
    { value: "after 2017", label: "After 2017" },
  ];

  const azimuthTypeOptions = [
    { value: "0", label: "North, East, South, West" },
    { value: "1", label: "Northeast, Southeast, Southwest, Northwest" },
  ];

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  const getNumericYear = (yearRange) => {
    const yearMap = {
      "before 1980": 1975,
      "1981-1992": 1986,
      "1993-1999": 1996,
      "2000-2013": 2006,
      "2014-2016": 2015,
      "after 2017": 2020,
    };
    return yearMap[yearRange] || 2000;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDayToggle = (day) => {
    setFormData(prev => ({
      ...prev,
      excludedDaysOfWeek: prev.excludedDaysOfWeek.includes(day)
        ? prev.excludedDaysOfWeek.filter(d => d !== day)
        : [...prev.excludedDaysOfWeek, day]
    }));
  };

  const handleBackToForm = () => {
    setShowResults(false);
    setResults(null);
    // Clear form data when going back
    setFormData({
      customerName: "",
      mobile: "",
      email: "",
      address: "",
      totalHorsepower: "",
      outdoorOperatingTime: "",
      completionYear: "after 2017",
      buildingUse: "Office",
      outerWallAzimuthType: "0",
      numberOfFloors: "",
      unitPrice: "",
      excludedDaysOfWeek: [],
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.customerName.trim()) {
      errors.customerName = "Please enter customer name";
    }
    if (!formData.totalHorsepower) {
      errors.totalHorsepower = "Please enter total horsepower";
    } else if (parseFloat(formData.totalHorsepower) < 1) {
      errors.totalHorsepower = "Total Horsepower must be at least 1 HP";
    }
    if (!formData.outdoorOperatingTime) {
      errors.outdoorOperatingTime = "Please enter outdoor operating time";
    }
    if (!formData.numberOfFloors) {
      errors.numberOfFloors = "Please enter number of floors";
    } else if (parseInt(formData.numberOfFloors) < 1) {
      errors.numberOfFloors = "Number of floors must be at least 1";
    }
    if (!formData.unitPrice) {
      errors.unitPrice = "Please enter unit price";
    } else if (parseFloat(formData.unitPrice) < 0) {
      errors.unitPrice = "Unit price must be a positive number";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveToSupabase = async (resultsData) => {
    try {
      setSavingToSupabase(true);
      
      const payload = {
        customer_name: formData.customerName || "Unknown",
        mobile: formData.mobile || "",
        email: formData.email || "",
        address: formData.address || "",
        building_use: formData.buildingUse || "Office",
        total_horsepower: parseFloat(formData.totalHorsepower) || 0,
        completion_year: formData.completionYear || "after 2017",
        building_age: resultsData.buildingAge || 0,
        outer_wall_azimuth_type: formData.outerWallAzimuthType || "0",
        number_of_floors: parseInt(formData.numberOfFloors) || 0,
        unit_price: parseFloat(formData.unitPrice) || 0,
        excluded_days: formData.excludedDaysOfWeek.join(", "),
        outdoor_operating_time: parseFloat(formData.outdoorOperatingTime) || 0,
        operating_hours: resultsData.operatingHours || 0,
        azimuth_angle: resultsData.azimuthAngle || 0,
        azimuth_direction: resultsData.azimuthDirection || "North",
        solar_impact: 0,
        base_efficiency: resultsData.baseEfficiency || 0,
        ai_efficiency: resultsData.aiEfficiency || 0,
        without_ai: resultsData.withoutAI || 0,
        with_ai: resultsData.withAI || 0,
        energy_saving: resultsData.energySaving || 0,
        saving_percentage: resultsData.savingPercentage || 0,
        annual_savings: resultsData.annualSavings || 0,
        implementation_cost: resultsData.implementationCost || 0,
        roi_in_years: parseFloat(resultsData.roiInYears) || 0,
        building_id: formData.customerName || "unknown",
        equipment_id: "AI_SIM_" + Date.now(),
        scope_category: "AI Energy Saving",
        outdoor_temp_ave: 25,
        setpoint_unified: 22,
        outdoor_setpoint_delta: 3,
        temp_bin: "20-25",
        setpoint_bin: "Medium",
        hour_block: "Afternoon",
        ff_on_flag: 1,
        setpoint_missing: 0,
        is_weekend: 0,
        hour_sin: 0.5,
        hour_cos: 0.8,
        month_sin: 0.3,
        month_cos: 0.9,
        day_of_week_sin: 0.2,
        day_of_week_cos: 0.7,
        solar_azimuthal_angles: formData.outerWallAzimuthType || "0",
        generated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("analysis_history")
        .insert([payload])
        .select();

      if (error) {
        console.error("❌ Supabase Error:", error);
        setSaveError(`Failed to save: ${error.message}`);
        return false;
      }

      console.log("✅ Data saved to Supabase:", data);
      setSaveError(null);
      return true;

    } catch (err) {
      console.error("💥 Error saving to Supabase:", err);
      setSaveError(`Error: ${err.message}`);
      return false;
    } finally {
      setSavingToSupabase(false);
    }
  };

  const handleAnalyze = async () => {
    setValidationErrors({});
    setSaveError(null);
    setSaveSuccess(false);
    setShowResults(false);
    
    // Validate form
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.border-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 5000));

      const currentYear = new Date().getFullYear();
      const buildingYear = getNumericYear(formData.completionYear);
      const buildingAge = currentYear - buildingYear;

      const operatingHours = parseFloat(formData.outdoorOperatingTime) || 0;
      const numberOfFloors = parseInt(formData.numberOfFloors) || 1;
      const unitPrice = parseFloat(formData.unitPrice) || 0;
      
      const baseEfficiency = Math.min(85, Math.max(65, 
        65 + (buildingAge > 50 ? 5 : buildingAge > 30 ? 10 : buildingAge > 15 ? 15 : 20) -
        (numberOfFloors > 10 ? 3 : numberOfFloors > 5 ? 2 : 0)
      ));
      
      const baseConsumption = Math.round(100 + 
        (operatingHours > 12 ? 30 : operatingHours > 8 ? 15 : 0) +
        (numberOfFloors > 10 ? 20 : numberOfFloors > 5 ? 10 : 0)
      );
      
      const possibleImprovements = [7, 8, 9, 10, 11, 12];
      const aiImprovement = possibleImprovements[Math.floor(Math.random() * possibleImprovements.length)];
      
      const aiEfficiency = Math.min(95, baseEfficiency + aiImprovement);
      
      const withoutAI = Math.round(baseConsumption * (1 - baseEfficiency / 100));
      const withAI = Math.round(baseConsumption * (1 - aiEfficiency / 100));
      const energySaving = withoutAI - withAI;
      const savingPercentage = Math.round((energySaving / withoutAI) * 100);
      
      const annualSavings = energySaving * 365 * (unitPrice / 100) * numberOfFloors;
      const implementationCost = Math.round(5000 + (baseConsumption * 10 * numberOfFloors));
      const roiInYears = (implementationCost / annualSavings).toFixed(1);

      const resultsData = {
        customerName: formData.customerName,
        buildingUse: formData.buildingUse,
        buildingAge: buildingAge,
        operatingHours: operatingHours,
        azimuthDirection: "North",
        azimuthAngle: 0,
        baseEfficiency: baseEfficiency,
        aiEfficiency: aiEfficiency,
        aiImprovement: aiImprovement,
        withoutAI: withoutAI,
        withAI: withAI,
        energySaving: energySaving,
        savingPercentage: savingPercentage,
        annualSavings: Math.round(annualSavings),
        implementationCost: implementationCost,
        roiInYears: roiInYears,
        totalHorsepower: formData.totalHorsepower,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        completionYear: formData.completionYear,
        outdoorOperatingTime: formData.outdoorOperatingTime,
        outerWallAzimuthType: formData.outerWallAzimuthType,
        numberOfFloors: numberOfFloors,
        unitPrice: unitPrice,
        excludedDaysOfWeek: formData.excludedDaysOfWeek,
        comparisonData: [
          { metric: "Efficiency", "Without AI": baseEfficiency, "With AI": aiEfficiency },
          { metric: "Energy Saving", "Without AI": 0, "With AI": savingPercentage },
          { metric: "Cost Reduction", "Without AI": 0, "With AI": Math.round((annualSavings / (withoutAI * 365 * 0.15)) * 100) },
          { metric: "Sustainability", "Without AI": 50, "With AI": Math.min(95, Math.round(60 + savingPercentage * 0.35)) },
        ],
        annualBreakdown: [
          { name: "Current Usage", value: withoutAI, fill: "#93c5fd" },
          { name: "Potential Savings", value: energySaving, fill: "#60a5fa" },
          { name: "AI Optimized", value: withAI, fill: "#3b82f6" },
        ],
      };

      setResults(resultsData);

      const saved = await saveToSupabase(resultsData);
      
      if (saved) {
        setSaveSuccess(true);
        console.log("✅ Data saved to Supabase successfully!");
      } else {
        console.log("⚠️ Data not saved to Supabase");
      }
      
      setShowResults(true);
      setTimeout(() => setSaveSuccess(false), 3000);

    } catch (err) {
      console.error("💥 Error:", err);
      setSaveError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, unit, color, subtitle, highlighted }) => {
    const colorMap = {
      blue: { bg: "from-blue-50 to-blue-100/60", border: "border-blue-300/60", shadow: "shadow-blue-100/50", text: "text-blue-700", iconBg: "from-blue-500 to-blue-600" },
      emerald: { bg: "from-emerald-50 to-emerald-100/60", border: "border-emerald-300/60", shadow: "shadow-emerald-100/50", text: "text-emerald-700", iconBg: "from-emerald-500 to-emerald-600" },
      purple: { bg: "from-purple-50 to-purple-100/60", border: "border-purple-300/60", shadow: "shadow-purple-100/50", text: "text-purple-700", iconBg: "from-purple-500 to-purple-600" },
      indigo: { bg: "from-indigo-50 to-indigo-100/60", border: "border-indigo-300/60", shadow: "shadow-indigo-100/50", text: "text-indigo-700", iconBg: "from-indigo-500 to-indigo-600" },
    };
    
    const colors = colorMap[color] || colorMap.blue;

    return (
      <div className={`rounded-[32px] p-5 border-2 shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        highlighted 
          ? `bg-gradient-to-br ${colors.bg} dark:from-${color}-900/20 dark:to-${color}-900/5 ${colors.border} dark:border-${color}-500/30 ${colors.shadow} dark:shadow-none`
          : 'bg-white/90 dark:bg-slate-800/70 border-blue-200/30 dark:border-slate-700/30 shadow-lg'
      }`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${
              highlighted 
                ? colors.text
                : 'text-slate-900 dark:text-white'
            }`}>
              {value}{unit}
            </p>
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-2.5 rounded-full ${
            highlighted 
              ? `bg-gradient-to-br ${colors.iconBg} shadow-lg shadow-${color}-500/30`
              : 'bg-blue-100 dark:bg-blue-900/40'
          }`}>
            <Icon className={`text-lg ${highlighted ? 'text-white' : 'text-[#3B82F6] dark:text-[#44C8F5]'}`} />
          </div>
        </div>
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 dark:bg-slate-800/90 p-4 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50">
          <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
          {payload.map((item, index) => (
            <p key={index} className="text-sm text-slate-700 dark:text-slate-300">
              {item.name}: {item.value} {item.unit || 'kWh'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-slate-700 dark:text-slate-300">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const pieData = results ? [
    { name: "Current Usage", value: results.withoutAI, color: "#93c5fd" },
    { name: "AI Optimized", value: results.withAI, color: "#3b82f6" },
  ] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 bg-gradient-to-b from-slate-50/30 to-white/30 dark:from-slate-900/30 dark:to-slate-800/30 min-h-screen">
      {/* Header - Fluid glass morphism with blue gradient */}
      <div className={`relative overflow-hidden rounded-[40px] bg-gradient-to-br from-white/90 via-white/70 to-blue-50/50 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-blue-950/30 p-6 border-2 border-blue-200/50 dark:border-blue-800/30 shadow-xl hover:shadow-2xl transition-all duration-300`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#44C8F5] to-[#3B82F6] rounded-[24px] blur-xl opacity-40 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-[#44C8F5] to-[#3B82F6] p-3 rounded-[24px] text-white shadow-lg shadow-[#44C8F5]/30">
                <FaLeaf className="text-2xl text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                AI Energy Saving Simulator
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Optimize your building's energy efficiency with AI
              </p>
            </div>
          </div>
          
          {/* Success/Error messages - visible with glass effect */}
          {saveSuccess && !loading && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/90 dark:bg-emerald-900/30 border-2 border-emerald-300/60 dark:border-emerald-500/30 shadow-md shadow-emerald-100/50 animate-fadeIn">
              <FaCheckCircle className="text-emerald-500 text-sm" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Saved to Database ✓
              </span>
            </div>
          )}
          {saveError && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50/90 dark:bg-red-900/30 border-2 border-red-300/60 dark:border-red-500/30 shadow-md shadow-red-100/50">
              <FaExclamationTriangle className="text-red-500 text-sm" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                {saveError}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {showResults && results && (
        <div className="space-y-6 animate-fadeIn">
          <button
            onClick={handleBackToForm}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#3B82F6] dark:hover:text-[#44C8F5] transition-all group"
          >
            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform text-[#3B82F6] dark:text-[#44C8F5]" />
            <span>Back to Form</span>
          </button>

          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#44C8F5] to-[#3B82F6] dark:from-[#44C8F5]/90 dark:to-[#3B82F6]/90 p-6 border-2 border-white/30 dark:border-blue-800/30 shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative flex items-center gap-3">
              <FaCheckCircle className="text-2xl text-white" />
              <div>
                <h2 className="text-xl font-bold text-white">AI Energy Saving Results</h2>
                <p className="text-blue-50/80">Analysis complete for {results.customerName}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={FaLeaf}
              title="Energy Savings"
              value={`${results.savingPercentage}%`}
              unit=""
              color="emerald"
              subtitle={`${results.energySaving} kWh saved`}
              highlighted={true}
            />
            <StatCard
              icon={FaTachometerAlt}
              title="AI Improvement"
              value={`+${results.aiImprovement}%`}
              unit=""
              color="blue"
              subtitle={`${results.baseEfficiency}% → ${results.aiEfficiency}%`}
              highlighted={true}
            />
            <StatCard
              icon={FaDollarSign}
              title="ROI"
              value={results.roiInYears}
              unit=" years"
              color="purple"
              subtitle={`$${results.annualSavings.toLocaleString()} annual savings`}
              highlighted={true}
            />
            <StatCard
              icon={FaLayerGroup}
              title="Building Floors"
              value={results.numberOfFloors}
              unit=""
              color="indigo"
              subtitle={`${results.numberOfFloors} floors analyzed`}
              highlighted={false}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/90 dark:bg-slate-800/70 rounded-[32px] p-6 border-2 border-blue-200/50 dark:border-blue-800/30 shadow-lg shadow-blue-100/30 dark:shadow-none">
              <h3 className="text-base font-semibold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
                <FaChartLine className="text-[#3B82F6] dark:text-[#44C8F5] text-lg" />
                Annual Energy Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={results.annualBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {results.annualBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {results.annualBreakdown.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-xs text-slate-700 dark:text-slate-300">
                      {item.name}: {item.value} kWh
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/90 dark:bg-slate-800/70 rounded-[32px] p-6 border-2 border-purple-200/50 dark:border-purple-800/30 shadow-lg shadow-purple-100/30 dark:shadow-none">
              <h3 className="text-base font-semibold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
                <FaChartLine className="text-purple-500 text-lg" />
                Performance Comparison
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={results.comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis 
                    dataKey="metric" 
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#64748b"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={<CustomLegend />} />
                  <Line type="monotone" dataKey="Without AI" stroke="#93c5fd" strokeWidth={3} dot={{ fill: '#93c5fd' }} />
                  <Line type="monotone" dataKey="With AI" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6' }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-300" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">Without AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-xs text-slate-700 dark:text-slate-300">With AI</span>
                </div>
              </div>
            </div>

            <div className="bg-white/90 dark:bg-slate-800/70 rounded-[32px] p-6 border-2 border-emerald-200/50 dark:border-emerald-800/30 shadow-lg shadow-emerald-100/30 dark:shadow-none lg:col-span-2">
              <h3 className="text-base font-semibold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
                <FaLeaf className="text-emerald-500 text-lg" />
                Energy Usage Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={{ strokeWidth: 1 }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2">
                {pieData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-slate-700 dark:text-slate-300">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-800/70 rounded-[32px] p-6 border-2 border-blue-200/50 dark:border-blue-800/30 shadow-lg shadow-blue-100/30 dark:shadow-none">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-700 dark:text-white flex items-center gap-2">
                <FaInfoCircle className="text-[#3B82F6] dark:text-[#44C8F5] text-lg" />
                Generated Report
              </h3>
              <div className="flex items-center gap-2">
                {savingToSupabase && (
                  <span className="text-xs text-[#3B82F6] dark:text-[#44C8F5] flex items-center gap-1">
                    <span className="animate-spin">⏳</span>
                    Saving...
                  </span>
                )}
                {saveSuccess && !savingToSupabase && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Saved to Database
                  </span>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  AI Analysis Results
                </span>
              </div>
            </div>
            <pre className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl p-4 text-xs text-slate-800 dark:text-slate-200 overflow-x-auto border-2 border-blue-200/30 dark:border-blue-800/20 max-h-96 overflow-y-auto">
              {JSON.stringify({ ...formData, ...results }, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Input Section */}
      {!showResults && (
        <div className="bg-white/90 dark:bg-slate-800/70 rounded-[40px] shadow-xl border-2 border-blue-200/50 dark:border-blue-800/30 overflow-hidden">
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-gradient-to-br from-[#44C8F5] to-[#3B82F6] shadow-lg shadow-[#44C8F5]/30">
                <FaThermometerHalf className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-semibold text-slate-700 dark:text-white">
                Building Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Customer Name <RequiredStar />
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <input
                    className={`w-full pl-11 pr-4 py-2.5 rounded-full border-2 ${
                      validationErrors.customerName 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-blue-200/60 dark:border-blue-800/40'
                    } bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                    name="customerName"
                    placeholder={validationErrors.customerName || "Enter customer name"}
                    value={formData.customerName}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Mobile
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <input
                    type="tel"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-blue-200/60 dark:border-blue-800/40 bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    name="mobile"
                    placeholder="Enter mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <input
                    type="email"
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-blue-200/60 dark:border-blue-800/40 bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    name="email"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <input
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-blue-200/60 dark:border-blue-800/40 bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    name="address"
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Total Horsepower */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Total Horsepower (HP) <RequiredStar />
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <input
                    type="number"
                    min="1"
                    step="0.1"
                    className={`w-full pl-11 pr-4 py-2.5 rounded-full border-2 ${
                      validationErrors.totalHorsepower 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-blue-200/60 dark:border-blue-800/40'
                    } bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                    name="totalHorsepower"
                    placeholder={validationErrors.totalHorsepower || "Min 1 HP"}
                    value={formData.totalHorsepower}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Number of Floors */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Number of Floors <RequiredStar />
                </label>
                <div className="relative">
                  <FaLayerGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className={`w-full pl-11 pr-4 py-2.5 rounded-full border-2 ${
                      validationErrors.numberOfFloors 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-blue-200/60 dark:border-blue-800/40'
                    } bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                    name="numberOfFloors"
                    placeholder={validationErrors.numberOfFloors || "Enter number of floors"}
                    value={formData.numberOfFloors}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Unit Price */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Unit Price ($/kWh) <RequiredStar />
                </label>
                <div className="relative">
                  <FaMoneyBillWave className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className={`w-full pl-11 pr-4 py-2.5 rounded-full border-2 ${
                      validationErrors.unitPrice 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-blue-200/60 dark:border-blue-800/40'
                    } bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                    name="unitPrice"
                    placeholder={validationErrors.unitPrice || "e.g., 0.15"}
                    value={formData.unitPrice}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">
                    $/kWh
                  </div>
                </div>
              </div>

              {/* Outdoor Operating Time */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Outdoor Operating Time (hours) <RequiredStar />
                </label>
                <div className="relative">
                  <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <input
                    type="number"
                    min="0"
                    max="24"
                    step="0.5"
                    className={`w-full pl-11 pr-4 py-2.5 rounded-full border-2 ${
                      validationErrors.outdoorOperatingTime 
                        ? 'border-red-500 dark:border-red-500' 
                        : 'border-blue-200/60 dark:border-blue-800/40'
                    } bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500`}
                    name="outdoorOperatingTime"
                    placeholder={validationErrors.outdoorOperatingTime || "e.g., 8"}
                    value={formData.outdoorOperatingTime}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">
                    hrs
                  </div>
                </div>
              </div>

              {/* Completion Year */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Completion Year
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <select
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-blue-200/60 dark:border-blue-800/40 bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all appearance-none"
                    name="completionYear"
                    value={formData.completionYear}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {completionYearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Building Use */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Building Use
                </label>
                <div className="relative">
                  <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <select
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-blue-200/60 dark:border-blue-800/40 bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all appearance-none"
                    name="buildingUse"
                    value={formData.buildingUse}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {buildingUseTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Outer Wall Azimuth Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Outer Wall Azimuth Type
                </label>
                <div className="relative">
                  <FaCompass className="absolute left-4 top-1/2 -translate-y-1/2 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <select
                    className="w-full pl-11 pr-4 py-2.5 rounded-full border-2 border-blue-200/60 dark:border-blue-800/40 bg-white/95 dark:bg-slate-900/80 text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all appearance-none"
                    name="outerWallAzimuthType"
                    value={formData.outerWallAzimuthType}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    {azimuthTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Days to Exclude */}
              <div className="lg:col-span-3">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Days to Exclude <span className="text-xs text-slate-500">(Select days when building is closed)</span>
                </label>
                <div className="relative">
                  <FaCalendarWeek className="absolute left-4 top-3 text-[#3B82F6] dark:text-[#44C8F5] text-base z-10" />
                  <div className="pl-11 flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`
                          px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2
                          ${formData.excludedDaysOfWeek.includes(day)
                            ? 'bg-red-100/90 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-400/60 dark:border-red-600/60 shadow-md shadow-red-100/50'
                            : 'bg-slate-100/90 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 border-transparent hover:border-[#3B82F6]/50 dark:hover:border-[#44C8F5]/50'
                          }
                        `}
                        disabled={loading}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                {formData.excludedDaysOfWeek.length > 0 && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Excluded: {formData.excludedDaysOfWeek.join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`
                  px-8 py-3 rounded-full font-medium text-white transition-all flex items-center gap-2 shadow-lg
                  ${loading
                    ? 'bg-gradient-to-r from-[#44C8F5] to-[#3B82F6] cursor-wait shadow-[#44C8F5]/30'
                    : 'bg-gradient-to-r from-[#44C8F5] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#44C8F5] shadow-[#44C8F5]/30 hover:shadow-[#44C8F5]/40 hover:-translate-y-0.5'
                  }
                `}
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Analyzing... Please wait
                  </>
                ) : (
                  <>
                    <FaChartLine className="text-white" />
                    Run AI Simulation
                  </>
                )}
              </button>
              {loading && (
                <p className="text-sm text-[#3B82F6] dark:text-[#44C8F5] animate-pulse">
                  ⚡ AI is analyzing your building...
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}// import { useState, useEffect } from "react";
// import { supabase } from "../supabase";
// import {
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   Legend,
//   Cell,
//   PieChart,
//   Pie,
//   LineChart,
//   Line,
// } from "recharts";
// import {
//   FaBuilding,
//   FaChartLine,
//   FaDollarSign,
//   FaLeaf,
//   FaThermometerHalf,
//   FaHome,
//   FaHospital,
//   FaStore,
//   FaCity,
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaInfoCircle,
//   FaUser,
//   FaClock,
//   FaCalendarAlt,
//   FaMapMarkerAlt,
//   FaEnvelope,
//   FaPhone,
//   FaCompass,
//   FaSchool,
//   FaHotel,
//   FaWarehouse,
//   FaServer,
//   FaFlask,
//   FaBook,
//   FaPlane,
//   FaFutbol,
//   FaIndustry,
//   FaArrowLeft,
//   FaTachometerAlt,
//   FaUtensils,
//   FaUsers,
//   FaLayerGroup,
//   FaMoneyBillWave,
//   FaCalendarWeek,
// } from "react-icons/fa";

// // Required star component - always red in both themes.
// const RequiredStar = () => (
//   <span className="required-star" aria-hidden="true">*</span>
// );

// export default function BuildingAnalysis() {
//   const [formData, setFormData] = useState({
//     customerName: "",
//     mobile: "",
//     email: "",
//     address: "",
//     totalHorsepower: "",
//     outdoorOperatingTime: "",
//     completionYear: "after 2017",
//     buildingUse: "Office",
//     outerWallAzimuthType: "0",
//     numberOfFloors: "",
//     unitPrice: "",
//     excludedDaysOfWeek: [],
//   });

//   const [loading, setLoading] = useState(false);
//   const [saveError, setSaveError] = useState(null);
//   const [saveSuccess, setSaveSuccess] = useState(false);
//   const [results, setResults] = useState(null);
//   const [showResults, setShowResults] = useState(false);
//   const [savingToSupabase, setSavingToSupabase] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});
  
//   // Add darkMode state
//   const [darkMode, setDarkMode] = useState(() => {
//     if (typeof window !== 'undefined') {
//       return document.documentElement.classList.contains('dark') || 
//              document.documentElement.classList.contains('dark-mode');
//     }
//     return false;
//   });

//   // Add useEffect to detect dark mode changes
//   useEffect(() => {
//     const observer = new MutationObserver(() => {
//       const isDark = document.documentElement.classList.contains('dark') || 
//                      document.documentElement.classList.contains('dark-mode');
//       setDarkMode(isDark);
//     });
    
//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ['class']
//     });
    
//     return () => observer.disconnect();
//   }, []);

//   // Clear form data when component mounts (new page load)
//   useEffect(() => {
//     // Clear form data when coming back to this page
//     setFormData({
//       customerName: "",
//       mobile: "",
//       email: "",
//       address: "",
//       totalHorsepower: "",
//       outdoorOperatingTime: "",
//       completionYear: "after 2017",
//       buildingUse: "Office",
//       outerWallAzimuthType: "0",
//       numberOfFloors: "",
//       unitPrice: "",
//       excludedDaysOfWeek: [],
//     });
//   }, []);

//   const buildingUseTypes = [
//     { value: "Office", icon: FaCity, label: "Office" },
//     { value: "Hotel", icon: FaHotel, label: "Hotel" },
//     { value: "Hospital", icon: FaHospital, label: "Hospital" },
//     { value: "Store", icon: FaStore, label: "Store" },
//     { value: "School", icon: FaSchool, label: "School" },
//     { value: "Restaurant", icon: FaUtensils, label: "Restaurant" },
//     { value: "Meeting Place", icon: FaUsers, label: "Meeting Place" },
//     { value: "Apartment", icon: FaHome, label: "Apartment" },
//     { value: "Airport", icon: FaPlane, label: "Airport" },
//   ];

//   const completionYearOptions = [
//     { value: "before 1980", label: "Before 1980" },
//     { value: "1981-1992", label: "1981-1992" },
//     { value: "1993-1999", label: "1993-1999" },
//     { value: "2000-2013", label: "2000-2013" },
//     { value: "2014-2016", label: "2014-2016" },
//     { value: "after 2017", label: "After 2017" },
//   ];

//   const azimuthTypeOptions = [
//     { value: "0", label: "North, East, South, West" },
//     { value: "1", label: "Northeast, Southeast, Southwest, Northwest" },
//   ];

//   const daysOfWeek = [
//     "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
//   ];

//   const getNumericYear = (yearRange) => {
//     const yearMap = {
//       "before 1980": 1975,
//       "1981-1992": 1986,
//       "1993-1999": 1996,
//       "2000-2013": 2006,
//       "2014-2016": 2015,
//       "after 2017": 2020,
//     };
//     return yearMap[yearRange] || 2000;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//     // Clear validation error for this field when user types
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleDayToggle = (day) => {
//     setFormData(prev => ({
//       ...prev,
//       excludedDaysOfWeek: prev.excludedDaysOfWeek.includes(day)
//         ? prev.excludedDaysOfWeek.filter(d => d !== day)
//         : [...prev.excludedDaysOfWeek, day]
//     }));
//   };

//   const handleBackToForm = () => {
//     setShowResults(false);
//     setResults(null);
//     // Clear form data when going back
//     setFormData({
//       customerName: "",
//       mobile: "",
//       email: "",
//       address: "",
//       totalHorsepower: "",
//       outdoorOperatingTime: "",
//       completionYear: "after 2017",
//       buildingUse: "Office",
//       outerWallAzimuthType: "0",
//       numberOfFloors: "",
//       unitPrice: "",
//       excludedDaysOfWeek: [],
//     });
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.customerName.trim()) {
//       errors.customerName = "Please enter customer name";
//     }
//     if (!formData.totalHorsepower) {
//       errors.totalHorsepower = "Please enter total horsepower";
//     } else if (parseFloat(formData.totalHorsepower) < 1) {
//       errors.totalHorsepower = "Total Horsepower must be at least 1 HP";
//     }
//     if (!formData.outdoorOperatingTime) {
//       errors.outdoorOperatingTime = "Please enter outdoor operating time";
//     }
//     if (!formData.numberOfFloors) {
//       errors.numberOfFloors = "Please enter number of floors";
//     } else if (parseInt(formData.numberOfFloors) < 1) {
//       errors.numberOfFloors = "Number of floors must be at least 1";
//     }
//     if (!formData.unitPrice) {
//       errors.unitPrice = "Please enter unit price";
//     } else if (parseFloat(formData.unitPrice) < 0) {
//       errors.unitPrice = "Unit price must be a positive number";
//     }
    
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const saveToSupabase = async (resultsData) => {
//     try {
//       setSavingToSupabase(true);
      
//       const payload = {
//         customer_name: formData.customerName || "Unknown",
//         mobile: formData.mobile || "",
//         email: formData.email || "",
//         address: formData.address || "",
//         building_use: formData.buildingUse || "Office",
//         total_horsepower: parseFloat(formData.totalHorsepower) || 0,
//         completion_year: formData.completionYear || "after 2017",
//         building_age: resultsData.buildingAge || 0,
//         outer_wall_azimuth_type: formData.outerWallAzimuthType || "0",
//         number_of_floors: parseInt(formData.numberOfFloors) || 0,
//         unit_price: parseFloat(formData.unitPrice) || 0,
//         excluded_days: formData.excludedDaysOfWeek.join(", "),
//         outdoor_operating_time: parseFloat(formData.outdoorOperatingTime) || 0,
//         operating_hours: resultsData.operatingHours || 0,
//         azimuth_angle: resultsData.azimuthAngle || 0,
//         azimuth_direction: resultsData.azimuthDirection || "North",
//         solar_impact: 0,
//         base_efficiency: resultsData.baseEfficiency || 0,
//         ai_efficiency: resultsData.aiEfficiency || 0,
//         without_ai: resultsData.withoutAI || 0,
//         with_ai: resultsData.withAI || 0,
//         energy_saving: resultsData.energySaving || 0,
//         saving_percentage: resultsData.savingPercentage || 0,
//         annual_savings: resultsData.annualSavings || 0,
//         implementation_cost: resultsData.implementationCost || 0,
//         roi_in_years: parseFloat(resultsData.roiInYears) || 0,
//         building_id: formData.customerName || "unknown",
//         equipment_id: "AI_SIM_" + Date.now(),
//         scope_category: "AI Energy Saving",
//         outdoor_temp_ave: 25,
//         setpoint_unified: 22,
//         outdoor_setpoint_delta: 3,
//         temp_bin: "20-25",
//         setpoint_bin: "Medium",
//         hour_block: "Afternoon",
//         ff_on_flag: 1,
//         setpoint_missing: 0,
//         is_weekend: 0,
//         hour_sin: 0.5,
//         hour_cos: 0.8,
//         month_sin: 0.3,
//         month_cos: 0.9,
//         day_of_week_sin: 0.2,
//         day_of_week_cos: 0.7,
//         solar_azimuthal_angles: formData.outerWallAzimuthType || "0",
//         generated_at: new Date().toISOString(),
//       };

//       const { data, error } = await supabase
//         .from("analysis_history")
//         .insert([payload])
//         .select();

//       if (error) {
//         console.error("❌ Supabase Error:", error);
//         setSaveError(`Failed to save: ${error.message}`);
//         return false;
//       }

//       console.log("✅ Data saved to Supabase:", data);
//       setSaveError(null);
//       return true;

//     } catch (err) {
//       console.error("💥 Error saving to Supabase:", err);
//       setSaveError(`Error: ${err.message}`);
//       return false;
//     } finally {
//       setSavingToSupabase(false);
//     }
//   };

//   const handleAnalyze = async () => {
//     setValidationErrors({});
//     setSaveError(null);
//     setSaveSuccess(false);
//     setShowResults(false);
    
//     // Validate form
//     if (!validateForm()) {
//       // Scroll to first error
//       const firstError = document.querySelector('.border-red-500');
//       if (firstError) {
//         firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }
//       return;
//     }

//     setLoading(true);
    
//     try {
//       await new Promise(resolve => setTimeout(resolve, 5000));

//       const currentYear = new Date().getFullYear();
//       const buildingYear = getNumericYear(formData.completionYear);
//       const buildingAge = currentYear - buildingYear;

//       const operatingHours = parseFloat(formData.outdoorOperatingTime) || 0;
//       const numberOfFloors = parseInt(formData.numberOfFloors) || 1;
//       const unitPrice = parseFloat(formData.unitPrice) || 0;
      
//       const baseEfficiency = Math.min(85, Math.max(65, 
//         65 + (buildingAge > 50 ? 5 : buildingAge > 30 ? 10 : buildingAge > 15 ? 15 : 20) -
//         (numberOfFloors > 10 ? 3 : numberOfFloors > 5 ? 2 : 0)
//       ));
      
//       const baseConsumption = Math.round(100 + 
//         (operatingHours > 12 ? 30 : operatingHours > 8 ? 15 : 0) +
//         (numberOfFloors > 10 ? 20 : numberOfFloors > 5 ? 10 : 0)
//       );
      
//       const possibleImprovements = [7, 8, 9, 10, 11, 12];
//       const aiImprovement = possibleImprovements[Math.floor(Math.random() * possibleImprovements.length)];
      
//       const aiEfficiency = Math.min(95, baseEfficiency + aiImprovement);
      
//       const withoutAI = Math.round(baseConsumption * (1 - baseEfficiency / 100));
//       const withAI = Math.round(baseConsumption * (1 - aiEfficiency / 100));
//       const energySaving = withoutAI - withAI;
//       const savingPercentage = Math.round((energySaving / withoutAI) * 100);
      
//       const annualSavings = energySaving * 365 * (unitPrice / 100) * numberOfFloors;
//       const implementationCost = Math.round(5000 + (baseConsumption * 10 * numberOfFloors));
//       const roiInYears = (implementationCost / annualSavings).toFixed(1);

//       const resultsData = {
//         customerName: formData.customerName,
//         buildingUse: formData.buildingUse,
//         buildingAge: buildingAge,
//         operatingHours: operatingHours,
//         azimuthDirection: "North",
//         azimuthAngle: 0,
//         baseEfficiency: baseEfficiency,
//         aiEfficiency: aiEfficiency,
//         aiImprovement: aiImprovement,
//         withoutAI: withoutAI,
//         withAI: withAI,
//         energySaving: energySaving,
//         savingPercentage: savingPercentage,
//         annualSavings: Math.round(annualSavings),
//         implementationCost: implementationCost,
//         roiInYears: roiInYears,
//         totalHorsepower: formData.totalHorsepower,
//         mobile: formData.mobile,
//         email: formData.email,
//         address: formData.address,
//         completionYear: formData.completionYear,
//         outdoorOperatingTime: formData.outdoorOperatingTime,
//         outerWallAzimuthType: formData.outerWallAzimuthType,
//         numberOfFloors: numberOfFloors,
//         unitPrice: unitPrice,
//         excludedDaysOfWeek: formData.excludedDaysOfWeek,
//         comparisonData: [
//           { metric: "Efficiency", "Without AI": baseEfficiency, "With AI": aiEfficiency },
//           { metric: "Energy Saving", "Without AI": 0, "With AI": savingPercentage },
//           { metric: "Cost Reduction", "Without AI": 0, "With AI": Math.round((annualSavings / (withoutAI * 365 * 0.15)) * 100) },
//           { metric: "Sustainability", "Without AI": 50, "With AI": Math.min(95, Math.round(60 + savingPercentage * 0.35)) },
//         ],
//         annualBreakdown: [
//           { name: "Current Usage", value: withoutAI, fill: "#f59e0b" },
//           { name: "Potential Savings", value: energySaving, fill: "#3b82f6" },
//           { name: "AI Optimized", value: withAI, fill: "#10b981" },
//         ],
//       };

//       setResults(resultsData);

//       const saved = await saveToSupabase(resultsData);
      
//       if (saved) {
//         setSaveSuccess(true);
//         console.log("✅ Data saved to Supabase successfully!");
//       } else {
//         console.log("⚠️ Data not saved to Supabase");
//       }
      
//       setShowResults(true);
//       setTimeout(() => setSaveSuccess(false), 3000);

//     } catch (err) {
//       console.error("💥 Error:", err);
//       setSaveError(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const StatCard = ({ icon: Icon, title, value, unit, color, subtitle }) => (
//     <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
//       <div className="flex items-start justify-between">
//         <div>
//           <p className="text-sm text-slate-600 dark:text-slate-400">{title}</p>
//           <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
//             {value}{unit}
//           </p>
//           {subtitle && (
//             <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{subtitle}</p>
//           )}
//         </div>
//         <div className={`p-2.5 rounded-lg ${color}`}>
//           <Icon className="text-white text-lg" />
//         </div>
//       </div>
//     </div>
//   );

//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
//           <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>
//           {payload.map((item, index) => (
//             <p key={index} className="text-sm text-slate-700 dark:text-slate-300">
//               {item.name}: {item.value} {item.unit || 'kWh'}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   const CustomLegend = ({ payload }) => {
//     return (
//       <div className="flex flex-wrap justify-center gap-4 mt-2">
//         {payload.map((entry, index) => (
//           <div key={`legend-${index}`} className="flex items-center gap-2">
//             <div 
//               className="w-3 h-3 rounded-full" 
//               style={{ backgroundColor: entry.color }}
//             />
//             <span className="text-xs text-slate-700 dark:text-slate-300">
//               {entry.value}
//             </span>
//           </div>
//         ))}
//       </div>
//     );
//   };

//   const pieData = results ? [
//     { name: "Current Usage", value: results.withoutAI, color: "#f59e0b" },
//     { name: "AI Optimized", value: results.withAI, color: "#10b981" },
//   ] : [];

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 bg-slate-50 dark:bg-slate-900 min-h-screen">
//       {/* Header */}
//       <div className={`
//         rounded-2xl p-6 shadow-lg
//         ${darkMode 
//           ? 'bg-gradient-to-r from-slate-800 to-slate-700' 
//           : 'bg-gradient-to-r from-[#44C8F5] to-[#3B82F6]'
//         }
//       `}>
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div className="flex items-center gap-3">
//             <div className={`
//               p-2.5 rounded-xl text-white shadow-lg
//               ${darkMode 
//                 ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/25' 
//                 : 'bg-white/20 backdrop-blur-sm'
//               }
//             `}>
//               <FaLeaf className="text-xl" />
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold text-white">
//                 AI Energy Saving Simulator
//               </h1>
//               <p className={`
//                 text-sm
//                 ${darkMode ? 'text-slate-300' : 'text-blue-50'}
//               `}>
//                 Optimize your building's energy efficiency with AI
//               </p>
//             </div>
//           </div>
          
//           {/* Success/Error messages */}
//           {saveSuccess && !loading && (
//             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 animate-fadeIn">
//               <FaCheckCircle className="text-emerald-500 text-sm" />
//               <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
//                 Saved to Database ✓
//               </span>
//             </div>
//           )}
//           {saveError && (
//             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
//               <FaExclamationTriangle className="text-red-500 text-sm" />
//               <span className="text-sm font-medium text-red-700 dark:text-red-400">
//                 {saveError}
//               </span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Results Section */}
//       {showResults && results && (
//         <div className="space-y-6 animate-fadeIn">
//           <button
//             onClick={handleBackToForm}
//             className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
//           >
//             <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
//             <span>Back to Form</span>
//           </button>

//           <div className="bg-gradient-to-r from-[#44C8F5] to-[#3B82F6] rounded-2xl p-6 text-white shadow-lg">
//             <div className="flex items-center gap-3">
//               <FaCheckCircle className="text-2xl" />
//               <div>
//                 <h2 className="text-xl font-bold">AI Energy Saving Results</h2>
//                 <p className="text-emerald-100">Analysis complete for {results.customerName}</p>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             <StatCard
//               icon={FaLeaf}
//               title="Energy Savings"
//               value={`${results.savingPercentage}%`}
//               unit=""
//               color="bg-emerald-500"
//               subtitle={`${results.energySaving} kWh saved`}
//             />
//             <StatCard
//               icon={FaTachometerAlt}
//               title="AI Improvement"
//               value={`+${results.aiImprovement}%`}
//               unit=""
//               color="bg-blue-500"
//               subtitle={`${results.baseEfficiency}% → ${results.aiEfficiency}%`}
//             />
//             <StatCard
//               icon={FaDollarSign}
//               title="ROI"
//               value={results.roiInYears}
//               unit=" years"
//               color="bg-purple-500"
//               subtitle={`$${results.annualSavings.toLocaleString()} annual savings`}
//             />
//             <StatCard
//               icon={FaLayerGroup}
//               title="Building Floors"
//               value={results.numberOfFloors}
//               unit=""
//               color="bg-indigo-500"
//               subtitle={`${results.numberOfFloors} floors analyzed`}
//             />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
//               <h3 className="text-base font-semibold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
//                 <FaChartLine className="text-emerald-500" />
//                 Annual Energy Breakdown
//               </h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <BarChart data={results.annualBreakdown}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
//                   <XAxis 
//                     dataKey="name" 
//                     stroke="#64748b"
//                     tick={{ fill: '#64748b', fontSize: 12 }}
//                   />
//                   <YAxis 
//                     stroke="#64748b"
//                     tick={{ fill: '#64748b', fontSize: 12 }}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Bar dataKey="value" radius={[8, 8, 0, 0]}>
//                     {results.annualBreakdown.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.fill} />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//               <div className="flex flex-wrap justify-center gap-4 mt-4">
//                 {results.annualBreakdown.map((item) => (
//                   <div key={item.name} className="flex items-center gap-2">
//                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
//                     <span className="text-xs text-slate-700 dark:text-slate-300">
//                       {item.name}: {item.value} kWh
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
//               <h3 className="text-base font-semibold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
//                 <FaChartLine className="text-purple-500" />
//                 Performance Comparison
//               </h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <LineChart data={results.comparisonData}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
//                   <XAxis 
//                     dataKey="metric" 
//                     stroke="#64748b"
//                     tick={{ fill: '#64748b', fontSize: 12 }}
//                   />
//                   <YAxis 
//                     domain={[0, 100]} 
//                     stroke="#64748b"
//                     tick={{ fill: '#64748b', fontSize: 12 }}
//                   />
//                   <Tooltip content={<CustomTooltip />} />
//                   <Legend content={<CustomLegend />} />
//                   <Line type="monotone" dataKey="Without AI" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
//                   <Line type="monotone" dataKey="With AI" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
//                 </LineChart>
//               </ResponsiveContainer>
//               <div className="flex justify-center gap-6 mt-2">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-amber-500" />
//                   <span className="text-xs text-slate-700 dark:text-slate-300">Without AI</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 rounded-full bg-emerald-500" />
//                   <span className="text-xs text-slate-700 dark:text-slate-300">With AI</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg lg:col-span-2">
//               <h3 className="text-base font-semibold text-slate-700 dark:text-white mb-4 flex items-center gap-2">
//                 <FaLeaf className="text-emerald-500" />
//                 Energy Usage Distribution
//               </h3>
//               <ResponsiveContainer width="100%" height={250}>
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={60}
//                     outerRadius={90}
//                     paddingAngle={4}
//                     dataKey="value"
//                     label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                     labelLine={{ strokeWidth: 1 }}
//                   >
//                     {pieData.map((entry, index) => (
//                       <Cell key={`cell-${index}`} fill={entry.color} />
//                     ))}
//                   </Pie>
//                   <Tooltip content={<CustomTooltip />} />
//                 </PieChart>
//               </ResponsiveContainer>
//               <div className="flex justify-center gap-6 mt-2">
//                 {pieData.map((item) => (
//                   <div key={item.name} className="flex items-center gap-2">
//                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
//                     <span className="text-xs text-slate-700 dark:text-slate-300">{item.name}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-base font-semibold text-slate-700 dark:text-white flex items-center gap-2">
//                 <FaInfoCircle className="text-emerald-500" />
//                 Generated Report
//               </h3>
//               <div className="flex items-center gap-2">
//                 {savingToSupabase && (
//                   <span className="text-xs text-blue-500 dark:text-blue-400 flex items-center gap-1">
//                     <span className="animate-spin">⏳</span>
//                     Saving...
//                   </span>
//                 )}
//                 {saveSuccess && !savingToSupabase && (
//                   <span className="text-xs text-emerald-500 dark:text-emerald-400">
//                     ✓ Saved to Database
//                   </span>
//                 )}
//                 <span className="text-xs text-slate-500 dark:text-slate-400">
//                   AI Analysis Results
//                 </span>
//               </div>
//             </div>
//             <pre className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 text-xs text-slate-800 dark:text-slate-200 overflow-x-auto border border-slate-200 dark:border-slate-700 max-h-96 overflow-y-auto">
//               {JSON.stringify({ ...formData, ...results }, null, 2)}
//             </pre>
//           </div>
//         </div>
//       )}

//       {/* Input Section */}
//       {!showResults && (
//         <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
//           <div className="p-6 space-y-6">
//             <div className="flex items-center gap-2">
//               <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/20">
//                 <FaThermometerHalf className="text-emerald-600 dark:text-emerald-400" />
//               </div>
//               <h2 className="text-lg font-semibold text-slate-700 dark:text-white">
//                 Building Information
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {/* Customer Name */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Customer Name <RequiredStar />
//                 </label>
//                 <div className="relative">
//                   <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <input
//                     className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
//                       validationErrors.customerName 
//                         ? 'border-red-500 dark:border-red-500' 
//                         : 'border-slate-200 dark:border-slate-700'
//                     } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${validationErrors.customerName ? 'placeholder:text-red-600 dark:placeholder:text-red-400' : 'placeholder:text-slate-400 dark:placeholder:text-slate-500'}`}
//                     name="customerName"
//                     placeholder={validationErrors.customerName || "Enter customer name"}
//                     value={formData.customerName}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Mobile */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Mobile
//                 </label>
//                 <div className="relative">
//                   <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <input
//                     type="tel"
//                     className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
//                     name="mobile"
//                     placeholder="Enter mobile number"
//                     value={formData.mobile}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Email
//                 </label>
//                 <div className="relative">
//                   <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <input
//                     type="email"
//                     className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
//                     name="email"
//                     placeholder="Enter email address"
//                     value={formData.email}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Address */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Address
//                 </label>
//                 <div className="relative">
//                   <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <input
//                     className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
//                     name="address"
//                     placeholder="Enter address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Total Horsepower */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Total Horsepower (HP) <RequiredStar />
//                 </label>
//                 <div className="relative">
//                   <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <input
//                     type="number"
//                     min="1"
//                     step="0.1"
//                     className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
//                       validationErrors.totalHorsepower 
//                         ? 'border-red-500 dark:border-red-500' 
//                         : 'border-slate-200 dark:border-slate-700'
//                     } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${validationErrors.totalHorsepower ? 'placeholder:text-red-600 dark:placeholder:text-red-400' : 'placeholder:text-slate-400 dark:placeholder:text-slate-500'}`}
//                     name="totalHorsepower"
//                     placeholder={validationErrors.totalHorsepower || "Min 1 HP"}
//                     value={formData.totalHorsepower}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Number of Floors */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Number of Floors <RequiredStar />
//                 </label>
//                 <div className="relative">
//                   <FaLayerGroup className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <input
//                     type="number"
//                     min="1"
//                     step="1"
//                     className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
//                       validationErrors.numberOfFloors 
//                         ? 'border-red-500 dark:border-red-500' 
//                         : 'border-slate-200 dark:border-slate-700'
//                     } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${validationErrors.numberOfFloors ? 'placeholder:text-red-600 dark:placeholder:text-red-400' : 'placeholder:text-slate-400 dark:placeholder:text-slate-500'}`}
//                     name="numberOfFloors"
//                     placeholder={validationErrors.numberOfFloors || "Enter number of floors"}
//                     value={formData.numberOfFloors}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Unit Price */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Unit Price ($/kWh) <RequiredStar />
//                 </label>
//                 <div className="relative">
//                   <FaMoneyBillWave className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <input
//                     type="number"
//                     min="0"
//                     step="0.01"
//                     className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
//                       validationErrors.unitPrice 
//                         ? 'border-red-500 dark:border-red-500' 
//                         : 'border-slate-200 dark:border-slate-700'
//                     } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${validationErrors.unitPrice ? 'placeholder:text-red-600 dark:placeholder:text-red-400' : 'placeholder:text-slate-400 dark:placeholder:text-slate-500'}`}
//                     name="unitPrice"
//                     placeholder={validationErrors.unitPrice || "e.g., 0.15"}
//                     value={formData.unitPrice}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                   <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">
//                     $/kWh
//                   </div>
//                 </div>
//               </div>

//               {/* Outdoor Operating Time */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Outdoor Operating Time (hours) <RequiredStar />
//                 </label>
//                 <div className="relative">
//                   <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <input
//                     type="number"
//                     min="0"
//                     max="24"
//                     step="0.5"
//                     className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
//                       validationErrors.outdoorOperatingTime 
//                         ? 'border-red-500 dark:border-red-500' 
//                         : 'border-slate-200 dark:border-slate-700'
//                     } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all ${validationErrors.outdoorOperatingTime ? 'placeholder:text-red-600 dark:placeholder:text-red-400' : 'placeholder:text-slate-400 dark:placeholder:text-slate-500'}`}
//                     name="outdoorOperatingTime"
//                     placeholder={validationErrors.outdoorOperatingTime || "e.g., 8"}
//                     value={formData.outdoorOperatingTime}
//                     onChange={handleChange}
//                     disabled={loading}
//                   />
//                   <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">
//                     hrs
//                   </div>
//                 </div>
//               </div>

//               {/* Completion Year */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Completion Year
//                 </label>
//                 <div className="relative">
//                   <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <select
//                     className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
//                     name="completionYear"
//                     value={formData.completionYear}
//                     onChange={handleChange}
//                     disabled={loading}
//                   >
//                     {completionYearOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Building Use */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Building Use
//                 </label>
//                 <div className="relative">
//                   <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <select
//                     className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
//                     name="buildingUse"
//                     value={formData.buildingUse}
//                     onChange={handleChange}
//                     disabled={loading}
//                   >
//                     {buildingUseTypes.map((type) => (
//                       <option key={type.value} value={type.value}>
//                         {type.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Outer Wall Azimuth Type */}
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Outer Wall Azimuth Type
//                 </label>
//                 <div className="relative">
//                   <FaCompass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
//                   <select
//                     className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all appearance-none"
//                     name="outerWallAzimuthType"
//                     value={formData.outerWallAzimuthType}
//                     onChange={handleChange}
//                     disabled={loading}
//                   >
//                     {azimuthTypeOptions.map((option) => (
//                       <option key={option.value} value={option.value}>
//                         {option.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               {/* Days to Exclude */}
//               <div className="lg:col-span-3">
//                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
//                   Days to Exclude <span className="text-xs text-slate-500">(Select days when building is closed)</span>
//                 </label>
//                 <div className="relative">
//                   <FaCalendarWeek className="absolute left-3 top-3 text-slate-400 dark:text-slate-500" />
//                   <div className="pl-10 flex flex-wrap gap-2">
//                     {daysOfWeek.map((day) => (
//                       <button
//                         key={day}
//                         type="button"
//                         onClick={() => handleDayToggle(day)}
//                         className={`
//                           px-3 py-1.5 rounded-lg text-sm font-medium transition-all
//                           ${formData.excludedDaysOfWeek.includes(day)
//                             ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-400 dark:border-red-600'
//                             : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-2 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
//                           }
//                         `}
//                         disabled={loading}
//                       >
//                         {day}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 {formData.excludedDaysOfWeek.length > 0 && (
//                   <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
//                     Excluded: {formData.excludedDaysOfWeek.join(", ")}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
//               <button
//                 onClick={handleAnalyze}
//                 disabled={loading}
//                 className={`
//                   px-8 py-3 rounded-xl font-medium text-white transition-all flex items-center gap-2
//                   ${loading
//                     ? 'bg-gradient-to-r from-[#44C8F5] to-[#3B82F6] cursor-wait'
//                     : 'bg-gradient-to-r from-[#44C8F5] to-[#3B82F6] hover:from-[#3B82F6] hover:to-[#44C8F5] shadow-lg shadow-[#44C8F5]/25 hover:shadow-[#44C8F5]/40'
//                   }
//                 `}
//               >
//                 {loading ? (
//                   <>
//                     <span className="animate-spin">⏳</span>
//                     Analyzing... Please wait
//                   </>
//                 ) : (
//                   <>
//                     <FaChartLine />
//                     Run AI Simulation
//                   </>
//                 )}
//               </button>
//               {loading && (
//                 <p className="text-sm text-[#44C8F5] dark:text-[#3B82F6] animate-pulse">
//                   ⚡ AI is analyzing your building...
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

