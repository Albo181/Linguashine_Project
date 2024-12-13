import React from 'react';
import { LuQuote, LuTarget, LuBook, LuBrain, LuLanguages } from "react-icons/lu";

const MethodCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-5 transform transition-all duration-300 hover:scale-105">
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 mb-3">
      <Icon className="w-6 h-6 text-purple-600" />
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed text-sm">{description}</p>
  </div>
);

const MethodBody = () => {
  const methodFeatures = [
    {
      icon: LuTarget,
      title: "Enfoque Sistemático",
      description: "Simplificamos lo complejo en bloques manejables, permitiendo un aprendizaje gradual y efectivo."
    },
    {
      icon: LuBook,
      title: "Práctica Continua",
      description: "Ejercicios prácticos y dinámicos que refuerzan el aprendizaje y construyen confianza."
    },
    {
      icon: LuBrain,
      title: "Pensamiento Crítico",
      description: "Se fomenta la creatividad y el análisis desde diferentes perspectivas."
    },
    {
      icon: LuLanguages,
      title: "Inmersión Cultural",
      description: "Integración de aspectos culturales para una comprensión más profunda del idioma."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 mt-12">
              Un método que simplifica lo complicado
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre un enfoque innovador que hace del aprendizaje del inglés 
              una experiencia enriquecedora y efectiva.
            </p>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {methodFeatures.map((feature, index) => (
            <MethodCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Detailed Method Description */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative">
          <LuQuote className="absolute text-4xl text-purple-200 -top-6 -left-4 transform -rotate-12" />
          
          <div className="space-y-6 text-gray-700 leading-relaxed italic -mt-20">
            <p>
              En las clases se emplea un método de enseñanza que se fundamenta en "simplificar lo complicado," 
              para que los estudiantes avancen de una forma sistemática con el aprendizaje de bloques de 
              contenido más manejables.
            </p>

            <p>
              Cada lección es una oportunidad para explorar y descubrir, lo que permite 
              a los estudiantes aprender de manera dinámica y envolvente. Fomentamos siempre un 
              ambiente en el que se ve cada tema desde diferentes perspectivas.
            </p>

            <p>
              Se hace hincapié en los aspectos claves de la comunicación para que uno pueda 
              participar y reaccionar de forma más natural y flexible, tanto dentro como fuera 
              del aula.
            </p>

            <p>
              La práctica frecuente es una herramienta imprescindible para asimilar mejor lo 
              aprendido y hacer que lo mecánico llegue a ser una rutina, lo cual ayuda a 
              apaciguar el miedo escénico.
            </p>

            <p>
              El proceso de adquirir una lengua extranjera debe de ser gradual, divertido y 
              gratificante; es más, el alumno debe reconocer sus progresos de forma continua.
            </p>
          </div>

          <LuQuote className="absolute text-4xl text-purple-200 -bottom-6 -right-4 transform rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default MethodBody;
