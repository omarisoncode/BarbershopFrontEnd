import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import SEO from '../components/SEO';
import ServiceModal from '../components/ServiceModal';
import {
  BarbersPreviewSection,
  FAQSection,
  GallerySection,
  LocationSection,
  PromiseSection,
  ReviewsSection,
  ServicesPreviewSection,
} from '../components/home/HomeSections';
import { AuthContext } from '../context/AuthContext';
import { prefetchPublicBookingData, prefetchPublicHomepageData } from '../hooks/usePublicCatalog';
import useBarbers from '../hooks/useBarbers';
import useServices from '../hooks/useServices';
import { translations } from '../utils/i18n';
import { repairArabicObject } from '../utils/repairArabicText';

const pageMeta = {
  services: { titleKey: 'navServices' },
  barbers: { titleKey: 'navBarbers' },
  gallery: { titleKey: 'navGallery' },
  reviews: { titleKey: 'navTestimonials' },
  faq: { titleKey: 'navFAQ' },
  about: { titleKey: 'navAbout' },
  location: { titleKey: 'navLocation' },
  contact: { titleKey: 'navContact' },
};

export default function StudioShowcasePage({ lang, isRTL, page }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [selectedService, setSelectedService] = useState(null);

  const t = useMemo(
    () => repairArabicObject(translations[lang] || translations.en),
    [lang],
  );

  const services = useServices({ lang, t, limit: 12 });
  const barbers = useBarbers({ lang, t, limit: 12 });

  useEffect(() => {
    void prefetchPublicHomepageData();
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [page]);

  const metaTitle = `${t.logo} | ${t[pageMeta[page]?.titleKey] || t.logo}`;
  const metaDescription =
    page === 'services'
      ? t.homeServicesSubtitle
      : page === 'barbers'
        ? t.homeBarbersSubtitle
        : page === 'gallery'
          ? t.homeGallerySubtitle
          : page === 'faq'
            ? t.homeFaqSubtitle
            : page === 'about'
              ? t.homePromiseSubtitle
              : page === 'reviews'
                ? t.homeReviewsSubtitle
                : t.homeLocationSubtitle;

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

  const renderPage = () => {
    switch (page) {
      case 'services':
        return (
          <ServicesPreviewSection
            t={t}
            isRTL={isRTL}
            state={services.state}
            items={services.items}
            onRetry={services.refetch}
            onBook={openBookingFlow}
            onOpenService={handleOpenService}
            onViewAll={() => openBookingFlow()}
          />
        );
      case 'barbers':
        return (
          <BarbersPreviewSection
            t={t}
            isRTL={isRTL}
            state={barbers.state}
            items={barbers.items}
            onRetry={barbers.refetch}
            onBook={handleBookBarber}
            onViewAll={() => openBookingFlow()}
          />
        );
      case 'gallery':
        return <GallerySection t={t} />;
      case 'reviews':
        return <ReviewsSection t={t} />;
      case 'faq':
        return <FAQSection t={t} />;
      case 'about':
        return <PromiseSection t={t} isRTL={isRTL} onBook={() => openBookingFlow()} />;
      case 'location':
        return <LocationSection t={t} isRTL={isRTL} onBook={() => openBookingFlow()} />;
      case 'contact':
        return (
          <LocationSection
            t={t}
            isRTL={isRTL}
            onBook={() => openBookingFlow()}
            kickerOverride={t.navContact}
            titleOverride={t.navContact}
            subtitleOverride={t.locationDescription}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <SEO title={metaTitle} description={metaDescription} lang={lang} />

      <div className='relative overflow-hidden'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.12),transparent_28%)] dark:bg-[radial-gradient(circle_at_top,rgba(201,164,92,0.08),transparent_24%)]' />
        <main className='relative z-10 pb-6 pt-4 sm:pt-6'>{renderPage()}</main>

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
