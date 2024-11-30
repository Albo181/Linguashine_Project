import React, { useState } from 'react';
import { getCsrfToken } from './Utils.js';


const ContactForm = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus("pending");
 
    
      try {
      const csrftoken = getCsrfToken();
      console.log("CSRF Token:", csrftoken); // Verify it is not null

      const response = await fetch("/send_query/contacto/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken, // Includes CSRF token in headers
        },
        body: JSON.stringify({ name, subject, message }),
      });

      if (response.ok) {
        setSubmissionStatus("success");
        console.log("Mensaje enviado!");
      } else {
        setSubmissionStatus("error");
        console.log("Se ha producido un error. Vuelve a intentarlo.");
      }
    } catch (error) {
      setSubmissionStatus("error");
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-96 mx-auto pt-10 pb-12">
      <div className="text-normal text-center font-lg text-black">
        <span>Mándame un mensaje</span>
      </div>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-96"
      />

      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="border p-2 w-96"
      >
        <option value="">Elige una opción</option>
        <option value="TENGO UNA PREGUNTA">Tengo una pregunta</option>
        <option value="ME GUSTARÍA QUE ME LLAMARAS">Me gustaría que me llamaras</option>
        <option value="OTRO MOTIVO">Otro motivo</option>
      </select>

      <textarea
        placeholder="Mensaje"
        value={message}
        onChange={(e) => setMessage(e.target.value)} 
        className="border p-2 w-96"
      />

      <button
        type="submit"
        disabled={submissionStatus === "pending" || submissionStatus === "success"}
        className={`p-2 rounded text-white bg-blue-500 
          ${submissionStatus === "pending" ? "bg-gray-500 opacity-70 cursor-not-allowed" : ""}
          ${submissionStatus === "success" ? "bg-green-500 cursor-not-allowed" : ""}
          ${submissionStatus === "error" ? "bg-red-500" : ""}
        `}
      >
        {submissionStatus === "pending" ? "Enviando..." : submissionStatus === "success" ? "Mensaje enviado" : "Enviar mensaje"}
      </button>
      
      {submissionStatus === "success" && <p className="text-green-600">Gracias! Mensaje enviado!</p>}
      {submissionStatus === "error" && <p className="text-red-600">Se ha producido un error. Vuelve a intentarlo.</p>}
    </form>
  );
};

export default ContactForm;
