// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';
import placeholder from './placeholder.png';

class Avatar extends Component {
  state = {
    error: false
  }

  handleError = () => {
    this.setState({
      error: true
    });
  };

  render() {
    return (
      <CircleImg
        {...this.props}
        onError={this.handleError}
        src={this.state.error ? placeholder : this.props.src}
      />
    );
  }
}

const CircleImg = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid ${color.white};
  flex-shrink: 0;
`;

export default Avatar;
