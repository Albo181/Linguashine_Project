import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import getBlogData from './blogData';
import './CustomSwiper.css';

const OptimizedImage = ({ src, alt, className, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden">
      {/* Blur placeholder */}
      <div 
        className={`absolute inset-0 blur-xl scale-95 transform ${isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Main image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

const BlogComponent = () => {
  const { t } = useTranslation();
  const blogData = getBlogData(t);
  // Gradient colors for each blog card
  const gradientColors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-emerald-500',
    'from-amber-500 to-orange-500',
    'from-sky-500 to-blue-500',
    'from-purple-500 to-pink-500',
  ];

  return (
    <section className="w-full py-6 sm:py-10 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col items-center">
      {/* Background only for this block */}
      <div className="relative w-full -mt-4 max-w-7xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-white/90 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
        {/* Soft radial lights */}
        <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen">
          <div className="absolute -top-24 -left-10 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-pink-200/40 blur-3xl" />
        </div>

        {/* Soft diagonal pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-multiply">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#e0f2fe_0,#ffffff_55%),linear-gradient(135deg,#e0f2fe_0,#eef2ff_48%,#fce7f3_100%)]" />
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 px-4 sm:px-6 md:px-8 py-8 sm:py-10">
          {/* Section Header */}
          <div className="text-center mb-6 -mt-4 sm:mb-8 w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold pb-4 mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600">
              {t('blog.sectionTitle')}
            </h2>
            <p className="text-base sm:text-lg text-slate-700 -mt-4 max-w-2xl mx-auto">
              {t('blog.sectionSubtitle')}
            </p>
          </div>

      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={1}
        spaceBetween={20}
        loop
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
        className="w-full"
      >
        {blogData.map((blog, index) => (
          <SwiperSlide key={blog.id}>
            <div className="p-2 sm:p-3 h-full">
              <Link to={`/blog/${blog.id}`} className="block h-full">
                <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl p-5 h-full flex flex-col transform transition-all duration-300 hover:-translate-y-1 border border-slate-200/80 overflow-hidden">
                  {/* Subtle gradient accent on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} opacity-0 group-hover:opacity-[0.04] rounded-2xl transition-opacity duration-300`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col h-full">
                    {blog.image && (
                      <div className="mb-3 rounded-xl overflow-hidden shadow-md">
                        <OptimizedImage
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-36 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <h3 className="text-base sm:text-lg font-semibold mb-1.5 text-slate-900 leading-snug">
                      {blog.title}
                    </h3>
                    
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed flex-grow">
                      {blog.content.length > 120 ? blog.content.slice(0, 120) + '...' : blog.content}
                    </p>

                    {/* Read more indicator */}
                    <div className="mt-3 flex items-center text-[11px] sm:text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors duration-300">
                      <span>{t('blog.readMore')}</span>
                      <svg 
                        className="w-3 h-3 sm:w-4 sm:h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${gradientColors[index % gradientColors.length]} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`}></div>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
        </div>
      </div>
    </section>
  );
};

export default BlogComponent;
