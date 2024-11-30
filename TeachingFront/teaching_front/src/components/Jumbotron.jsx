import React from 'react';
import Mascot from '../images/Mascot.jpg';

const Jumbotron = () => {
  return (
    <section className="relative bg-gradient-to-b from-green-50 via-white to-gray-100 mt-12 -mb-8 shadow-lg rounded-xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-transparent to-lime-100 opacity-60 pointer-events-none"></div>

      {/* Flex container for layout */}
      <div className="relative flex justify-center items-center">
        {/* Mascot image with animation */}
        <img
          src={Mascot}
          alt="Mascot"
          className="absolute top-14 lg:top-16 left-[10%] lg:left-[21%] h-[100px] lg:h-[122px] w-auto rounded-full border-2 border-emerald-600 shadow-lg"
          style={{
            animation: 'float 3s ease-in-out infinite',
          }}
        />
      </div>

      <div className="py-16 px-10 mx-auto max-w-screen-lg text-center lg:py-20">
        {/* Title */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight leading-tight md:text-5xl lg:text-6xl text-emerald-800">
          Cursos de inglés online
        </h1>
        {/* Subtitle */}
        <p className="mb-10 text-lg font-light text-emerald-700 lg:text-xl sm:px-16 lg:px-36">
        Aprende inglés con un enfoque práctico y personalizado, guiado por un profesor británico titulado en filología inglesa.
        </p>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-6">
          <a
            href="blog/5"
            className="inline-flex justify-center items-center py-3 px-8 text-lg font-medium text-white bg-emerald-600 rounded-full shadow-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-400 transition-transform transform hover:scale-105">
            ¡Infórmate ya!
            <svg
              className="w-5 h-5 ml-2 rtl:rotate-180"
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
            className="py-3 px-8 text-lg font-medium text-emerald-800 bg-white rounded-full shadow-md border border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900 focus:ring-4 focus:ring-emerald-200 transition-transform transform hover:scale-105"
          >
            Aprende más sobre el método
          </a>
        </div>

        {/* Decorative Text Section */}
        <div className="mt-10 text-md font-semibold text-emerald-800 border-t border-gray-300 pt-4">
          <p>--- Educación de Adultos Online ---</p>
        </div>
      </div>
    </section>
  );
};

export default Jumbotron;
