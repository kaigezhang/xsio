import parseTitle from 'shared/utils/parseTitle';
import { documentSave } from 'services/api/api';
import {
  SET_PENDING_CHANGES,
  UPDATE_DOCUMENT_DATA,
  CLEAR_EDIT,
} from '../constants/edit';
import { documentApiRequestStart, documentGetSuccess } from './documents';
import { apiFetched } from './api';
import { SET_ACTIVE_DOCUMENT } from '../constants/ui';
import { uiSelector } from '../selectors/ui';

export const updateData = (document, data, dirty) => (dispatch) =>  {
  if (data.text) {
    const { title, emoji } = parseTitle(data.text);
    data.title = title;
    data.emoji = emoji;
  }
  if (dirty) dispatch(setPendingChanges(true));
  dispatch(updateDocumentData({ document, data }));
};

export const setPendingChanges = payload => ({
  type: SET_PENDING_CHANGES,
  payload
});

export const updateDocumentData = payload => ({
  type: UPDATE_DOCUMENT_DATA,
  payload
});


export const saveDocument = (document, publish) => dispatch =>
  documentSave(document.collectionId, {
    ...document,
    publish: publish || false
  }).then(
    (payload) => {
      dispatch(apiFetched(payload));
      dispatch(clearEdit());
      return payload;
    }
  );

export const clearEdit = () => ({
  type: CLEAR_EDIT
});

// export const selectDocument = payload => (dispatch, getState) => {
//   const state = getState();
//   const ui = uiSelector(state);

//   dispatch({
//     type: SET_ACTIVE_DOCUMENT,
//     payload: Object.values(payload)[0][1]
//   });
// };
