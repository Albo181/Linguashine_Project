import React from 'react'
import Students from '../images/Students.png'
import { MdOutlineMail } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import StateHome from '../images/StateHome.png';
 

const ContactBody = () => {
  return (
<section className="relative bg-blue-50 pt-24">
  {/* Wrapper div to hold space for the absolute element */}
   
<div
  className="absolute bg-no-repeat bg-cover h-[697px] w-[600px] border-black box-border top-15 md: -left-60 md:top-16"
  style={{
    backgroundImage: `url(${StateHome})`,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    backgroundBlendMode: 'overlay',
  }}
></div>

  <div className="relative h-[300px] ml-36 w-full">
    <div className="text-center mr-72 items-center h-42 pt-4">
      <p className="text-xl font-bold text-green-950 mx-auto max-w-screen-xl pt-6 pb-8 underline">CONTACTO:</p>
      <p className="text-lg font-bold text-green-950 mx-auto max-w-screen-xl pb-8">Alexander</p>
      <div className="flex items-center justify-center text-lg font-bold text-green-950 mx-auto max-w-screen-xl pb-8">
        <BsTelephone className="mr-2" />
      <span>Teléfono: 633 971 070</span>
    </div>

    {/* Flex container for email and icon */}
    <div className="flex items-center justify-center text-lg font-bold text-green-950 mx-auto max-w-screen-xl pb-8">
      <MdOutlineMail className="mr-2" />
      <span>Email: linguashine1@gmail.com</span>
    </div>
  </div>
  
  <div
      className="absolute bg-no-repeat bg-cover h-[695px] w-[600px] border-black box-border"
      style={{
        backgroundImage: `url(${Students})`,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        backgroundBlendMode: 'overlay',
        right: '-100px',   // Fine-tune position here
        top: '-30px',     // Fine-tune vertical position here
      }}
    ></div>
  </div>
</section>


  )
}

export default ContactBody