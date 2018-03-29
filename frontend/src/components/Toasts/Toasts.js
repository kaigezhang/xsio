// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { layout } from 'shared/styles/constants';
import Toast from './components/Toast';

const propTypes = {
  errors: PropTypes.array,
};

class Toasts extends Component {
  handleClose = (index) => {
    this.props.errors.remove(index);
  };

  render() {
    const { errors } = this.props;

    return (
      <List>
        {errors.map((error, index) => (
          <Toast
            key={index}
            onRequestClose={() => this.handleClose(index)}
            message={error}
          />
        ))}
      </List>
    );
  }
}

const List = styled.ol`
  position: fixed;
  left: ${layout.hpadding};
  bottom: ${layout.vpadding};
  list-style: none;
  margin: 0;
  padding: 0;
`;

List.propTypes = propTypes;

export default Toasts;
