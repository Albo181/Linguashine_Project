import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import portalVideo from '../videos/26.mp4';

const BackgroundImage = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [poster, setPoster] = useState(null);
  const [posterCaptured, setPosterCaptured] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || posterCaptured) return;

    const handleLoadedData = () => {
      if (posterCaptured) return;
      try {
        video.pause();
        video.currentTime = 0.13;
      } catch (error) {
        console.warn('Unable to capture poster frame', error);
      }
    };

    const handleSeeked = () => {
      if (posterCaptured || !video.videoWidth) return;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setPoster(canvas.toDataURL('image/jpeg', 0.85));
        setPosterCaptured(true);
        video.pause();
        video.currentTime = 0;
      } catch (error) {
        console.warn('Unable to set poster image', error);
      }
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('seeked', handleSeeked);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('seeked', handleSeeked);
    };
  }, [posterCaptured]);
  
  const features = [
    { text: t('backgroundImage.features.oneToOne'), icon: '👤', gradient: 'from-blue-500 to-cyan-500' },
    { text: t('backgroundImage.features.smallGroups'), icon: '👥', gradient: 'from-purple-500 to-pink-500' },
    { text: t('backgroundImage.features.examPrep'), icon: '📝', gradient: 'from-yellow-500 to-orange-500' },
    { text: t('backgroundImage.features.oppositions'), icon: '🏛️', gradient: 'from-green-500 to-emerald-500' },
    { text: t('backgroundImage.features.universitySupport'), icon: '🎓', gradient: 'from-indigo-500 to-blue-500' },
  ];
  
  return (
    <div className="relative w-screen -mt-10 overflow-hidden">
      {/* Modern gradient background */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 py-12 sm:py-16 md:py-10">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            
            {/* Left side - Student Zone Badge & video */}
            <div className="flex-shrink-0 order-2 lg:order-1 w-full lg:w-auto space-y-4">
              <Link to="/login" className="block">
                <div className="relative group">
                  {/* Glowing effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  
                  <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/20 shadow-2xl transform group-hover:scale-105 transition-transform duration-300 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full mb-2 shadow-lg">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                      {t('backgroundImage.newPortal')}
                    </h3>
                    <div className="w-10 h-0.5 bg-gradient-to-r from-yellow-400 to-pink-400 mx-auto rounded-full"></div>
                    <p className="mt-2 text-xs text-white/70">
                      {t('common.login')}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-2xl blur-2xl opacity-40"></div>
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-2 flex justify-center">
                  <video
                    ref={videoRef}
                    src={portalVideo}
                    controls
                    poster={poster || undefined}
                    preload="metadata"
                    controlsList="nofullscreen nodownload noremoteplayback"
                    disablePictureInPicture
                    playsInline
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-xl border border-white/20 shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Right side - Features List */}
            <div className="flex-1 order-1 lg:order-2 w-full">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:-translate-x-2"
                  >
                    {/* Gradient accent bar */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${feature.gradient} rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className="flex items-center gap-2 pl-2">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-lg sm:text-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                        {feature.icon}
                      </div>
                      
                      {/* Text */}
                      <span className="flex-grow text-white font-semibold text-xs sm:text-sm md:text-base">
                        {feature.text}
                      </span>
                      
                      {/* Arrow indicator */}
                      <svg 
                        className="w-3 h-3 sm:w-4 sm:h-4 text-white/50 group-hover:text-white/100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animation delays */}
      <style>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default BackgroundImage;
