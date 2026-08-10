// src/pages/LogoutModal.jsx
import { FaExclamationTriangle } from "react-icons/fa";

const LogoutModal = ({ isOpen, onClose, onConfirm, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`
        relative w-full max-w-sm rounded-2xl shadow-2xl p-6
        ${darkMode 
          ? "bg-slate-800 border border-slate-700" 
          : "bg-white border border-slate-200"
        }
      `}>
        <div className="flex justify-center mb-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${darkMode ? "bg-red-500/20" : "bg-red-50"}
          `}>
            <FaExclamationTriangle className={`
              text-3xl
              ${darkMode ? "text-red-400" : "text-red-500"}
            `} />
          </div>
        </div>
        <h3 className={`
          text-lg font-semibold text-center mb-2
          ${darkMode ? "text-white" : "text-slate-900"}
        `}>
          Confirm Logout
        </h3>
        <p className={`
          text-sm text-center mb-6
          ${darkMode ? "text-slate-400" : "text-slate-500"}
        `}>
          Are you sure you want to logout? You will need to login again to access your account.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className={`
              flex-1 px-4 py-2.5 rounded-xl font-medium transition-all
              ${darkMode 
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600" 
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }
            `}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/25"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;