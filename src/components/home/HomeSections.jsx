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
    <section id={HOME_SECTION_IDS.hero} className='relative overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-8'>
      <div className='lux-section-shell'>
        <motion.div
          initial='hidden'
          animate='visible'
          variants={staggerContainer}
          className='relative overflow-hidden rounded-[2rem] border border-black/10 bg-[#f3ede2] shadow-[0_28px_90px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-[#090807]'
        >
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.26),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(212,175,55,0.14),transparent_32%)]' />
          <div className='absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(90deg,rgba(7,7,7,0)_0%,rgba(7,7,7,0.22)_25%,rgba(7,7,7,0.66)_100%)] dark:block' />

          <div className='relative grid min-h-[66svh] gap-6 sm:min-h-[72svh] lg:min-h-[78svh] lg:grid-cols-[1.05fr_0.95fr] lg:gap-10'>
            <div className='flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14'>
              <motion.p variants={revealUpVariants} className='lux-kicker'>
                {t.homeHeroEyebrow}
              </motion.p>

              <motion.h1
                variants={revealUpVariants}
                className='mt-4 max-w-2xl font-display text-[2.85rem] font-semibold leading-[0.94] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white'
              >
                <span className='block'>{t.homeHeroTitleLine1}</span>
                <span className='mt-2 block text-brand-gold'>{t.homeHeroTitleLine2}</span>
              </motion.h1>

              <motion.p variants={revealUpVariants} className='lux-copy mt-4 max-w-xl text-[15px] sm:mt-6 sm:text-lg'>
                {t.homeHeroSubtitle}
              </motion.p>

              <motion.div
                variants={revealUpVariants}
                className='mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row'
              >
                <PrimaryButton type='button' onClick={onBookNow} className='min-w-[190px]'>
                  {t.homeHeroPrimaryCta}
                  {renderArrow(isRTL)}
                </PrimaryButton>
                <SecondaryButton type='button' onClick={onExploreServices} className='min-w-[190px]'>
                  <Play size={16} className='fill-current' />
                  {t.homeHeroSecondaryCta}
                </SecondaryButton>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                className='mt-6 grid grid-cols-2 gap-3 sm:mt-8 lg:grid-cols-4 lg:gap-4'
              >
                {HERO_TRUST_BADGES.map((badge, index) => {
                  const Icon = iconMap[badge.icon] || Sparkles;

                  return (
                    <motion.div
                      key={badge.titleKey}
                      variants={sequentialReveal}
                      custom={index}
                      className={`rounded-[1.2rem] border border-black/8 bg-white/58 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-white/6 ${
                        index > 1 ? 'hidden lg:block' : ''
                      }`}
                    >
                      <div className='flex flex-col items-start gap-3 sm:flex-row'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] border border-brand-gold/25 bg-brand-gold/12 text-brand-gold'>
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

            <div className='relative flex min-h-[240px] items-end overflow-hidden sm:min-h-[280px] lg:min-h-full'>
              <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_18%,rgba(212,175,55,0.36),transparent_28%),linear-gradient(180deg,rgba(7,7,7,0.12),rgba(7,7,7,0.72))]' />
              <video
                className='absolute inset-0 h-full w-full object-cover'
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
                className='relative z-10 m-4 w-full max-w-[15rem] rounded-[1.35rem] border border-white/12 bg-black/42 p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:m-8 sm:max-w-xs sm:p-5'
              >
                <p className='text-[10px] font-semibold uppercase tracking-[0.26em] text-brand-gold'>
                  {t.homeHeroMediaBadge}
                </p>
                <h3 className='mt-2.5 text-xl font-semibold sm:text-2xl'>{t.homeHeroMediaTitle}</h3>
                <p className='mt-2 hidden text-sm leading-7 text-white/70 sm:block'>{t.homeHeroMediaText}</p>
                <div className='mt-4 flex items-center gap-3 text-sm text-white/80 sm:mt-6'>
                  <CheckCircle2 size={16} className='text-brand-gold' />
                  {t.homeHeroMediaPoint}
                </div>
              </motion.div>
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
      className='pt-10'
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
                className='group flex h-full flex-col overflow-hidden rounded-[1.8rem] border border-black/8 bg-white/70 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-gold/30 hover:shadow-[0_30px_90px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-white/6'
              >
                <button
                  type='button'
                  onClick={() => onOpenService(service)}
                  className='relative block overflow-hidden text-left'
                >
                  <div className='aspect-[5/4] overflow-hidden'>
                    <img
                      src={service.image}
                      alt={service.title}
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]'
                      loading='lazy'
                    />
                  </div>
                  <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.02)_0%,rgba(7,7,7,0.14)_45%,rgba(7,7,7,0.72)_100%)]' />
                  <div className='absolute inset-x-4 bottom-4 flex items-end justify-between gap-3'>
                    <StatusBadge tone='accent' className='backdrop-blur-xl'>
                      {service.tag}
                    </StatusBadge>
                    <div className='rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xl'>
                      {service.durationLabel}
                    </div>
                  </div>
                </button>

                <div className='flex flex-1 flex-col p-4.5 sm:p-5'>
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='text-xs uppercase tracking-[0.18em] text-brand-gold'>
                        {service.categoryLabel}
                      </p>
                      <h3 className='mt-2 text-lg font-semibold text-slate-900 dark:text-white sm:text-xl'>
                        {service.title}
                      </h3>
                    </div>
                    <p
                      className={`text-sm font-semibold ${
                        service.isFallback
                          ? 'text-slate-500 dark:text-white/65'
                          : 'text-brand-gold'
                      }`}
                    >
                      {service.priceDisplay}
                    </p>
                  </div>

                  <p className='mt-3 min-h-[56px] text-sm leading-6 text-slate-600 dark:text-white/70'>
                    {service.description}
                  </p>

                  {service.isFallback && service.priceNote ? (
                    <p className='mt-2 text-xs leading-6 text-slate-500 dark:text-white/55'>
                      {service.priceNote}
                    </p>
                  ) : null}

                  <div className='mt-4 flex flex-wrap gap-2'>
                    {service.previewFeatures.slice(0, 2).map((feature) => (
                      <span
                        key={feature}
                        className='rounded-full border border-black/8 bg-black/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-white/65'
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className='mt-6 flex items-center justify-between gap-3'>
                    <button
                      type='button'
                      onClick={() => onOpenService(service)}
                      className='text-sm font-semibold text-slate-500 transition hover:text-brand-gold dark:text-white/60 dark:hover:text-brand-gold'
                    >
                      {t.homeLearnMoreCta}
                    </button>
                    <PrimaryButton
                      type='button'
                      onClick={() => onBook(service.isFallback ? null : service)}
                      className='px-4 py-2.5 text-xs uppercase tracking-[0.16em]'
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
        className='grid gap-6 xl:grid-cols-[1.05fr_0.95fr]'
      >
        <motion.div variants={revealUpVariants}>
          <GlassPanel className='grid h-full gap-6 overflow-hidden p-0 lg:grid-cols-[0.95fr_1.05fr]'>
            <div className='relative min-h-[320px] overflow-hidden'>
              <img
                src='https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=80'
                alt={t.homePromiseImageAlt}
                className='h-full w-full object-cover'
                loading='lazy'
              />
              <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.08)_0%,rgba(7,7,7,0.68)_100%)]' />
            </div>

            <div className='flex flex-col justify-between p-6 sm:p-8'>
              <div>
                <StatusBadge tone='accent'>{t.homePromiseBadge}</StatusBadge>
                <h3 className='mt-4 text-3xl font-semibold text-slate-900 dark:text-white'>
                  {t.homePromiseCardTitle}
                </h3>
                <p className='lux-copy mt-4'>{t.homePromiseCardText}</p>
              </div>

              <div className='mt-8 grid gap-4 2xl:grid-cols-2'>
                {PROMISE_POINTS.map((point) => {
                  const Icon = iconMap[point.icon] || Sparkles;

                  return (
                    <div
                      key={point.titleKey}
                      className='flex h-full flex-col rounded-[1.5rem] border border-black/8 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/5'
                    >
                      <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/12 text-brand-gold'>
                        <Icon size={18} />
                      </div>
                      <p className='mt-4 text-lg font-semibold leading-7 text-slate-900 dark:text-white sm:text-xl'>
                        {t[point.titleKey]}
                      </p>
                      <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/70'>
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
          <GlassPanel className='h-full p-6 sm:p-8'>
            <div className='rounded-[1.7rem] border border-brand-gold/25 bg-brand-gold/10 p-5 text-brand-gold'>
              <CalendarDays size={22} />
            </div>
            <h3 className='mt-6 text-3xl font-semibold text-slate-900 dark:text-white'>
              {t.homePromiseCtaTitle}
            </h3>
            <p className='lux-copy mt-4'>{t.homePromiseCtaText}</p>

            <div className='mt-8 space-y-4'>
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className='flex items-start gap-3 rounded-[1.4rem] border border-black/8 bg-black/[0.03] p-4 dark:border-white/10 dark:bg-white/5'
                >
                  <CheckCircle2 size={18} className='mt-1 shrink-0 text-brand-gold' />
                  <div>
                    <p className='text-sm font-semibold text-slate-900 dark:text-white'>
                      {t[`homePromiseChecklist${item}Title`]}
                    </p>
                    <p className='mt-1 text-sm leading-7 text-slate-600 dark:text-white/70'>
                      {t[`homePromiseChecklist${item}Text`]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <PrimaryButton type='button' onClick={onBook} className='mt-8 w-full'>
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
      className='pt-8 sm:pt-10'
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
                <PremiumCard className='group h-full overflow-hidden p-0'>
                  <div className='relative min-h-[320px] overflow-hidden'>
                    <img
                      src={barber.image}
                      alt={barber.title}
                      loading='lazy'
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]'
                    />
                    <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.1)_0%,rgba(7,7,7,0.22)_36%,rgba(7,7,7,0.82)_100%)]' />
                    <div className='absolute inset-x-4 bottom-4 flex items-center justify-between gap-3'>
                      <StatusBadge tone='accent'>{t.homeFeaturedBadge}</StatusBadge>
                      <div className='rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-gold backdrop-blur-xl'>
                        {barber.experienceYears > 0
                          ? `${barber.experienceYears} ${t.homeYearsShort}`
                          : t.homeFeaturedBadge}
                      </div>
                    </div>
                  </div>

                  <div className='flex h-full flex-col justify-between p-5 sm:p-6'>
                    <div>
                      <p className='text-[11px] uppercase tracking-[0.2em] text-brand-gold'>
                        {t.homeMeetTeamCta}
                      </p>
                      <h3 className='mt-3 text-2xl font-semibold text-slate-900 dark:text-white'>
                        {barber.title}
                      </h3>
                      <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/70'>
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
      className='pt-10 pb-8 sm:pt-12'
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
              <GlassPanel className='group relative h-full overflow-hidden p-0'>
                <div className={`relative overflow-hidden ${large ? 'aspect-[16/12]' : 'aspect-[16/10]'}`}>
                  {item.type === 'video' ? (
                    <video
                      src={item.src}
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]'
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
                      className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]'
                    />
                  )}
                  <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.04)_0%,rgba(7,7,7,0.18)_45%,rgba(7,7,7,0.82)_100%)]' />
                    <div className='absolute inset-x-5 bottom-5'>
                      <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>{t.homeGalleryBadge}</p>
                      <h3 className='mt-2 text-xl font-semibold text-white sm:text-2xl'>{t[item.titleKey]}</h3>
                      <p className='mt-2 text-sm leading-6 text-white/70'>{t[item.captionKey]}</p>
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
    <PremiumCard className='h-full p-6'>
      <div className='flex items-center gap-1 text-brand-gold'>
        {Array.from({ length: 5 }).map((_, starIndex) => (
          <Star key={starIndex} size={15} className='fill-current' />
        ))}
      </div>
      <p className='mt-5 text-base leading-8 text-slate-700 dark:text-white/75'>
        "{t[`homeReview${index}Quote`]}"
      </p>
      <div className='mt-6 flex items-center gap-4'>
        <div className='flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/12 text-brand-gold'>
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
      className='pt-10 pb-8 sm:pt-12'
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
      className='pt-10 pb-8 sm:pt-12'
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
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/12 text-brand-gold'>
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

export function LocationSection({ t, isRTL, onBook }) {
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
      kicker={t.homeLocationKicker}
      title={t.homeLocationTitle}
      subtitle={t.homeLocationSubtitle}
      className='pt-10 pb-20 sm:pt-12'
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

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <PrimaryButton as='a' href={locationPhoneHref} className='sm:min-w-[160px]'>
                <Phone size={16} />
                {t.homeLocationCallCta}
              </PrimaryButton>
              <SecondaryButton as='a' href={locationWhatsappHref} className='sm:min-w-[160px]'>
                <MessageCircle size={16} />
                {t.homeLocationWhatsappCta}
              </SecondaryButton>
              <SecondaryButton type='button' onClick={onBook} className='sm:min-w-[160px]'>
                {t.homeBookGeneralCta}
                {renderArrow(isRTL)}
              </SecondaryButton>
            </div>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </SectionShell>
  );
}

export { HOME_SECTION_IDS };
