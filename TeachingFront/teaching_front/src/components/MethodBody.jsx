import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  LuLayers,
  LuUser,
  LuZap,
  LuGlobe,
  LuCompass,
  LuWrench,
  LuSparkles,
  LuCheckCircle2,
  LuArrowRight
} from 'react-icons/lu';

const Tag = ({ children }) => (
  <span className="inline-flex items-center rounded-full border border-indigo-200/50 bg-gradient-to-r from-indigo-50 to-fuchsia-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-700 shadow-sm backdrop-blur-sm">
    {children}
  </span>
);

const MethodBody = () => {
  const { t } = useTranslation();

  const methodFeatures = [
    {
      icon: LuLayers,
      title: t('methodPage.features.buildingBlocksTitle'),
      subtitle: t('methodPage.features.buildingBlocksSubtitle'),
      description: t('methodPage.features.buildingBlocksDesc'),
      benefits: t('methodPage.features.buildingBlocksBenefits'),
      goal: t('methodPage.features.buildingBlocksGoal')
    },
    {
      icon: LuUser,
      title: t('methodPage.features.potisTitle'),
      subtitle: t('methodPage.features.potisSubtitle'),
      description: t('methodPage.features.potisDesc'),
      items: [
        t('methodPage.features.potisP'),
        t('methodPage.features.potisO'),
        t('methodPage.features.potisT'),
        t('methodPage.features.potisI'),
        t('methodPage.features.potisS')
      ],
      detail: t('methodPage.features.potisDetail')
    },
    {
      icon: LuZap,
      title: t('methodPage.features.flowTitle'),
      subtitle: t('methodPage.features.flowSubtitle'),
      description: t('methodPage.features.flowDesc'),
      elements: t('methodPage.features.flowElements'),
      detail: t('methodPage.features.flowDetail')
    },
    {
      icon: LuGlobe,
      title: t('methodPage.features.cultureTitle'),
      subtitle: t('methodPage.features.cultureSubtitle'),
      description: t('methodPage.features.cultureDesc'),
      elements: t('methodPage.features.cultureElements'),
      detail: t('methodPage.features.cultureDetail')
    }
  ];

  const processSteps = [
    {
      icon: LuCompass,
      title: t('methodPage.steps.diagnosisTitle'),
      detail: t('methodPage.steps.diagnosisDetail')
    },
    {
      icon: LuWrench,
      title: t('methodPage.steps.constructionTitle'),
      detail: t('methodPage.steps.constructionDetail')
    },
    {
      icon: LuSparkles,
      title: t('methodPage.steps.transferTitle'),
      detail: t('methodPage.steps.transferDetail')
    }
  ];

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-indigo-50/30 via-fuchsia-50/30 to-slate-50 text-slate-900">
      {/* Animated background elements */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-indigo-200/20 blur-3xl animate-pulse" />
        <div className="absolute -right-20 top-40 h-96 w-96 rounded-full bg-fuchsia-200/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute left-1/2 bottom-20 h-96 w-96 -translate-x-1/2 rounded-full bg-purple-200/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero */}
      <section className="relative px-5 pt-24 pb-12 sm:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-block">
            <Tag>{t('methodPage.tagHero')}</Tag>
          </div>
          <h1 className="mt-6 pb-4 bg-gradient-to-r from-indigo-700 via-fuchsia-600 to-purple-600 bg-clip-text text-3xl font-extrabold leading-tight text-transparent sm:text-4xl lg:text-5xl">
            {t('methodPage.heroTitle')}
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-slate-700 sm:text-lg">
            {t('methodPage.heroText')}
          </p>
        </div>
        
        {/* Enhanced Stats - moved closer */}
        <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-3">
          <div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white/90 to-white/50 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-indigo-200/50">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                {t('methodPage.statsExperience')}
              </p>
              <p className="mt-3 bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-2xl font-bold text-transparent">
                {t('methodPage.statsExperienceValue')}
              </p>
            </div>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-200/40 to-indigo-300/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white/90 to-white/50 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-fuchsia-200/50">
            <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                {t('methodPage.statsCertification')}
              </p>
              <p className="mt-3 bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 bg-clip-text text-2xl font-bold text-transparent">
                {t('methodPage.statsCertificationValue')}
              </p>
            </div>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-fuchsia-200/40 to-fuchsia-300/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white/90 to-white/50 p-6 shadow-lg shadow-slate-200/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-purple-200/50">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                {t('methodPage.statsEnvironments')}
              </p>
              <p className="mt-3 bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-2xl font-bold text-transparent">
                {t('methodPage.statsEnvironmentsValue')}
              </p>
            </div>
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br from-purple-200/40 to-purple-300/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </div>
      </section>

      {/* Features - moved closer */}
      <section className="relative px-5 pb-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">{t('methodPage.corePrinciplesTitle')}</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {t('methodPage.corePrinciplesSubtitle')}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {methodFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-lg shadow-slate-200/50 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-200/50"
              >
                {/* Decorative gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-fuchsia-500/0 to-purple-500/0 transition-all duration-500 group-hover:from-indigo-500/5 group-hover:via-fuchsia-500/5 group-hover:to-purple-500/5" />
                
                {/* Icon */}
                <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 via-fuchsia-100 to-purple-100 shadow-md transition-all duration-500 group-hover:scale-110">
                  <feature.icon className="h-6 w-6 text-indigo-600 transition-all duration-500 group-hover:text-fuchsia-600" />
                </div>
                
                <h3 className="relative text-lg font-bold text-slate-900 transition-colors duration-300 group-hover:text-indigo-700">
                  {feature.title}
                </h3>
                {feature.subtitle && (
                  <p className="relative mt-1 text-xs font-medium text-indigo-600">
                    {feature.subtitle}
                  </p>
                )}
                <p className="relative mt-3 text-md leading-relaxed text-slate-600">
                  {feature.description}
                </p>
                
                {feature.benefits && (
                  <div className="relative mt-4 rounded-lg bg-indigo-50/50 p-3">
                    <p className="text-md leading-relaxed text-slate-700">
                      {feature.benefits}
                    </p>
                  </div>
                )}
                
                {feature.items && (
                  <div className="relative mt-4 space-y-2">
                    {feature.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-md text-slate-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                {feature.elements && (
                  <div className="relative mt-4 rounded-lg bg-fuchsia-50/50 p-3">
                    <p className="text-md leading-relaxed text-slate-700">
                      {feature.elements}
                    </p>
                  </div>
                )}
                
                {feature.detail && (
                  <p className="relative mt-4 text-md leading-relaxed text-slate-600">
                    {feature.detail}
                  </p>
                )}
                
                {feature.goal && (
                  <div className="relative mt-4 rounded-lg border border-indigo-200 bg-indigo-50/30 p-3">
                    <p className="text-xs font-medium leading-relaxed text-indigo-900">
                      {feature.goal}
                    </p>
                  </div>
                )}
                
                {/* Decorative corner accent */}
                <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br from-indigo-200/30 to-fuchsia-200/30 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process - made smaller */}
      <section className="relative px-5 pb-16">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-900 to-fuchsia-900 p-8 text-white shadow-xl shadow-slate-900/80 sm:p-10">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-fuchsia-600/20 animate-pulse" />
          
          {/* Decorative elements */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
          
          <div className="relative text-center">
            <div className="inline-block">
              <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur-sm">
                {t('methodPage.tagProcess')}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{t('methodPage.processTitle')}</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/80">
              {t('methodPage.processSubtitle')}
            </p>
          </div>
          
          <div className="relative mt-8 grid gap-6 sm:grid-cols-3">
            {processSteps.map((step, index) => (
              <div 
                key={step.title} 
                className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/20"
              >
                {/* Step number indicator */}
                <div className="absolute -left-2 top-6 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/30 bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/30 text-base font-bold text-white shadow-lg">
                  {index + 1}
                </div>
                
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 shadow-md transition-all duration-500 group-hover:scale-110 group-hover:border-white/40">
                  <step.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-white/90">
                  {step.detail}
                </p>
                
                {/* Hover effect gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-fuchsia-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-10" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-5 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-white via-indigo-50/50 to-fuchsia-50/50 p-10 text-center shadow-xl shadow-indigo-200/30 backdrop-blur-sm sm:p-12">
          {/* Decorative background elements */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-200/40 to-fuchsia-200/40 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-gradient-to-br from-purple-200/40 to-pink-200/40 blur-3xl" />
          
          <div className="relative">
            <h3 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {t('methodPage.ctaTitle')}
            </h3>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-700">
              {t('methodPage.ctaText')}
            </p>
            
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <a
                href="/contacto"
                className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-indigo-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/60"
              >
                <span className="relative z-10">{t('methodPage.ctaCall')}</span>
                <LuArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-fuchsia-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </a>
              <a
                href="/testimonials"
                className="group flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-700 shadow-md transition-all duration-300 hover:scale-105 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-lg"
              >
                <span>{t('methodPage.ctaReferences')}</span>
                <LuArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
            
            {/* Decorative checkmarks */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <LuCheckCircle2 className="h-4 w-4 text-indigo-600" />
                <span>{t('methodPage.personalizedApproach')}</span>
              </div>
              <div className="flex items-center gap-2">
                <LuCheckCircle2 className="h-4 w-4 text-fuchsia-600" />
                <span>{t('methodPage.provenMethodology')}</span>
              </div>
              <div className="flex items-center gap-2">
                <LuCheckCircle2 className="h-4 w-4 text-purple-600" />
                <span>{t('methodPage.measurableResults')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MethodBody;
