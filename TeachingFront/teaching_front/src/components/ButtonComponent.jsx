import React from 'react';
import Student_Button_NEW from '../images/Student_button_NEW.png';
import red_arrow_icon from '../images/red_arrow_icon.png'
import { Link } from 'react-router-dom';

const ButtonComponent = () => (
  <div className="flex justify-center mt-2 mb-2 sm:mt-16 relative">
    <div className="relative">
      <Link to="/Login">
        <img
          src={Student_Button_NEW}
          alt="Student Area"
          className="w-40 h-auto -mt-4 sm:-mt-36 mb-2 sm:mb-4 border-8 sm:w-32 md:w-48 lg:w-52 hover:scale-110 transition-transform"
        />
      </Link>

      {/* Highlight Call-to-Action */}
      <div className="absolute -right-20 top-[65%] sm:top-[5%] -translate-y-1/2 flex flex-col items-center">
        <img
          src={red_arrow_icon}
          alt="Student Zone Arrow"
          className="h-[40px] sm:h-[50px] md:h-[60px] lg:h-[80px] w-auto drop-shadow-md"
        />
        <span className="mt-2 text-sm sm:text-base font-semibold text-green-700 animate-bounce whitespace-nowrap">
          Acceso para estudiantes
        </span>
      </div>
    </div>
  </div>
);

export default ButtonComponent;
