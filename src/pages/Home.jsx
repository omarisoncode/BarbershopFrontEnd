import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SEO from '../components/SEO';
import ServiceModal from '../components/ServiceModal';
import { AuthContext } from '../context/AuthContext';
import {
  BarbersPreviewSection,
  FAQSection,
  GallerySection,
  HeroSection,
  HOME_SECTION_IDS,
  LocationSection,
  PromiseSection,
  ReviewsSection,
  ServicesPreviewSection,
} from '../components/home/HomeSections';
import { prefetchPublicBookingData, prefetchPublicHomepageData } from '../hooks/usePublicCatalog';
import useBarbers from '../hooks/useBarbers';
import useServices from '../hooks/useServices';
import { translations } from '../utils/i18n';
import { repairArabicObject } from '../utils/repairArabicText';

const scrollToSection = (sectionId) => {
  if (typeof window === 'undefined') return;

  const target = document.getElementById(sectionId);
  if (!target) return;

  const offset = 104;
  const top = target.getBoundingClientRect().top + window.scrollY - offset;

  window.history.replaceState(
    null,
    '',
    sectionId === HOME_SECTION_IDS.hero ? '/' : `/#${sectionId}`,
  );
  window.scrollTo({ top, behavior: 'smooth' });
};

export default function Home({ lang, isRTL }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedService, setSelectedService] = useState(null);

  const t = useMemo(
    () => repairArabicObject(translations[lang] || translations.en),
    [lang],
  );

  const metaTitle = `${t.logo} | ${t.homeMetaTitle || t.homeHeroTitleLine1}`;
  const metaDescription = t.homeMetaDescription || t.homeHeroSubtitle;

  const services = useServices({ lang, t });
  const barbers = useBarbers({ lang, t });

  useEffect(() => {
    void prefetchPublicHomepageData();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const hash = window.location.hash.replace('#', '');
    if (!hash) return undefined;

    const timeoutId = window.setTimeout(() => {
      scrollToSection(hash);
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const openBookingFlow = useCallback(
    (service = null) => {
      void prefetchPublicBookingData();

      if (!user) {
        if (service?._id || service?.title) {
          navigate('/booking', { state: { preselectedService: service } });
          return;
        }

        navigate('/booking');
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

      if (service?._id || service?.title) {
        navigate('/booking', { state: { preselectedService: service } });
        return;
      }

      navigate('/booking');
    },
    [navigate, user],
  );

  const handleOpenService = useCallback((service) => {
    setSelectedService(service);
  }, []);

  const handleBookBarber = useCallback(
    (service) => {
      openBookingFlow(service || null);
    },
    [openBookingFlow],
  );

  const handleExploreServices = useCallback(() => {
    scrollToSection(HOME_SECTION_IDS.services);
  }, []);

  return (
    <>
      <SEO title={metaTitle} description={metaDescription} lang={lang} />

      <div className='relative overflow-hidden'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.12),transparent_28%)] dark:bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.08),transparent_24%)]' />

        <main className='relative z-10 pb-6'>
          <HeroSection
            t={t}
            isRTL={isRTL}
            onBookNow={() => openBookingFlow()}
            onExploreServices={handleExploreServices}
          />

          <ServicesPreviewSection
            t={t}
            isRTL={isRTL}
            state={services.state}
            items={services.items}
            showRefreshing={services.showRefreshing}
            showCachedWarning={services.showCachedWarning}
            onRetry={services.refetch}
            onBook={openBookingFlow}
            onOpenService={handleOpenService}
            onViewAll={() => openBookingFlow()}
          />

          <PromiseSection t={t} isRTL={isRTL} onBook={() => openBookingFlow()} />

          <BarbersPreviewSection
            t={t}
            isRTL={isRTL}
            state={barbers.state}
            items={barbers.items}
            showRefreshing={barbers.showRefreshing}
            showCachedWarning={barbers.showCachedWarning}
            onRetry={barbers.refetch}
            onBook={handleBookBarber}
            onViewAll={() => openBookingFlow()}
          />

          <GallerySection t={t} />
          <ReviewsSection t={t} />
          <FAQSection t={t} />
          <LocationSection t={t} isRTL={isRTL} onBook={() => openBookingFlow()} />
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
