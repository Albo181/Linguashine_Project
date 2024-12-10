import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import blogData from './blogData';
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
  return (
    <div className="w-full p-4 bg-gray-100 flex flex-col items-center">
      <Swiper
        modules={[Navigation]}
        navigation
        slidesPerView={1}
        spaceBetween={10}
        loop
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 10 },
          1024: { slidesPerView: 3, spaceBetween: 10 },
        }}
        className="w-full max-w-5xl"
      >
        {blogData.map((blog) => (
          <SwiperSlide key={blog.id}>
            <div className="p-2 sm:p-4">
              <Link to={`/blog/${blog.id}`} className="flex-1 max-w-md">
                <div className="bg-white rounded-lg shadow-lg p-6 h-64 transform transition hover:scale-105 border-4 border-blue-400 cursor-pointer">
                  {blog.image && (
                    <OptimizedImage
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-32 object-cover mb-4 rounded"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                  <p className="text-gray-700">
                    {blog.content.length > 100 ? blog.content.slice(0, 100) + '...' : blog.content}
                  </p>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BlogComponent;
