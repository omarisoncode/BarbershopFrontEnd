// Replace these values before broad public launch.
export const businessInfo = {
  address: {
    en: '123 Style Avenue, Downtown Kuwait City',
    ar: '١٢٣ شارع الأناقة، مدينة الكويت',
  },
  phoneDisplay: '+965 1234 5678',
  phoneHref: 'tel:+96512345678',
  email: 'hello@thecut.com',
  emailHref: 'mailto:hello@thecut.com',
  whatsappHref: 'https://wa.me/96512345678',
  hours: {
    en: 'Mon - Sun: 10am - 10pm',
    ar: 'الأحد - السبت: ١٠ ص - ١٠ م',
  },
  parkingValue: {
    en: 'Free parking available',
    ar: 'مواقف مجانية متاحة',
  },
};

export const getBusinessValue = (value, lang = 'en') => {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value[lang] || value.en || '';
  }

  return value;
};
