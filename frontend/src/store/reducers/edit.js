import {
  SET_PENDING_CHANGES,
  UPDATE_DOCUMENT_DATA,
  CLEAR_EDIT,
  DOCUMENT_SAVE_SUCCESS
} from '../constants/edit';


const initialState = {
  hasPendingChanges: false,
  document: {},
  currentDocument: null
};

const editReducer = (state = initialState, action) => {
  switch (action.type) {
  case SET_PENDING_CHANGES:
    return {
      ...state,
      hasPendingChanges: action.payload
    };
  case UPDATE_DOCUMENT_DATA:
    return {
      ...state,
      document: {
        ...action.payload.document,
        ...action.payload.data
      }
    };
  case CLEAR_EDIT:
    return initialState;

  default:
    return state;
  }
};


export default editReducer;
