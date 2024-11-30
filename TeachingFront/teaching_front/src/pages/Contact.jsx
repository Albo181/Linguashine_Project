import React from 'react'
import ContactBody from '../components/ContactBody'
import ContactForm from '../components/ContactForm'
import { useEffect } from 'react'

const Contact = () => {

  //Starts window at top
useEffect(() => {
  window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
    <ContactBody /> 
    <ContactForm /> 
    </>
  )
}

export default Contact