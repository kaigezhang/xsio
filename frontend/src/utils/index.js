import originalSlugify from 'slugify';

export function slugify(originalString) {
  if (!originalString) {
    return null;
  }
  const stringForSlug = originalString.replace(/[^A-Za-z0-9_\s]/g, '');
  return originalSlugify(stringForSlug.toLowerCase());
}

export function lowerCaseFirstLetter(originalString) {
  if (!originalString) {
    return null;
  }
  return originalString.charAt(0).toLowerCase() + originalString.slice(1);
}

export function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type:mime });
}
