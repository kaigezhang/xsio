import React from 'react';
import { connect } from 'react-redux';
import { recentlyEditedSelector } from 'store/selectors/documents';
import { getRecentlyEdited  } from 'store/actions/documents';
import { getCollections } from 'store/actions/collections';

import { getLibraries, getRecentlyFiles, getPapers } from 'store/actions/files';
import { recentlyFilesSelector } from 'store/selectors/files';
import { authSelector } from 'store/selectors/shared/auth';

import Dashboard from './Dashboard';

const mapState = state => ({
  auth: authSelector(state),
  recentlyEdited: recentlyEditedSelector(state),
  recentlyFiles: recentlyFilesSelector(state)
});

const mapDispatch = dispatch => ({
  getCollections: () => dispatch(getCollections()),
  getLibraries: () => dispatch(getLibraries()),
});

export default connect(mapState, mapDispatch)(Dashboard);
