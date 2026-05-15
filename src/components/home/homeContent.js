export const HOME_SECTION_IDS = {
  hero: 'home',
  services: 'services',
  about: 'about',
  barbers: 'barbers',
  gallery: 'gallery',
  reviews: 'reviews',
  faq: 'faq',
  location: 'location',
  contact: 'contact',
};

const SERVICE_FALLBACK_IMAGES = {
  haircut:
    'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80',
  shave:
    'https://images.unsplash.com/photo-1701891123509-e983d6c45259?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  beard:
    'https://images.unsplash.com/photo-1733995471058-3d6ff2013de3?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  treatment:
    'https://images.unsplash.com/photo-1635273051937-a0ddef9573b6?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  package:
    'https://images.unsplash.com/photo-1648221122279-5246dd0cf86c?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
};

const DEFAULT_SERVICE_IMAGE_ROTATION = [
  SERVICE_FALLBACK_IMAGES.haircut,
  SERVICE_FALLBACK_IMAGES.beard,
  SERVICE_FALLBACK_IMAGES.shave,
  SERVICE_FALLBACK_IMAGES.package,
];

const BARBER_FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=900&q=80',
];

const FALLBACK_SERVICE_PREVIEWS = [
  {
    slug: 'signature-cut',
    category: 'haircut',
    price: 8,
    durationMinutes: 45,
    image: SERVICE_FALLBACK_IMAGES.haircut,
    titleKey: 'homeFallbackService1Name',
    descriptionKey: 'homeFallbackService1Description',
    longDescriptionKey: 'homeFallbackService1LongDescription',
    featureKeys: [
      'homeFallbackService1Feature1',
      'homeFallbackService1Feature2',
      'homeFallbackService1Feature3',
    ],
  },
  {
    slug: 'beard-sculpt',
    category: 'beard',
    price: 6,
    durationMinutes: 30,
    image: SERVICE_FALLBACK_IMAGES.beard,
    titleKey: 'homeFallbackService2Name',
    descriptionKey: 'homeFallbackService2Description',
    longDescriptionKey: 'homeFallbackService2LongDescription',
    featureKeys: [
      'homeFallbackService2Feature1',
      'homeFallbackService2Feature2',
      'homeFallbackService2Feature3',
    ],
  },
  {
    slug: 'royal-shave',
    category: 'shave',
    price: 7,
    durationMinutes: 35,
    image: SERVICE_FALLBACK_IMAGES.shave,
    titleKey: 'homeFallbackService3Name',
    descriptionKey: 'homeFallbackService3Description',
    longDescriptionKey: 'homeFallbackService3LongDescription',
    featureKeys: [
      'homeFallbackService3Feature1',
      'homeFallbackService3Feature2',
      'homeFallbackService3Feature3',
    ],
  },
  {
    slug: 'hair-and-beard-combo',
    category: 'package',
    price: 12,
    durationMinutes: 60,
    image: SERVICE_FALLBACK_IMAGES.package,
    titleKey: 'homeFallbackService4Name',
    descriptionKey: 'homeFallbackService4Description',
    longDescriptionKey: 'homeFallbackService4LongDescription',
    featureKeys: [
      'homeFallbackService4Feature1',
      'homeFallbackService4Feature2',
      'homeFallbackService4Feature3',
    ],
  },
];

const FALLBACK_BARBER_PREVIEWS = [
  {
    image: BARBER_FALLBACK_IMAGES[0],
    experienceYears: 11,
    nameKey: 'homeFallbackBarber1Name',
    bioKey: 'homeFallbackBarber1Bio',
    specialtyKeys: [
      'homeFallbackBarber1Specialty1',
      'homeFallbackBarber1Specialty2',
    ],
  },
  {
    image: BARBER_FALLBACK_IMAGES[1],
    experienceYears: 8,
    nameKey: 'homeFallbackBarber2Name',
    bioKey: 'homeFallbackBarber2Bio',
    specialtyKeys: [
      'homeFallbackBarber2Specialty1',
      'homeFallbackBarber2Specialty2',
    ],
  },
  {
    image: BARBER_FALLBACK_IMAGES[2],
    experienceYears: 6,
    nameKey: 'homeFallbackBarber3Name',
    bioKey: 'homeFallbackBarber3Bio',
    specialtyKeys: [
      'homeFallbackBarber3Specialty1',
      'homeFallbackBarber3Specialty2',
    ],
  },
  {
    image: BARBER_FALLBACK_IMAGES[3],
    experienceYears: 9,
    nameKey: 'homeFallbackBarber4Name',
    bioKey: 'homeFallbackBarber4Bio',
    specialtyKeys: [
      'homeFallbackBarber4Specialty1',
      'homeFallbackBarber4Specialty2',
    ],
  },
];

export const HERO_TRUST_BADGES = [
  { titleKey: 'homeTrust1Title', textKey: 'homeTrust1Text', icon: 'scissors' },
  { titleKey: 'homeTrust2Title', textKey: 'homeTrust2Text', icon: 'sparkles' },
  { titleKey: 'homeTrust3Title', textKey: 'homeTrust3Text', icon: 'clock' },
  { titleKey: 'homeTrust4Title', textKey: 'homeTrust4Text', icon: 'shield' },
];

export const PROMISE_POINTS = [
  {
    titleKey: 'homePromisePoint1Title',
    textKey: 'homePromisePoint1Text',
    icon: 'sparkles',
  },
  {
    titleKey: 'homePromisePoint2Title',
    textKey: 'homePromisePoint2Text',
    icon: 'sofa',
  },
  {
    titleKey: 'homePromisePoint3Title',
    textKey: 'homePromisePoint3Text',
    icon: 'shield',
  },
  {
    titleKey: 'homePromisePoint4Title',
    textKey: 'homePromisePoint4Text',
    icon: 'clock',
  },
];

export const GALLERY_MEDIA = [
  {
    key: 'studio-video',
    type: 'video',
    src: '/barber.mp4',
    titleKey: 'homeGallery1Title',
    captionKey: 'homeGallery1Caption',
  },
  {
    key: 'gallery-cut',
    type: 'image',
    src: SERVICE_FALLBACK_IMAGES.haircut,
    titleKey: 'homeGallery2Title',
    captionKey: 'homeGallery2Caption',
  },
  {
    key: 'gallery-beard',
    type: 'image',
    src: SERVICE_FALLBACK_IMAGES.beard,
    titleKey: 'homeGallery3Title',
    captionKey: 'homeGallery3Caption',
  },
  {
    key: 'gallery-shave',
    type: 'image',
    src: SERVICE_FALLBACK_IMAGES.shave,
    titleKey: 'homeGallery4Title',
    captionKey: 'homeGallery4Caption',
  },
  {
    key: 'gallery-studio',
    type: 'image',
    src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=80',
    titleKey: 'homeGallery5Title',
    captionKey: 'homeGallery5Caption',
  },
];

export const REVIEW_KEYS = [1, 2, 3, 4];
export const FAQ_KEYS = [1, 2, 3, 4, 5];

export const SOCIAL_ACTIONS = [
  { key: 'phone', hrefKey: 'locationPhoneHref', labelKey: 'locationPhoneTitle' },
  { key: 'whatsapp', hrefKey: 'locationWhatsappHref', labelKey: 'homeLocationWhatsappCta' },
  { key: 'email', hrefKey: 'locationEmailHref', labelKey: 'locationEmailTitle' },
];

const normalizeLookupValue = (value) => String(value || '').trim().toLowerCase();

export const getServiceFallbackImage = (service, index = 0) => {
  const lookupValue = normalizeLookupValue(
    `${service?.category || ''} ${service?.name || ''} ${service?.title || ''}`,
  );

  if (lookupValue.includes('beard')) return SERVICE_FALLBACK_IMAGES.beard;
  if (lookupValue.includes('shave')) return SERVICE_FALLBACK_IMAGES.shave;
  if (lookupValue.includes('facial') || lookupValue.includes('treatment')) {
    return SERVICE_FALLBACK_IMAGES.treatment;
  }
  if (
    lookupValue.includes('combo') ||
    lookupValue.includes('package') ||
    lookupValue.includes('signature')
  ) {
    return SERVICE_FALLBACK_IMAGES.package;
  }
  if (lookupValue.includes('hair') || lookupValue.includes('cut')) {
    return SERVICE_FALLBACK_IMAGES.haircut;
  }

  return DEFAULT_SERVICE_IMAGE_ROTATION[index % DEFAULT_SERVICE_IMAGE_ROTATION.length];
};

export const getBarberFallbackImage = (index = 0) =>
  BARBER_FALLBACK_IMAGES[index % BARBER_FALLBACK_IMAGES.length];

export const getFallbackServicePreviews = (t) =>
  FALLBACK_SERVICE_PREVIEWS.map((item) => ({
    key: item.slug,
    id: item.slug,
    _id: '',
    slug: item.slug,
    title: t[item.titleKey],
    description: t[item.descriptionKey],
    longDesc: t[item.longDescriptionKey] || t[item.descriptionKey],
    price: null,
    priceDisplay: t.homeFallbackPriceLabel || 'Price at booking',
    priceNote:
      t.homeFallbackPriceNote ||
      'Live pricing appears as soon as the service catalog finishes syncing.',
    durationMinutes: item.durationMinutes,
    durationLabel: `${item.durationMinutes} ${t.homeMinuteShort || 'min'}`,
    image: item.image,
    img: item.image,
    tag: t.homePreviewBadge,
    category: item.category,
    categoryAr: '',
    categoryLabel: t.homePreviewBadge,
    features: item.featureKeys.map((key) => t[key]).filter(Boolean),
    featuresAr: item.featureKeys.map((key) => t[key]).filter(Boolean),
    previewFeatures: item.featureKeys.map((key) => t[key]).filter(Boolean),
    raw: null,
    isFallback: true,
  }));

export const getFallbackBarberPreviews = (t) =>
  FALLBACK_BARBER_PREVIEWS.map((item, index) => ({
    key: `fallback-barber-${index}`,
    id: `fallback-barber-${index}`,
    _id: '',
    title: t[item.nameKey],
    bio: t[item.bioKey],
    image: item.image,
    specialties: item.specialtyKeys.map((key) => t[key]).filter(Boolean),
    experienceYears: item.experienceYears,
    bookingService: null,
    raw: null,
    isFallback: true,
  }));
