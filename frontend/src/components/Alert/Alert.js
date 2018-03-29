// @flow
import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'shared/components/Flex';
import styled from 'styled-components';
import { color } from 'shared/styles/constants';

const propTypes = {
  children: PropTypes.any,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'danger', 'offline'])
};

const Alert = props => (
  <Container align="center" justify="center" type={props.type}>
    {props.children}
  </Container>
);

Alert.propTypes = propTypes;
Alert.defaultProps = {
  type: 'info',
};

const Container = styled(Flex)`
  color: #ffffff;
  font-size: 14px;
  line-height: 1;

  background-color: ${({ type }) => color[type]};
`;

export default Alert;
