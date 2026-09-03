import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiUpload, FiArrowLeft, FiCamera } from 'react-icons/fi';
import { Oval } from 'react-loader-spinner';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useLanguage } from '../../contexts/LanguageContext';
import { translations } from '../../services/translations';

const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const CheckOffer = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert('Please paste some text to analyze');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE}/check-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() })
      });
      const data = await response.json();
      navigate('/result', { state: { result: data, inputText: text } });
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Analysis failed. Please make sure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${API_BASE}/check-image`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      navigate('/result', { state: { result: data, imageUploaded: true } });
    } catch (err) {
      console.error('Image analysis failed:', err);
      setError('Image analysis failed. Please make sure the backend is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Native camera capture (Capacitor) — only used when running as a native app
  const handleCameraCapture = async () => {
    if (Capacitor.isNativePlatform()) {
      setLoading(true);
      setError('');
      try {
        const photo = await Camera.getPhoto({
          quality: 80,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
        });
        // Convert base64 to blob for upload
        const blob = await fetch(`data:image/${photo.format};base64,${photo.base64String}`).then(r => r.blob());
        const formData = new FormData();
        formData.append('file', blob, `photo.${photo.format}`);
        const response = await fetch(`${API_BASE}/check-image`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.error) {
          setError(data.error);
          return;
        }
        navigate('/result', { state: { result: data, imageUploaded: true } });
      } catch (error) {
        // User cancelling the camera shows as an error too — ignore those quietly
        if (error && error.message && error.message.toLowerCase().includes('cancel')) {
          console.log('Camera capture cancelled by user');
        } else {
          console.error('Camera capture failed:', error);
          setError('Camera capture failed. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 pt-12 pb-6 rounded-b-3xl shadow-lg">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center text-white mb-4 hover:text-blue-200 transition"
        >
          <FiArrowLeft className="h-5 w-5 mr-2" />
          {t.back}
        </button>
        <h1 className="text-2xl font-bold text-white">{t.checkJobOffer}</h1>
        <p className="text-blue-100 text-sm mt-1">{t.pasteJobOffer}</p>
      </div>

      <div className="px-6 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <label className="block text-gray-700 font-semibold mb-2">
            {t.pasteOfferText}
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.pastePlaceholder}
            className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700"
          />
          
          {loading && (
            <div className="flex justify-center py-4">
              <Oval height={40} width={40} color="#4F46E5" secondaryColor="#818CF8" />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className={`w-full mt-4 py-3 rounded-xl font-semibold text-white transition ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? t.analyzing : t.analyzeText}
          </button>
        </div>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">{t.or}</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <FiUpload className="h-6 w-6 text-blue-600" />
            <label className="block text-gray-700 font-semibold">
              {t.uploadScreenshot}
            </label>
          </div>
          <p className="text-gray-500 text-sm mb-4">{t.uploadDesc}</p>

          {Capacitor.isNativePlatform() && (
            <button
              onClick={handleCameraCapture}
              disabled={loading}
              className={`w-full py-3 mb-4 rounded-xl font-semibold text-white transition flex items-center justify-center gap-2 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <FiCamera className="h-5 w-5" />
              Take Photo
            </button>
          )}

          <label className="w-full">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition cursor-pointer">
              <FiFileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">{t.clickToUpload}</p>
              <p className="text-gray-400 text-sm mt-1">{t.acceptedFormats}</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default CheckOffer;
