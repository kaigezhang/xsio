import React from 'react';
import { connect } from 'react-redux';
import { enableProgressBar, disableProgressBar } from 'store/actions/ui';
import LoadingIndicator from './LoadingIndicator';

export default connect(
  null,
  () => ({
    enableProgressBar,
    disableProgressBar
  })
)(LoadingIndicator);