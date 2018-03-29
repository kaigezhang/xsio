import React from 'react';
import { connect } from 'react-redux';
import { pinFile, unPinFile } from 'store/actions/files';
import { fileRefSelector } from 'store/selectors/files';
import FilePreview from './FilePreview';

// const mapState = (state, props) => ({
//   fileRef: fileRefSelector(state, props),
// });

const mapState = (state, props) => ({
  fileRef: fileRefSelector(state, props)
});

const mapDispatch = dispatch => ({
  pinFile: fileId => dispatch(pinFile(fileId)),
  unPinFile: fileId => dispatch(unPinFile(fileId)),
});

export default connect(mapState, mapDispatch)(FilePreview);
