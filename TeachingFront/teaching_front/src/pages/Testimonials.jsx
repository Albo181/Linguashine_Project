import React from 'react';
import { useTranslation } from 'react-i18next';

const StarRow = ({ count }) => (
  <div className="flex items-center gap-1 text-amber-400 mb-1">
    {Array.from({ length: count }).map((_, i) => (
      <span key={i} aria-hidden="true">★</span>
    ))}
    <span className="ml-1 text-xs font-semibold text-amber-100/80">{count}.0</span>
  </div>
);

const Testimonials = () => {
  const { t } = useTranslation();
  const testimonials = t('testimonialsPage.testimonials', { returnObjects: true });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white pt-24 sm:pt-28 md:pt-32 px-4 sm:px-6 md:px-8 pb-16">
      {/* Soft background accents */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-32 left-0 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.35em] text-blue-200/80 uppercase mb-3">
            {t('testimonialsPage.tag')}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-white to-purple-200">
            {t('testimonialsPage.title')}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-200/90 max-w-2xl mx-auto">
            {t('testimonialsPage.intro')}
          </p>
        </div>

        {/* Summary strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 sm:mb-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 text-xl font-semibold">
              ★
            </div>
            <div>
              <div className="text-lg font-semibold">
                {t('testimonialsPage.summaryOverall')}
              </div>
              <div className="text-xs text-slate-200/80">
                {t('testimonialsPage.summaryOverallSub')}
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 text-xl font-semibold">
              ✓
            </div>
            <div>
              <div className="text-lg font-semibold">
                {t('testimonialsPage.summaryExams')}
              </div>
              <div className="text-xs text-slate-200/80">
                {t('testimonialsPage.summaryExamsSub')}
              </div>
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3 backdrop-blur-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300 text-xl font-semibold">
              ⌛
            </div>
            <div>
              <div className="text-lg font-semibold">
                {t('testimonialsPage.summaryLongTerm')}
              </div>
              <div className="text-xs text-slate-200/80">
                {t('testimonialsPage.summaryLongTermSub')}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name + index}
              className="bg-white/6 border border-white/12 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-[0_18px_45px_rgba(15,23,42,0.45)] relative overflow-hidden"
            >
              {/* Decorative corner gradient */}
              <div className="pointer-events-none absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-500/40 via-purple-500/40 to-pink-500/40 blur-3xl opacity-60" />

              <div className="relative">
                {/* Header row: name + metadata */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-semibold text-white">
                      {testimonial.name}
                    </h2>
                    {testimonial.meta && (
                      <p className="text-xs text-slate-200/80 mt-0.5">
                        {testimonial.meta}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <StarRow count={testimonial.stars} />
                    <p className="text-[11px] text-slate-300/80">{testimonial.timeAgo}</p>
                  </div>
                </div>

                {/* Main quote */}
                {testimonial.text && (
                  <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-100/95">
                    "{testimonial.text}"
                  </p>
                )}
                {testimonial.extra && (
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-200/90">
                    {testimonial.extra}
                  </p>
                )}

                {/* Tags line */}
                {testimonial.tags && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {testimonial.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Note about translation */}
                {testimonial.note && (
                  <p className="mt-2 text-[11px] italic text-slate-300/80">
                    {testimonial.note}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Closing line */}
        <div className="mt-10 text-center text-xs sm:text-sm text-slate-300/80 max-w-2xl mx-auto">
          {t('testimonialsPage.footerNote')}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;


