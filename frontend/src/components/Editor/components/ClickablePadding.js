// @flow
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const propTypes = {
  onClick: PropTypes.func,
  grow: PropTypes.bool,
};

const ClickablePadding = props => <Container grow={props.grow} onClick={props.onClick} />;

ClickablePadding.propTypes = propTypes;

const Container = styled.div`
  min-height: 150px;
  padding-top: 50px;
  cursor: ${({ onClick }) => (onClick ? 'text' : 'default')};

  ${({ grow }) => grow && 'flex-grow: 1;'};
`;

export default ClickablePadding;
