import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import blogData from './blogData';
import enjoyment from '../images/enjoyment.png';
import exam from '../images/exam.png';
import dashboard from '../images/dashboard.png';
import professional from '../images/professional.png';
import tree from '../images/tree.png';
import podcast from '../images/podcast.png';

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

const BlogDetails = () => {
  const { id } = useParams();
  const blog = blogData.find((b) => b.id === parseInt(id));

  if (!blog) return <p>Blog not found!</p>;

  const blogImage = blog.id === 1 ? exam : blog.id === 2 ? enjoyment : blog.id === 3 ? dashboard : blog.id === 4 ? podcast : blog.id === 5 ? professional : '';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen flex ${blog.id === 5 ? 'flex-col mt-16 bg-gray-50' : 'justify-center items-center bg-gray-100'} p-4`}>
      {blog.id === 5 ? (
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
          {blog.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
