// @flow
import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  enableProgressBar: PropTypes.func,
  disableProgressBar: PropTypes.func,
};


class LoadingIndicator extends React.Component {
  componentDidMount() {
    this.props.enableProgressBar();
  }

  componentWillUnmount() {
    this.props.disableProgressBar();
  }

  render() {
    return null;
  }
}

export default LoadingIndicator;
