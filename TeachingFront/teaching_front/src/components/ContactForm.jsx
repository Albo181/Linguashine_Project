import React, { useState } from 'react';
import apiClient from '../api/apiClient';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus("pending");
    setValidationErrors({});
    
    const errors = {};
    if (!name) errors.name = "Por favor, introduce tu nombre";
    if (!subject) errors.subject = "Por favor, selecciona una opción";
    if (!message) errors.message = "Por favor, escribe tu mensaje";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setSubmissionStatus("error");
      return;
    }

    try {
      const payload = {
        name,
        subject,
        message
      };

      console.log("Making request to:", `${apiClient.defaults.baseURL}/send_query/contacto/`);
      console.log("With payload:", payload);

      const response = await apiClient.post("/send_query/contacto/", payload);

      console.log("Full response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });

      if (response.status === 201 || response.status === 200) {
        setSubmissionStatus("success");
        setName('');
        setSubject('');
        setMessage('');
        console.log("Mensaje enviado!");
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Detailed error information:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        baseURL: apiClient.defaults.baseURL
      });

      // Log the full error object
      console.error("Full error object:", error);

      setSubmissionStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-96 mx-auto pt-10 pb-12">
      <div className="text-normal text-center font-lg text-black">
        <span>Mándame un mensaje</span>
      </div>

      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Nombre *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`border p-2 w-96 ${validationErrors.name ? 'border-red-500' : ''}`}
        />
        {validationErrors.name && (
          <span className="text-red-500 text-sm mt-1">{validationErrors.name}</span>
        )}
      </div>

      <div className="flex flex-col">
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={`border p-2 w-96 ${validationErrors.subject ? 'border-red-500' : ''}`}
        >
          <option value="">Elige una opción *</option>
          <option value="TENGO UNA PREGUNTA">Tengo una pregunta</option>
          <option value="ME GUSTARÍA QUE ME LLAMARAS">Me gustaría que me llamaras</option>
          <option value="OTRO MOTIVO">Otro motivo</option>
        </select>
        {validationErrors.subject && (
          <span className="text-red-500 text-sm mt-1">{validationErrors.subject}</span>
        )}
      </div>

      <div className="flex flex-col">
        <textarea
          placeholder="Mensaje *"
          value={message}
          onChange={(e) => setMessage(e.target.value)} 
          className={`border p-2 w-96 ${validationErrors.message ? 'border-red-500' : ''}`}
        />
        {validationErrors.message && (
          <span className="text-red-500 text-sm mt-1">{validationErrors.message}</span>
        )}
      </div>

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
