import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Flex from 'shared/components/Flex';

// import Editor from 'components/Editor'
//
// const propTypes = {
//
// }
import Document from 'scenes/Document';

class Side extends Component {
  render() {
    const { inputRef } = this.props;
    return (
      <StyledContainer align="flex-start" justify="center">
        <Document newDocument inputRef={inputRef} />
      </StyledContainer>
    );
  }
}


const StyledContainer = styled(Flex)`
  overflow: hidden;
`;
Side.propTypes = {};

export default Side;
