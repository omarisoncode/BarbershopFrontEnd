const defaultCategoryLabels = {
  haircut: { en: 'Haircut', ar: '\u0642\u0635' },
  shave: { en: 'Shave', ar: '\u062d\u0644\u0627\u0642\u0629' },
  beard: { en: 'Beard', ar: '\u0644\u062d\u064a\u0629' },
  package: { en: 'Package', ar: '\u0628\u0627\u0642\u0629' },
  treatment: { en: 'Treatment', ar: '\u0639\u0646\u0627\u064a\u0629' },
  signature: { en: 'Signature', ar: '\u0645\u0645\u064a\u0632' },
  manicure: { en: 'Manicure', ar: '\u0645\u0627\u0646\u064a\u0643\u064a\u0648\u0631' },
  pedicure: { en: 'Pedicure', ar: '\u0628\u064a\u062f\u064a\u0643\u064a\u0648\u0631' },
  facial: { en: 'Facial', ar: '\u0627\u0644\u0639\u0646\u0627\u064a\u0629 \u0628\u0627\u0644\u0628\u0634\u0631\u0629' },
  braiding: { en: 'Hair braiding', ar: '\u062a\u0636\u0641\u064a\u0631 \u0627\u0644\u0634\u0639\u0631' },
  'hair braiding': { en: 'Hair braiding', ar: '\u062a\u0636\u0641\u064a\u0631 \u0627\u0644\u0634\u0639\u0631' },
  coloring: { en: 'Coloring', ar: '\u0635\u0628\u063a \u0627\u0644\u0634\u0639\u0631' },
  'hair coloring': { en: 'Hair coloring', ar: '\u0635\u0628\u063a \u0627\u0644\u0634\u0639\u0631' },
  styling: { en: 'Styling', ar: '\u062a\u0635\u0641\u064a\u0641' },
  spa: { en: 'Spa', ar: '\u0633\u0628\u0627' },
};

const commonArabicFallbacks = {
  haircut: '\u0642\u0635',
  shave: '\u062d\u0644\u0627\u0642\u0629',
  beard: '\u0644\u062d\u064a\u0629',
  package: '\u0628\u0627\u0642\u0629',
  treatment: '\u0639\u0646\u0627\u064a\u0629',
  signature: '\u0645\u0645\u064a\u0632',
  manicure: '\u0645\u0627\u0646\u064a\u0643\u064a\u0648\u0631',
  pedicure: '\u0628\u064a\u062f\u064a\u0643\u064a\u0648\u0631',
  facial: '\u0627\u0644\u0639\u0646\u0627\u064a\u0629 \u0628\u0627\u0644\u0628\u0634\u0631\u0629',
  braiding: '\u062a\u0636\u0641\u064a\u0631 \u0627\u0644\u0634\u0639\u0631',
  'hair braiding': '\u062a\u0636\u0641\u064a\u0631 \u0627\u0644\u0634\u0639\u0631',
  coloring: '\u0635\u0628\u063a \u0627\u0644\u0634\u0639\u0631',
  'hair coloring': '\u0635\u0628\u063a \u0627\u0644\u0634\u0639\u0631',
  styling: '\u062a\u0635\u0641\u064a\u0641',
  spa: '\u0633\u0628\u0627',
};

const normalizeCategoryText = (value) =>
  String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toTitleCase = (value) =>
  normalizeCategoryText(value).replace(/\b\w/g, (character) => character.toUpperCase());

export const normalizeCategoryValue = (value) =>
  normalizeCategoryText(value).toLowerCase();

export const getLocalizedCategoryLabel = (serviceOrCategory, lang = 'en', fallback = '') => {
  const service =
    typeof serviceOrCategory === 'object' && serviceOrCategory !== null
      ? serviceOrCategory
      : { category: serviceOrCategory };
  const categoryKey = normalizeCategoryValue(service.category);

  if (lang === 'ar' && service.categoryAr) {
    return String(service.categoryAr).trim();
  }

  if (defaultCategoryLabels[categoryKey]) {
    return defaultCategoryLabels[categoryKey][lang] || defaultCategoryLabels[categoryKey].en;
  }

  const rawCategory = normalizeCategoryText(service.category);
  if (!rawCategory) {
    return fallback || '';
  }

  if (lang === 'ar' && commonArabicFallbacks[normalizeCategoryValue(rawCategory)]) {
    return commonArabicFallbacks[normalizeCategoryValue(rawCategory)];
  }

  return lang === 'ar' ? rawCategory : toTitleCase(rawCategory);
};

export const getServiceBadgeOrCategoryLabel = (service, lang = 'en', fallback = '') => {
  if (lang === 'ar' && service?.badgeAr) {
    return service.badgeAr;
  }

  if (service?.badge) {
    return service.badge;
  }

  return getLocalizedCategoryLabel(service, lang, fallback);
};
