const ARABIC_INDIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

export const localizeDigits = (value, lang = 'en') => {
  if (lang !== 'ar') {
    return value;
  }

  return String(value ?? '').replace(/\d/g, (digit) => ARABIC_INDIC_DIGITS[Number(digit)] || digit);
};
