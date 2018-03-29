// @flow
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const propTypes = {
  column: PropTypes.bool,
  align: PropTypes.any,
  justify: PropTypes.any,
  auto: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};

const Flex = (props) => {
  const { children, ...restProps } = props;
  return <Container {...restProps}>{children}</Container>;
};

const Container = styled.div`
  display: flex;
  flex: ${({ auto }) => (auto ? '1 1 auto' : 'initial')};
  flex-direction: ${({ column }) => (column ? 'column' : 'row')};
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
`;

export default Flex;
