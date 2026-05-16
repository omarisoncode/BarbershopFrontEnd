import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Scissors,
  Sparkles,
  Star,
  UserRound,
} from 'lucide-react';

import SEO from '../components/SEO';
import ServiceModal from '../components/ServiceModal';
import {
  EmptyState,
  ErrorState,
  GlassPanel,
  PremiumCard,
  PrimaryButton,
  SecondaryButton,
  SkeletonCard,
  StatusBadge,
} from '../components/home/HomePrimitives';
import {
  FAQ_KEYS,
  GALLERY_MEDIA,
  PROMISE_POINTS,
  REVIEW_KEYS,
} from '../components/home/homeContent';
import { businessInfo, getBusinessValue } from '../config/businessInfo';
import { AuthContext } from '../context/AuthContext';
import useBarbers from '../hooks/useBarbers';
import { prefetchPublicBookingData, prefetchPublicHomepageData } from '../hooks/usePublicCatalog';
import useServices from '../hooks/useServices';
import { translations } from '../utils/i18n';
import { localizeDigits } from '../utils/localizeDigits';
import { repairArabicObject } from '../utils/repairArabicText';

const pageCopy = {
  en: {
    featuredService: 'Featured service',
    servicesAvailable: 'services available',
    barbersAvailable: 'barbers available',
    yearsShort: 'yrs experience',
    selectedCraft: 'Selected craft',
    bookWithPrefix: 'Book With',
    meetTheTeam: 'Meet the team',
    studioStory: 'Studio story',
    practicalInfo: 'Practical details',
    getInTouch: 'Get in touch',
    callNow: 'Call now',
    messageNow: 'Message on WhatsApp',
    emailNow: 'Send email',
    planYourVisit: 'Plan your visit',
    reviewAverage: 'guest rating',
    trustedByGuests: 'trusted by returning guests',
    galleryHighlight: 'A better look at the room, the rhythm, and the finishing detail.',
    faqHelp: 'Still need help?',
    faqHelpText: 'If your question is specific to timing or booking updates, our team can help directly.',
    reachStudio: 'Reach the studio',
    openingHours: 'Opening hours',
    parking: 'Parking',
    locationLead: 'Everything you need before you arrive.',
    contactLead: 'Choose the fastest way to reach the studio.',
    promiseChecklistTitle: 'What stays consistent every visit',
    bookAppointment: 'Book appointment',
    exploreServices: 'Explore services',
    askOnWhatsapp: 'Ask on WhatsApp',
    viewService: 'View details',
    learnMore: 'Learn more',
    noCatalogTitle: 'Nothing is visible yet',
    noCatalogText: 'The live catalog is still syncing. Try again in a moment.',
    reviewsTag: 'Guest perspective',
    galleryTag: 'Studio gallery',
    contactTag: 'Direct contact',
    locationTag: 'Visit the studio',
    faqTag: 'Clear answers',
    aboutTag: 'What defines the studio',
  },
  ar: {
    featuredService: 'الخدمة المميزة',
    servicesAvailable: 'خدمة متاحة',
    barbersAvailable: 'حلاقون متاحون',
    yearsShort: 'سنوات خبرة',
    selectedCraft: 'الخبرة المختارة',
    bookWithPrefix: 'احجز مع',
    meetTheTeam: 'تعرّف على الفريق',
    studioStory: 'قصة الاستوديو',
    practicalInfo: 'تفاصيل عملية',
    getInTouch: 'تواصل معنا',
    callNow: 'اتصل الآن',
    messageNow: 'راسلنا عبر واتساب',
    emailNow: 'أرسل بريداً',
    planYourVisit: 'خطط لزيارتك',
    reviewAverage: 'تقييم الضيوف',
    trustedByGuests: 'يثق بنا الضيوف العائدون',
    galleryHighlight: 'نظرة أوضح على المكان والإيقاع والتفاصيل النهائية.',
    faqHelp: 'ما زلت تحتاج مساعدة؟',
    faqHelpText: 'إذا كان سؤالك يتعلق بالتوقيت أو تحديثات الحجز، يمكن لفريقنا مساعدتك مباشرة.',
    reachStudio: 'الوصول إلى الاستوديو',
    openingHours: 'ساعات العمل',
    parking: 'المواقف',
    locationLead: 'كل ما تحتاجه قبل أن تصل.',
    contactLead: 'اختر أسرع طريقة للتواصل مع الاستوديو.',
    promiseChecklistTitle: 'ما الذي يبقى ثابتاً في كل زيارة',
    bookAppointment: 'احجز موعداً',
    exploreServices: 'استعرض الخدمات',
    askOnWhatsapp: 'اسأل عبر واتساب',
    viewService: 'عرض التفاصيل',
    learnMore: 'اعرف أكثر',
    noCatalogTitle: 'لا يوجد محتوى ظاهر بعد',
    noCatalogText: 'القائمة المباشرة ما زالت تتزامن. حاول مرة أخرى بعد لحظة.',
    reviewsTag: 'رأي الضيوف',
    galleryTag: 'معرض الاستوديو',
    contactTag: 'تواصل مباشر',
    locationTag: 'زيارة الاستوديو',
    faqTag: 'إجابات واضحة',
    aboutTag: 'ما الذي يميز الاستوديو',
  },
};

const aboutChecklistKeys = [1, 2, 3];

const formatCount = (value, lang) => localizeDigits(value, lang);

function PageHero({
  kicker,
  title,
  subtitle,
  statLabel,
  statValue,
  actions,
  accentIcon,
  isRTL,
}) {
  const AccentIcon = accentIcon || Scissors;

  return (
    <section className='relative overflow-hidden pb-10 pt-10 sm:pb-14 sm:pt-14'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.12),transparent_30%)]' />
      <div className='lux-section-shell relative z-10'>
        <GlassPanel className='overflow-hidden px-5 py-6 sm:px-8 sm:py-8'>
          <div className='grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end'>
            <div>
              <StatusBadge tone='accent'>{kicker}</StatusBadge>
              <h1 className='mt-5 max-w-4xl font-display text-[2.4rem] font-semibold leading-[1.02] tracking-tight text-slate-950 dark:text-white sm:text-[3.1rem]'>
                {title}
              </h1>
              <p className='lux-copy mt-4 max-w-2xl text-[15px] leading-7 sm:text-base sm:leading-8'>
                {subtitle}
              </p>
              {actions ? (
                <div
                  className={`mt-6 flex flex-wrap gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
                >
                  {actions}
                </div>
              ) : null}
            </div>

            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
              <div className='rounded-[1.75rem] border border-brand-gold/18 bg-brand-gold/10 p-5 text-slate-900 shadow-[0_18px_46px_rgba(201,164,92,0.14)] dark:text-white'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/25 bg-brand-gold/14 text-brand-gold'>
                    <AccentIcon size={20} />
                  </div>
                  <div>
                    <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold'>
                      {statLabel}
                    </p>
                    <p className='mt-1 text-2xl font-black text-slate-950 dark:text-white'>
                      {statValue}
                    </p>
                  </div>
                </div>
              </div>

              <div className='rounded-[1.75rem] border border-black/8 bg-white/58 p-5 dark:border-white/10 dark:bg-white/[0.04]'>
                <p className='text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-gold'>
                  {isRTL ? 'الحجز' : 'Booking'}
                </p>
                <p className='mt-2 text-sm leading-7 text-slate-600 dark:text-white/68'>
                  {isRTL
                    ? 'اختر خدمتك أو حلاقك ثم أكمل الحجز بخطوات أوضح وأسرع.'
                    : 'Choose a service or barber, then move into a cleaner booking flow without losing context.'}
                </p>
              </div>
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}

function ServiceCard({ item, onOpenService, onBook, t, c, isFeatured = false }) {
  return (
    <PremiumCard className={`overflow-hidden ${isFeatured ? 'p-4 sm:p-5' : 'p-4'}`}>
      <div className={`grid gap-5 ${isFeatured ? 'lg:grid-cols-[1.02fr_0.98fr]' : ''}`}>
        <div className='overflow-hidden rounded-[1.6rem]'>
          <img
            src={item.image}
            alt={item.title}
            className={`w-full object-cover transition duration-500 ${isFeatured ? 'h-full min-h-[260px]' : 'h-52'}`}
          />
        </div>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <StatusBadge tone='accent'>{item.categoryLabel || t.servicesTag}</StatusBadge>
            <StatusBadge>{item.durationLabel}</StatusBadge>
            <StatusBadge>{item.priceDisplay}</StatusBadge>
          </div>
          <h2 className={`mt-4 font-display font-semibold tracking-tight text-slate-950 dark:text-white ${isFeatured ? 'text-3xl sm:text-[2.15rem]' : 'text-2xl'}`}>
            {item.title}
          </h2>
          <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/68'>
            {item.description}
          </p>
          <div className='mt-4 flex flex-wrap gap-2'>
            {item.previewFeatures?.slice(0, isFeatured ? 4 : 3).map((feature) => (
              <span
                key={feature}
                className='rounded-full border border-black/8 bg-black/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/68'
              >
                {feature}
              </span>
            ))}
          </div>
          <div className='mt-5 flex flex-wrap gap-3'>
            <PrimaryButton type='button' onClick={() => onBook(item)}>
              {c.bookAppointment}
              <ArrowRight size={16} />
            </PrimaryButton>
            <SecondaryButton type='button' onClick={() => onOpenService(item)}>
              {c.viewService}
            </SecondaryButton>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}

function BarberCard({ item, lang, c, onBook }) {
  const years = item.experienceYears
    ? `${formatCount(item.experienceYears, lang)} ${c.yearsShort}`
    : c.selectedCraft;

  return (
    <PremiumCard className='overflow-hidden p-4 sm:p-5'>
      <div className='overflow-hidden rounded-[1.65rem]'>
        <img src={item.image} alt={item.title} className='h-72 w-full object-cover' />
      </div>
      <div className='mt-5 flex items-start justify-between gap-4'>
        <div className='min-w-0'>
          <h2 className='font-display text-3xl font-semibold tracking-tight text-slate-950 dark:text-white'>
            {item.title}
          </h2>
          <p className='mt-2 text-sm text-brand-gold'>{years}</p>
        </div>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-gold/22 bg-brand-gold/10 text-brand-gold'>
          <UserRound size={18} />
        </div>
      </div>
      <p className='mt-4 text-sm leading-7 text-slate-600 dark:text-white/68'>{item.bio}</p>
      <div className='mt-4 flex flex-wrap gap-2'>
        {item.specialties?.slice(0, 3).map((specialty) => (
          <span
            key={specialty}
            className='rounded-full border border-black/8 bg-black/[0.03] px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/68'
          >
            {specialty}
          </span>
        ))}
      </div>
      <PrimaryButton type='button' onClick={() => onBook(item.bookingService || null)} className='mt-5 w-full'>
        {`${c.bookWithPrefix} ${item.title}`}
      </PrimaryButton>
    </PremiumCard>
  );
}

function ContactCards({ lang, t }) {
  const address = getBusinessValue(businessInfo.address, lang) || t.locationAddress;
  const hours = getBusinessValue(businessInfo.hours, lang) || t.locationHours;
  const email = getBusinessValue(businessInfo.email, lang) || t.locationEmail;
  const phone = localizeDigits(
    getBusinessValue(businessInfo.phoneDisplay, lang) || t.locationPhone,
    lang,
  );
  const parking = getBusinessValue(businessInfo.parkingValue, lang) || t.locationParkingValue;

  return {
    address,
    hours,
    email,
    phone,
    parking,
    emailHref: businessInfo.emailHref || t.locationEmailHref,
    phoneHref: businessInfo.phoneHref || t.locationPhoneHref,
    whatsappHref: businessInfo.whatsappHref || t.locationWhatsappHref,
  };
}

export default function StudioShowcasePage({ lang, isRTL, page }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedService, setSelectedService] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const t = useMemo(() => repairArabicObject(translations[lang] || translations.en), [lang]);
  const c = useMemo(() => repairArabicObject(pageCopy[lang] || pageCopy.en), [lang]);
  const retryLabel = isRTL ? 'إعادة المحاولة' : 'Try again';

  const services = useServices({ lang, t, limit: 24 });
  const barbers = useBarbers({ lang, t, limit: 24 });
  const contact = useMemo(() => ContactCards({ lang, t }), [lang, t]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    void prefetchPublicHomepageData();
  }, [page]);

  const openBookingFlow = useCallback(
    (service = null) => {
      void prefetchPublicBookingData();

      if (!user) {
        navigate('/booking', service ? { state: { preselectedService: service } } : undefined);
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

      navigate('/booking', service ? { state: { preselectedService: service } } : undefined);
    },
    [navigate, user],
  );

  const handleOpenService = useCallback((service) => {
    setSelectedService(service);
  }, []);

  const metaTitle = `${t.logo} | ${
    {
      services: t.navServices,
      barbers: t.navBarbers,
      gallery: t.navGallery,
      reviews: t.homeReviewsTitle,
      about: t.navAbout,
      faq: 'FAQ',
      location: t.navLocation,
      contact: t.navContact,
    }[page] || t.logo
  }`;

  const metaDescription =
    {
      services: t.homeServicesSubtitle,
      barbers: t.homeBarbersSubtitle,
      gallery: t.homeGallerySubtitle,
      reviews: t.homeReviewsSubtitle,
      about: t.homePromiseSubtitle,
      faq: t.homeFaqSubtitle,
      location: t.homeLocationSubtitle || t.locationSubtitle,
      contact: c.contactLead,
    }[page] || t.homeHeroSubtitle;

  const renderServicesPage = () => {
    const items = services.items || [];
    const featured = items[0];
    const remaining = items.slice(1);

    return (
      <>
        <PageHero
          kicker={t.servicesTag}
          title={t.homeServicesTitle}
          subtitle={t.homeServicesSubtitle}
          statLabel={c.servicesAvailable}
          statValue={formatCount(services.totalCount || items.length, lang)}
          actions={
            <>
              <PrimaryButton type='button' onClick={() => openBookingFlow()}>
                {c.bookAppointment}
              </PrimaryButton>
              <SecondaryButton as={Link} to='/contact'>
                {c.getInTouch}
              </SecondaryButton>
            </>
          }
          accentIcon={Scissors}
          isRTL={isRTL}
        />

        <section className='pb-20'>
          <div className='lux-section-shell space-y-6'>
            {services.state === 'loading' ? (
              <div className='grid gap-5 lg:grid-cols-2'>
                <SkeletonCard className='min-h-[520px]' />
                <div className='grid gap-5 sm:grid-cols-2'>
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>
            ) : services.state === 'error' ? (
              <ErrorState
                title={c.noCatalogTitle}
                description={c.noCatalogText}
                actionLabel={retryLabel}
                onAction={services.refetch}
              />
            ) : items.length === 0 ? (
              <EmptyState
                title={c.noCatalogTitle}
                description={c.noCatalogText}
                actionLabel={t.footerBookBtn}
                onAction={() => openBookingFlow()}
              />
            ) : (
              <>
                <div className='grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]'>
                  <ServiceCard
                    item={featured}
                    onOpenService={handleOpenService}
                    onBook={openBookingFlow}
                    t={t}
                    c={c}
                    isFeatured={true}
                  />
                  <GlassPanel className='flex flex-col justify-between p-5 sm:p-6'>
                    <div>
                      <StatusBadge tone='accent'>{c.featuredService}</StatusBadge>
                      <h2 className='mt-5 font-display text-[2rem] font-semibold tracking-tight text-slate-950 dark:text-white'>
                        {featured.title}
                      </h2>
                      <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/68'>
                        {featured.longDesc || featured.description}
                      </p>
                    </div>
                    <div className='mt-8 grid gap-3 sm:grid-cols-3'>
                      <div className='rounded-[1.45rem] border border-black/8 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.04]'>
                        <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                          {isRTL ? 'المدة' : 'Duration'}
                        </p>
                        <p className='mt-2 text-lg font-semibold text-slate-900 dark:text-white'>
                          {featured.durationLabel}
                        </p>
                      </div>
                      <div className='rounded-[1.45rem] border border-black/8 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.04]'>
                        <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                          {isRTL ? 'السعر' : 'Price'}
                        </p>
                        <p className='mt-2 text-lg font-semibold text-slate-900 dark:text-white'>
                          {featured.priceDisplay}
                        </p>
                      </div>
                      <div className='rounded-[1.45rem] border border-black/8 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.04]'>
                        <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                          {isRTL ? 'الخدمات' : 'Catalog'}
                        </p>
                        <p className='mt-2 text-lg font-semibold text-slate-900 dark:text-white'>
                          {formatCount(items.length, lang)}
                        </p>
                      </div>
                    </div>
                  </GlassPanel>
                </div>

                {remaining.length > 0 ? (
                  <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
                    {remaining.map((item) => (
                      <ServiceCard
                        key={item.key}
                        item={item}
                        onOpenService={handleOpenService}
                        onBook={openBookingFlow}
                        t={t}
                        c={c}
                      />
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </section>
      </>
    );
  };

  const renderBarbersPage = () => {
    const items = barbers.items || [];

    return (
      <>
        <PageHero
          kicker={c.meetTheTeam}
          title={t.homeBarbersTitle}
          subtitle={t.homeBarbersSubtitle}
          statLabel={c.barbersAvailable}
          statValue={formatCount(barbers.totalCount || items.length, lang)}
          actions={
            <>
              <PrimaryButton type='button' onClick={() => openBookingFlow()}>
                {c.bookAppointment}
              </PrimaryButton>
              <SecondaryButton as={Link} to='/services'>
                {c.exploreServices}
              </SecondaryButton>
            </>
          }
          accentIcon={UserRound}
          isRTL={isRTL}
        />

        <section className='pb-20'>
          <div className='lux-section-shell space-y-6'>
            {barbers.state === 'loading' ? (
              <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : barbers.state === 'error' ? (
              <ErrorState
                title={c.noCatalogTitle}
                description={c.noCatalogText}
                actionLabel={retryLabel}
                onAction={barbers.refetch}
              />
            ) : items.length === 0 ? (
              <EmptyState
                title={c.noCatalogTitle}
                description={c.noCatalogText}
                actionLabel={c.bookAppointment}
                onAction={() => openBookingFlow()}
              />
            ) : (
              <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
                {items.map((item) => (
                  <BarberCard
                    key={item.key}
                    item={item}
                    lang={lang}
                    c={c}
                    onBook={openBookingFlow}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </>
    );
  };

  const renderGalleryPage = () => (
    <>
      <PageHero
        kicker={c.galleryTag}
        title={t.homeGalleryTitle}
        subtitle={t.homeGallerySubtitle}
        statLabel={isRTL ? 'المشاهد' : 'Scenes'}
        statValue={formatCount(GALLERY_MEDIA.length, lang)}
        actions={
          <>
            <PrimaryButton type='button' onClick={() => openBookingFlow()}>
              {c.bookAppointment}
            </PrimaryButton>
            <SecondaryButton as={Link} to='/about'>
              {c.studioStory}
            </SecondaryButton>
          </>
        }
        accentIcon={Sparkles}
        isRTL={isRTL}
      />

      <section className='pb-20'>
        <div className='lux-section-shell space-y-5'>
          <GlassPanel className='px-5 py-5 text-sm leading-7 text-slate-600 dark:text-white/68 sm:px-6'>
            {c.galleryHighlight}
          </GlassPanel>
          <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-12'>
            {GALLERY_MEDIA.map((item, index) => {
              const spanClass =
                index === 0
                  ? 'xl:col-span-7 xl:row-span-2'
                  : index === 4
                    ? 'xl:col-span-5'
                    : 'xl:col-span-5';

              return (
                <PremiumCard key={item.key} className={`overflow-hidden p-3 ${spanClass}`}>
                  <div className='relative h-full overflow-hidden rounded-[1.65rem]'>
                    {item.type === 'video' ? (
                      <video
                        className='h-full min-h-[260px] w-full object-cover'
                        src={item.src}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={item.src}
                        alt={t[item.titleKey]}
                        className='h-full min-h-[260px] w-full object-cover'
                      />
                    )}
                    <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,6,0.04),rgba(8,7,6,0.72))]' />
                    <div className='absolute inset-x-4 bottom-4'>
                      <StatusBadge tone='accent'>{item.type === 'video' ? 'Studio' : 'Detail'}</StatusBadge>
                      <h2 className='mt-3 font-display text-2xl font-semibold tracking-tight text-white sm:text-[2rem]'>
                        {t[item.titleKey]}
                      </h2>
                      <p className='mt-2 text-sm leading-7 text-white/76'>
                        {t[item.captionKey]}
                      </p>
                    </div>
                  </div>
                </PremiumCard>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );

  const renderReviewsPage = () => (
    <>
      <PageHero
        kicker={c.reviewsTag}
        title={t.homeReviewsTitle}
        subtitle={t.homeReviewsSubtitle}
        statLabel={c.reviewAverage}
        statValue='4.9/5'
        actions={
          <>
            <PrimaryButton type='button' onClick={() => openBookingFlow()}>
              {c.bookAppointment}
            </PrimaryButton>
            <SecondaryButton as={Link} to='/contact'>
              {c.getInTouch}
            </SecondaryButton>
          </>
        }
        accentIcon={Star}
        isRTL={isRTL}
      />

      <section className='pb-20'>
        <div className='lux-section-shell'>
          <div className='mb-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4'>
            {REVIEW_KEYS.map((reviewNumber) => (
              <PremiumCard key={reviewNumber} className='p-5 sm:p-6'>
                <div className='flex items-center gap-1 text-brand-gold'>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={15} fill='currentColor' />
                  ))}
                </div>
                <p className='mt-5 text-sm leading-8 text-slate-700 dark:text-white/74'>
                  "{t[`homeReview${reviewNumber}Quote`]}"
                </p>
                <div className='mt-6 border-t border-black/8 pt-4 dark:border-white/10'>
                  <p className='font-semibold text-slate-900 dark:text-white'>
                    {t[`homeReview${reviewNumber}Name`]}
                  </p>
                  <p className='mt-1 text-sm text-slate-500 dark:text-white/52'>
                    {t[`homeReview${reviewNumber}Role`]}
                  </p>
                </div>
              </PremiumCard>
            ))}
          </div>

          <GlassPanel className='mt-6 grid gap-5 px-5 py-5 sm:grid-cols-3 sm:px-6'>
            <div>
              <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                {c.reviewAverage}
              </p>
              <p className='mt-2 text-2xl font-black text-slate-950 dark:text-white'>4.9/5</p>
            </div>
            <div>
              <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                {c.trustedByGuests}
              </p>
              <p className='mt-2 text-2xl font-black text-slate-950 dark:text-white'>90%+</p>
            </div>
            <div>
              <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                {isRTL ? 'التركيز' : 'Focus'}
              </p>
              <p className='mt-2 text-sm leading-7 text-slate-600 dark:text-white/68'>
                {isRTL
                  ? 'الضيوف يكررون نفس الإشادة: الدقة، الهدوء، والنتيجة النظيفة.'
                  : 'Guests repeat the same themes: precision, calm pacing, and a finish that lasts.'}
              </p>
            </div>
          </GlassPanel>
        </div>
      </section>
    </>
  );

  const renderAboutPage = () => (
    <>
      <PageHero
        kicker={c.aboutTag}
        title={t.homePromiseTitle}
        subtitle={t.homePromiseSubtitle}
        statLabel={isRTL ? 'المبادئ' : 'Principles'}
        statValue={formatCount(PROMISE_POINTS.length, lang)}
        actions={
          <>
            <PrimaryButton type='button' onClick={() => openBookingFlow()}>
              {c.bookAppointment}
            </PrimaryButton>
            <SecondaryButton as={Link} to='/location'>
              {c.planYourVisit}
            </SecondaryButton>
          </>
        }
        accentIcon={Sparkles}
        isRTL={isRTL}
      />

      <section className='pb-20'>
        <div className='lux-section-shell space-y-6'>
          <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-4'>
            {PROMISE_POINTS.map((point, index) => (
              <PremiumCard key={point.titleKey} className='p-5 sm:p-6'>
                <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/22 bg-brand-gold/10 text-brand-gold'>
                  {index % 2 === 0 ? <Scissors size={18} /> : <Sparkles size={18} />}
                </div>
                <h2 className='mt-5 text-xl font-semibold text-slate-950 dark:text-white'>
                  {t[point.titleKey]}
                </h2>
                <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/68'>
                  {t[point.textKey]}
                </p>
              </PremiumCard>
            ))}
          </div>

          <GlassPanel className='px-5 py-5 sm:px-6 sm:py-6'>
            <div className='max-w-2xl'>
              <StatusBadge tone='accent'>{c.promiseChecklistTitle}</StatusBadge>
              <h2 className='mt-4 font-display text-[2rem] font-semibold tracking-tight text-slate-950 dark:text-white'>
                {isRTL
                  ? 'النتيجة ليست مجرد شكل جيد، بل تجربة منظمة ومحترمة بالكامل.'
                  : 'The goal is not just a sharp result. It is a more orderly, respectful visit end to end.'}
              </h2>
            </div>
            <div className='mt-6 grid gap-4 md:grid-cols-3'>
              {aboutChecklistKeys.map((number) => (
                <div
                  key={number}
                  className='rounded-[1.55rem] border border-black/8 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.04]'
                >
                  <div className='flex items-center gap-3'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-2xl border border-brand-gold/20 bg-brand-gold/10 text-brand-gold'>
                      <CheckCircle2 size={18} />
                    </div>
                    <h3 className='text-base font-semibold text-slate-900 dark:text-white'>
                      {t[`homePromiseChecklist${number}Title`]}
                    </h3>
                  </div>
                  <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/68'>
                    {t[`homePromiseChecklist${number}Text`]}
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>
      </section>
    </>
  );

  const renderFaqPage = () => (
    <>
      <PageHero
        kicker={c.faqTag}
        title={t.homeFaqTitle}
        subtitle={t.homeFaqSubtitle}
        statLabel={isRTL ? 'الأسئلة' : 'Questions'}
        statValue={formatCount(FAQ_KEYS.length, lang)}
        actions={
          <>
            <PrimaryButton as='a' href={contact.whatsappHref} target='_blank' rel='noreferrer'>
              {c.askOnWhatsapp}
            </PrimaryButton>
            <SecondaryButton as={Link} to='/contact'>
              {c.getInTouch}
            </SecondaryButton>
          </>
        }
        accentIcon={CheckCircle2}
        isRTL={isRTL}
      />

      <section className='pb-20'>
        <div className='lux-section-shell grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]'>
          <div className='space-y-4'>
            {FAQ_KEYS.map((questionNumber) => {
              const isOpen = openFaq === questionNumber;
              return (
                <GlassPanel key={questionNumber} className='overflow-hidden p-0'>
                  <button
                    type='button'
                    onClick={() => setOpenFaq(isOpen ? null : questionNumber)}
                    className='flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6'
                  >
                    <span className='text-base font-semibold text-slate-900 dark:text-white sm:text-lg'>
                      {t[`homeFaq${questionNumber}Question`]}
                    </span>
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/8 bg-white/60 text-slate-500 transition dark:border-white/10 dark:bg-white/[0.04] dark:text-white/58 ${isOpen ? 'rotate-180 text-brand-gold' : ''}`}
                    >
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  {isOpen ? (
                    <div className='border-t border-black/8 px-5 pb-5 pt-4 text-sm leading-8 text-slate-600 dark:border-white/10 dark:text-white/68 sm:px-6'>
                      {t[`homeFaq${questionNumber}Answer`]}
                    </div>
                  ) : null}
                </GlassPanel>
              );
            })}
          </div>

          <GlassPanel className='h-fit px-5 py-5 sm:px-6'>
            <StatusBadge tone='accent'>{c.faqHelp}</StatusBadge>
            <h2 className='mt-4 font-display text-[1.9rem] font-semibold tracking-tight text-slate-950 dark:text-white'>
              {c.faqHelpText}
            </h2>
            <div className='mt-6 space-y-3'>
              <SecondaryButton as='a' href={contact.phoneHref}>
                <Phone size={16} />
                {contact.phone}
              </SecondaryButton>
              <SecondaryButton as='a' href={contact.emailHref}>
                <Mail size={16} />
                {contact.email}
              </SecondaryButton>
              <PrimaryButton as='a' href={contact.whatsappHref} target='_blank' rel='noreferrer'>
                <MessageCircle size={16} />
                {c.messageNow}
              </PrimaryButton>
            </div>
          </GlassPanel>
        </div>
      </section>
    </>
  );

  const renderLocationPage = () => (
    <>
      <PageHero
        kicker={c.locationTag}
        title={t.homeLocationTitle || t.locationTitle}
        subtitle={t.homeLocationSubtitle || t.locationSubtitle}
        statLabel={c.practicalInfo}
        statValue={isRTL ? '24/7' : '24/7'}
        actions={
          <>
            <PrimaryButton type='button' onClick={() => openBookingFlow()}>
              {c.bookAppointment}
            </PrimaryButton>
            <SecondaryButton as='a' href={contact.phoneHref}>
              {c.callNow}
            </SecondaryButton>
          </>
        }
        accentIcon={MapPin}
        isRTL={isRTL}
      />

      <section className='pb-20'>
        <div className='lux-section-shell space-y-5'>
          <GlassPanel className='px-5 py-5 text-sm leading-7 text-slate-600 dark:text-white/68 sm:px-6'>
            {c.locationLead}
          </GlassPanel>
          <div className='grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]'>
            <PremiumCard className='p-5 sm:p-6'>
              <StatusBadge tone='accent'>{c.reachStudio}</StatusBadge>
              <h2 className='mt-4 font-display text-[2rem] font-semibold tracking-tight text-slate-950 dark:text-white'>
                {contact.address}
              </h2>
              <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                <div className='rounded-[1.45rem] border border-black/8 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.04]'>
                  <div className='flex items-center gap-3 text-brand-gold'>
                    <Clock3 size={17} />
                    <p className='text-[11px] uppercase tracking-[0.18em]'>{c.openingHours}</p>
                  </div>
                  <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/68'>
                    {contact.hours}
                  </p>
                </div>
                <div className='rounded-[1.45rem] border border-black/8 bg-white/58 p-4 dark:border-white/10 dark:bg-white/[0.04]'>
                  <div className='flex items-center gap-3 text-brand-gold'>
                    <CalendarDays size={17} />
                    <p className='text-[11px] uppercase tracking-[0.18em]'>{c.parking}</p>
                  </div>
                  <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/68'>
                    {contact.parking}
                  </p>
                </div>
              </div>
            </PremiumCard>

            <GlassPanel className='px-5 py-5 sm:px-6'>
              <StatusBadge tone='accent'>{c.planYourVisit}</StatusBadge>
              <div className='mt-5 space-y-4'>
                <a
                  href={contact.phoneHref}
                  className='flex items-center justify-between gap-4 rounded-[1.45rem] border border-black/8 bg-white/58 px-4 py-4 transition hover:border-brand-gold/25 hover:text-brand-gold dark:border-white/10 dark:bg-white/[0.04]'
                >
                  <span className='flex items-center gap-3'>
                    <Phone size={18} />
                    <span>{contact.phone}</span>
                  </span>
                  <ArrowRight size={16} />
                </a>
                <a
                  href={contact.whatsappHref}
                  target='_blank'
                  rel='noreferrer'
                  className='flex items-center justify-between gap-4 rounded-[1.45rem] border border-black/8 bg-white/58 px-4 py-4 transition hover:border-brand-gold/25 hover:text-brand-gold dark:border-white/10 dark:bg-white/[0.04]'
                >
                  <span className='flex items-center gap-3'>
                    <MessageCircle size={18} />
                    <span>{c.messageNow}</span>
                  </span>
                  <ArrowRight size={16} />
                </a>
                <a
                  href={contact.emailHref}
                  className='flex items-center justify-between gap-4 rounded-[1.45rem] border border-black/8 bg-white/58 px-4 py-4 transition hover:border-brand-gold/25 hover:text-brand-gold dark:border-white/10 dark:bg-white/[0.04]'
                >
                  <span className='flex items-center gap-3'>
                    <Mail size={18} />
                    <span>{contact.email}</span>
                  </span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>
    </>
  );

  const renderContactPage = () => (
    <>
      <PageHero
        kicker={c.contactTag}
        title={c.getInTouch}
        subtitle={c.contactLead}
        statLabel={isRTL ? 'الرد' : 'Response'}
        statValue={isRTL ? 'سريع' : 'Fast'}
        actions={
          <>
            <PrimaryButton as='a' href={contact.whatsappHref} target='_blank' rel='noreferrer'>
              {c.messageNow}
            </PrimaryButton>
            <SecondaryButton as='a' href={contact.phoneHref}>
              {c.callNow}
            </SecondaryButton>
          </>
        }
        accentIcon={MessageCircle}
        isRTL={isRTL}
      />

      <section className='pb-20'>
        <div className='lux-section-shell grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
          <PremiumCard className='p-5 sm:p-6'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/22 bg-brand-gold/10 text-brand-gold'>
              <Phone size={18} />
            </div>
            <h2 className='mt-5 text-2xl font-semibold text-slate-950 dark:text-white'>
              {t.locationPhoneTitle}
            </h2>
            <p className='mt-2 text-sm text-slate-600 dark:text-white/68'>{contact.phone}</p>
            <PrimaryButton as='a' href={contact.phoneHref} className='mt-5 w-full'>
              {c.callNow}
            </PrimaryButton>
          </PremiumCard>

          <PremiumCard className='p-5 sm:p-6'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/22 bg-brand-gold/10 text-brand-gold'>
              <MessageCircle size={18} />
            </div>
            <h2 className='mt-5 text-2xl font-semibold text-slate-950 dark:text-white'>
              WhatsApp
            </h2>
            <p className='mt-2 text-sm text-slate-600 dark:text-white/68'>
              {isRTL
                ? 'للاستفسارات السريعة وتأكيد التفاصيل العملية.'
                : 'Best for quick questions, booking help, and practical confirmations.'}
            </p>
            <PrimaryButton
              as='a'
              href={contact.whatsappHref}
              target='_blank'
              rel='noreferrer'
              className='mt-5 w-full'
            >
              {c.messageNow}
            </PrimaryButton>
          </PremiumCard>

          <PremiumCard className='p-5 sm:p-6'>
            <div className='flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-gold/22 bg-brand-gold/10 text-brand-gold'>
              <Mail size={18} />
            </div>
            <h2 className='mt-5 text-2xl font-semibold text-slate-950 dark:text-white'>
              {t.locationEmailTitle}
            </h2>
            <p className='mt-2 text-sm text-slate-600 dark:text-white/68'>{contact.email}</p>
            <PrimaryButton as='a' href={contact.emailHref} className='mt-5 w-full'>
              {c.emailNow}
            </PrimaryButton>
          </PremiumCard>

          <GlassPanel className='px-5 py-5 md:col-span-2 xl:col-span-3 sm:px-6'>
            <div className='grid gap-5 xl:grid-cols-3'>
              <div>
                <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                  {c.reachStudio}
                </p>
                <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/68'>
                  {contact.address}
                </p>
              </div>
              <div>
                <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                  {c.openingHours}
                </p>
                <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/68'>
                  {contact.hours}
                </p>
              </div>
              <div>
                <p className='text-[11px] uppercase tracking-[0.18em] text-brand-gold'>
                  {c.parking}
                </p>
                <p className='mt-3 text-sm leading-7 text-slate-600 dark:text-white/68'>
                  {contact.parking}
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>
    </>
  );

  const pageContent = {
    services: renderServicesPage,
    barbers: renderBarbersPage,
    gallery: renderGalleryPage,
    reviews: renderReviewsPage,
    about: renderAboutPage,
    faq: renderFaqPage,
    location: renderLocationPage,
    contact: renderContactPage,
  };

  const Content = pageContent[page];

  return (
    <>
      <SEO title={metaTitle} description={metaDescription} lang={lang} />

      <div className='relative overflow-hidden pb-6'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.14),transparent_28%)] dark:bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.08),transparent_24%)]' />
        <main className='relative z-10'>
          {Content ? (
            <Content />
          ) : (
            <section className='py-20'>
              <div className='lux-section-shell'>
                <EmptyState
                  title={c.noCatalogTitle}
                  description={c.noCatalogText}
                  actionLabel={t.navHome}
                  onAction={() => navigate('/')}
                />
              </div>
            </section>
          )}
        </main>

        <ServiceModal
          isOpen={Boolean(selectedService)}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          lang={lang}
        />
      </div>
    </>
  );
}
