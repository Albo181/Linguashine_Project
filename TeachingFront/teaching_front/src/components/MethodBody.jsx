import React from 'react';
import { LuQuote } from "react-icons/lu";

const MethodBody = () => {
  return (
    <section className="bg-gray-50 py-20 flex items-center justify-center mt-12">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-10 italic">
          Un método que simplifica lo complicado
        </h1>

        <div className="relative text-lg text-gray-700 font-light leading-relaxed italic">
          {/* Opening Quote Icon */}
          <LuQuote
            style={{ transform: 'scaleX(-1)' }}
            className="text-4xl text-gray-400 absolute -top-8 -left-4"
          />

          <p className="mb-6">
            En las clases se emplea un método de enseñanza que se fundamenta en "simplificar lo complicado," 
            para que los estudiantes avancen de una forma sistemática
            con el aprendizaje de bloques de contenido más manejables. Se abordan 
            los temas más complejos de manera lógica y claramente estructurada, asegurando una comprensión 
            profunda y duradera. Las explicaciones se refuerzan con ejemplos claros 
            y pertinentes, utilizando técnicas lúdicas que facilitan la conexión con el contenido.
          </p>

          <p className="mb-6">
            Cada lección es una oportunidad para explorar y descubrir, lo que permite 
            a los estudiantes aprender de manera dinámica y envolvente. Fomentamos siempre un 
            ambiente en el que se ve cada tema desde diferentes perspectivas, 
            promoviendo al mismo tiempo el pensamiento crítico y la creatividad.
          </p>

          <p className="mb-6">
            Se hace hincapié en los aspectos claves de la comunicación para que uno pueda 
            participar y reaccionar de forma más natural y flexible, tanto dentro como fuera 
            del aula. Por ello, el uso de materiales del mundo anglófono predominan en las 
            clases, así como la enseñanza de los aspectos culturales de estos mismos países.
            Es evidente que el aprendizaje de un idioma y la cultura son aspectos inseparables, 
            por lo que se deben considerar ambos vitales para tener una formación eficaz.
          </p>

          <p className="mb-6">
            La práctica frecuente es una herramienta imprescindible para asimilar mejor lo 
            aprendido y hacer que lo mecánico llegue a ser una rutina, por lo que las clases 
            suelen ser muy prácticas, lo cual ayuda a apaciguar el miedo escénico que suele 
            surgir en situaciones de incertidumbre.
          </p>

          <p className="mb-6">
            El proceso de adquirir una lengua extranjera debe de ser gradual, divertido y 
            gratificante; es más, el alumno debe reconocer sus progresos de forma continua 
            para entender mejor sus fortalezas y sus debilidades, lo cual contribuye enormemente 
            a su propio camino de aprendizaje.
          </p>

          {/* Closing Quote Icon */}
          <div className="flex justify-end mt-8">
            <LuQuote className="text-4xl text-gray-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodBody;
