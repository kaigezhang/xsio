import SessionSerializer from 'services/serializers/session';
import UserSerializer from 'services/serializers/user';
import UserRegistrationSerializer from 'services/serializers/user/registration';
import HighlightSerializer from 'services/serializers/highlight';
import DocumentSerializer from 'services/serializers/document';
import CollectionSerializer from 'services/serializers/collection';
import LibrarySerializer from 'services/serializers/library';

import { initializeApi, initialHttp, fetch, normalize, normalizeErrors } from './helpers';

export { initializeApi, initialHttp };

function legacyError(result) {
  return result.errors;
}

export const register = (user) => {
  const payload = UserRegistrationSerializer.serialize(user);

  return fetch('users', {
    method: 'POST',
    data: JSON.stringify(payload)
  })
    .then(normalize())
    .catch(normalizeErrors(null, true));
};

export const login = (loginData) => {
  const payload = SessionSerializer.serialize({ email: loginData.email, password: loginData.password });
  return fetch('users/login', {
    method: 'POST',
    data: JSON.stringify(payload)
  })
    .then(normalize())
    .catch(normalizeErrors(legacyError));
};

export const getUser = () => fetch('user', { method: 'GET' })
  .then(normalize())
  .catch(normalizeErrors(legacyError));

export const updateUser = (user) => {
  const payload = UserSerializer.serialize(user);

  return fetch('user', {
    method: 'PUT',
    data: JSON.stringify(payload)
  })
    .then(normalize())
    .catch(normalizeErrors(null, true));
};

export function passwordReset(formData, passwordResetToken) {
  const payload = UserRegistrationSerializer.serialize(formData);
  return fetch(`password-reset/${passwordResetToken}`, {
    method: 'PUT',
    data: JSON.stringify(payload)
  }).then(normalize(() => ({}))).catch(normalizeErrors(null, true));
}

export function emailConfirmationRequest(formData) {
  const payload = UserRegistrationSerializer.serialize(formData);

  return fetch('confirmations', {
    method: 'POST',
    data: JSON.stringify(payload)
  });
}

export function emailConfirmation(emailConfirmationToken) {
  const payload = {
    data: {}
  };
  return fetch(`confirmations/${emailConfirmationToken}`, {
    method: 'PUT',
    data: JSON.stringify(payload)
  }).then(normalize(() => ({}))).catch(normalizeErrors(null, true));
}

export const uploadFileFetch = (form) => {
  const { files, libraryId } = form;
  const data = new FormData();
  files.forEach(file => data.append('files', file));
  console.log(data, 'data');
  return fetch(`/libraries/${libraryId}/files`, {
    method: 'POST',
    data,
    onUploadProgress(progressEvent) {
      const percentage = progressEvent.loaded / progressEvent.total;
      console.log(percentage);
    }
  })
    .then(normalize())
    .catch(normalizeErrors());
};

/* Library and files */
export const createLibraryFetch = (library) => {
  const payload = LibrarySerializer.serialize(library);
  return fetch('libraries', { method: 'POST', data: JSON.stringify(payload) }).then(normalize()).catch(normalizeErrors);
};
export const getFiles = () => fetch('files', { method: 'GET' })
  .then(normalize())
  .catch(normalizeErrors());

export const fetchFile = fileId => fetch(`files/${fileId}/download`, {
  method: 'GET',
  responseType: 'blob'
});

export const fetchFileInfo = fileId => fetch(`files/${fileId}`, { method: 'GET' })
  .then(normalize())
  .catch(normalizeErrors());

export const saveHighlight = (highlight, fileId) => {
  // const { selector } = highlight if (selector.image) { //  TODO 在此处理图片上传问题 }

  const payload = HighlightSerializer.serialize(highlight);
  return fetch(`/files/${fileId}/annotations`, {
    method: 'POST',
    data: JSON.stringify(payload)
  })
    .then(normalize())
    .catch(normalizeErrors());
};

export const fetchHighlights = fileId => fetch(`files/${fileId}/annotations`, { method: 'GET' })
  .then(normalize())
  .catch(normalizeErrors(null, true));

export const fetchDocuments = ({
  type, limit
}) => fetch(`documents?type=${type}&limit=${limit}`, { method: 'GET' })
  .then(normalize())
  .catch(normalizeErrors(null, true));

export const documentSave = (collectionId, document) => {
  const payload = DocumentSerializer.serialize(document);
  return fetch(`/collections/${collectionId}/documents`,
    { method: 'POST', data: JSON.stringify(payload) }
  )
    .then(normalize())
    .catch(normalizeErrors(null, true));
};

export const starDocumentFetch = documentId => fetch(`documents/${documentId}/star`, { method: 'POST' });
export const unstarDocumentFetch = documentId => fetch(`documents/${documentId}/star`, { method: 'DELETE' });

export const pinDocumentFetch = documentId => fetch(`documents/${documentId}/pin`, { method: 'POST' });
export const unpinDocumentFetch = documentId => fetch(`documents/${documentId}/pin`, { method: 'DELETE' });


export const fetchCollections = () => fetch('collections', { method:'GET' }).then(normalize()).catch(normalizeErrors(null, true));

export const fetchFiles = limit => fetch(`files?limit=${limit}`, { method: 'GET' }).then(normalize()).catch(normalizeErrors);
export const fetchLibraries = () => fetch('libraries', { method: 'GET' }).then(normalize()).catch(normalizeErrors);
export const fetchPapers = () => fetch('papers', { method: 'GET' }).then(normalize()).catch(normalizeErrors);


/* Collections and document */
export const createCollectionFetch = (collection) => {
  const payload = CollectionSerializer.serialize(collection);
  return fetch('collections', { method: 'POST', data: JSON.stringify(payload) }).then(normalize()).catch(normalizeErrors);
};
