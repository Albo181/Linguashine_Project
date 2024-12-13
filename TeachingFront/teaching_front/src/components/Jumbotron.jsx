import React from 'react';
import Mascot from '../images/Mascot.jpg';

const Jumbotron = () => {
  return (
    <section className="relative bg-gradient-to-b from-green-50 via-white to-gray-100 mt-16 sm:mt-8 md:mt-10 lg:mt-12 -mb-6 sm:-mb-8 shadow-lg rounded-xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-transparent to-lime-100 opacity-60 pointer-events-none"></div>

      {/* Flex container for layout */}
      <div className="relative flex justify-center items-center">
        {/* Mascot image with animation */}
        <img
          src={Mascot}
          alt="Mascot"
          className="absolute block top-9 sm:hidden lg:block lg:top-16 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-[8%] md:left-[15%] lg:left-[21%] h-[80px] sm:h-[90px] md:h-[100px] lg:h-[122px] w-auto rounded-full border-2 border-emerald-600 shadow-lg mb-24 sm:mb-0"
          style={{
            /*animation: 'float 0.8s ease-in-out infinite',*/
          }}
        />
      </div>

      <div className="pt-32 pb-16 sm:py-14 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-10 mx-auto max-w-screen-lg text-center">
        {/* Title */}
        <h1 className="mb-4 sm:mb-5 md:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-emerald-800">
          Cursos de inglés online
        </h1>
        {/* Subtitle */}
        <p className="mb-8 sm:mb-9 md:mb-10 text-base sm:text-lg md:text-xl font-light text-emerald-700 sm:px-8 md:px-16 lg:px-36">
          Aprende inglés con un enfoque práctico y personalizado, guiado por un profesor británico titulado en filología inglesa.
        </p>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 sm:gap-6 px-4 sm:px-0">
          <a
            href="blog/5"
            className="inline-flex justify-center items-center  py-2.5 sm:py-3 px-6 sm:px-8 text-base sm:text-lg font-medium text-white bg-emerald-600 rounded-full shadow-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-400 transition-transform transform hover:scale-105"
          >
            ¡Infórmate ya!
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 ml-2 rtl:rotate-180"
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
          <a
            href="/metodo"
            className="py-2.5 sm:py-3 px-6 sm:px-8 text-base sm:text-lg font-medium text-emerald-800 bg-white rounded-full shadow-md border border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900 focus:ring-4 focus:ring-emerald-200 transition-transform transform hover:scale-105"
          >
            Aprende más sobre el método
          </a>
        </div>

        {/* Decorative Text Section */}
        <div className="mt-8 sm:mt-9 md:mt-10 text-sm sm:text-base md:text-md font-semibold text-emerald-800 border-t border-gray-300 pt-3 sm:pt-4">
          <p>--- Educación de Adultos Online ---</p>
        </div>
      </div>
    </section>
  );
};

export default Jumbotron;
