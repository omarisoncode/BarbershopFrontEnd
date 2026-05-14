import { useMemo } from 'react';

import useHomepagePreviewCollection from './useHomepagePreviewCollection';
import { usePublicBarbers } from './usePublicCatalog';
import { getFallbackBarberPreviews, getBarberFallbackImage } from '../components/home/homeContent';

const hasValue = (value) => typeof value === 'string' && value.trim().length > 0;
const hasArabicScript = (value) => /[\u0600-\u06FF]/.test(String(value || ''));

const getBarberName = (barber, lang) =>
  lang === 'ar'
    ? (hasValue(barber.nameAr) ? barber.nameAr : barber.name)
    : (hasValue(barber.name) ? barber.name : barber.nameAr);

const getArabicBarberBio = (barber, fallback) => {
  if (hasValue(barber.bioAr) && hasArabicScript(barber.bioAr)) {
    return barber.bioAr;
  }

  if (hasValue(barber.bio) && hasArabicScript(barber.bio)) {
    return barber.bio;
  }

  return fallback;
};

const getBarberBio = (barber, lang, t) =>
  lang === 'ar'
    ? getArabicBarberBio(barber, t.homeFallbackBarberBio)
    : (hasValue(barber.bio) ? barber.bio : hasValue(barber.bioAr) ? barber.bioAr : t.homeFallbackBarberBio);

const getBarberSpecialties = (barber, lang) => {
  if (!Array.isArray(barber.serviceIds)) {
    return [];
  }

  return barber.serviceIds
    .filter((service) => service && typeof service === 'object')
    .slice(0, 3)
    .map((service) => (lang === 'ar' ? service.nameAr || service.name : service.name))
    .filter(Boolean);
};

const getBookingService = (barber, lang) => {
  const firstService = Array.isArray(barber.serviceIds)
    ? barber.serviceIds.find((service) => service && typeof service === 'object')
    : null;

  if (!firstService) {
    return null;
  }

  return {
    _id: firstService._id || '',
    title: lang === 'ar' ? firstService.nameAr || firstService.name : firstService.name,
    price: Number(firstService.price) || 0,
  };
};

const mapBarber = (barber, lang, t, index) => {
  const image = barber.image || getBarberFallbackImage(index);

  return {
    key: barber._id || barber.name || `barber-${index}`,
    id: barber._id || barber.name || `barber-${index}`,
    _id: barber._id || '',
    title: getBarberName(barber, lang),
    bio: getBarberBio(barber, lang, t),
    image,
    specialties: getBarberSpecialties(barber, lang),
    experienceYears: Number(barber.experienceYears) || 0,
    bookingService: getBookingService(barber, lang),
    raw: barber,
    isFallback: false,
  };
};

export default function useBarbers({ lang, t, limit = 4 }) {
  const resource = usePublicBarbers();

  const liveItems = useMemo(
    () => resource.data.slice(0, limit).map((barber, index) => mapBarber(barber, lang, t, index)),
    [lang, limit, resource.data, t],
  );

  const fallbackItems = useMemo(
    () => getFallbackBarberPreviews(t).slice(0, limit),
    [t, limit],
  );

  const preview = useHomepagePreviewCollection({
    data: liveItems,
    error: resource.error,
    isLoading: resource.isLoading,
    isRefreshing: resource.isRefreshing,
    hasCachedData: resource.hasCachedData,
    refetch: resource.refetch,
    fallbackItems,
  });

  return {
    ...preview,
    totalCount: resource.data.length,
  };
}
