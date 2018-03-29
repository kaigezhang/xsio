// @flow
import React, { Component } from 'react';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';


class ErrorBoundary extends Component {
  state = {
    error: false,
    info: null
  }

  componentDidCatch(error, info) {
    this.setState({
      error: true,
      info
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <CenteredContent>
          <PageTitle title="Something went wrong" />
          <h1>
            <span role="img" aria-label="Space ship">
              🛸
            </span>{' '}
            Something unexpected happened
          </h1>
          <p>
            An unrecoverable error occurred{window.Bugsnag ||
          (true && ' and our engineers have been notified')}. Please try{' '}
            <a onClick={this.handleReload}>reloading</a>.
          </p>
        </CenteredContent>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
