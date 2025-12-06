import React from 'react';
import { useTranslation } from 'react-i18next';
import Mascot from '../images/me_suit.png';

const Portfolio = () => {
  const { t } = useTranslation();
  
  const sectors = t('portfolio.sectors.list', { returnObjects: true });
  
  const clientSections = [
    {
      title: t('portfolio.clients.sections.government.title'),
      clients: t('portfolio.clients.sections.government.clients', { returnObjects: true }),
    },
    {
      title: t('portfolio.clients.sections.aerospace.title'),
      clients: t('portfolio.clients.sections.aerospace.clients', { returnObjects: true }),
    },
    {
      title: t('portfolio.clients.sections.corporate.title'),
      clients: t('portfolio.clients.sections.corporate.clients', { returnObjects: true }),
    },
    {
      title: t('portfolio.clients.sections.legal.title'),
      clients: t('portfolio.clients.sections.legal.clients', { returnObjects: true }),
    },
    {
      title: t('portfolio.clients.sections.education.title'),
      clients: t('portfolio.clients.sections.education.clients', { returnObjects: true }),
    },
  ];
  
  return (
    <main className="bg-slate-950 text-slate-100">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-1/2 w-[120%] -translate-x-1/2 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.25),transparent_60%)]"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(15,23,42,0.4),rgba(2,6,23,0.9))]"></div>
        </div>
        <div className="relative mx-auto max-w-5xl px-5 pb-24 pt-28 sm:pt-32 sm:pb-28">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
            {t('portfolio.tag')}
            <span className="h-1 w-1 rounded-full bg-emerald-400"></span>
            {t('portfolio.tagSub')}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white mt-4 sm:text-4xl md:text-[46px]">
            {t('portfolio.name')}
          </h1>
          <p className="mt-3 text-lg text-slate-200 sm:text-xl">
            {t('portfolio.title')}
          </p>
          <p className="mt-6 text-base font-semibold uppercase tracking-[0.25em] text-slate-300">
            {t('portfolio.subtitle')}
          </p>
          <div className="mt-10 grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:grid-cols-3">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{t('portfolio.stats.focus')}</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {t('portfolio.stats.focusValue')}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{t('portfolio.stats.service')}</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {t('portfolio.stats.serviceValue')}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-300">{t('portfolio.stats.regions')}</p>
              <p className="mt-2 text-lg font-semibold text-white">
                {t('portfolio.stats.regionsValue')}
              </p>
            </div>
          </div>

          {/* Fixed photo border */}
          <div className="relative mx-auto mt-12 -mb-20 w-fit rounded-[20px] border-8 border-white/20 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 shadow-2xl shadow-blue-950/50 backdrop-blur-xl">
            <img
              src={Mascot}
              alt="Alexander James Lenton"
              className="max-h-[280px] w-auto object-contain rounded-[20px]"
            />
          </div>
        </div>
      </section>

 

      <section className="mx-auto -mt-10 max-w-5xl px-5 py-16 sm:py-20">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-blue-950/40">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
            {t('portfolio.sectors.title')}
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {sectors.map((sector) => (
              <div
                key={sector}
                className="rounded-2xl border border-white/10 bg-slate-800/60 px-5 py-4 text-base font-medium text-slate-100 shadow-inner shadow-black/20"
              >
                • {sector}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl -mt-6 px-5 pb-16 sm:pb-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-300">
            {t('portfolio.clients.title')}
          </p>
          <p className="mt-4 text-base text-slate-300">
            {t('portfolio.clients.subtitle')}
          </p>
        </div>

        <div className="mt-12 space-y-12">
          {clientSections.map((section) => (
            <article
              key={section.title}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-indigo-900/40 p-8 shadow-2xl shadow-black/40"
            >
              <header className="flex flex-col gap-3 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-2xl font-semibold text-white">{section.title}</h3>
                <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
                  {t('portfolio.clients.provenImpact')}
                </div>
              </header>
              <ul className="mt-6 space-y-4 text-sm text-slate-200">
                {section.clients.map((client) => (
                  <li
                    key={client.name}
                    className="rounded-2xl border border-white/5 bg-white/5 px-5 py-4 shadow-inner shadow-black/30"
                  >
                    <p className="text-base font-semibold text-white">{client.name}</p>
                    {client.detail && (
                      <p className="mt-2 text-sm text-slate-300">{client.detail}</p>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-24">
        <div className="rounded-3xl border border-indigo-400/40 bg-gradient-to-br from-indigo-600/60 via-purple-600/60 to-slate-900/60 p-8 text-center shadow-2xl shadow-indigo-900/40">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/90">
            {t('portfolio.cta.tag')}
          </p>
          <h4 className="mt-4 text-2xl font-semibold text-white">
            {t('portfolio.cta.title')}
          </h4>
          <p className="mt-3 text-base text-white/90">
            {t('portfolio.cta.text')}
          </p>
          <a
            href="/contacto"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white/15 px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/25"
          >
            {t('portfolio.cta.button')}
          </a>
        </div>
      </section>
    </main>
  );
};

export default Portfolio;

