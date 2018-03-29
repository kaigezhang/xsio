import { fetchFiles, fetchLibraries  } from 'services/api/api';

import { apiFetched } from './api';

export const getRecentlyFiles = limit => (dispatch) => {
  fetchFiles({
    limit
  }).then((payload) => {
    dispatch(apiFetched(payload));
  });
};


export const getLibraries = () => (dispatch) => {
  fetchLibraries().then((payload) => {
    dispatch(apiFetched(payload));
  });
};
