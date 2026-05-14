const MOJIBAKE_PATTERN =
  /[\u00D8\u00D9\u00C3\u00C2\u00A7]|â€¢|â€”|â€“|â€¦|ï»¿/;

const decodeLatin1AsUtf8 = (value) => {
  const bytes = Uint8Array.from(
    Array.from(value, (char) => char.charCodeAt(0) & 0xff),
  );

  return new TextDecoder('utf-8').decode(bytes);
};

const normalizeBrokenPunctuation = (value) =>
  value
    .replace(/â€¢/g, '\u2022')
    .replace(/â€”/g, '\u2014')
    .replace(/â€“/g, '\u2013')
    .replace(/â€¦/g, '\u2026');

export const repairArabicText = (value) => {
  if (typeof value !== 'string' || !MOJIBAKE_PATTERN.test(value)) {
    return value;
  }

  try {
    const decoded = decodeLatin1AsUtf8(value);
    if (decoded && !decoded.includes('\uFFFD')) {
      return normalizeBrokenPunctuation(decoded);
    }
  } catch {
    // If decoding fails, keep the original string and only normalize punctuation.
  }

  return normalizeBrokenPunctuation(value);
};

export const repairArabicObject = (value) => {
  if (Array.isArray(value)) {
    return value.map(repairArabicObject);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        repairArabicObject(entry),
      ]),
    );
  }

  return repairArabicText(value);
};
