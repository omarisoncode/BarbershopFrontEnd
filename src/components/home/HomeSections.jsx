import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Play,
  Scissors,
  ShieldCheck,
  Sofa,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react';

import {
  EmptyState,
  ErrorState,
  GlassPanel,
  PremiumCard,
  PrimaryButton,
  SecondaryButton,
  SectionShell,
  SkeletonCard,
  StatusBadge,
  revealUpVariants,
  sectionViewport,
  sequentialReveal,
  staggerContainer,
} from './HomePrimitives';
import {
  FAQ_KEYS,
  GALLERY_MEDIA,
  HERO_TRUST_BADGES,
  HOME_SECTION_IDS,
  PROMISE_POINTS,
  REVIEW_KEYS,
} from './homeContent';
import { businessInfo, getBusinessValue } from '../../config/businessInfo';
import { localizeDigits } from '../../utils/localizeDigits';

void motion;

const iconMap = {
  scissors: Scissors,
  sparkles: Sparkles,
  shield: ShieldCheck,
  clock: Clock3,
  sofa: Sofa,
};

const renderArrow = (isRTL) => (
  <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
);

export function HeroSection({
  t,
  isRTL,
  onBookNow,
  onExploreServices,
}) {
  return (
    <section id={HOME_SECTION_IDS.hero} className='relative overflow-hidden pb-10 pt-4 sm:pb-16 sm:pt-8'>
      <div className='lux-section-shell'>
        <motion.div
          initial='hidden'
          animate='visible'
          variants={staggerContainer}
          className='lux-hero-stage relative overflow-hidden rounded-[2rem]'
        >
          <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22),rgba(255,255,255,0)_30%,rgba(91,58,45,0.05)_100%)]' />
          <div className='absolute -left-[12%] top-[12%] h-52 w-52 rounded-full bg-[#7a3a33]/8 blur-3xl dark:bg-[#7a3a33]/12' />
          <div className='absolute bottom-[6%] right-[8%] h-48 w-48 rounded-full bg-black/6 blur-3xl dark:bg-white/[0.05]' />
          <div className='absolute inset-y-0 left-0 w-[42%] bg-[linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0))] opacity-70 dark:hidden' />
          <div className='absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(90deg,rgba(7,7,7,0)_0%,rgba(7,7,7,0.18)_24%,rgba(7,7,7,0.62)_100%)] dark:block' />

          <div className='relative grid min-h-[auto] gap-5 sm:min-h-[72svh] lg:min-h-[78svh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10'>
            <div className='flex flex-col justify-center px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-14'>
              <motion.p variants={revealUpVariants} className='lux-kicker'>
                {t.homeHeroEyebrow}
              </motion.p>

              <motion.h1
                variants={revealUpVariants}
                className='mt-3 max-w-2xl font-display text-[2.2rem] font-semibold leading-[0.96] tracking-tight text-slate-950 sm:mt-4 sm:text-6xl lg:text-7xl dark:text-white'
              >
                <span className='block'>{t.homeHeroTitleLine1}</span>
                <span className='mt-2 block text-brand-gold/85'>{t.homeHeroTitleLine2}</span>
              </motion.h1>

              <motion.p variants={revealUpVariants} className='lux-copy mt-3 max-w-xl text-[14px] leading-7 sm:mt-6 sm:text-lg'>
                {t.homeHeroSubtitle}
              </motion.p>

              <motion.div
                variants={revealUpVariants}
                className='mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row'
              >
                <PrimaryButton type='button' onClick={onBookNow} className='w-full sm:min-w-[190px] sm:w-auto'>
                  {t.homeHeroPrimaryCta}
                  {renderArrow(isRTL)}
                </PrimaryButton>
                <SecondaryButton type='button' onClick={onExploreServices} className='w-full sm:min-w-[190px] sm:w-auto'>
                  <Play size={16} className='fill-current' />
                  {t.homeHeroSecondaryCta}
                </SecondaryButton>
              </motion.div>

              <motion.div
                variants={revealUpVariants}
                className='mt-5 flex items-center gap-3 border-t border-black/8 pt-4 text-sm text-slate-600 dark:border-white/10 dark:text-white/68 sm:mt-7'
              >
                <span className='h-1.5 w-1.5 rounded-full bg-[#7a3a33]' />
                <p className='max-w-lg leading-7'>
                  {t.homeHeroMediaPoint}
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className='mt-5 grid grid-cols-2 gap-3 sm:mt-8 lg:gap-4 2xl:grid-cols-4'
              >
                {HERO_TRUST_BADGES.map((badge, index) => {
                  const Icon = iconMap[badge.icon] || Sparkles;

                  return (
                    <motion.div
                      key={badge.titleKey}
                      variants={sequentialReveal}
                      custom={index}
                      className={`flex h-full rounded-[1.2rem] border border-black/8 bg-white/82 p-4 transition-transform duration-300 hover:-translate-y-0.5 sm:p-4.5 lg:p-5 dark:border-white/10 dark:bg-white/7 ${
                        index > 1 ? 'hidden md:block' : ''
                      }`}
                    >
                      <div className='flex flex-col items-start gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border border-brand-gold/18 bg-brand-gold/8 text-brand-gold'>
                          <Icon size={16} />
                        </div>
                        <div className='min-w-0'>
                          <p className='text-sm font-semibold leading-5 text-slate-900 dark:text-white sm:text-base sm:leading-6'>
                            {t[badge.titleKey]}
                          </p>
                          <p className='mt-1.5 text-xs leading-5 text-slate-500 dark:text-white/65 sm:text-sm sm:leading-6'>
                            {t[badge.textKey]}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            <div className='relative min-h-[240px] p-3 sm:min-h-[280px] sm:p-4 lg:min-h-full lg:p-5'>
              <div className='relative flex h-full items-end overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#15120d] p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.2)] sm:rounded-[1.9rem] sm:p-2'>
                <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.08),rgba(7,7,7,0.68))]' />
                <video
                  className='absolute inset-1.5 h-[calc(100%-0.75rem)] w-[calc(100%-0.75rem)] rounded-[1.25rem] object-cover sm:inset-2 sm:h-[calc(100%-1rem)] sm:w-[calc(100%-1rem)] sm:rounded-[1.55rem]'
                  src='/barber.mp4'
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload='metadata'
                />
                <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.4)_38%,rgba(5,5,5,0.88)_100%)]' />

                <motion.div
                  variants={revealUpVariants}
                  className='relative z-10 m-3 w-full max-w-[13rem] rounded-[1.2rem] border border-white/12 bg-[#15110f]/84 p-3.5 text-white shadow-[0_20px_48px_rgba(0,0,0,0.26)] sm:m-8 sm:max-w-xs sm:p-5'
                >
                  <p className='text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-gold'>
                    {t.homeHeroMediaBadge}
                  </p>
                  <h3 className='mt-2 text-lg font-semibold sm:text-2xl'>{t.homeHeroMediaTitle}</h3>
                  <p className='mt-2 hidden text-sm leading-7 text-white/70 sm:block'>{t.homeHeroMediaText}</p>
                  <div className='mt-3 flex items-center gap-3 text-xs text-white/80 sm:mt-6 sm:text-sm'>
                    <CheckCircle2 size={16} className='text-brand-gold' />
                    {t.homeHeroMediaPoint}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function ServicesPreviewSection({
  t,
  isRTL,
  state,
  items,
  onRetry,
  onBook,
  onOpenService,
  onViewAll,
}) {
  return (
    <SectionShell
      id={HOME_SECTION_IDS.services}
      kicker={t.homeServicesKicker}
      title={t.homeServicesTitle}
      subtitle={t.homeServicesSubtitle}
      actions={
        <div className='flex items-center gap-3'>
          <SecondaryButton type='button' onClick={onViewAll}>
            {t.homeViewCatalogCta}
            {renderArrow(isRTL)}
          </SecondaryButton>
        </div>
      }
      className='lux-section-band-soft pt-10'
    >
      <AnimatePresence mode='wait'>
        {state === 'loading' ? (
          <motion.div
            key='services-loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='grid gap-5 md:grid-cols-2 xl:grid-cols-4'
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} className='min-h-[420px]' />
            ))}
          </motion.div>
        ) : null}

        {state === 'error' ? (
          <motion.div key='services-error' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState
              title={t.homeServicesErrorTitle}
              description={t.homeServicesErrorText}
              actionLabel={t.homeRetryCta}
              onAction={onRetry}
            />
          </motion.div>
        ) : null}

        {state === 'empty' ? (
          <motion.div key='services-empty' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState
              title={t.homeServicesEmptyTitle}
              description={t.homeServicesEmptyText}
              actionLabel={t.homeBookGeneralCta}
              onAction={() => onBook()}
            />
          </motion.div>
        ) : null}

        {state === 'data' || state === 'fallback' ? (
          <motion.div
            key={`services-${state}`}
            initial='hidden'
            whileInView='visible'
            viewport={sectionViewport}
            variants={staggerContainer}
            className='grid gap-5 md:grid-cols-2 xl:grid-cols-4'
          >
            {items.map((service, index) => (
              <motion.article
                key={service.key}
                custom={index}
                variants={sequentialReveal}
                className='lux-elevate-hover group flex h-full min-h-[388px] flex-col overflow-hidden rounded-[1.45rem] border border-black/8 bg-white/92 shadow-[0_18px_44px_rgba(15,23,42,0.06)] transition-all duration-300 hover:border-brand-gold/20 sm:rounded-[1.8rem] dark:border-white/10 dark:bg-[#15120f]'
              >
                <button
                  type='button'
                  onClick={() => onOpenService(service)}
                  className='relative block overflow-hidden p-2 pb-0 text-left sm:p-2.5 sm:pb-0'
                >
                  <div className='h-48 overflow-hidden rounded-[1.15rem] border border-black/6 bg-[#15120f] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] sm:h-52 sm:rounded-[1.4rem] sm:p-2 dark:border-white/10'>
                    <img
                      src={service.image}
                      alt={service.title}
                      className='h-full w-full rounded-[0.95rem] object-cover object-center transition-transform duration-500 group-hover:scale-[1.035] sm:rounded-[1.15rem]'
                      loading='lazy'
                    />
                  </div>
                  <div className='absolute inset-x-2 bottom-0 top-2 rounded-[1.15rem] bg-[linear-gradient(180deg,rgba(7,7,7,0.02)_0%,rgba(7,7,7,0.14)_42%,rgba(7,7,7,0.8)_100%)] sm:inset-x-2.5 sm:top-2.5 sm:rounded-[1.4rem]' />
                  <div className='absolute inset-x-5 bottom-3 flex items-end justify-between gap-2 sm:inset-x-6 sm:bottom-4 sm:gap-3'>
                    <StatusBadge tone='accent'>
                      {service.tag}
                    </StatusBadge>
                    <div className='rounded-full border border-white/15 bg-[#15110f]/78 px-2.5 py-1 text-[11px] font-semibold text-white sm:px-3 sm:text-xs'>
                      {service.durationLabel}
                    </div>
                  </div>
                </button>

                <div className='flex flex-1 flex-col p-4 pt-3 sm:p-4.5 sm:pt-3.5'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='min-w-0 flex-1'>
                      <p className='text-[11px] uppercase tracking-[0.2em] text-brand-gold'>
                        {service.categoryLabel}
                      </p>
                      <h3 className='mt-2 min-h-[40px] font-display text-[1.08rem] font-semibold leading-7 text-slate-900 dark:text-white sm:min-h-[48px] sm:text-[1.35rem] sm:leading-7'>
                        {service.title}
                      </h3>
                      <p
                        className={`mt-2 text-[13px] font-semibold uppercase tracking-[0.12em] ${
                          service.isFallback
                            ? 'text-slate-500 dark:text-white/65'
                            : 'text-brand-gold/85'
                        }`}
                      >
                        {service.priceDisplay}
                      </p>
                    </div>
                    <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/18 bg-brand-gold/8 text-brand-gold'>
                      <Scissors size={18} />
                    </div>
                  </div>

                  <p className='mt-2.5 min-h-[44px] text-[13px] leading-6 text-slate-600 dark:text-white/70 sm:min-h-[52px] sm:text-sm'>
                    {service.description}
                  </p>

                  {service.isFallback && service.priceNote ? (
                    <p className='mt-2 text-xs leading-6 text-slate-500 dark:text-white/55'>
                      {service.priceNote}
                    </p>
                  ) : null}

                  <div className='mt-3 flex flex-wrap gap-2 sm:mt-3.5'>
                    {service.previewFeatures.slice(0, 2).map((feature) => (
                      <span
                        key={feature}
                        className='rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-white/65'
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className='mt-auto flex items-center justify-between gap-3 pt-4 sm:pt-4.5'>
                    <button
                      type='button'
                      onClick={() => onOpenService(service)}
                      className='text-[13px] font-semibold text-slate-500 transition hover:text-brand-gold dark:text-white/60 dark:hover:text-brand-gold sm:text-sm'
                    >
                      {t.homeLearnMoreCta}
                    </button>
                    <PrimaryButton
                      type='button'
                      onClick={() => onBook(service.isFallback ? null : service)}
                      className='px-3 py-2 text-[11px] uppercase tracking-[0.14em] sm:px-4 sm:py-2.5 sm:text-xs sm:tracking-[0.16em]'
                    >
                      {t.homeServiceCardCta}
                      {renderArrow(isRTL)}
                    </PrimaryButton>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionShell>
  );
}

export function PromiseSection({ t, isRTL, onBook }) {
  return (
    <SectionShell
      id={HOME_SECTION_IDS.about}
      kicker={t.homePromiseKicker}
      title={t.homePromiseTitle}
      subtitle={t.homePromiseSubtitle}
    >
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={sectionViewport}
        variants={staggerContainer}
        className='grid gap-4 sm:gap-6 xl:grid-cols-[1.05fr_0.95fr]'
      >
        <motion.div variants={revealUpVariants}>
          <GlassPanel className='overflow-hidden p-0'>
            <div className='relative min-h-[220px] overflow-hidden sm:min-h-[320px]'>
              <img
                src='https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=80'
                alt={t.homePromiseImageAlt}
                className='h-full w-full object-cover'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.08)_0%,rgba(7,7,7,0.68)_100%)]' />
            </div>

            <div className='flex flex-col justify-between p-5 sm:p-8'>
              <div>
                <StatusBadge tone='accent'>{t.homePromiseBadge}</StatusBadge>
                <h3 className='mt-3 text-[1.9rem] font-semibold text-slate-900 dark:text-white sm:mt-4 sm:text-3xl'>
                  {t.homePromiseCardTitle}
                </h3>
                <p className='lux-copy mt-3 text-sm sm:mt-4 sm:text-base'>{t.homePromiseCardText}</p>
              </div>

              <div className='mt-5 grid gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-2'>
                {PROMISE_POINTS.slice(0, 2).map((point) => {
                  const Icon = iconMap[point.icon] || Sparkles;

                  return (
                    <div
                      key={point.titleKey}
                      className='flex h-full flex-col rounded-[1.2rem] border border-black/8 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/5 sm:rounded-[1.5rem] sm:p-5'
                    >
                      <div className='flex h-10 w-10 items-center justify-center rounded-xl border border-brand-gold/18 bg-brand-gold/8 text-brand-gold sm:h-12 sm:w-12 sm:rounded-2xl'>
                        <Icon size={16} />
                      </div>
                      <p className='mt-3 text-base font-semibold leading-6 text-slate-900 dark:text-white sm:mt-4 sm:text-xl sm:leading-7'>
                        {t[point.titleKey]}
                      </p>
                      <p className='mt-2 text-[13px] leading-6 text-slate-600 dark:text-white/70 sm:mt-3 sm:text-sm sm:leading-7'>
                        {t[point.textKey]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div variants={revealUpVariants}>
          <GlassPanel className='lux-anchor-surface h-full p-5 sm:p-8'>
            <div className='rounded-[1.35rem] border border-brand-gold/18 bg-brand-gold/8 p-4 text-brand-gold sm:rounded-[1.7rem] sm:p-5'>
              <CalendarDays size={22} />
            </div>
            <h3 className='mt-4 text-[1.9rem] font-semibold text-white sm:mt-6 sm:text-3xl'>
              {t.homePromiseCtaTitle}
            </h3>
            <p className='mt-3 text-sm leading-7 text-white/74 sm:mt-4 sm:text-base'>{t.homePromiseCtaText}</p>

            <div className='mt-5 space-y-3 sm:mt-8 sm:space-y-4'>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className='flex items-start gap-3 rounded-[1.2rem] border border-white/10 bg-white/[0.04] p-3.5 sm:rounded-[1.4rem] sm:p-4'
                >
                  <CheckCircle2 size={18} className='mt-1 shrink-0 text-brand-gold' />
                  <div>
                    <p className='text-[13px] font-semibold text-white sm:text-sm'>
                      {t[`homePromiseChecklist${item}Title`]}
                    </p>
                    <p className='mt-1 text-[13px] leading-6 text-white/68 sm:text-sm sm:leading-7'>
                      {t[`homePromiseChecklist${item}Text`]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <PrimaryButton type='button' onClick={onBook} className='mt-5 w-full sm:mt-8'>
              {t.homePromisePrimaryCta}
              {renderArrow(isRTL)}
            </PrimaryButton>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}

export function BarbersPreviewSection({
  t,
  isRTL,
  state,
  items,
  onRetry,
  onBook,
  onViewAll,
}) {
  return (
    <SectionShell
      id={HOME_SECTION_IDS.barbers}
      kicker={t.homeBarbersKicker}
      title={t.homeBarbersTitle}
      subtitle={t.homeBarbersSubtitle}
      actions={
        <SecondaryButton type='button' onClick={onViewAll}>
          {t.homeMeetTeamCta}
          {renderArrow(isRTL)}
        </SecondaryButton>
      }
      className='lux-section-band-light pt-8 sm:pt-10'
    >
      <AnimatePresence mode='wait'>
        {state === 'loading' ? (
          <motion.div
            key='barbers-loading'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='grid gap-5 md:grid-cols-2 xl:grid-cols-4'
          >
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={index} className='min-h-[470px]' />
            ))}
          </motion.div>
        ) : null}

        {state === 'error' ? (
          <motion.div key='barbers-error' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ErrorState
              title={t.homeBarbersErrorTitle}
              description={t.homeBarbersErrorText}
              actionLabel={t.homeRetryCta}
              onAction={onRetry}
            />
          </motion.div>
        ) : null}

        {state === 'empty' ? (
          <motion.div key='barbers-empty' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <EmptyState
              title={t.homeBarbersEmptyTitle}
              description={t.homeBarbersEmptyText}
              actionLabel={t.homeBookGeneralCta}
              onAction={() => onBook(null)}
            />
          </motion.div>
        ) : null}

        {state === 'data' || state === 'fallback' ? (
          <motion.div
            key={`barbers-${state}`}
            initial='hidden'
            whileInView='visible'
            viewport={sectionViewport}
            variants={staggerContainer}
            className='grid gap-5 md:grid-cols-2 xl:grid-cols-4'
          >
            {items.map((barber, index) => (
              <motion.article key={barber.key} custom={index} variants={sequentialReveal}>
                <PremiumCard className='lux-elevate-hover group flex h-full flex-col overflow-hidden bg-white/84 p-4 sm:p-5 dark:bg-white/6'>
                  <div className='overflow-hidden rounded-[1.65rem] border border-black/6 bg-[#15120f] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] dark:border-white/10'>
                    <img
                      src={barber.image}
                      alt={barber.title}
                      loading='lazy'
                      className='aspect-[4/5] w-full rounded-[1.35rem] object-cover object-[center_18%] transition-transform duration-500 group-hover:scale-[1.025]'
                    />
                  </div>

                  <div className='flex flex-1 flex-col justify-between'>
                    <div>
                      <div className='mt-5 flex items-start justify-between gap-4'>
                        <div className='min-w-0'>
                          <p className='text-[11px] uppercase tracking-[0.2em] text-brand-gold'>
                            {t.homeBarberCardEyebrow || t.homeMeetTeamCta}
                          </p>
                          <h3 className='mt-2 font-display text-[1.8rem] font-semibold text-slate-900 dark:text-white'>
                            {barber.title}
                          </h3>
                          <p className='mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold'>
                            {barber.experienceYears > 0
                              ? `${barber.experienceYears} ${t.homeYearsShort}`
                              : t.homeFeaturedBadge}
                          </p>
                        </div>
                        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/18 bg-brand-gold/8 text-brand-gold'>
                          <UserRound size={18} />
                        </div>
                      </div>

                      <p className='mt-4 text-[13px] leading-6 text-slate-600 dark:text-white/70 sm:text-sm sm:leading-7'>
                        {barber.bio}
                      </p>
                      <div className='mt-4 flex flex-wrap gap-2'>
                        {barber.specialties.slice(0, 3).map((specialty) => (
                          <span
                            key={specialty}
                            className='rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-white/65'
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    <PrimaryButton
                      type='button'
                      onClick={() => onBook(barber.isFallback ? null : barber.bookingService)}
                      className='mt-6 w-full'
                    >
                      {`${t.homeBarberCardCta} ${barber.title}`}
                      {renderArrow(isRTL)}
                    </PrimaryButton>
                  </div>
                </PremiumCard>
              </motion.article>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionShell>
  );
}

export function GallerySection({ t }) {
  const galleryItems = GALLERY_MEDIA.slice(0, 3);

  return (
    <SectionShell
      id={HOME_SECTION_IDS.gallery}
      kicker={t.homeGalleryKicker}
      title={t.homeGalleryTitle}
      subtitle={t.homeGallerySubtitle}
      align='center'
      className='lux-section-band-soft pt-10 pb-8 sm:pt-12'
    >
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={sectionViewport}
        variants={staggerContainer}
        className='grid gap-4 md:grid-cols-12'
      >
        {galleryItems.map((item, index) => {
          const large = index === 0;
          const classes = large
            ? 'md:col-span-7 md:row-span-2'
            : index === 4
              ? 'md:col-span-5'
              : 'md:col-span-5';

          return (
            <motion.div key={item.key} custom={index} variants={sequentialReveal} className={classes}>
              <GlassPanel className='group relative h-full overflow-hidden p-2 sm:p-2.5'>
                <div
                  className={`relative overflow-hidden rounded-[1.35rem] border border-black/6 bg-[#13110e] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] dark:border-white/10 ${
                    large ? 'aspect-[16/11]' : 'aspect-[4/3]'
                  }`}
                >
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.015] group-hover:-translate-y-0.5'
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload='metadata'
                    />
                  ) : (
                    <img
                      src={item.src}
                      alt={t[item.titleKey]}
                      loading='lazy'
                      className='h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03] group-hover:-translate-y-0.5'
                    />
                  )}
                  <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.04)_0%,rgba(7,7,7,0.18)_45%,rgba(7,7,7,0.82)_100%)]' />
                    <div className='absolute inset-x-5 bottom-5 max-w-[26rem]'>
                      <p className='text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-gold'>{t.homeGalleryBadge}</p>
                      <h3 className={`mt-2 font-display font-semibold text-white ${large ? 'text-[1.7rem] sm:text-[2.2rem]' : 'text-xl sm:text-2xl'}`}>{t[item.titleKey]}</h3>
                      <p className={`mt-2 leading-6 text-white/70 ${large ? 'max-w-xl text-sm sm:text-[15px]' : 'max-w-sm text-[13px] sm:text-sm'}`}>{t[item.captionKey]}</p>
                    </div>
                  </div>
                </GlassPanel>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionShell>
  );
}

const ReviewCard = ({ t, index }) => (
  <motion.div custom={index} variants={sequentialReveal}>
    <PremiumCard className='lux-elevate-hover h-full p-6'>
      <div className='flex items-center gap-1 text-brand-gold'>
        {Array.from({ length: 5 }).map((_, starIndex) => (
          <Star key={starIndex} size={15} className='fill-current' />
        ))}
      </div>
      <p className='mt-5 text-base leading-8 text-slate-700 dark:text-white/75'>
        "{t[`homeReview${index}Quote`]}"
      </p>
      <div className='mt-6 flex items-center gap-4'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/18 bg-brand-gold/8 text-brand-gold'>
          <UserRound size={18} />
        </div>
        <div>
          <p className='font-semibold text-slate-900 dark:text-white'>{t[`homeReview${index}Name`]}</p>
          <p className='text-sm text-slate-500 dark:text-white/60'>{t[`homeReview${index}Role`]}</p>
        </div>
      </div>
    </PremiumCard>
  </motion.div>
);

export function ReviewsSection({ t }) {
  return (
    <SectionShell
      id={HOME_SECTION_IDS.reviews}
      kicker={t.homeReviewsKicker}
      title={t.homeReviewsTitle}
      subtitle={t.homeReviewsSubtitle}
      className='lux-section-band-light pt-10 pb-8 sm:pt-12'
    >
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={sectionViewport}
        variants={staggerContainer}
        className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'
      >
        {REVIEW_KEYS.slice(0, 3).map((key, index) => (
          <ReviewCard key={key} t={t} index={key} custom={index} />
        ))}
      </motion.div>
    </SectionShell>
  );
}

const FaqItem = ({ item, isOpen, onToggle }) => (
  <motion.div variants={revealUpVariants}>
    <GlassPanel className='overflow-hidden p-0'>
      <button
        type='button'
        onClick={onToggle}
        className='flex w-full items-center justify-between gap-4 px-5 py-5 text-left'
      >
        <span className='text-base font-semibold text-slate-900 dark:text-white'>{item.question}</span>
        <span className='text-brand-gold'>{isOpen ? '-' : '+'}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className='overflow-hidden'
          >
            <div className='px-5 pb-5 text-sm leading-7 text-slate-600 dark:text-white/70'>
              {item.answer}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </GlassPanel>
  </motion.div>
);

export function FAQSection({ t }) {
  const [openIndex, setOpenIndex] = useState(-1);

  const faqItems = useMemo(
    () =>
      FAQ_KEYS.slice(0, 4).map((item) => ({
        question: t[`homeFaq${item}Question`],
        answer: t[`homeFaq${item}Answer`],
      })),
    [t],
  );

  return (
    <SectionShell
      id={HOME_SECTION_IDS.faq}
      kicker={t.homeFaqKicker}
      title={t.homeFaqTitle}
      subtitle={t.homeFaqSubtitle}
      className='lux-section-band-soft pt-10 pb-8 sm:pt-12'
    >
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={sectionViewport}
        variants={staggerContainer}
        className='grid gap-4'
      >
        {faqItems.map((item, index) => (
          <FaqItem
            key={item.question}
            item={item}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex((current) => (current === index ? -1 : index))}
          />
        ))}
      </motion.div>
    </SectionShell>
  );
}

const LocationInfoCard = ({ icon, label, value, note, href }) => {
  const Icon = icon;

  return (
    <div className='rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5'>
      <div className='flex items-start gap-3'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/18 bg-brand-gold/8 text-brand-gold'>
          <Icon size={18} />
        </div>
        <div>
          <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>{label}</p>
          {href ? (
            <a
              href={href}
              className='mt-2 inline-flex text-base font-semibold text-slate-900 transition hover:text-brand-gold dark:text-white'
            >
              {value}
            </a>
          ) : (
            <p className='mt-2 text-base font-semibold text-slate-900 dark:text-white'>{value}</p>
          )}
          {note ? <p className='mt-2 text-sm leading-7 text-slate-600 dark:text-white/70'>{note}</p> : null}
        </div>
      </div>
    </div>
  );
};

export function LocationSection({
  t,
  isRTL,
  onBook,
  titleOverride = '',
  subtitleOverride = '',
  kickerOverride = '',
}) {
  const lang = isRTL ? 'ar' : 'en';
  const locationAddress = getBusinessValue(businessInfo.address, lang) || t.locationAddress;
  const locationPhone = localizeDigits(
    getBusinessValue(businessInfo.phoneDisplay, lang) || t.locationPhone,
    lang,
  );
  const locationPhoneHref = businessInfo.phoneHref || t.locationPhoneHref;
  const locationEmail = getBusinessValue(businessInfo.email, lang) || t.locationEmail;
  const locationEmailHref = businessInfo.emailHref || t.locationEmailHref;
  const locationHours = getBusinessValue(businessInfo.hours, lang) || t.locationHours;
  const locationParkingValue =
    getBusinessValue(businessInfo.parkingValue, lang) || t.locationParkingValue;
  const locationWhatsappHref = businessInfo.whatsappHref || t.locationWhatsappHref;

  return (
    <SectionShell
      id={HOME_SECTION_IDS.location}
      kicker={kickerOverride || t.homeLocationKicker}
      title={titleOverride || t.homeLocationTitle}
      subtitle={subtitleOverride || t.homeLocationSubtitle}
      className='lux-section-band-light pt-10 pb-20 sm:pt-12'
    >
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={sectionViewport}
        variants={staggerContainer}
        className='grid gap-6'
      >
        <motion.div variants={revealUpVariants}>
          <GlassPanel className='h-full p-6 sm:p-8'>
            <StatusBadge tone='accent'>{t.locationTag}</StatusBadge>
            <h3 className='mt-5 text-3xl font-semibold text-slate-900 dark:text-white'>
              {locationAddress}
            </h3>
            <p className='lux-copy mt-4'>{t.locationDescription}</p>

            <div className='mt-8 grid gap-4 md:grid-cols-2'>
              <LocationInfoCard
                icon={Phone}
                label={t.locationPhoneTitle}
                value={locationPhone}
                note={t.locationPhoneNote}
                href={locationPhoneHref}
              />
              <LocationInfoCard
                icon={Clock3}
                label={t.locationHoursTitle}
                value={locationHours}
                note={t.locationHoursNote}
              />
              <LocationInfoCard
                icon={MapPin}
                label={t.locationParkingTitle}
                value={locationParkingValue}
                note={t.locationParkingNote}
              />
              <LocationInfoCard
                icon={MessageCircle}
                label={t.locationEmailTitle}
                value={locationEmail}
                note={t.locationEmailNote}
                href={locationEmailHref}
              />
            </div>

            <div className='mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap'>
              <PrimaryButton as='a' href={locationPhoneHref} className='w-full sm:min-w-[160px] sm:w-auto'>
                <Phone size={16} />
                {t.homeLocationCallCta}
              </PrimaryButton>
              <SecondaryButton as='a' href={locationWhatsappHref} className='w-full sm:min-w-[160px] sm:w-auto'>
                <MessageCircle size={16} />
                {t.homeLocationWhatsappCta}
              </SecondaryButton>
              <div className='pt-1 text-sm font-semibold text-slate-500 dark:text-white/60 sm:flex-basis-full sm:pt-0'>
                <button
                  type='button'
                  onClick={onBook}
                  className='inline-flex items-center gap-2 transition hover:text-brand-gold'
                >
                  {t.homeBookGeneralCta}
                  {renderArrow(isRTL)}
                </button>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}

export { HOME_SECTION_IDS };
