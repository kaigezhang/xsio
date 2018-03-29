// @flow

export function homeUrl() {
  return '/dashboard';
}

export function starredUrl() {
  return '/starred';
}

export function newCollectionUrl() {
  return '/collections/new';
}

export function collectionUrl(collectionId) {
  return `/collections/${collectionId}`;
}

export function documentUrl(doc) {
  return `/doc/${doc.slug}`;
}

export function documentNewUrl(doc) {
  const newUrl = `/collections/${doc.collection.id}/new`;
  if (doc.parentDocumentId) {
    return `${newUrl}?parentDocument=${doc.parentDocumentId}`;
  }
  return newUrl;
}

export function documentEditUrl(doc) {
  return `/doc/${doc.slug}/edit`;
}

export function documentMoveUrl(doc) {
  return `/doc/${doc.slug}/move`;
}

/**
 * Replace full url's document part with the new one in case
 * the document slug has been updated
 */
export function updateDocumentUrl(oldUrl, newUrl) {
  // Update url to match the current one
  const urlParts = oldUrl
    .trim()
    .split('/');
  const actions = urlParts.slice(3);
  if (actions[0]) {
    return [newUrl, actions].join('/');
  }
  return newUrl;
}

export function newDocumentUrl(collection) {
  return `/collections/${collection.id}/new`;
}

export function searchUrl(query) {
  if (query) { return `/search/${encodeURIComponent(query)}`; }
  return '/search';
}

export function notFoundUrl() {
  return '/404';
}

export const matchDocumentSlug = ':documentSlug([0-9a-zA-Z-]*-[a-zA-z0-9]{0,6})';

export const matchDocumentEdit = `/doc/${matchDocumentSlug}/edit`;
export const matchDocumentMove = `/doc/${matchDocumentSlug}/move`;


/* Library and document */
export const newLibraryUrl = () => '/libraries/new';
