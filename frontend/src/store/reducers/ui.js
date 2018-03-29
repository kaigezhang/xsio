import {
  SET_ACTIVE_MODAL,
  CLEAR_ACTIVE_MODAL,
  SET_ACTIVE_DOCUMENT,
  SET_ACTIVE_COLLECTION,
  CLEAR_ACTIVE_COLLECTION,
  CLEAR_ACTIVE_DOCUMENT,
  SET_ACTIVE_LIBRARY,
  SET_ACTIVE_FILE,
  CLEAR_ACTIVE_LIBRARY,
  CLEAR_ACTIVE_FILE,
  ENABLE_EDIT_MODE,
  DISABLE_EDIT_MODE,
  ENABLE_PROGRESS_BAR,
  DISABLE_PROGRESS_BAR,
  TOGGLE_MOBILE_SIDEBAR,
  HIDE_MOBILE_SIDEBAR,
} from 'store/constants/ui';

const initialState = {
  activeModalName: '',
  activeModalProps: {},
  activeDocument: {},
  activeCollection: {},
  progressBarVisible: false,
  editMode: false,
  mobileSidebarVisible: false,
};


const UiReducer = (state = initialState, action) => {
  switch (action.type) {
  case SET_ACTIVE_MODAL:
    return {
      ...state,
      activeModalName: action.payload.name,
      activeModalProps: action.payload.props
    };
  case CLEAR_ACTIVE_MODAL:
    return {
      ...state,
      activeModalName: '',
      activeModalProps: {}
    };
  case SET_ACTIVE_DOCUMENT: {
    let collection = '';
    const document = action.payload.document;
    if (document.publishedAt) {
      collection = document.collection;
    }
    return {
      ...state,
      activeDocument: document,
      activeCollection : collection
    };
  }


  case SET_ACTIVE_COLLECTION:
    return {
      ...state,
      activeCollection: action.payload.collection
    };
  case CLEAR_ACTIVE_COLLECTION:
    return {
      ...state,
      activeCollection: undefined
    };
  case CLEAR_ACTIVE_DOCUMENT:
    return {
      ...state,
      activeDocument: undefined,
      activeCollection: undefined
    };

  case SET_ACTIVE_LIBRARY:
    return {
      ...state,
      activeLibrary: action.payload.library
    };
  case CLEAR_ACTIVE_LIBRARY:
    return {
      ...state,
      activeLibrary: undefined
    };
  case SET_ACTIVE_FILE:
    return {
      ...state,
      activeFile: action.payload.file
    };
  case CLEAR_ACTIVE_FILE:
    return {
      ...state,
      activeFile: undefined
    };

  case ENABLE_EDIT_MODE:
    return {
      ...state,
      editMode: true
    };
  case DISABLE_EDIT_MODE:
    return {
      ...state,
      editMode: false,
    };
  case ENABLE_PROGRESS_BAR:
    return {
      ...state,
      progressBarVisible: true,
    };
  case DISABLE_PROGRESS_BAR:
    return {
      ...state,
      progressBarVisible: false
    };

  case TOGGLE_MOBILE_SIDEBAR:
    return {
      ...state,
      mobileSidebarVisible: !state.mobileSidebarVisible
    };
  case HIDE_MOBILE_SIDEBAR:
    return {
      ...state,
      mobileSidebarVisible: false
    };

  default:
    return state;
  }
};


export default UiReducer;
