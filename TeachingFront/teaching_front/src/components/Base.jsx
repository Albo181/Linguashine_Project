import React from 'react';
import red_arrow_icon from '../images/red_arrow_icon.png';
import BlogComponent from './BlogComponent';
import ButtonComponent from './ButtonComponent';


const Base = () => {
  return (
    <section className="bg-white mt-20 pt-8 px-4 md:px-20 lg:px-40">
        {/* Button Component */}
      <ButtonComponent />
      <BlogComponent />



      {/* Main Info Section */}
      <section className="bg-gradient-to-b from-green-50 via-white to-gray-100 mt-4 border-8 border-grey">
        <div className="bg-white-300 py-6 mx-auto max-w-screen-xl text-center italic font-bold shadow-lg">
          <p className="text-xl text-black">- Profesor nativo bilingüe</p>
          <p className="text-xl text-black">- 17 años de experiencia</p>
          <p className="text-xl text-black">- Máster en formación de profesorado</p>
          <p className="text-xl text-black">- Forma de enseñanza altamente dinámica y variada</p>
          <p className="text-xl text-black">- Herramientas diversas (micrófonos, pizarra y cámaras HD profesionales)</p>
          <p className="text-xl text-black">- Programas de estudio individualizados</p>
        </div>
      </section>

    

      {/* Link Section */}
      <div className="flex justify-center mt-8 pb-10">
        <a
          href="/sobre-mi"
          className="inline-flex items-center py-3 px-5 text-base border-4 border-grey font-medium text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300"
        >
          Sobre mí
          <svg
            className="w-3.5 h-3.5 ml-2"
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
