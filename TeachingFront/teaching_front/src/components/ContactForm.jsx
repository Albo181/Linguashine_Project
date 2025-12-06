import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/apiClient';

const ContactForm = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus("pending");
    setValidationErrors({});
    
    const errors = {};
    if (!name) errors.name = t('contactForm.errorName');
    if (!subject) errors.subject = t('contactForm.errorSubject');
    if (!message) errors.message = t('contactForm.errorMessage');

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmissionStatus("error");
      return;
    }

    try {
      const payload = {
        name,
        subject,
        message
      };

      console.log("Making request to:", `${apiClient.defaults.baseURL}/send_query/contacto/`);
      console.log("With payload:", payload);

      const response = await apiClient.post("/send_query/contacto/", payload);

      console.log("Full response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });

      if (response.status === 201 || response.status === 200) {
        setSubmissionStatus("success");
        setName('');
        setSubject('');
        setMessage('');
        console.log("Mensaje enviado!");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Detailed error information:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        baseURL: apiClient.defaults.baseURL
      });

      setSubmissionStatus("error");
      
      // Add specific message for rate limiting
      if (error.response?.status === 429) {
        alert(t('contactForm.rateLimit'));
      }
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 py-8 px-4 sm:px-6 md:px-8 lg:px-12 text-[0.95rem]">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-9 border border-gray-200">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-3 shadow-lg">
              <span className="text-2xl">✉️</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              {t('contactForm.title')}
            </h2>
     				<div className="w-20 h-[3px] bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700">
                {t('contactForm.nameLabel')}
              </label>
              <input
                id="name"
                type="text"
                placeholder={t('contactForm.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:outline-none ${
                  validationErrors.name 
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500'
                }`}
              />
              {validationErrors.name && (
                <span className="text-red-500 text-xs sm:text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.name}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block text-xs sm:text-sm font-semibold text-gray-700">
                {t('contactForm.subjectLabel')}
              </label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:outline-none ${
                  validationErrors.subject 
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500'
                }`}
              >
                <option value="">{t('contactForm.subjectPlaceholder')}</option>
                <option value="TENGO UNA PREGUNTA">{t('contactForm.subjectOptionQuestion')}</option>
                <option value="ME GUSTARÍA QUE ME LLAMARAS">{t('contactForm.subjectOptionCall')}</option>
                <option value="OTRO MOTIVO">{t('contactForm.subjectOptionOther')}</option>
              </select>
              {validationErrors.subject && (
                <span className="text-red-500 text-xs sm:text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.subject}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-700">
                {t('contactForm.messageLabel')}
              </label>
              <textarea
                id="message"
                placeholder={t('contactForm.messagePlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 focus:ring-2 focus:outline-none resize-none ${
                  validationErrors.message 
                    ? 'border-red-500 focus:ring-red-400 focus:border-red-500' 
                    : 'border-gray-300 focus:ring-blue-400 focus:border-blue-500'
                }`}
              />
              {validationErrors.message && (
                <span className="text-red-500 text-xs sm:text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={submissionStatus === "pending" || submissionStatus === "success"}
              className={`w-full py-3.5 rounded-lg text-white font-semibold text-base sm:text-lg transition-all duration-300 shadow-lg transform hover:scale-105 ${
                submissionStatus === "pending" 
                  ? "bg-gray-500 opacity-70 cursor-not-allowed" 
                  : submissionStatus === "success"
                  ? "bg-green-500 cursor-not-allowed"
                  : submissionStatus === "error"
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 hover:shadow-blue-500/50"
              }`}
            >
              {submissionStatus === "pending" ? t('contactForm.submitPending') : submissionStatus === "success" ? t('contactForm.submitSuccess') : t('contactForm.submitIdle')}
            </button>
            
            {submissionStatus === "success" && (
              <div className="p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                <p className="text-green-700 text-sm font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('contactForm.successBanner')}
                </p>
              </div>
            )}
            {submissionStatus === "error" && (
              <div className="p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {t('contactForm.errorBanner')}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
