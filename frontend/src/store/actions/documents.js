import { fetchDocuments, starDocumentFetch, unstarDocumentFetch, documentSave } from 'services/api/api';
import { apiFetched } from './api';

import {
  DOCUMENT_API_FEATCH_START,
  DOCUMENT_GET_SUCCESS
} from '../constants/documents';

export const getDocuments = ({ type, limit }) => dispatch => fetchDocuments({ type, limit }).then(
  (payload) => {
    dispatch(
      apiFetched(payload)
    );
  }
);

// export const saveDocument = () => {}
export const saveDocument = (document, publish) => (dispatch) => {
  dispatch(documentApiRequestStart());
  return documentSave(document, publish).then(
    (payload) => {
      dispatch(apiFetched(payload));
      // dispatch(documentGetSuccess(payload));
      return payload;
    }
  );
};

export const deleteDocument = documentId => dispatch => null;

export const documentApiRequestStart = () => ({
  type: DOCUMENT_API_FEATCH_START
});

export const documentGetSuccess = payload => ({
  type: DOCUMENT_GET_SUCCESS,
  payload,
});

export const getRecentlyEdited = limit => (dispatch) => {
  console.log('recently called');
  return dispatch(getDocuments({ type: 'edited', limit: limit.limit }));
};
export const getStarredDocuments = () => dispatch => getDocuments({ type: 'starred' });
export const getDraftsDocuments = () => dispatch => getDocuments({ type: 'drafts' });


export const fetchDocument = () => (dispatch) => {};
export const viewedDocument = () => (dispatch) => {};
export const updateDocumentData = () => (dispatch) => {};

export const starDocument = documentId => dispatch => starDocumentFetch(documentId);
export const unstarDocument = documentId => dispatch => unstarDocumentFetch(documentId);
export const pinDocument = documentId => dispatch => starDocumentFetch(documentId);
export const unpinDocument = documentId => dispatch => unstarDocumentFetch(documentId);
export const downDocument = document => (dispatch) => {
  const a = window.document.createElement('a');
  a.textContent = 'download';
  a.download = `${document.title}.md`;
  a.href = `data:text/markdown;charset=UTF-8,${encodeURIComponent(document.text)}`;
  a.click();
};


export const prefetchDocument = () => (dispatch) => {};
