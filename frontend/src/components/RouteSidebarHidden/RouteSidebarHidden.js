// @flow
import React, { Component } from 'react';
import { Route } from 'react-router-dom';

class RouteSidebarHidden extends Component {
  componentDidMount() {
    this.props.enableEditMode();
  }

  componentWillUnmount() {
    this.props.disableEditMode();
  }

  render() {
    const { component, ...rest } = this.props;
    const Component = component;
    return <Route {...rest} render={props => <Component {...props} />} />;
  }
}

export default RouteSidebarHidden;
