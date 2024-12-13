import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import blogData from './blogData';
import enjoyment from '../images/enjoyment.png';
import exam from '../images/exam.png';
import dashboard from '../images/dashboard.png';
import professional from '../images/professional.png';
import tree from '../images/tree.png';
import podcast from '../images/podcast.png';

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
    opacity: 0.35;
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

  const blogImage = blog.id === 1 ? exam : blog.id === 2 ? enjoyment : blog.id === 3 ? dashboard : blog.id === 4 ? podcast : blog.id === 5 ? professional : '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen flex relative ${
      blog.id === 5 
        ? 'flex-col mt-16 bg-gray-50' 
        : blog.id === 1
          ? 'justify-center items-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100'
          : blog.id === 2
            ? 'justify-center items-center bg-gradient-to-br from-green-50 via-emerald-100 to-teal-100 animate-gradient'
            : blog.id === 3
              ? 'justify-center items-center bg-gradient-to-tr from-amber-50 via-orange-50 to-yellow-100 animate-pulse-slow'
              : blog.id === 4
                ? 'justify-center items-center bg-[linear-gradient(120deg,#e0f2fe,#f0f9ff,#dbeafe)] animate-gradient'
                : 'justify-center items-center bg-gray-100'
    } p-4`}>
      <FloatingElements blogId={blog.id} />
      {/* Navigation Arrows */}
      <button 
        onClick={goToPreviousBlog}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
        aria-label="Previous blog"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={goToNextBlog}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
        aria-label="Next blog"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      {blog.id === 5 ? (
        // Existing code for blog 5
        <>
          <div className="bg-blue-950 text-white py-12 px-6 font-bold">
            <div className="container mx-auto max-w-5xl text-center">
              <h1 className="text-6xl font-extrabold mb-4">{blog.title}</h1>
              <p className="text-lg font-light mb-6">
                Lleva tu inglés al siguiente nivel con clases de inglés personalizadas, profesionales y estimulantes.
              </p>
              <div className="flex justify-center">
                {blogImage && (
                  <OptimizedImage
                    src={blogImage}
                    alt="Professional classes"
                    style={{
                      maxWidth: '200px',
                      width: '100%',
                      height: 'auto',
                    }}
                    className="rounded-lg shadow-md border border-2"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="bg-white py-12 px-6">
            <div className="container mx-auto max-w-5xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div>
                  {blog.id === 5 && (
                    <h2 className="text-2xl font-semibold text-blue-950 mt-4 mb-6">
                      ¡Bienvenidos a mi rincón de enseñanza!
                    </h2>
                  )}
                  {blog.content.split('\n\n').map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-lg text-gray-700 leading-8 mb-6"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-4">
                  <h2 className="text-2xl font-semibold mb-10 text-blue-950">¿Qué se ofrece?</h2>
                  <ul className="list-disc list-inside text-gray-700 text-lg space-y-6">
                    <li>17+ años de experiencia impartiendo clases.</li>
                    <li>Un método interactivo, divertido y productivo.</li>
                    <li>Profesor nativo y bilingüe.</li>
                    <li>Clases a medida para alcanzar tus objetivos.</li>
                    <li>Horarios flexibles que adaptan a tu ritmo.</li>
                    <li>Uso de tecnologías nuevas.</li>
                  </ul>
                  <div className="mt-12 text-center mb-16"> 
                    <Link
                      className="bg-blue-950 text-white border-2 border-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-800 transition"
                      to="/contacto"
                    >
                      ¡Ponte en contacto!
                    </Link>
                  </div>
                  <div className="relative flex flex-col items-center">
                    <OptimizedImage
                      src={tree}
                      alt="tree"
                      className="mt-32 lg:-mt-2 mb-8 h-[150px] lg:h-[275px] w-auto rounded-lg shadow-lg p-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500"
                      style={{
                        borderRadius: '15px',
                      }}
                    />
                    <div className="bg-white p-4 rounded-lg shadow-md text-center mt-0">
                      <blockquote className="text-blue-950 italic font-bold mb-2">
                        "A tree's beauty lies in its branches, but its strength lies in its roots." 
                      </blockquote>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white shadow-lg rounded-lg p-8 mt-20 mb-6 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-center text-green-700">
            {blog.title}
          </h1>
          {blogImage && (
            <div className="flex justify-center mb-4">
              <OptimizedImage
                src={blogImage}
                alt="Event"
                className="border-4 border-green-700 h-60 mt-4 mb-4 w-auto rounded-lg"
              />
            </div>
          )}
          {blog.id === 1 ? (
            blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph.split(':').map((part, partIndex) => (
                  <span key={partIndex}>
                    {partIndex === 0 ? <strong>{part.trim()}:</strong> : part}
                  </span>
                ))}
              </p>
            ))
          ) : (
            blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default BlogDetails;