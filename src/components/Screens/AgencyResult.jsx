import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiInfo, FiMapPin, FiPhone, FiFileText } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const AgencyResult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  
  const agencyName = location.state?.agencyName || 'Al-Falah Overseas';
  
  const mockAgency = {
    verified: true,
    name: agencyName,
    licenseNumber: 'BE-2024-1123',
    contact: '+92-42-1234567',
    city: 'Lahore',
    status: 'Active',
    address: '123 Main Street, Lahore, Pakistan'
  };

  const isVerified = mockAgency.verified;

  // Save to history when result loads
  useEffect(() => {
    const saveToHistory = () => {
      const historyEntry = {
        type: 'agency',
        risk: isVerified ? 'Low' : 'High',
        text: null,
        agencyName: agencyName,
        date: new Date().toISOString()
      };

      const savedHistory = localStorage.getItem('safeMigrateHistory');
      let history = savedHistory ? JSON.parse(savedHistory) : [];
      history.unshift(historyEntry);
      // Keep only last 50 entries
      if (history.length > 50) {
        history = history.slice(0, 50);
      }
      localStorage.setItem('safeMigrateHistory', JSON.stringify(history));
    };

    saveToHistory();
  }, [agencyName, isVerified]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${
        isVerified ? 'from-green-600 to-green-800' : 'from-red-600 to-red-800'
      } px-6 pt-12 pb-6 rounded-b-3xl shadow-lg`}>
        <button
          onClick={() => navigate('/check-agency')}
          className="flex items-center text-white mb-4 hover:text-gray-200 transition"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          {t.back}
        </button>
        <h1 className="text-2xl font-bold text-white">{t.agencyResult}</h1>
        <p className="text-white/80 text-sm mt-1">
          {t.verificationDetails} {agencyName}
        </p>
      </div>

      <div className="px-6 py-6">
        <div className={`border-2 rounded-2xl p-6 shadow-sm ${
          isVerified 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full ${
              isVerified ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isVerified ? (
                <FiCheckCircle className="h-10 w-10 text-green-600" />
              ) : (
                <FiXCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isVerified ? 'text-green-700' : 'text-red-700'
              }`}>
                {isVerified ? t.verifiedAgency : t.unverifiedAgency}
              </h2>
              <p className={`text-sm ${
                isVerified ? 'text-green-600' : 'text-red-600'
              }`}>
                {isVerified ? t.registeredWithGov : t.notInVerifiedList}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiInfo className="h-5 w-5 text-blue-600" />
            {t.agencyDetails}
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm">{t.agencyName}</span>
              <span className="font-semibold text-gray-800">{mockAgency.name}</span>
            </div>
            
            {isVerified && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">{t.licenseNumber}</span>
                  <span className="font-semibold text-gray-800">{mockAgency.licenseNumber}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm">{t.status}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    {mockAgency.status}
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 text-sm flex items-center gap-1">
                <FiMapPin className="h-4 w-4" />
                {t.city}
              </span>
              <span className="font-semibold text-gray-800">{mockAgency.city}</span>
            </div>

            {isVerified && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 text-sm flex items-center gap-1">
                  <FiPhone className="h-4 w-4" />
                  {t.contact}
                </span>
                <span className="font-semibold text-gray-800">{mockAgency.contact}</span>
              </div>
            )}

            {isVerified && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 text-sm flex items-center gap-1">
                  <FiFileText className="h-4 w-4" />
                  {t.address}
                </span>
                <span className="font-semibold text-gray-800 text-sm text-right">
                  {mockAgency.address}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={`mt-6 rounded-2xl border p-5 ${
          isVerified 
            ? 'bg-blue-50 border-blue-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <h3 className={`font-semibold mb-2 ${
            isVerified ? 'text-blue-800' : 'text-orange-800'
          }`}>
            {isVerified ? '✅ ' + t.whatThisMeans : '⚠️ ' + t.whatThisMeans}
          </h3>
          <p className={`text-sm ${
            isVerified ? 'text-blue-700' : 'text-orange-700'
          }`}>
            {isVerified ? t.verifiedMeaning : t.unverifiedMeaning}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate('/check-agency')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {t.searchAnother}
          </button>
          {!isVerified && (
            <button
              onClick={() => navigate('/report-scam')}
              className="w-full border-2 border-red-600 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
            >
              {t.reportThisAgency}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgencyResult;