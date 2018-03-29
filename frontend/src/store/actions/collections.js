import { fetchCollections, createCollectionFetch } from 'services/api/api';
import { apiFetched } from './api';

export const getCollections = () => dispatch => fetchCollections().then((payload) => {
  dispatch(apiFetched(payload));
});

export const deleteCollection = () => (dispatch) => {};

export const fetchRecentlyEdited = () => (dispatch) => {};
export const fetchPinnedDocuments = () => (dispatch) => {};
export const pinnedDocuments = () => (dispatch) => {};
export const createCollection = collection => dispatch => createCollectionFetch(collection).then((payload) => {
  dispatch(apiFetched(payload));
  return payload;
});
export const updateCollection = () => (dispatch) => {};
