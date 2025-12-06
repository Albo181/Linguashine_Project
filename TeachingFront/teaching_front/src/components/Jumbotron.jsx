import React from 'react';
import { useTranslation } from 'react-i18next';
import Mascot from '../images/me_suit.png';

const Jumbotron = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative mt-12 sm:mt-6 md:mt-8 lg:mt-8 -mb-4 sm:-mb-6 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800"></div>
      
      {/* Animated mesh gradient overlay */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      {/* Content container */}
      <div className="relative z-10 pt-10 pb-24 sm:pt-14 sm:pb-18 md:pt-24 md:pb-22 px-4 sm:px-5 md:px-7 lg:px-10 mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-10">
          
          {/* Left side - Image and badge */}
          <div className="flex-shrink-0 order-2 lg:order-1 mt-10 lg:mt-24 self-center lg:self-start">
            <div className="relative">
              {/* Glowing ring effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              
              {/* Profile image with modern styling - even smaller size */}
              <div className="relative">
                <img
                  src={Mascot}
                  alt="Alexander Lenton"
                  className="relative z-10 h-16 w-16 sm:h-28 sm:w-28 md:h-36 md:w-36 lg:h-40 lg:w-40 rounded-full border-4 border-white shadow-2xl object-cover transform hover:scale-105 transition-transform duration-300"
                />
                {/* Decorative circles - smaller */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-7 h-7 bg-pink-400 rounded-full opacity-80 animate-bounce animation-delay-1000"></div>
              </div>

            </div>
          </div>

          {/* Right side - Text content */}
          <div className="flex-1 text-center lg:text-left order-1 lg:order-2">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-5 border border-white/20">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm font-semibold text-white">{t('jumbotron.professionalEnglishTraining')}</span>
            </div>

            {/* Main title with gradient text - reduced size */}
            <h1 className="mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-extrabold leading-tight pb-1">
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-100">
                {t('jumbotron.title1')}
              </span>
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 pb-6">
                {t('jumbotron.title2')}
              </span>
            </h1>

            {/* Subtitle - reduced size */}
            <p className="-mt-2 mb-6 text-base sm:text-lg md:text-lg font-light text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t('jumbotron.subtitle')}
            </p>

            {/* Key highlights */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-medium">{t('jumbotron.britishNative')}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-medium">{t('jumbotron.executiveCoach')}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 01.557 1.04l1.055 4.428a1 1 0 00.99 1.01h.01a1 1 0 00.99-1.01l1.055-4.428a1 1 0 01.557-1.04l1.94-.831-2.727-1.222a1 1 0 11.788-1.838l4 1.714a1 1 0 01.356.257l2.644 1.131a1 1 0 000-1.84l-7-3z" />
                </svg>
                <span className="text-white font-medium">{t('jumbotron.multinationalCorporations')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href="/portfolio"
                className="group relative inline-flex items-center justify-center px-5 py-3 text-base font-semibold text-white bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-500 via-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative flex items-center gap-2">
                  {t('jumbotron.getInfo')}
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a
                href="/metodo"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-white/10 backdrop-blur-md rounded-full border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-300"
              >
                {t('jumbotron.learnMore')}
              </a>
              <a
                href="/sobre-mi"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-purple-700 bg-white rounded-full border-2 border-white/80 hover:bg-purple-50 hover:border-white transform hover:scale-105 transition-all duration-300"
              >
                {t('jumbotron.aboutMe')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
};

export default Jumbotron;
