import React from 'react';
import { useTranslation } from 'react-i18next';
import BlogComponent from './BlogComponent';
import ButtonComponent from './ButtonComponent';

const Base = () => {
  const { t } = useTranslation();
  
  const features = [
    { text: t('base.features.nativeTeacher'), icon: '🇬🇧', color: 'from-blue-500 to-blue-600' },
    { text: t('base.features.experience'), icon: '⭐', color: 'from-yellow-500 to-orange-500' },
    { text: t('base.features.master'), icon: '🎓', color: 'from-purple-500 to-pink-500' },
    { text: t('base.features.dynamic'), icon: '⚡', color: 'from-green-500 to-emerald-500' },
    { text: t('base.features.tools'), icon: '🛠️', color: 'from-indigo-500 to-blue-500' },
    { text: t('base.features.programs'), icon: '📚', color: 'from-teal-500 to-cyan-500' },
  ];
  
  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 mt-4 sm:mt-16 md:mt-8 pt-2 sm:pt-12 md:pt-16 px-4 sm:px-6 md:px-8 lg:px-12">
      {/* Button Component with background strip */}
      <div className="relative -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 mb-4">
        {/* Background strip that extends upward without affecting button position */}
        <div className="absolute inset-x-0 -top-12 sm:-top-16 md:-top-24 bottom-0 overflow-hidden">
          {/* Match Jumbotron gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800" />
          {/* Mesh blobs similar to hero */}
          <div className="pointer-events-none absolute -top-20 left-10 h-48 w-48 rounded-full bg-blue-400/40 mix-blend-multiply blur-3xl animate-blob" />
          <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-purple-400/40 mix-blend-multiply blur-3xl animate-blob animation-delay-2000" />
          <div className="pointer-events-none absolute -bottom-12 left-1/2 h-48 w-48 rounded-full bg-pink-400/40 mix-blend-multiply blur-3xl animate-blob animation-delay-4000" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
        </div>
        {/* Button Component in normal flow - maintains its original position */}
        <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6">
          <ButtonComponent />
        </div>
      </div>
      <BlogComponent />

      {/* Modern Features Section */}
      <section className="mt-12 sm:mt-16 md:mt-20 mb-12">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10 -mt-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 pb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              {t('base.coachingExperienceTitle')}
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              {t('base.coachingExperienceSubtitle')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-3">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} text-white text-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Text */}
                  <p className="text-gray-800 font-semibold text-base leading-relaxed">
                    {feature.text}
                  </p>
                </div>

                {/* Decorative corner */}
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>

          {/* About Me CTA Section */}
          <div className="relative mt-12 mb-10">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl opacity-10 blur-3xl"></div>
            
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-6 sm:p-10 text-center shadow-2xl overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                  {t('base.teachingApproachTitle')}
                </h3>
                <p className="text-white/90 text-base sm:text-lg mb-6 max-w-2xl mx-auto">
                  {t('base.teachingApproachDescription')}
                </p>
                <a
                  href="/metodo"
                  className="inline-flex items-center gap-2 px-6 py-3 text-base font-semibold text-purple-600 bg-white rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50"
                >
                  {t('base.methodology')}
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default Base;
