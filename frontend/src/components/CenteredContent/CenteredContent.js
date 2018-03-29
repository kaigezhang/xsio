import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import breakpoint from 'styled-components-breakpoint';

const propTypes = {
  children: PropTypes.node,
};


const Container = styled.div`
  width: 100%;
  padding: 60px 20px;

  ${breakpoint('tablet')`
    padding: 60pxl
  `}
`;


const Content = styled.div`
  max-width: 46em;
  margin: 0 auto;
`;


const CenteredContent = ({ children, ...rest }) => (
  <Container {...rest}>
    <Content>{children}</Content>
  </Container>
);


export default CenteredContent;
