import React from 'react';
import English_theme from '../images/English_theme.png';
import arrow from '../images/arrow.png';
import student_zone1 from '../images/student_zone1.png';

const BackgroundImage = () => {
  return (
    <div
      className="relative h-72 w-screen -mt-6 bg-no-repeat bg-cover bg-center border-2 border-green-950"
      style={{ backgroundImage: `url(${English_theme})` }}
    >
      {/* Soft White Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-60"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center text-green-900">
        {/* Student Zone Badge - Responsive positioning */}
        <div className="absolute -top-8 sm:-top-12 md:-top-16 right-4 sm:right-12 md:right-20 lg:right-32 flex flex-col items-center">
          <img
            src={student_zone1}
            alt="Student Zone"
            className="h-[100px] sm:h-[120px] md:h-[140px] w-auto drop-shadow-lg animate-bounce"
            style={{
              animationDuration: '3s',
              animationTimingFunction: 'ease-in-out',
            }}
          />
          <span className="-mt-2 text-sm sm:text-md font-bold text-green-800 rotate-6 max-w-[150px] sm:max-w-none">
            ¡Nuevo portal digital para estudiantes!
          </span>
        </div>

        {/* Feature List - Mobile optimized */}
        <div className="font-extrabold mt-8 sm:mt-2 md:mt-2 space-y-2 sm:space-y-3 w-full max-w-xl px-2 sm:px-4">
          {[
            'One-to-one',
            'Clases en grupos reducidos',
            'Preparación para exámenes (Cambridge, EOI, APTIS...)',
            'Oposiciones (especialidad: inglés)',
            'Apoyo universitario',
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-start text-base sm:text-lg md:text-xl">
              <img src={arrow} alt="Arrow" className="w-4 sm:w-5 md:w-6 h-auto mr-2 sm:mr-4 md:mr-8 flex-shrink-0" />
              <span className="flex-grow text-left hover:scale-105 sm:hover:scale-110 transition-transform duration-300 ease-in-out">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BackgroundImage;
