import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const ReportScam = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [formData, setFormData] = useState({
    agencyName: '',
    description: '',
    date: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agencyName.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/report-scam`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency_name: formData.agencyName.trim(),
          description: formData.description.trim()
        })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSubmitted(true);
        setFormData({ agencyName: '', description: '', date: '' });
      } else {
        setError(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Report submission failed:', err);
      setError('Submission failed. Please make sure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FiCheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t.reportSubmitted}</h2>
          <p className="text-gray-600 mb-6">{t.thankYou}</p>
          <button
            onClick={() => {
              setSubmitted(false);
              navigate('/home');
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {t.goToHome}
          </button>
          <button
            onClick={() => {
              setSubmitted(false);
            }}
            className="w-full mt-3 text-blue-600 font-semibold hover:text-blue-800 transition"
          >
            {t.reportAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-white mb-4 hover:text-gray-200 transition"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          {t.back}
        </button>
        <h1 className="text-2xl font-bold text-white">{t.reportScamTitle}</h1>
        <p className="text-orange-100 text-sm mt-1">{t.helpOthers}</p>
      </div>

      <div className="px-6 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <FiAlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-orange-800">{t.important}</h4>
                <p className="text-sm text-orange-700">{t.reportWarning}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                {t.agencyNameLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                placeholder={t.agencyNameLabel}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-700"
                required
              />
            </div>

            <div className="mb-5">
              <label className="block text-gray-700 font-semibold mb-2">
                {t.dateOfIncident}
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-700"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                {t.describeExperience} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={t.describePlaceholder}
                className="w-full h-48 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-gray-700"
                required
              />
              <p className="text-xs text-gray-400 mt-1">{t.minCharacters}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              {loading ? t.submitting : t.submitReport}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportScam;
