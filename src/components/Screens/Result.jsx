import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiAlertTriangle, FiXCircle, FiInfo } from 'react-icons/fi';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const Result = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];
  
  const mockResult = {
    risk: 'High',
    score: 85,
    flags: [
      'Upfront payment request detected',
      'Unrealistic salary offer',
      'Urgency pressure tactic',
      'Agency not in verified list'
    ],
    explanation: 'This offer contains multiple red flags commonly associated with recruitment scams. The combination of upfront payment requests, unrealistic salary promises, and pressure tactics are strong indicators of fraudulent activity.'
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'Low': return 'green';
      case 'Medium': return 'yellow';
      case 'High': return 'red';
      default: return 'gray';
    }
  };

  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'Low': return FiCheckCircle;
      case 'Medium': return FiAlertTriangle;
      case 'High': return FiXCircle;
      default: return FiInfo;
    }
  };

  const getRiskBgColor = (risk) => {
    switch(risk) {
      case 'Low': return 'bg-green-50 border-green-200';
      case 'Medium': return 'bg-yellow-50 border-yellow-200';
      case 'High': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getRiskTextColor = (risk) => {
    switch(risk) {
      case 'Low': return 'text-green-700';
      case 'Medium': return 'text-yellow-700';
      case 'High': return 'text-red-700';
      default: return 'text-gray-700';
    }
  };

  const getRiskLabel = (risk) => {
    switch(risk) {
      case 'Low': return t.lowRisk;
      case 'Medium': return t.mediumRisk;
      case 'High': return t.highRisk;
      default: return 'Unknown';
    }
  };

  const RiskIcon = getRiskIcon(mockResult.risk);
  const riskColor = getRiskColor(mockResult.risk);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${
        mockResult.risk === 'Low' ? 'from-green-600 to-green-800' :
        mockResult.risk === 'Medium' ? 'from-yellow-600 to-yellow-800' :
        'from-red-600 to-red-800'
      } px-6 pt-12 pb-6 rounded-b-3xl shadow-lg`}>
        <button
          onClick={() => navigate('/check-offer')}
          className="flex items-center text-white mb-4 hover:text-gray-200 transition"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          {t.back}
        </button>
        <h1 className="text-2xl font-bold text-white">{t.analysisResult}</h1>
        <p className="text-white/80 text-sm mt-1">{t.heresWhatFound}</p>
      </div>

      <div className="px-6 py-6">
        <div className={`${getRiskBgColor(mockResult.risk)} border-2 rounded-2xl p-6 shadow-sm`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${
              mockResult.risk === 'Low' ? 'bg-green-100' :
              mockResult.risk === 'Medium' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <RiskIcon className={`h-8 w-8 ${getRiskTextColor(mockResult.risk)}`} />
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${getRiskTextColor(mockResult.risk)}`}>
                {getRiskLabel(mockResult.risk)} {t.risk}
              </h2>
              <p className={`text-sm ${getRiskTextColor(mockResult.risk)} mt-1`}>
                {t.riskScore}: {mockResult.score}%
              </p>
              <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    mockResult.risk === 'Low' ? 'bg-green-500' :
                    mockResult.risk === 'Medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${mockResult.score}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <FiInfo className="h-5 w-5 text-blue-600" />
            {t.explanation}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {mockResult.explanation}
          </p>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FiAlertTriangle className="h-5 w-5 text-red-600" />
            {t.redFlagsDetected}
          </h3>
          <ul className="space-y-2">
            {mockResult.flags.map((flag, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <span className="text-red-500 font-bold mt-0.5">•</span>
                <span className="text-gray-700">{flag}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 bg-blue-50 rounded-2xl border border-blue-200 p-5">
          <h3 className="font-semibold text-blue-800 mb-2">{t.recommendedNextSteps}</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li className="flex items-start gap-3">
              <span className="font-bold">1.</span>
              <span>{t.verifyAgency}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold">2.</span>
              <span>{t.dontSendMoney}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="font-bold">3.</span>
              <span>{t.contactBE}</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate('/check-offer')}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {t.checkAnotherOffer}
          </button>
          <button
            onClick={() => navigate('/report-scam')}
            className="w-full border-2 border-red-600 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
          >
            {t.reportThisScam}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;