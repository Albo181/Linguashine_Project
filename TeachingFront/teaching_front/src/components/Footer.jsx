import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-green-950 border-t">
      <div className="mx-auto w-full max-w-screen-xl p-2 sm:p-4 py-2 sm:py-6 lg:py-8">
        <div className="md:flex md:justify-around">
          <div className="mb-3 md:mb-0 text-center md:text-left">
            <Link to="/" className="flex items-center justify-center md:justify-start">
              <span className="self-center text-lg sm:text-2xl font-bold whitespace-nowrap text-white">Linguashine</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-8 sm:grid-cols-3 text-center">
            <div>
              <h2 className="mb-2 sm:mb-6 text-sm font-semibold uppercase text-white text-center">Recursos</h2>
              <ul className="text-white text-sm sm:text-base font-medium space-y-2 sm:space-y-4 text-center">
                <li>
                  <Link to="/" className="hover:underline">Cursos grabados</Link>
                </li>
                <li>
                  <Link to="/login" className="hover:underline">Zona de Estudiantes</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-2 sm:mb-6 text-sm font-semibold text-white uppercase text-center">Follow</h2>
              <ul className="text-white text-sm sm:text-base font-medium space-y-2 sm:space-y-4 text-center">
                <li>
                  <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="hover:underline">Github</a>
                </li>
                <li>
                  <a href="https://discord.gg/yourinvite" target="_blank" rel="noopener noreferrer" className="hover:underline">Discord</a>
                </li>
              </ul>
            </div>
            <div className="col-span-2 sm:col-span-1 mt-3 sm:mt-0">
              <h2 className="mb-2 sm:mb-6 text-sm font-semibold text-white uppercase text-center">Legal</h2>
              <ul className="text-white text-sm sm:text-base font-medium space-y-2 sm:space-y-4 text-center">
                <li>
                  <Link to="/" className="hover:underline">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/" className="hover:underline">Terms &amp; Conditions</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-3 sm:my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-3 sm:space-y-0">
          <span className="text-xs sm:text-sm text-white text-center"> 2025 <Link to="/" className="hover:underline">LentonEducation</Link>. All Rights Reserved.</span>
          <div className="flex justify-center space-x-3 sm:space-x-5">
            <a href="https://facebook.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-900">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/>
              </svg>
              <span className="sr-only">Facebook page</span>
            </a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-900">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd"/>
              </svg>
              <span className="sr-only">Twitter page</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer