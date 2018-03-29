import  { connect } from 'react-redux';
import { uploadFile } from 'store/actions/library';
import { setActiveLibrary, clearActiveLibrary } from 'store/actions/ui';
import { libraryByIdSelector, recentlyFilesSelector, pinnedFilesSelector }  from 'store/selectors/library';
import Library from './Library';

const mapState = (state, { match }) => ({
  library: libraryByIdSelector(state, match),
  recentlyFiles: recentlyFilesSelector(state, match),
  pinnedFiles: pinnedFilesSelector(state, match)
});


const mapDispatch = dispatch => ({
  setActiveLibrary: library => dispatch(setActiveLibrary(library)),
  clearActiveLibrary: () => dispatch(clearActiveLibrary()),
  uploadFile: form => dispatch(uploadFile(form))
  // getRecentlyFiles: ({ limit, library }) => dispatch(fetchRecentlyFiles(limit, library)),
  // getPinnedFiles: library => dispatch(fetchPinnedFiles(library)),
});


export default connect(mapState, mapDispatch)(Library);
