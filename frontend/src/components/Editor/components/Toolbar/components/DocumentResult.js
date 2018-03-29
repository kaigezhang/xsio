import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { fontWeight, color } from 'shared/styles/constants';
import NextIcon from 'components/Icon/NextIcon';

const propTypes = {
  innerRef: PropTypes.func,
  onClick: PropTypes.func,
  document: PropTypes.object,
};


const DocumentResult = ({ document, ...rest }) => (
  <ListItem {...rest} href="">
    <i>
      <NextIcon light />
    </i>
    { document.title }
  </ListItem>
);

const ListItem = styled.a`
  display: flex;
  align-items: center;
  height: 28px;
  padding: 6px 8px 6px 0;
  color: ${color.white};
  font-size: 15px;
  overflow: hidden;
  white-space: nowrap;
  i {
    visibility: hidden;
  }

  &:hover,
  &:focus,
  &:active {
    font-weight: ${fontWeight.medium};
    outline: none;

    i {
      visibility: visible;
    }
  }
`;

export default DocumentResult;
