import { connect } from 'react-redux';
import { getFile, addHighlight, getHighlights, getFileInfo } from 'store/actions/file';
import { fileDataSelector, highlightsSelector, fileByIdSelector } from 'store/selectors/file';
import { userSelector } from 'store/selectors/shared/auth';
import { enableProgressBar, disableProgressBar } from 'store/actions/ui';
import Pdf from './Pdf';


const mapState = (state, props) => ({
  fileData: fileDataSelector(state, props),
  file: fileByIdSelector(state, props),
  highlights: highlightsSelector(state, props),
  user: userSelector(state)
});

const mapDispatch = dispatch => ({
  getFileInfo: fileId => dispatch(getFileInfo(fileId)),
  getFile: fileId => dispatch(getFile(fileId)),
  addHighlight: (highilght, fileId) => dispatch(addHighlight(highilght, fileId)),
  getHighlights: fileId => dispatch(getHighlights(fileId)),
  enableProgressBar: () => dispatch(enableProgressBar()),
  disableProgressBar: () => dispatch(disableProgressBar()),
});

export default connect(mapState, mapDispatch)(Pdf);
