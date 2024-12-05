import React from 'react';
import red_arrow_icon from '../images/red_arrow_icon.png';
import BlogComponent from './BlogComponent';
import ButtonComponent from './ButtonComponent';

const Base = () => {
  return (
    <section className="bg-white mt-4 sm:mt-16 md:mt-20 pt-2 sm:pt-6 md:pt-8 px-3 sm:px-6 md:px-20 lg:px-40">
      {/* Button Component */}
      <ButtonComponent />
      <BlogComponent />

      {/* Main Info Section */}
      <section className="bg-gradient-to-b from-green-50 via-white to-gray-100 mt-4 border-4 sm:border-6 md:border-8 border-grey">
        <div className="bg-white-300 py-4 sm:py-5 md:py-6 mx-auto max-w-screen-xl text-center italic font-bold shadow-lg px-2 sm:px-4">
          {[
            'Profesor nativo bilingüe',
            '17 años de experiencia',
            'Máster en formación de profesorado',
            'Forma de enseñanza altamente dinámica y variada',
            'Herramientas diversas (micrófonos, pizarra y cámaras HD profesionales)',
            'Programas de estudio individualizados',
          ].map((text, index) => (
            <p key={index} className="text-base sm:text-lg md:text-xl text-black mb-2 sm:mb-3">
              - {text}
            </p>
          ))}
        </div>
      </section>

      {/* Link Section */}
      <div className="flex justify-center mt-6 sm:mt-7 md:mt-8 pb-6 sm:pb-8 md:pb-10">
        <a
          href="/sobre-mi"
          className="inline-flex items-center py-2.5 sm:py-3 px-4 sm:px-5 text-sm sm:text-base border-2 sm:border-4 border-grey font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 transition-all duration-300"
        >
          Sobre mí
          <svg
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Base;
