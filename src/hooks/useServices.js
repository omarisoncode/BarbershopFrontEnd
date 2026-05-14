import { useMemo } from 'react';

import useHomepagePreviewCollection from './useHomepagePreviewCollection';
import { usePublicServices } from './usePublicCatalog';
import {
  getFallbackServicePreviews,
  getServiceFallbackImage,
} from '../components/home/homeContent';
import {
  getLocalizedCategoryLabel,
  getServiceBadgeOrCategoryLabel,
} from '../utils/serviceCategories';

const formatPrice = (value, lang) => {
  const amount = new Intl.NumberFormat(lang === 'ar' ? 'ar-KW' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

  return lang === 'ar' ? `${amount} د.ك` : `KD ${amount}`;
};

const formatDuration = (value, lang) => {
  const amount = new Intl.NumberFormat(lang === 'ar' ? 'ar-KW' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

  return lang === 'ar' ? `${amount} دقيقة` : `${amount} min`;
};

const getServiceTitle = (service, lang) =>
  lang === 'ar' ? service.nameAr || service.name : service.name;

const getServiceDescription = (service, lang) =>
  lang === 'ar'
    ? service.descriptionAr || service.description || ''
    : service.description || service.descriptionAr || '';

const getServiceFeatures = (service, lang) => {
  const localizedFeatures =
    lang === 'ar'
      ? service.featuresAr?.filter(Boolean)
      : service.features?.filter(Boolean);

  if (localizedFeatures?.length) {
    return localizedFeatures.slice(0, 3);
  }

  return (service.features || service.featuresAr || []).filter(Boolean).slice(0, 3);
};

const mapService = (service, lang, t, index) => {
  const title = getServiceTitle(service, lang);
  const description =
    getServiceDescription(service, lang) || t.homeFallbackServiceDescription;
  const image = service.image || getServiceFallbackImage(service, index);

  return {
    key: service._id || service.slug || `${service.name}-${index}`,
    id: service._id || service.slug || `${service.name}-${index}`,
    _id: service._id || '',
    slug: service.slug || '',
    title,
    description,
    longDesc: description,
    price: Number(service.price) || 0,
    priceDisplay: formatPrice(service.price, lang),
    priceNote: '',
    durationMinutes: Number(service.durationMinutes) || 0,
    durationLabel: formatDuration(service.durationMinutes, lang),
    image,
    img: image,
    tag: getServiceBadgeOrCategoryLabel(service, lang, t.servicesTag || 'Service'),
    category: service.category || '',
    categoryAr: service.categoryAr || '',
    categoryLabel: getLocalizedCategoryLabel(
      service,
      lang,
      t.servicesTag || 'Service',
    ),
    features: Array.isArray(service.features) ? service.features : [],
    featuresAr: Array.isArray(service.featuresAr) ? service.featuresAr : [],
    previewFeatures: getServiceFeatures(service, lang),
    raw: service,
    isFallback: false,
  };
};

export default function useServices({ lang, t, limit = 4 }) {
  const resource = usePublicServices();

  const liveItems = useMemo(
    () => resource.data.slice(0, limit).map((service, index) => mapService(service, lang, t, index)),
    [lang, limit, resource.data, t],
  );

  const fallbackItems = useMemo(
    () => getFallbackServicePreviews(t).slice(0, limit),
    [limit, t],
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
