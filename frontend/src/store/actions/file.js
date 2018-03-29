import { fetchFile, saveHighlight, fetchHighlights, fetchFileInfo } from 'services/api/api';

import {
  FILE_DOWNLOADED,
  HIGHLIGHT_SAVED
} from '../constants/file';
import { apiFetched } from './api';

export const getFileInfo = fileId => dispatch => fetchFileInfo(fileId).then(payload => dispatch(apiFetched(payload)));
export const addHighlight = (highlight, fileId) => dispatch => saveHighlight(highlight, fileId).then(payload => dispatch(apiFetched(payload)));
export const getHighlights = fileId => dispatch => fetchHighlights(fileId).then(payload => dispatch(apiFetched(payload)));

export const getFile  = fileId => dispatch => fetchFile(fileId).then(payload => dispatch(fileDownloaded(payload)));
export const fileDownloaded = payload => ({ type: FILE_DOWNLOADED, payload });


export const starFile = fileId => (dispatch) => {};
export const unstarFile = fileId => (dispatch) => {};
export const pinFile = fileId => (dispatch) => {};
export const unpinFile = fileId => (dispatch) => {};
export const downloadFile = fileId => (dispatch) => {};
