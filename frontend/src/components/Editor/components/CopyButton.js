// @flow
import React, { Component } from 'react';
import { color } from 'shared/styles/constants';
import styled from 'styled-components';
import CopyToClipboard from 'components/CopyToClipboard';

class CopyButton extends Component {
  copiedTimeout = 0

  state = {
    copied: false
  }

  componentWillUnmount() {
    clearTimeout(this.copiedTimeout);
  }

  handleCopy = () => {
    this.setState({
      copied: true
    });
    this.copiedTimeout = setTimeout(() => (this.setState({ copied: false })), 3000);
  };

  render() {
    return (
      <StyledCopyToClipboard onCopy={this.handleCopy} {...this.props}>
        <span>{this.state.copied ? 'Copied!' : 'Copy'}</span>
      </StyledCopyToClipboard>
    );
  }
}

const StyledCopyToClipboard = styled(CopyToClipboard)`
  position: absolute;
  top: 0;
  right: 0;

  opacity: 0;
  transition: opacity 50ms ease-in-out;
  z-index: 1;
  font-size: 12px;
  background: ${color.smoke};
  border-radius: 0 2px 0 2px;
  padding: 1px 6px;
  cursor: pointer;

  &:hover {
    background: ${color.smokeDark};
  }
`;

export default CopyButton;
