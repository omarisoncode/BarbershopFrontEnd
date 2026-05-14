/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, RefreshCcw } from 'lucide-react';

const MotionDiv = motion.div;

export const sectionViewport = { once: true, amount: 0.2, margin: '0px 0px -8% 0px' };

export const revealUpVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const sequentialReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: index * 0.07,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function SectionShell({
  id,
  kicker,
  title,
  subtitle,
  align = 'left',
  actions = null,
  className = '',
  children,
}) {
  const centered = align === 'center';

  return (
    <section id={id} className={`relative py-18 sm:py-22 ${className}`}>
      <div className='lux-section-shell'>
        {(kicker || title || subtitle || actions) && (
          <MotionDiv
            initial='hidden'
            whileInView='visible'
            viewport={sectionViewport}
            variants={revealUpVariants}
            className={`mb-10 flex flex-col gap-5 md:mb-12 ${
              centered ? 'items-center text-center' : 'items-start text-left'
            }`}
          >
            <div
              className={`flex w-full flex-col gap-5 md:flex-row md:items-end ${
                centered ? 'md:justify-center' : 'md:justify-between'
              }`}
            >
              <div className={centered ? 'max-w-3xl' : 'max-w-3xl'}>
                {kicker ? <p className='lux-kicker'>{kicker}</p> : null}
                {title ? <h2 className='lux-heading mt-4'>{title}</h2> : null}
                {subtitle ? <p className='lux-copy mt-4 max-w-2xl'>{subtitle}</p> : null}
              </div>
              {actions ? <div className='flex items-center gap-3'>{actions}</div> : null}
            </div>
          </MotionDiv>
        )}
        {children}
      </div>
    </section>
  );
}

export const GlassPanel = ({ as = 'div', className = '', children, ...props }) =>
  React.createElement(as, { className: `lux-panel ${className}`, ...props }, children);

export const PremiumCard = ({ as = 'article', className = '', children, ...props }) =>
  React.createElement(as, { className: `lux-card ${className}`, ...props }, children);

const buttonBaseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 disabled:cursor-not-allowed disabled:opacity-60';

export const PrimaryButton = ({ as = 'button', className = '', children, ...props }) =>
  React.createElement(
    as,
    { className: `${buttonBaseClasses} lux-button-primary ${className}`, ...props },
    children,
  );

export const SecondaryButton = ({
  as = 'button',
  className = '',
  children,
  ...props
}) =>
  React.createElement(
    as,
    { className: `${buttonBaseClasses} lux-button-secondary ${className}`, ...props },
    children,
  );

export const StatusBadge = ({ children, tone = 'default', className = '' }) => {
  const toneClasses = {
    default:
      'border-white/10 bg-white/8 text-white/75 dark:border-white/10 dark:bg-white/8',
    accent: 'border-brand-gold/30 bg-brand-gold/12 text-brand-gold',
    danger: 'border-rose-500/20 bg-rose-500/12 text-rose-200 dark:text-rose-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

export const SkeletonCard = ({ className = '' }) => (
  <div className={`lux-card overflow-hidden ${className}`}>
    <div className='aspect-[4/3] lux-skeleton rounded-[1.7rem]' />
    <div className='mt-5 space-y-3'>
      <div className='h-3 w-24 lux-skeleton rounded-full' />
      <div className='h-7 w-2/3 lux-skeleton rounded-full' />
      <div className='h-4 w-full lux-skeleton rounded-full' />
      <div className='h-4 w-4/5 lux-skeleton rounded-full' />
      <div className='mt-5 flex items-center justify-between gap-3'>
        <div className='h-4 w-20 lux-skeleton rounded-full' />
        <div className='h-11 w-32 lux-skeleton rounded-full' />
      </div>
    </div>
  </div>
);

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => (
  <GlassPanel
    className={`flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center ${className}`}
  >
    <div className='flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/25 bg-brand-gold/12 text-brand-gold'>
      <AlertTriangle size={22} />
    </div>
    <h3 className='mt-5 text-2xl font-semibold text-slate-900 dark:text-white'>{title}</h3>
    <p className='lux-copy mt-3 max-w-xl'>{description}</p>
    {actionLabel ? (
      <PrimaryButton type='button' onClick={onAction} className='mt-7'>
        {actionLabel}
        <ArrowRight size={16} />
      </PrimaryButton>
    ) : null}
  </GlassPanel>
);

export const ErrorState = ({
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => (
  <GlassPanel
    className={`flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center ${className}`}
  >
    <div className='flex h-14 w-14 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/12 text-rose-200'>
      <AlertTriangle size={22} />
    </div>
    <h3 className='mt-5 text-2xl font-semibold text-slate-900 dark:text-white'>{title}</h3>
    <p className='lux-copy mt-3 max-w-xl'>{description}</p>
    <SecondaryButton type='button' onClick={onAction} className='mt-7'>
      <RefreshCcw size={16} />
      {actionLabel}
    </SecondaryButton>
  </GlassPanel>
);
