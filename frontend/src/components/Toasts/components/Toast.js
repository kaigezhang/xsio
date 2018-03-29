// @flow
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';
import { color } from 'shared/styles/constants';
import { fadeAndScaleIn } from 'shared/styles/animations';

const propTypes = {
  onRequestClose: PropTypes.func,
  closeAfterMs: PropTypes.number,
  message: PropTypes.string,
  type: PropTypes.oneOf(['warning', 'error', 'info']),
};

class Toast extends Component {
  timeout = 0

  static defaultProps = {
    closeAfterMs: 3000,
    type: 'warning'
  };

  componentDidMount() {
    this.timeout = setTimeout(this.props.onRequestClose, this.props.closeAfterMs);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { type, onRequestClose } = this.props;
    const message = typeof this.props.message === 'string'
      ? this.props.message
      : this.props.message.toString();

    return (
      <Container onClick={onRequestClose} type={type}>
        <Message>{message}</Message>
      </Container>
    );
  }
}

const Container = styled.li`
  display: flex;
  align-items: center;
  animation: ${fadeAndScaleIn} 100ms ease;
  margin: 8px 0;
  padding: 8px;
  color: ${color.white};
  background: ${props => color[props.type]};
  font-size: 15px;
  border-radius: 5px;
  cursor: default;

  &:hover {
    background: ${props => darken(0.05, color[props.type])};
  }
`;

const Message = styled.div`
  padding-left: 5px;
`;

export default Toast;
