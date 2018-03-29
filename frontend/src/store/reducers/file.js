import {
  FILE_DOWNLOADED,
  HIGHLIGHT_SAVED
} from '../constants/file';

const initialState = {
  file: null
};

const fileReducer = (state = initialState, action) => {
  switch (action.type) {
  case FILE_DOWNLOADED:
    return {
      ...state,
      file: action.payload
    };
  default:
    return state;
  }
};

export default fileReducer
