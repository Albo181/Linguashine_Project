import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import getBlogData from './blogData';
import enjoyment from '../images/enjoyment.png';
import exam from '../images/exam.png';
import dashboard from '../images/dashboard.png';
import professional from '../images/professional.png';
import tree from '../images/tree.png';
import podcast from '../images/podcast.png';
import best from '../images/best.png';
import me2 from '../images/me2.png';
import duo from '../images/duo.jpg';

const style = document.createElement('style');
style.textContent = `
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-gradient {
    background-size: 200% 200%;
    animation: gradientShift 15s ease infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  .animate-pulse-slow {
    animation: pulse 4s ease-in-out infinite;
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  @keyframes floatReverse {
    0%, 100% { transform: translateY(-20px) rotate(-5deg); }
    50% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes spinReverse {
    from { transform: rotate(360deg); }
    to { transform: rotate(0deg); }
  }
  @keyframes wave {
    0%, 100% { transform: skewX(0deg) translateX(0); }
    50% { transform: skewX(-5deg) translateX(10px); }
  }
  .floating-element {
    position: absolute;
    pointer-events: none;
    z-index: 0;
    opacity: 0.18;
  }
  .float-animation {
    animation: float 6s ease-in-out infinite;
  }
  .float-reverse {
    animation: floatReverse 7s ease-in-out infinite;
  }
  .spin-slow {
    animation: spin 12s linear infinite;
  }
  .spin-reverse {
    animation: spinReverse 15s linear infinite;
  }
  .wave-animation {
    animation: wave 8s ease-in-out infinite;
  }
  .hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
  .pentagon {
    clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
  }
  .triangle {
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  }
  .line {
    clip-path: polygon(0 45%, 100% 45%, 100% 55%, 0% 55%);
  }
  .cross {
    clip-path: polygon(35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%);
  }
  .small-cross {
    clip-path: polygon(40% 0%, 60% 0%, 60% 40%, 100% 40%, 100% 60%, 60% 60%, 60% 100%, 40% 100%, 40% 60%, 0% 60%, 0% 40%, 40% 40%);
  }
`;
document.head.appendChild(style);

const OptimizedImage = ({ src, alt, className, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
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

const FloatingElements = ({ blogId }) => {
  const elements = {
    1: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-0 w-1/3 h-full">
          <div className="floating-element left-[10%] top-[10%] w-12 h-12 bg-blue-300/40 rounded-full float-animation" />
          <div className="floating-element left-[20%] top-[25%] w-8 h-8 bg-purple-300/30 rounded-full float-reverse" />
          <div className="floating-element left-[5%] top-[40%] w-32 h-32 border border-pink-300/35 hexagon spin-slow" />
          <div className="floating-element left-[15%] top-[55%] w-16 h-16 bg-pink-200/45 rounded-full wave-animation" />
          <div className="floating-element left-[8%] top-[70%] w-24 h-24 border border-blue-200/40 pentagon float-animation" />
          <div className="floating-element left-[25%] top-[85%] w-10 h-10 bg-purple-100/35 rounded-full spin-slow" />
          <div className="floating-element left-[18%] top-[15%] w-20 h-20 border border-blue-300/40 cross float-side" />
          <div className="floating-element left-[12%] top-[45%] w-14 h-14 bg-pink-300/35 rounded-full float-side-reverse" />
          <div className="floating-element left-[28%] top-[65%] w-16 h-16 border border-purple-200/40 triangle spin-reverse" />
          <div className="floating-element left-[3%] top-[30%] w-40 h-2 bg-blue-200/25 line wave-animation" />
          <div className="floating-element left-[22%] top-[92%] w-6 h-6 bg-pink-400/50 small-cross spin-slow" />
          <div className="floating-element left-[30%] top-[5%] w-4 h-4 bg-purple-500/60 rounded-full float-animation" />
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full">
          <div className="floating-element right-[10%] top-[15%] w-28 h-28 border border-blue-200/35 hexagon spin-slow" />
          <div className="floating-element right-[20%] top-[30%] w-14 h-14 bg-purple-200/40 rounded-full spin-reverse" />
          <div className="floating-element right-[5%] top-[45%] w-20 h-20 border border-blue-200/35 pentagon float-animation" />
          <div className="floating-element right-[15%] top-[60%] w-12 h-12 bg-pink-200/45 rounded-full float-reverse" />
          <div className="floating-element right-[8%] top-[75%] w-36 h-36 border border-purple-100/30 hexagon wave-animation" />
          <div className="floating-element right-[25%] top-[90%] w-8 h-8 bg-blue-300/40 rounded-full float-animation" />
          <div className="floating-element right-[18%] top-[20%] w-24 h-24 border border-pink-300/35 cross float-side" />
          <div className="floating-element right-[12%] top-[50%] w-10 h-10 bg-purple-300/40 rounded-full float-side-reverse" />
          <div className="floating-element right-[28%] top-[70%] w-18 h-18 border border-blue-200/45 triangle spin-reverse" />
          <div className="floating-element right-[2%] top-[25%] w-48 h-2 bg-pink-200/25 line wave-animation" />
          <div className="floating-element right-[32%] top-[88%] w-5 h-5 bg-blue-400/50 small-cross spin-reverse" />
          <div className="floating-element right-[35%] top-[10%] w-3 h-3 bg-purple-500/60 rounded-full float-reverse" />
        </div>
      </div>
    ),
    2: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-0 w-1/3 h-full">
          <div className="floating-element left-[5%] top-[5%] w-10 h-10 bg-green-300/40 rounded-full float-animation" />
          <div className="floating-element left-[15%] top-[20%] w-28 h-28 border border-emerald-300/35 pentagon spin-slow" />
          <div className="floating-element left-[8%] top-[35%] w-16 h-16 bg-teal-200/45 rounded-full float-reverse" />
          <div className="floating-element left-[20%] top-[50%] w-32 h-32 border border-green-200/40 hexagon float-animation" />
          <div className="floating-element left-[12%] top-[65%] w-12 h-12 bg-emerald-100/35 rounded-full spin-reverse" />
          <div className="floating-element left-[5%] top-[80%] w-24 h-24 border border-teal-300/40 pentagon float-reverse" />
          <div className="floating-element left-[25%] top-[15%] w-20 h-20 border border-emerald-200/35 cross float-side" />
          <div className="floating-element left-[18%] top-[45%] w-14 h-14 bg-green-300/45 rounded-full float-side-reverse" />
          <div className="floating-element left-[10%] top-[75%] w-16 h-16 border border-teal-200/40 triangle wave-animation" />
          <div className="floating-element left-[2%] top-[28%] w-44 h-2 bg-emerald-200/25 line wave-animation" />
          <div className="floating-element left-[28%] top-[92%] w-7 h-7 bg-teal-400/50 small-cross spin-slow" />
          <div className="floating-element left-[32%] top-[8%] w-4 h-4 bg-green-500/60 rounded-full float-animation" />
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full">
          <div className="floating-element right-[12%] top-[10%] w-28 h-28 border border-emerald-100/35 hexagon float-reverse" />
          <div className="floating-element right-[18%] top-[40%] w-14 h-14 bg-green-300/40 rounded-full float-animation" />
          <div className="floating-element right-[8%] top-[55%] w-20 h-20 border border-teal-100/45 pentagon float-reverse" />
          <div className="floating-element right-[15%] top-[70%] w-8 h-8 bg-emerald-200/35 rounded-full spin-reverse" />
          <div className="floating-element right-[5%] top-[85%] w-16 h-16 border border-green-200/40 hexagon float-animation" />
          <div className="floating-element right-[25%] top-[25%] w-12 h-12 bg-teal-200/45 rounded-full wave-animation" />
          <div className="floating-element right-[20%] top-[15%] w-22 h-22 border border-emerald-300/40 cross float-side" />
          <div className="floating-element right-[10%] top-[45%] w-18 h-18 bg-green-200/35 triangle float-side-reverse" />
          <div className="floating-element right-[28%] top-[75%] w-10 h-10 border border-teal-300/45 rounded-full spin-slow" />
          <div className="floating-element right-[3%] top-[32%] w-52 h-2 bg-green-200/25 line wave-animation" />
          <div className="floating-element right-[30%] top-[88%] w-6 h-6 bg-emerald-400/50 small-cross spin-reverse" />
          <div className="floating-element right-[35%] top-[12%] w-3 h-3 bg-teal-500/60 rounded-full float-reverse" />
        </div>
      </div>
    ),
    3: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-0 w-1/3 h-full">
          <div className="floating-element left-[12%] top-[8%] w-24 h-24 border border-amber-300/40 pentagon float-animation" />
          <div className="floating-element left-[5%] top-[23%] w-32 h-32 border border-orange-200/35 hexagon float-reverse" />
          <div className="floating-element left-[18%] top-[38%] w-10 h-10 bg-yellow-300/45 rounded-full spin-slow" />
          <div className="floating-element left-[8%] top-[53%] w-16 h-16 bg-yellow-100/40 rounded-full float-animation" />
          <div className="floating-element left-[15%] top-[68%] w-28 h-28 border border-amber-200/35 pentagon spin-reverse" />
          <div className="floating-element left-[5%] top-[83%] w-12 h-12 bg-orange-100/45 rounded-full float-reverse" />
          <div className="floating-element left-[25%] top-[15%] w-20 h-20 border border-yellow-200/40 cross float-side" />
          <div className="floating-element left-[10%] top-[45%] w-18 h-18 bg-amber-300/35 triangle float-side-reverse" />
          <div className="floating-element left-[22%] top-[75%] w-14 h-14 border border-orange-300/45 rounded-full wave-animation" />
          <div className="floating-element left-[2%] top-[35%] w-48 h-2 bg-yellow-200/25 line wave-animation" />
          <div className="floating-element left-[28%] top-[90%] w-8 h-8 bg-orange-400/50 small-cross spin-slow" />
          <div className="floating-element left-[32%] top-[5%] w-4 h-4 bg-amber-500/60 rounded-full float-animation" />
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full">
          <div className="floating-element right-[15%] top-[5%] w-36 h-36 border border-amber-200/35 hexagon float-animation" />
          <div className="floating-element right-[5%] top-[20%] w-14 h-14 bg-orange-200/45 rounded-full spin-slow" />
          <div className="floating-element right-[20%] top-[35%] w-20 h-20 border border-amber-100/40 pentagon float-reverse" />
          <div className="floating-element right-[10%] top-[50%] w-8 h-8 bg-yellow-200/35 rounded-full float-animation" />
          <div className="floating-element right-[8%] top-[65%] w-28 h-28 border border-orange-100/45 hexagon spin-reverse" />
          <div className="floating-element right-[25%] top-[80%] w-12 h-12 bg-amber-300/40 rounded-full float-reverse" />
          <div className="floating-element right-[18%] top-[15%] w-22 h-22 border border-yellow-300/35 cross float-side" />
          <div className="floating-element right-[12%] top-[45%] w-16 h-16 bg-orange-200/45 triangle float-side-reverse" />
          <div className="floating-element right-[28%] top-[75%] w-10 h-10 border border-amber-200/40 rounded-full wave-animation" />
          <div className="floating-element right-[3%] top-[30%] w-56 h-2 bg-orange-200/25 line wave-animation" />
          <div className="floating-element right-[32%] top-[85%] w-7 h-7 bg-yellow-400/50 small-cross spin-reverse" />
          <div className="floating-element right-[35%] top-[8%] w-3 h-3 bg-amber-500/60 rounded-full float-reverse" />
        </div>
      </div>
    ),
    4: (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-0 w-1/3 h-full">
          <div className="floating-element left-[7%] top-[5%] w-16 h-16 bg-sky-300/45 rounded-full float-animation" />
          <div className="floating-element left-[15%] top-[20%] w-10 h-10 bg-blue-200/35 rounded-full float-reverse" />
          <div className="floating-element left-[5%] top-[35%] w-32 h-32 border border-blue-300/40 hexagon spin-slow" />
          <div className="floating-element left-[18%] top-[50%] w-14 h-14 bg-sky-100/45 rounded-full float-animation" />
          <div className="floating-element left-[8%] top-[65%] w-28 h-28 border border-sky-200/35 pentagon spin-reverse" />
          <div className="floating-element left-[20%] top-[80%] w-12 h-12 bg-blue-100/40 rounded-full float-reverse" />
          <div className="floating-element left-[25%] top-[15%] w-24 h-24 border border-sky-300/45 cross float-side" />
          <div className="floating-element left-[12%] top-[45%] w-18 h-18 bg-blue-300/35 triangle float-side-reverse" />
          <div className="floating-element left-[28%] top-[75%] w-8 h-8 border border-sky-100/40 rounded-full wave-animation" />
          <div className="floating-element left-[2%] top-[25%] w-44 h-2 bg-blue-200/25 line wave-animation" />
          <div className="floating-element left-[30%] top-[92%] w-6 h-6 bg-sky-400/50 small-cross spin-slow" />
          <div className="floating-element left-[32%] top-[8%] w-4 h-4 bg-blue-500/60 rounded-full float-animation" />
        </div>
        <div className="absolute right-0 top-0 w-1/3 h-full">
          <div className="floating-element right-[10%] top-[10%] w-36 h-36 border border-sky-200/35 hexagon float-animation" />
          <div className="floating-element right-[20%] top-[25%] w-8 h-8 bg-blue-200/45 rounded-full spin-slow" />
          <div className="floating-element right-[5%] top-[40%] w-24 h-24 border border-sky-100/40 pentagon float-reverse" />
          <div className="floating-element right-[15%] top-[55%] w-16 h-16 bg-blue-300/35 rounded-full float-animation" />
          <div className="floating-element right-[8%] top-[70%] w-28 h-28 border border-sky-200/45 hexagon spin-reverse" />
          <div className="floating-element right-[25%] top-[85%] w-10 h-10 bg-blue-200/40 rounded-full float-reverse" />
          <div className="floating-element right-[18%] top-[20%] w-20 h-20 border border-blue-300/35 cross float-side" />
          <div className="floating-element right-[12%] top-[50%] w-14 h-14 bg-sky-300/45 triangle float-side-reverse" />
          <div className="floating-element right-[28%] top-[75%] w-12 h-12 border border-blue-100/40 rounded-full wave-animation" />
          <div className="floating-element right-[3%] top-[32%] w-52 h-2 bg-sky-200/25 line wave-animation" />
          <div className="floating-element right-[32%] top-[88%] w-5 h-5 bg-blue-400/50 small-cross spin-reverse" />
          <div className="floating-element right-[35%] top-[12%] w-3 h-3 bg-sky-500/60 rounded-full float-reverse" />
        </div>
      </div>
    ),
  };

  return elements[blogId] || null;
};

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const blogData = getBlogData(t);
  const currentBlogId = parseInt(id);
  const blog = blogData.find((b) => b.id === currentBlogId);

  const goToNextBlog = () => {
    const nextId = currentBlogId < blogData.length ? currentBlogId + 1 : 1;
    navigate(`/blog/${nextId}`);
  };

  const goToPreviousBlog = () => {
    const prevId = currentBlogId > 1 ? currentBlogId - 1 : blogData.length;
    navigate(`/blog/${prevId}`);
  };

  if (!blog) return <p>Blog not found!</p>;

  const renderRichText = (paragraph) => {
    const parts = paragraph.split('**');
    return parts.map((part, index) =>
      index % 2 === 1 ? (
        <strong key={index} className="font-semibold">
          {part}
        </strong>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  const blogImage = blog.id === 1 ? me2 : blog.id === 2 ? best : blog.id === 3 ? dashboard : blog.id === 4 ? duo : blog.id === 5 ? professional : '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Background gradients for each blog (softened)
  const backgroundGradients = {
    1: 'bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900',
    2: 'bg-gradient-to-br from-slate-900 via-emerald-900 to-teal-900',
    3: 'bg-gradient-to-br from-slate-800 via-amber-900 to-orange-900',
    4: 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900',
    5: 'bg-gradient-to-br from-slate-950 via-blue-900 to-purple-900'
  };

  return (
    <div className={`min-h-screen flex relative pt-28 sm:pt-32 md:pt-36 ${blog.id === 5 ? 'flex-col' : 'justify-center items-center'} ${backgroundGradients[blog.id] || 'bg-gray-900'} p-4 sm:p-6 md:p-8`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      <FloatingElements blogId={blog.id} />

      {/* Close / Back button */}
      <div className="fixed top-24 sm:top-28 left-4 sm:left-6 z-30">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-white/10 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Salir</span>
        </button>
      </div>
      
      {/* Modern Navigation Arrows */}
      <button 
        onClick={goToPreviousBlog}
        className="fixed left-4 sm:left-6 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full shadow-2xl border border-white/20 transition-all duration-300 hover:scale-110 z-20 group"
        aria-label="Previous blog"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={goToNextBlog}
        className="fixed right-4 sm:right-6 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white p-4 rounded-full shadow-2xl border border-white/20 transition-all duration-300 hover:scale-110 z-20 group"
        aria-label="Next blog"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {blog.id === 5 ? (
        // Professional design for blog 5 - Languages I'm Learning
        <div className="relative z-10 w-full max-w-6xl mx-auto mt-4 sm:mt-6 space-y-8">
          {/* Hero Section */}
          <div className="blog-typography relative overflow-hidden bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-8 sm:p-10 border border-white/20">
            <div className="text-center">
              <div className="inline-block mb-4">
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-blue-200/80 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  {t('blog.posts.5.hero.tag')}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                {blog.title}
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                {t('blog.posts.5.hero.subtitle')}
              </p>
            </div>
          </div>

          {/* Introduction with Tree Feature */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Intro Content */}
            <div className="lg:col-span-2 blog-typography bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 border border-white/20">
              <p className="text-xl sm:text-2xl text-white mb-5 font-semibold">
                For anyone new to this corner of my site: Welcome!
              </p>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4">
              I’m Alex: a linguist, language teacher, digital-pedagogy enthusiast, and someone who has spent an unreasonable (but very enjoyable) number of hours buried in both grammar books and Python scripts.
              </p>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4">
              I hold a Master’s Degree in Further Education, along with postgraduate qualifications in E-Learning, Emotional Intelligence, and Neuroeducation. I’ve also completed several ICT-focused programmes, including Google’s Technical Support with AI certification and Meta’s Full-Stack Development programme.
              </p>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
              Professionally, I’ve taught languages to exam candidates, professionals, and organisations; collaborated with institutions such as the Spanish Space Agency and various government ministries; and — because staying still has never been my strong point — I’m now also exploring VR/AR learning environments with the aim of developing educational software.
              </p>
            
                <p className="text-lg sm:text-xl text-white font-semibold italic -mt-3 mb-3">
                  But this page isn't about my CV.
                </p>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-3">
                  It's about the languages I'm learning right now, why I love them, and what I'm working toward. My aim is to update each section in the future with resources and reflections.
                </p>
                <p className="text-base sm:text-lg text-white/80 leading-relaxed italic">
                  (There's even a section on programming languages, because why not?)
                </p>
               
            </div>

            {/* Tree Image and Quote - Sidebar */}
            <div className="lg:col-span-1 flex flex-col">
              <div className="relative flex-1 flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-white/20">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl blur-xl"></div>
                  <OptimizedImage
                    src={tree}
                    alt="tree"
                    className="relative rounded-xl shadow-lg h-auto w-full max-w-[200px] border-2 border-white/30"
                  />
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 w-full">
                  <blockquote className="text-white italic font-semibold text-sm sm:text-base text-center leading-relaxed">
                    "{t('blog.posts.5.quote')}"
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

          {/* Languages Section */}
          <div className="space-y-6">
            {/* Section Header */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                {t('blog.posts.5.languages.title')}
              </h2>
              <p className="text-white/80 text-base">{t('blog.posts.5.languages.subtitle')}</p>
            </div>

            {/* Languages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Japanese - Featured Large Card */}
              <div className="md:col-span-2 blog-typography bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 border border-white/20">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-4xl border border-green-200 rounded p-1 bg-green-200/10">🇯🇵</span>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">{t('blog.posts.5.languages.japanese.title')}</h2>
                    <p className="text-sm text-blue-200 font-semibold">{t('blog.posts.5.languages.japanese.subtitle')}</p>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-white/95 leading-relaxed mb-4 font-medium">
                  {t('blog.posts.5.languages.japanese.p1')}
                </p>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6">
                  {t('blog.posts.5.languages.japanese.p2')}
                </p>
                <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-5">
                  <p className="text-sm font-semibold text-blue-200 mb-4 uppercase tracking-wide">{t('blog.posts.5.languages.japanese.reflectionsTitle')}</p>
                  <ul className="space-y-3 text-white/90">
                    <li className="flex items-start gap-3">
                      <span className="text-blue-300 mt-1">•</span>
                      <span>{t('blog.posts.5.languages.japanese.reflection1')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-300 mt-1">•</span>
                      <span>{t('blog.posts.5.languages.japanese.reflection2')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-300 mt-1">•</span>
                      <span>{t('blog.posts.5.languages.japanese.reflection3')}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-blue-300 mt-1">•</span>
                      <span>{t('blog.posts.5.languages.japanese.reflection4')}</span>
                    </li>
                  </ul>
                </div>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed italic bg-white/5 rounded-xl p-4 border border-white/10">
                  {t('blog.posts.5.languages.japanese.quote')}
                </p>
              </div>

              {/* French */}
              <div className="blog-typography bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl border border-green-200 rounded p-1 bg-green-200/10">🇫🇷</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-400">{t('blog.posts.5.languages.french.title')}</h2>
                    <p className="text-xs text-blue-200 font-semibold">{t('blog.posts.5.languages.french.subtitle')}</p>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4">
                  {t('blog.posts.5.languages.french.p1')}
                </p>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 mt-4">
                  <p className="text-base sm:text-lg text-white/95 leading-relaxed">
                    {t('blog.posts.5.languages.french.p2')}
                  </p>
                </div>
              </div>

              {/* Spanish */}
              <div className="blog-typography bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl border border-green-200 rounded p-1 bg-green-200/10">🇪🇸</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-400">{t('blog.posts.5.languages.spanish.title')}</h2>
                    <p className="text-xs text-blue-200 font-semibold">{t('blog.posts.5.languages.spanish.subtitle')}</p>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4">
                  {t('blog.posts.5.languages.spanish.p1')}
                </p>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4">
                  {t('blog.posts.5.languages.spanish.p2')}
                </p>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-base sm:text-lg text-white/95 leading-relaxed">
                    {t('blog.posts.5.languages.spanish.p3')}
                  </p>
                </div>
              </div>

              {/* Italian */}
              <div className="blog-typography bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl border border-green-200 rounded p-1 bg-green-200/10">🇮🇹</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-400">{t('blog.posts.5.languages.italian.title')}</h2>
                    <p className="text-xs text-blue-200 font-semibold">{t('blog.posts.5.languages.italian.subtitle')}</p>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4">
                  {t('blog.posts.5.languages.italian.p1')}
                </p>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4">
                  {t('blog.posts.5.languages.italian.p2')}
                </p>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-base sm:text-lg text-white/95 leading-relaxed italic">
                    {t('blog.posts.5.languages.italian.quote')}
                  </p>
                </div>
              </div>

              {/* English */}
              <div className="blog-typography bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl border border-green-200 rounded p-1 bg-green-200/10">🇬🇧</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-400 pb-2">{t('blog.posts.5.languages.english.title')}</h2>
                    <p className="text-xs text-blue-200 font-semibold">{t('blog.posts.5.languages.english.subtitle')}</p>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4">
                  {t('blog.posts.5.languages.english.p1')}
                </p>
                <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-4">
                  {t('blog.posts.5.languages.english.p2')}
                </p>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-base sm:text-lg text-white/95 leading-relaxed italic">
                    {t('blog.posts.5.languages.english.quote')}
                  </p>
                </div>
              </div>
            </div>
          </div>


          {/* Programming Languages */}
          <div className="blog-typography bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl">💻</span>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{t('blog.posts.5.programming.title')}</h2>
                <p className="text-sm text-blue-200 font-semibold">{t('blog.posts.5.programming.subtitle')}</p>
              </div>
            </div>
            <p className="text-base sm:text-lg text-white/95 leading-relaxed mb-6 font-medium">
              {t('blog.posts.5.programming.intro')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-sm font-semibold text-blue-200 mb-4 uppercase tracking-wide">{t('blog.posts.5.programming.bothRequire')}</p>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.programming.require1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.programming.require2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.programming.require3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.programming.require4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.programming.require5')}</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-sm font-semibold text-blue-200 mb-4 uppercase tracking-wide">{t('blog.posts.5.programming.toolkitTitle')}</p>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.programming.toolkit1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.programming.toolkit2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.programming.toolkit3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.programming.toolkit4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.programming.toolkit5')}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 mb-6">
              <p className="text-base sm:text-lg text-white/95 leading-relaxed mb-3 italic">
                {t('blog.posts.5.programming.story')}
              </p>
             
               
             
            </div>
            <p className="text-base sm:text-lg text-white/95 leading-relaxed font-medium text-center bg-white/5 rounded-xl p-5 border border-white/10">
              "{t('blog.posts.5.programming.quote')}"
            </p>
          </div>

          {/* Why This Page Exists */}
          <div className="blog-typography bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-6 sm:p-8 border border-white/20">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
              {t('blog.posts.5.objectives.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-base sm:text-lg text-white/95 leading-relaxed mb-4">
                  {t('blog.posts.5.objectives.p1')}
                </p>
                <p className="text-base sm:text-lg text-white/95 leading-relaxed">
                  {t('blog.posts.5.objectives.p2')}
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <p className="text-sm font-semibold text-blue-200 mb-4 uppercase tracking-wide">{t('blog.posts.5.objectives.updateTitle')}</p>
                <ul className="space-y-2 text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.objectives.update1')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.objectives.update2')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.objectives.update3')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.objectives.update4')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-300 mt-1">•</span>
                    <span>{t('blog.posts.5.objectives.update5')}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-5 border border-white/10">
              <p className="text-base sm:text-lg text-white/95 leading-relaxed font-medium">
                {t('blog.posts.5.objectives.closing')}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 w-full max-w-3xl mx-auto mt-4 sm:mt-6">
          <div className="blog-typography bg-white/8 backdrop-blur-xl rounded-3xl shadow-xl p-5 sm:p-6 md:p-8 border border-white/15">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-blue-200/80">
              {t('blog.articleLabel')}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-white text-center">
              {blog.title}
            </h1>
            
            {blog.video ? (
              <div className="flex flex-col items-center mb-5">
                <div className="relative w-full max-w-[260px] sm:max-w-[320px] md:max-w-[440px]">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur-xl opacity-40"></div>
                  <div
                    className="relative rounded-xl shadow-xl overflow-hidden border border-white/30"
                    style={{ aspectRatio: '4 / 3' }}
                  >
                    <video
                      src={blog.video}
                      controls
                      controlsList="nofullscreen nodownload noremoteplayback"
                      disablePictureInPicture
                      playsInline
                      onContextMenu={(e) => e.preventDefault()}
                      className="w-full h-full object-cover"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
                {blog.videoCaption && (
                  <p className="text-white/70 text-sm sm:text-base mt-3 text-center italic max-w-[260px] sm:max-w-[320px] md:max-w-[380px]">
                    {blog.videoCaption}
                  </p>
                )}
              </div>
      ) : blogImage && (
        <div className="flex justify-center mb-5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur-xl opacity-40"></div>
            <div
              className={`relative rounded-xl shadow-xl border border-white/30
                ${blog.id === 1 ? 'max-w-[280px] sm:max-w-[200px] md:max-w-[190px] w-full' : ''}
                ${blog.id === 4 ? 'max-w-[240px] sm:max-w-[180px] md:max-w-[160px] w-full' : ''}
                ${blog.id !== 1 && blog.id !== 4 ? 'max-w-[260px] sm:max-w-[300px] w-full' : ''}
              `}
            >
              <OptimizedImage
                src={blogImage}
                alt="Event"
                className={`w-full h-auto rounded-xl ${
                  blog.id === 4 ? 'max-h-[300px]' : ''
                }`}
              />
            </div>
          </div>
        </div>
      )}

            <div className="max-w-none">
              {blog.content.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="text-white/90 text-base sm:text-lg leading-relaxed text-justify mb-4"
                >
                  {renderRichText(paragraph)}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetails;