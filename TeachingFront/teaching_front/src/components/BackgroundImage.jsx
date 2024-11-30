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
        {/* Student Zone Badge */}
        <div className="absolute -top-16 right-32 flex flex-col items-center">
          <img
            src={student_zone1}
            alt="Student Zone"
            className="h-[140px] w-auto drop-shadow-lg animate-bounce"
            style={{
              animationDuration: '3s',
              animationTimingFunction: 'ease-in-out',
            }}
          />
          <span className="-mt-2 text-md font-bold text-green-800 rotate-6">
            ¡Nuevo portal digital para estudiantes!
          </span>
        </div>

        {/* Feature List */}
 
 
 
   
 
  
    <div className="font-extrabold mt-2 space-y-3">
      {[
        'One-to-one',
        'Clases en grupos reducidos',
        'Preparación para exámenes (Cambridge, EOI, APTIS...)',
        'Oposiciones (especialidad: inglés)',
        'Apoyo universitario',
      ].map((item, index) => (
        <div key={index} className="flex items-center justify-start text-xl">
          <img src={arrow} alt="Arrow" className="w-6 h-auto mr-8" />
          <span className="flex-grow text-left hover:scale-110 transition-transform duration-300 ease-in-out">{item}</span>
        </div>
      ))}
    </div>
   
 
         
  
    </div>
 


    
    </div>
     
  );
};

export default BackgroundImage;
