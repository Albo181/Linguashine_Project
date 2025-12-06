import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Student_Button_NEW from '../images/Student_button_NEW.png';

const ButtonComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex justify-center mt-4 mb-4 sm:mt-10 relative">
    <div className="relative flex flex-col items-center">
      {/* Student area image button (slightly smaller) */}
      <Link to="/login" className="group">
        <img
          src={Student_Button_NEW}
          alt="Student Area"
          className="w-32 h-auto sm:w-36 md:w-40 lg:w-44 -mt-2 sm:-mt-32 mb-2 sm:mb-4 rounded-2xl border-4 border-white/80 shadow-xl transition-transform duration-300 group-hover:scale-105 group-hover:shadow-2xl"
        />
      </Link>

      {/* Row of CTAs: members + testimonials */}
      <div className="mt-1 sm:mt-2 -mb-4 flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
        {/* Members area */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-300/60 bg-emerald-500/10 px-4 py-1.5 text-sm sm:text-xs md:text-sm font-semibold text-emerald-50 shadow-sm shadow-emerald-900/40 backdrop-blur group"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="whitespace-nowrap tracking-[0.12em] uppercase text-[10px] sm:text-[11px]">
            {t('base.membersAccess')}
          </span>
          <span className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-full border border-emerald-300/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 transform transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </Link>

        {/* Testimonials CTA */}
        <Link
          to="/testimonios"
          className="inline-flex items-center gap-2 rounded-full border border-sky-300/70 bg-sky-500/15 px-4 py-1.5 text-sm sm:text-xs md:text-sm font-semibold text-sky-50 shadow-sm shadow-sky-900/40 backdrop-blur group"
        >
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="whitespace-nowrap tracking-[0.12em] uppercase text-[10px] sm:text-[11px]">
            {t('base.testimonials')}
          </span>
          <span className="relative flex items-center justify-center">
            <span className="absolute -inset-1 rounded-full border border-sky-300/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 transform transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </span>
        </Link>
      </div>
    </div>
    </div>
  );
};

export default ButtonComponent;
