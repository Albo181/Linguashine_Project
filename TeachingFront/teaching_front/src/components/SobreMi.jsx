import React from 'react';

const SobreMi = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 flex flex-col items-center mt-16">
      {/* Header Section */}
      <div className="max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-extrabold text-blue-950 mb-4">Sobre mí</h1>
        <p className="text-lg text-gray-700 font-light">
          Conoce más sobre mi trayectoria profesional, mi experiencia y mis pasiones.
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <p className="text-lg text-gray-800 leading-8 mb-6">
        Soy profesor nativo de Inglaterra, titulado en Filología Inglesa y con 17 años de experiencia enseñando en España. Durante mi trayectoria, he trabajado en colegios, universidades, centros de formación, empresas y academias de idiomas en la Comunidad de Madrid. Además, soy especialista en la preparación de exámenes oficiales de Cambridge y del British Council, entre otros.
        </p>
        <p className="text-lg text-gray-800 leading-8 mb-6">
        En junio de 2017, obtuve el Máster en Formación de Profesorado con especialidad en inglés, otorgado por la Universidad de Alcalá de Henares en Madrid. Mi interés por los idiomas no se detiene ahí: en 2019, aprobé el examen DELE C1 del Instituto Cervantes, y en mi tiempo libre disfruto aprendiendo varios idiomas, de los que se incluyen el francés, el italiano y el japonés.
        </p>
        <p className="text-lg text-gray-800 leading-8 mb-6">
        En 2020, comencé estudios en Neurolingüística, E-learning y el uso de tecnologías en la educación digital, que finalicé en 2021. Más recientemente, completé dos titulaciones en el ámbito de las tecnologías nuevas y la educación, centradas en la programación de aplicaciones educativas y el uso de herramientas tecnológicas como recursos vitales en el aula. Estas formaciones me han permitido integrar enfoques innovadores y adaptados a los desafíos actuales del aprendizaje.
        </p>
        <p className="text-lg text-gray-800 leading-8 mb-6">
        La enseñanza de idiomas es mi pasión, y disfruto enormemente transmitiendo conocimientos de manera clara, metódica y, al mismo tiempo, amena. Mi enfoque de enseñanza inmersiva tiene como objetivo ayudar a los estudiantes a comunicarse con fluidez y confianza, permitiendo que uno se pueda enfrentar a cualquier dificultad que surja y de forma natural. 
        </p>
        <p className="text-lg text-gray-800 leading-8 mb-6">
        Espero seguir transmitiendo mi pasión por los idiomas y el aprendizaje lingüístico a todos mis alumnos, y confío en poder ayudar a muchos más de vostros en el futuro.
        </p>
      </div>

      {/* Visual Enhancement */}
      <div className="max-w-4xl mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-950 text-white p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold">
              17+ años de experiencia
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-950 text-white p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8c-2.28 0-4.14 1.86-4.14 4.14C7.86 14.42 9.72 16.28 12 16.28c2.28 0 4.14-1.86 4.14-4.14C16.14 9.86 14.28 8 12 8z"
                />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold">
              Experto en exámenes Cambridge
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-blue-950 text-white p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 10l6-6m0 0l6 6m-6-6v12"
                />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold">
              Apasionado por la enseñanza
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SobreMi;
