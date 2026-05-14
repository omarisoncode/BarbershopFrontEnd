export const KUWAIT_DIAL_CODE = '+965';
export const KUWAIT_FLAG = '🇰🇼';
export const KUWAIT_PHONE_REGEX = /^[24569]\d{7}$/;

export const normalizeKuwaitPhoneInput = (value) =>
  String(value || '').replace(/\D/g, '').slice(0, 8);

export const isValidKuwaitPhone = (value) =>
  KUWAIT_PHONE_REGEX.test(normalizeKuwaitPhoneInput(value));
