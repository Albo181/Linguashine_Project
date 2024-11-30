import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import blogData from './blogData'; // Import centralized data
import './CustomSwiper.css';

const BlogComponent = () => {
  return (
    <div className="w-full p-4 bg-gray-100 flex flex-col items-center">
  <Swiper
    modules={[Navigation]}
    navigation
    slidesPerView={3}
    spaceBetween={10}
    loop
    breakpoints={{
      640: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    }}
    className="w-full max-w-5xl"
  >
    {blogData.map((blog) => (
      <SwiperSlide key={blog.id}>
        {/* Add a wrapper with padding */}
        <div className="p-4">
          <Link to={`/blog/${blog.id}`} className="flex-1 max-w-md">
            <div className="bg-white rounded-lg shadow-lg p-6 h-64 transform transition hover:scale-105 border-4 border-blue-400 cursor-pointer">
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
