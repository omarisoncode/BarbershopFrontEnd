export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const loadImageElement = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

export const validateProfileImageFile = (file) => {
  if (!file || !file.type.startsWith('image/') || file.size > MAX_PROFILE_IMAGE_SIZE) {
    return false;
  }

  return true;
};

export const optimizeProfileImage = async (file) => {
  const rawDataUrl = await readFileAsDataUrl(file);
  const image = await loadImageElement(rawDataUrl);

  const maxDimension = 1080;
  const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    return rawDataUrl;
  }

  context.drawImage(image, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.86);
};
