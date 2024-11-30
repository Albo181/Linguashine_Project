import React from 'react';
import Student_Button_NEW from '../images/Student_Button_NEW.png';
import red_arrow_icon from '../images/red_arrow_icon.png'
import { Link } from 'react-router-dom';
 

const ButtonComponent = () => (
  <div className="flex justify-center mt-10 mb-4 sm:mt-16">
    <Link to="/Login">
      <img
        src={Student_Button_NEW}
        alt="Student Area"
        className="w-32 h-auto -mt-36 mb-4 border-8 :w-40 md:w-48 lg:w-52 hover:scale-110 transition-transform"
      />
    </Link>
  

        {/* Highlight Call-to-Action */}
        <div className="absolute top-[898px] right-[560px] flex flex-col items-center mr-1">
          <img
            src={red_arrow_icon}
            alt="Student Zone Arrow"
            className="h-[80px] w-auto drop-shadow-md"
          />
          <span className="mt-2 text-base font-semibold text-green-700 animate-bounce ml-2">
            Acceso para estudiantes
          </span>
        </div>
  </div>
);

export default ButtonComponent;
