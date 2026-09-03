import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSearch, FiHome } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const AgencySearch = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert('Please enter an agency name');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/check-agency?name=${encodeURIComponent(searchTerm.trim())}`);
      const data = await response.json();
      navigate('/agency-result', { state: { agency: data, searchQuery: searchTerm } });
    } catch (err) {
      console.error('Agency search failed:', err);
      setError('Search failed. Please make sure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
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
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}
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
              <span className="text-green-500 font-bold">{"\u2022"}</span>
              <span>{t.tip1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">{"\u2022"}</span>
              <span>{t.tip2}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 font-bold">{"\u2022"}</span>
              <span>{t.tip3}</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 bg-green-50 rounded-2xl border border-green-200 p-5 text-center">
          <p className="text-green-700 text-sm font-medium">
            Search for any agency by name to verify their BEOE registration status.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgencySearch;
