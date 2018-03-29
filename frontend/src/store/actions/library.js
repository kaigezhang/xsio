import { uploadFileFetch, createLibraryFetch } from 'services/api/api';
import { apiFetched } from './api';


// export const fetchRecentlyFiles = (libraryId) => (dispatch) => fetchRecentlyFiles(libraryId).then(payload => dispatch(apiFetched(payload)));
// export const fetchPinnedFiles = () => (dispatch) => {};
// export const fetchRecentlyFiles = libraryId => (dispatch) => {};

export const createLibrary = library => dispatch => createLibraryFetch(library).then((payload) => {
  dispatch(apiFetched(payload));
  return payload;
});

// const libraryCreateSuccess = payload => payload;


export const updateLibrary = library => (dispatch) => {};
export const deleteLibrary = library => (dispatch) => {};


export const uploadFile = form => dispatch => uploadFileFetch(form).then(payload => dispatch(apiFetched(payload)));
