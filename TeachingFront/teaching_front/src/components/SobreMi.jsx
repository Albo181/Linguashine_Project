import React from 'react';

const SobreMi = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-16 px-6 flex flex-col items-center mt-16 overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
      <div className="absolute -bottom-8 right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-6000"></div>
      
      {/* Content */}
      <div className="relative max-w-4xl text-center mb-16">
        <div className="relative">
          <h1 className="text-5xl font-light text-blue-950 mb-6">
            Sobre mí
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 italic font-light tracking-wide">
            Conoce más sobre mi trayectoria profesional<br/> 
          </p>
        </div>
      </div>

      <div className="relative max-w-4xl bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-8 -mt-8 hover:shadow-xl transition-all duration-300">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg blur opacity-25"></div>
        <div className="relative">
          <p className="text-lg text-gray-800 leading-8 mb-6">
          Soy profesor nativo de Inglés, titulado en Filología Inglesa y con 17 años de experiencia en la enseñanza de idiomas en España. A lo largo de mi trayectoria, he trabajado en colegios, universidades, centros de formación, empresas y academias de idiomas en la Comunidad de Madrid. Además, cuento con una sólida formación en la preparación de exámenes oficiales como los de Cambridge y del British Council, entre otros.
          </p>
          <p className="text-lg text-gray-800 leading-8 mb-6">
          En junio de 2017, obtuve el Máster en Formación de Profesorado con especialidad en inglés, otorgado por la Universidad de Alcalá de Henares en Madrid. Mi interés por los idiomas va más allá de la enseñanza: en 2019, obtuve el DELE C1 del Instituto Cervantes, y en mi tiempo libre disfruto aprendiendo idiomas como francés, italiano y japonés.
          </p>
          <p className="text-lg text-gray-800 leading-8 mb-6">
          Entre 2020 y 2021, me formé en Neurolingüística, E-learning y el uso de tecnologías aplicadas a la educación digital. Recientemente, completé dos titulaciones relacionadas con la programación de aplicaciones educativas y el empleo de herramientas tecnológicas como recursos esenciales en el aula. Estas formaciones han enriquecido mi metodología, permitiéndome incorporar enfoques innovadores adaptados a las demandas del aprendizaje actual.
          </p>
          <p className="text-lg text-gray-800 leading-8 mb-6">
          La enseñanza de idiomas es mi pasión. Disfruto transmitiendo conocimientos de forma clara, estructurada y amena. Mi enfoque didáctico inmersivo tiene como objetivo dar a los estudiantes de la confianza y fluidez necesarias para comunicarse eficazmente en cualquier situación.
          </p>
          <p className="text-lg text-gray-800 leading-8 mb-6">
          Mi compromiso es seguir compartiendo mi pasión por los idiomas y el aprendizaje con todos mis alumnos. Espero continuar ayudando a muchos más en su camino hacia el dominio de una nueva lengua.
          </p>
        </div>
      </div>

      <div className="relative max-w-4xl mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Experience */}
          <div className="group">
            <div className="relative flex items-center space-x-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold">17+ años de experiencia</p>
              </div>
            </div>
          </div>

          {/* Cambridge */}
          <div className="group">
            <div className="relative flex items-center space-x-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold">Experto en exámenes Cambridge</p>
              </div>
            </div>
          </div>

          {/* Passion */}
          <div className="group">
            <div className="relative flex items-center space-x-4 bg-white/90 backdrop-blur-sm p-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 rounded-full shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                  </svg>
                </div>
                <p className="text-gray-700 font-semibold">Apasionado por la enseñanza</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreMi;
