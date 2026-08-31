import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiHome } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const AgencySearch = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert('Please enter an agency name');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/agency-result', { state: { agencyName: searchTerm } });
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-white mb-4 hover:text-green-200 transition"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          {t.back}
        </button>
        <h1 className="text-2xl font-bold text-white">{t.checkAgency}</h1>
        <p className="text-green-100 text-sm mt-1">{t.verifyAgencies}</p>
      </div>

      <div className="px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiHome className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">{t.searchAgency}</h2>
          </div>
          
          <p className="text-gray-500 text-sm mb-4">{t.enterAgencyName}</p>

          <div className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t.searchPlaceholder}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-gray-700"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-semibold text-white transition flex items-center gap-2 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {loading ? t.searching : <><FiSearch className="h-5 w-5" /> {t.search}</>}
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">{t.tipsForSearching}</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              <span>{t.tip1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              <span>{t.tip2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">•</span>
              <span>{t.tip3}</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-700 mb-3">{t.verifiedAgencies}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
              <div>
                <p className="font-semibold text-gray-800">Al-Falah Overseas</p>
                <p className="text-xs text-gray-500">License: BE-2024-1123</p>
              </div>
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                {t.verified}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
              <div>
                <p className="font-semibold text-gray-800">Gulf Recruiters</p>
                <p className="text-xs text-gray-500">License: BE-2024-0892</p>
              </div>
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                {t.verified}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
              <div>
                <p className="font-semibold text-gray-800">Fast Track Overseas</p>
                <p className="text-xs text-gray-500">License: Not Found</p>
              </div>
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                {t.notVerified}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">{t.sampleData}</p>
        </div>
      </div>
    </div>
  );
};

export default AgencySearch;