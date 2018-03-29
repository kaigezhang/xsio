import { fetchLibraries, fetchFiles, fetchPapers } from 'services/api/api';
import { apiFetched } from './api';

export const pinFile = () => (dispatch) => {};
export const unPinFile = () => (dispatch) => {};


export const getRecentlyFiles = limit => dispatch => fetchFiles(limit.limit).then(payload => dispatch(apiFetched(payload)));
export const getLibraries = () => dispatch => fetchLibraries().then(payload => dispatch(apiFetched(payload)));

export const getPapers = () => dispatch => fetchPapers().then(payload => dispatch(apiFetched(payload)))
