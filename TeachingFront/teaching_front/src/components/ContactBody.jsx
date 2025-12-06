import React from 'react'
import { useTranslation } from 'react-i18next';
import Students from '../images/Students.png'
import { MdOutlineMail } from "react-icons/md";
import { BsTelephone } from "react-icons/bs";
import StateHome from '../images/StateHome.png';
 

const ContactBody = () => {
  const { t } = useTranslation();
  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 mt-16 pt-16 pb-10 overflow-hidden text-[0.95rem]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:34px_34px]"></div>

      {/* Decorative images - hidden on mobile, visible on larger screens */}
      <div
        className="hidden lg:block absolute bg-no-repeat bg-cover h-[620px] w-[540px] -left-56 top-16 opacity-20"
        style={{
          backgroundImage: `url(${StateHome})`,
        }}
      ></div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200">
            {t('contact.title').toUpperCase()}
          </h2>
          <div className="w-20 h-[3px] bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full mb-6"></div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-9 border border-white/20">
          <div className="space-y-6">
            {/* Name */}
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-white mb-6">Alexander</p>
            </div>

            {/* Phone */}
            <div className="flex items-center justify-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <BsTelephone className="text-white text-lg" />
              </div>
              <span className="text-base sm:text-sm font-semibold text-white">{t('contact.phone')}: 633 971 070</span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <MdOutlineMail className="text-white text-lg" />
              </div>
              <span className="text-base sm:text-sm font-semibold text-white">{t('contact.email')}: linguashine1@gmail.com</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side decorative image - hidden on mobile */}
      <div
        className="hidden lg:block absolute bg-no-repeat bg-cover h-[695px] w-[600px] -right-60 top-0 opacity-20"
        style={{
          backgroundImage: `url(${Students})`,
        }}
      ></div>
    </section>
  )
}

export default ContactBody