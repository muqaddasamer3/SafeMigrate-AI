import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiClock, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiXCircle,
  FiTrash2,
  FiCalendar
} from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const History = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [history, setHistory] = useState([]);

  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('safeMigrateHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'Low': return FiCheckCircle;
      case 'Medium': return FiAlertTriangle;
      case 'High': return FiXCircle;
      default: return FiClock;
    }
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'High': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRiskBadge = (risk) => {
    switch(risk) {
      case 'Low': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'High': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      localStorage.removeItem('safeMigrateHistory');
      setHistory([]);
    }
  };

  const deleteEntry = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    localStorage.setItem('safeMigrateHistory', JSON.stringify(newHistory));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-white mb-4 hover:text-purple-200 transition"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          {t.back || 'Back'}
        </button>
        <h1 className="text-2xl font-bold text-white">History</h1>
        <p className="text-purple-100 text-sm mt-1">
          Your past scam checks and verifications
        </p>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {history.length === 0 ? (
          // Empty State
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
            <div className="mx-auto w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <FiClock className="h-10 w-10 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No History Yet
            </h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto">
              Your past checks will appear here. Start by checking a job offer or verifying an agency.
            </p>
            <button
              onClick={() => navigate('/check-offer')}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition"
            >
              Check a Job Offer
            </button>
          </div>
        ) : (
          <>
            {/* History Stats */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm text-gray-500">Total Checks</span>
                  <p className="text-2xl font-bold text-gray-800">{history.length}</p>
                </div>
                <button
                  onClick={clearHistory}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-semibold"
                >
                  <FiTrash2 className="h-4 w-4" />
                  Clear All
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="space-y-3">
              {history.map((entry, index) => {
                const RiskIcon = getRiskIcon(entry.risk);
                const riskColor = getRiskColor(entry.risk);
                const riskBadge = getRiskBadge(entry.risk);
                
                return (
                  <div key={index} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-xl ${riskColor}`}>
                          <RiskIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-800 text-sm">
                              {entry.type === 'offer' ? 'Job Offer Check' : 'Agency Verification'}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${riskBadge}`}>
                              {entry.risk} Risk
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                            {entry.text || entry.agencyName || 'No details available'}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <FiCalendar className="h-3 w-3" />
                              {formatDate(entry.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEntry(index)}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;