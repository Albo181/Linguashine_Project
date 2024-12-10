import React from 'react'
import LoginForm from '../components/LoginForm'
import { useEffect } from 'react';

const LoginPage = () => {
  useEffect(() => { // Scroll to the top of the page when the component mounts 
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <LoginForm />
    </>
  )
}

export default LoginPage