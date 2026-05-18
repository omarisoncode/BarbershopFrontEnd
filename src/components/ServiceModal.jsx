import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Clock3, Info, Scissors, WalletCards } from 'lucide-react';

import { AuthContext } from '../context/AuthContext';
import { getLocalizedCategoryLabel } from '../utils/serviceCategories';

const MotionDiv = motion.div;

const copyByLang = {
  en: {
    duration: 'Duration',
    about: 'About this service',
    craftedFor: 'Crafted for',
    included: 'What is included',
    book: 'Book Now',
    mins: 'min',
    price: 'Price',
    previewPrice: 'Price at booking',
    previewPriceNote:
      'Live pricing appears as soon as the service catalog finishes syncing.',
  },
  ar: {
    duration: 'المدة',
    about: 'عن هذه الخدمة',
    craftedFor: 'مصممة لـ',
    included: 'يشمل',
    book: 'احجز الآن',
    mins: 'دقيقة',
    price: 'السعر',
    previewPrice: 'السعر عند الحجز',
    previewPriceNote: 'سيظهر السعر الفعلي بمجرد اكتمال مزامنة قائمة الخدمات.',
  },
};

export default function ServiceModal({ isOpen, onClose, service, lang }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isRTL = lang === 'ar';
  const copy = copyByLang[lang] || copyByLang.en;

  const priceDisplay = service?.isFallback
    ? service?.priceDisplay || copy.previewPrice
    : service?.priceDisplay || (isRTL ? `${service?.price} د.ك` : `KD ${service?.price}`);
  const priceNote = service?.isFallback
    ? service?.priceNote || copy.previewPriceNote
    : '';
  const serviceFeatures =
    (isRTL ? service?.featuresAr : service?.features) || service?.features || [];

  const handleBookNow = () => {
    onClose();

    if (!user) {
      navigate('/booking', { state: { preselectedService: service } });
      return;
    }

    if (user.role === 'admin') {
      navigate('/admin', {
        state: {
          section: 'bookings',
          preselectedServiceId: service?._id || '',
        },
      });
      return;
    }

    navigate('/booking', { state: { preselectedService: service } });
  };

  return (
    <AnimatePresence>
      {isOpen && service ? (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-[80] flex items-end justify-center bg-black/72 p-0 sm:items-center sm:p-4'
        >
          <button
            type='button'
            onClick={onClose}
            className='absolute inset-0 cursor-default'
            aria-label='Close service details'
          />

          <MotionDiv
            initial={{ y: 36, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 36, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className='relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-[#f1ebe4] text-slate-900 shadow-[0_24px_72px_rgba(0,0,0,0.24)] dark:bg-[#0b0908] dark:text-white sm:max-w-3xl sm:rounded-[2rem]'
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <div className='relative h-64 w-full shrink-0 overflow-hidden sm:h-80'>
              {service.img ? (
                <img
                  src={service.img}
                  alt={service.title}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center bg-[linear-gradient(180deg,rgba(33,25,20,0.88),rgba(10,9,8,1))]'>
                  <div className='flex flex-col items-center gap-4 text-white/80'>
                    <div className='rounded-full border border-white/12 bg-white/8 p-4'>
                      <Scissors className='h-10 w-10 text-brand-gold' />
                    </div>
                    <span className='text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60'>
                      {getLocalizedCategoryLabel(service, lang, copy.craftedFor)}
                    </span>
                  </div>
                </div>
              )}

              <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,7,0.04)_0%,rgba(7,7,7,0.2)_36%,rgba(7,7,7,0.82)_100%)]' />

              <button
                type='button'
                onClick={onClose}
                className={`absolute top-4 rounded-full border border-white/12 bg-[#15110f]/80 p-2 text-white transition hover:bg-white hover:text-black ${
                  isRTL ? 'left-4' : 'right-4'
                }`}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>

              <div className='absolute inset-x-6 bottom-6'>
                <div className='inline-flex rounded-full border border-brand-gold/30 bg-[rgba(30,22,18,0.82)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold'>
                  {getLocalizedCategoryLabel(service, lang, copy.craftedFor)}
                </div>
                <h2 className='mt-4 font-display text-4xl font-semibold text-white sm:text-5xl'>
                  {service.title}
                </h2>
              </div>
            </div>

            <div className='relative space-y-6 overflow-y-auto p-6 sm:p-8'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-[1.4rem] border border-black/8 bg-white/86 p-5 dark:border-white/10 dark:bg-white/6'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/12 text-brand-gold'>
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                        {copy.duration}
                      </p>
                      <p className='mt-1 text-xl font-semibold text-slate-900 dark:text-white'>
                        {service.durationMinutes}{' '}
                        <span className='text-sm font-medium text-slate-500 dark:text-white/60'>
                          {copy.mins}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className='rounded-[1.4rem] border border-black/8 bg-white/86 p-5 dark:border-white/10 dark:bg-white/6'>
                  <div className='flex items-center gap-3'>
                    <div className='flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/12 text-brand-gold'>
                      <WalletCards size={18} />
                    </div>
                    <div>
                      <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                        {copy.price}
                      </p>
                      <p className='mt-1 text-xl font-semibold text-slate-900 dark:text-white'>
                        {priceDisplay}
                      </p>
                      {priceNote ? (
                        <p className='mt-2 text-xs leading-6 text-slate-500 dark:text-white/60'>
                          {priceNote}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {service.longDesc ? (
                <div className='rounded-[1.5rem] border border-black/8 bg-white/86 p-5 dark:border-white/10 dark:bg-white/6'>
                  <div className='mb-3 flex items-center gap-2'>
                    <Info size={16} className='text-brand-gold' />
                    <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold'>
                      {copy.about}
                    </h3>
                  </div>
                  <p className='text-sm leading-8 text-slate-600 dark:text-white/70'>
                    {service.longDesc}
                  </p>
                </div>
              ) : null}

              {serviceFeatures.length > 0 ? (
                <div className='rounded-[1.5rem] border border-black/8 bg-white/86 p-5 dark:border-white/10 dark:bg-white/6'>
                  <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold'>
                    {copy.included}
                  </h3>
                  <div className='mt-4 flex flex-wrap gap-2'>
                    {serviceFeatures.slice(0, 4).map((feature) => (
                      <span
                        key={feature}
                        className='rounded-full border border-black/8 bg-black/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/6 dark:text-white/70'
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <button
                type='button'
                onClick={handleBookNow}
                className='lux-button-primary w-full rounded-full px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em]'
              >
                {copy.book}
              </button>
            </div>
          </MotionDiv>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}
